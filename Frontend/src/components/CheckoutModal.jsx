import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import esewa from '../assets/images/esewa.png';
import khalti from '../assets/images/khalti.png';

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
      const res = await axios.post('https://mosfetworkstation-backend.onrender.com/api/orders', orderData);
      const orderId = res.data.orderId;

      if (formData.payment === 'eSewa') {
        try {
          const sigRes = await axios.post('https://mosfetworkstation-backend.onrender.com/api/esewa-signature', {
            total_amount: total,
            transaction_uuid: orderId,
            product_code: "EPAYTEST"
          });
          esewaCall(total, orderId, sigRes.data.signature);
        } catch (err) {
          console.error("eSewa Error:", err);
          alert("eSewa connection failed. Please check backend.");
        }
      } else {
        completeOrder(orderId);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Order Failed. Please try again.");
    }
  };

  const esewaCall = (amount, orderId, signature) => {
    var path = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
   var params = {
      amount: amount,
      tax_amount: "0",
      total_amount: amount,
      transaction_uuid: orderId,
      product_code: "EPAYTEST",
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: "https://mosfet.com.np/order-success",
      failure_url: "https://mosfet.com.np/",
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature: signature,
    };

    var form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", path);

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
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-up">

        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Checkout</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-2xl">✕</button>
        </div>

        <form onSubmit={handleOrder} className="p-6 space-y-4">

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
            <input name="name" required onChange={handleChange} className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Ram Sharma" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Delivery Address</label>
            <input name="address" required onChange={handleChange} className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Kathmandu, Nepal" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
            <input name="phone" type="number" required onChange={handleChange} className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="98XXXXXXXX" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Payment Method</label>
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
                <img src={esewa} alt="eSewa" className="h-15 text-2xl object-contain p-2" />
                <span className="font-bold text-sm text-gray-700">eSewa</span>
              </label>

              {/* Khalti Option */}
              <label className={`border-2 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition h-20 overflow-hidden ${formData.payment === 'Khalti' ? 'border-purple-500 ring-1 ring-purple-500' : 'border-gray-100 hover:border-gray-200'}`}>
                <input type="radio" name="payment" value="Khalti" checked={formData.payment === 'Khalti'} onChange={handleChange} className="hidden" />
                {/* 👇 Using the online URL */}
                <img src={khalti} alt="Khalti" className="h-15 text-2xl object-contain p-2" />
                <span className="font-bold text-sm text-gray-700">Khalti</span>
              </label>

            </div>
          </div>

          <div className="pt-4 border-t flex justify-between items-center">
            <span className="text-gray-500">Total Amount:</span>
            <span className="text-2xl font-bold text-blue-600">Rs.{total}</span>
          </div>

          <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition shadow-lg transform active:scale-[0.98]">
            {formData.payment === 'COD' ? 'Place Order' : `Pay with ${formData.payment}`}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;