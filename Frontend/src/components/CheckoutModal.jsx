import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import esewa from '../assets/images/esewa.png';
import khalti from '../assets/images/khalti.png';

const BACKEND_URL = "https://mosfetworkstation-backend.onrender.com";

// 🟢 ESEWA TEST CONFIGURATION (Enabled)
const ESEWA_PRODUCT_CODE = "EPAYTEST"; 
const ESEWA_URL = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

const CheckoutModal = ({ isOpen, onClose, cartItems, total, onClearCart }) => {
  const [formData, setFormData] = useState({ name: '', address: '', phone: '', payment: 'COD' });
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleOrder = async (e) => {
    e.preventDefault();

    const orderData = {
      customerName: formData.name,
      address: formData.address,
      phone: formData.phone,
      items: cartItems,
      totalAmount: total,
      paymentMethod: formData.payment
    };

    try {
      // 1. Save Order to Database
      const res = await axios.post(`${BACKEND_URL}/api/orders`, orderData);
      const orderId = res.data.orderId;
      
      // 2. Handle Payment Methods
      if (formData.payment === 'eSewa') {
        // --- eSewa Logic ---
        try {
          // Get Signature from Backend
          // We pass "EPAYTEST" so the backend knows to use the test secret key
          const sigRes = await axios.post(`${BACKEND_URL}/api/esewa-signature`, {
             total_amount: total,
             transaction_uuid: orderId,
             product_code: ESEWA_PRODUCT_CODE
          });
          // Redirect to eSewa
          esewaCall(total, orderId, sigRes.data.signature);
        } catch (err) {
          console.error("eSewa Error:", err);
          alert("eSewa connection failed. Please check backend.");
        }
      } 
      else if (formData.payment === 'Khalti') {
        // --- Khalti Logic (Redirection Method) ---
        try {
            const khaltiRes = await axios.post(`${BACKEND_URL}/api/khalti-initiate`, {
                amount: total, // Backend will convert to paisa
                orderId: orderId,
                name: formData.name,
                email: formData.email,
                phone: formData.phone
            });

            if (khaltiRes.data.payment_url) {
                // Redirect user to Khalti's payment page
                window.location.href = khaltiRes.data.payment_url;
            } else {
                alert("Khalti initiation failed.");
            }
        } catch (err) {
            console.error("Khalti Error:", err);
            alert("Khalti connection failed.");
        }
      } 
      else {
        // --- COD Logic ---
        completeOrder(orderId);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Order Failed. Please try again.");
    }
  };

  // eSewa Form Auto-Submit
  const esewaCall = (amount, orderId, signature) => {
    // Auto-detect return URLs (Works on localhost AND live site)
    const returnUrl = `${window.location.origin}/order-success`;
    const failureUrl = `${window.location.origin}/`;

    var params = {
      amount: amount,
      tax_amount: "0",
      total_amount: amount,
      transaction_uuid: orderId,
      product_code: ESEWA_PRODUCT_CODE,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: returnUrl,
      failure_url: failureUrl,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature: signature,
    };

    var form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", ESEWA_URL);

    for (var key in params) {
      var hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", params[key]);
      form.appendChild(hiddenField);
    }

    document.body.appendChild(form);
    form.submit();
  };

  const completeOrder = (orderId) => {
    onClearCart();
    onClose();
    navigate('/order-success', { 
      state: { 
        orderId: orderId,
        customer: formData,
        items: cartItems,
        total: total,
        paymentMethod: formData.payment
      } 
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      {/* Expanded Width for Split View */}
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-scale-up flex flex-col md:flex-row max-h-[90vh]">

        {/* 🛍️ LEFT SIDE: ORDER SUMMARY */}
        <div className="bg-gray-50 p-6 md:w-5/12 border-r border-gray-100 flex flex-col hidden md:flex">
          <h3 className="font-bold text-gray-800 mb-4 text-lg">Order Summary</h3>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex gap-4 items-start">
                <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex-shrink-0 p-1">
                  <img src={item.imageUrl || item.image} alt="" className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="font-bold text-gray-700 text-sm line-clamp-2">{item.name}</p>
                  <p className="text-gray-500 text-xs mt-1">{item.quantity} x Rs.{item.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-bold">Rs.{total}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500">Shipping</span>
              <span className="text-green-600 font-bold">Free</span>
            </div>
            <div className="flex justify-between items-center text-xl font-extrabold text-gray-900 border-t pt-4 border-dashed">
              <span>Total</span>
              <span className="text-blue-600">Rs.{total}</span>
            </div>
          </div>
        </div>

        {/* 📝 RIGHT SIDE: SHIPPING & PAYMENT FORM */}
        <div className="p-6 md:w-7/12 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Shipping Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-2xl transition">✕</button>
          </div>

          <form onSubmit={handleOrder} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                <input name="name" required onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Ram Sharma" />
              </div>

              <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                    <input 
                      name="phone" 
                      type="tel" 
                      required 
                      maxLength="10"
                      value={formData.phone}
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 transition" 
                      placeholder="98XXXXXXXX" 
                    />
                  </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
              <input name="email" type="email" required onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="ram@example.com" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Delivery Address</label>
              <input name="address" required onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Street, City, Nepal" />
            </div>

            <div className="mt-6">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Payment Method</label>
              <div className="grid grid-cols-3 gap-3">

                {/* COD Option */}
                <label className={`border-2 rounded-xl p-3 flex flex-col items-center justify-center gap-1 cursor-pointer transition h-20 ${formData.payment === 'COD' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                  <input type="radio" name="payment" value="COD" checked={formData.payment === 'COD'} onChange={handleChange} className="hidden" />
                  <span className="text-2xl">💵</span>
                  <span className="font-bold text-xs text-gray-700">Cash</span>
                </label>

                {/* eSewa Option */}
                <label className={`border-2 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition h-20 overflow-hidden ${formData.payment === 'eSewa' ? 'border-green-500 ring-1 ring-green-500' : 'border-gray-100 hover:border-gray-200'}`}>
                  <input type="radio" name="payment" value="eSewa" checked={formData.payment === 'eSewa'} onChange={handleChange} className="hidden" />
                  {/* 👇 Using the online URL */}
                  <img src={esewa} alt="eSewa" className="h-6 text-2xl object-contain p-2" />
                  <span className="font-bold text-sm text-gray-700">eSewa</span>
                </label>

                {/* Khalti Option */}
                <label className={`border-2 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition h-20 overflow-hidden ${formData.payment === 'Khalti' ? 'border-purple-500 ring-1 ring-purple-500' : 'border-gray-100 hover:border-gray-200'}`}>
                  <input type="radio" name="payment" value="Khalti" checked={formData.payment === 'Khalti'} onChange={handleChange} className="hidden" />
                  {/* 👇 Using the online URL */}
                  <img src={khalti} alt="Khalti" className="h-6 text-2xl object-contain p-2" />
                  <span className="font-bold text-sm text-gray-700">Khalti</span>
                </label>

              </div>
            </div>

            <div className="md:hidden pt-4 border-t flex justify-between items-center">
              <span className="text-gray-500 font-bold">Total to Pay</span>
              <span className="text-xl font-bold text-blue-600">Rs.{total}</span>
            </div>

            <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition shadow-lg transform active:scale-[0.99] mt-2">
              {formData.payment === 'COD' ? `Confirm Order • Rs.${total}` : `Pay Rs.${total}`}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;