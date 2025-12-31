import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import logo from '../assets/images/logo.jpeg'

const OrderSuccess = () => {
  const location = useLocation();
  // Safe destructuring with default values to prevent crashes
  const { 
    orderId = "N/A", 
    customer = { name: "Guest", phone: "N/A" }, 
    items = [], 
    total = 0, 
    paymentMethod = "N/A" 
  } = location.state || {};

  // If accessed directly without state, show fallback
  if (!location.state) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <div className="text-6xl mb-4">🧾</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Order Details Found</h2>
        <p className="text-gray-500 mb-6">It looks like you navigated here directly.</p>
        <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 flex justify-center items-start">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg overflow-hidden animate-fade-in print:shadow-none">
        
        {/* Header */}
        <div className="bg-green-600 p-8 text-center text-white">
           <div className="flex justify-center mb-6">
            <img src={LOGO_URL} alt="Mosfet Workstation" className="h-16 object-contain" />
          </div>

          <div className="inline-flex bg-green-100 text-green-600 rounded-full p-3 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
          <p className="text-gray-500">Thank you for shopping with Mosfet Workstation.</p>
        </div>

        {/* Invoice Details */}
        <div className="p-8">
          
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8 text-sm border-b pb-8">
            <div>
              <p className="text-gray-500 mb-1">Order Number</p>
              <p className="font-mono font-bold text-gray-800">
                #{typeof orderId === 'string' ? orderId.slice(-6).toUpperCase() : 'ID-ERROR'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 mb-1">Date</p>
              <p className="font-bold text-gray-800">{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Customer</p>
              <p className="font-bold text-gray-800">{customer.name || "N/A"}</p>
              <p className="text-gray-600">{customer.phone || "N/A"}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 mb-1">Payment Method</p>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                paymentMethod === 'eSewa' ? 'bg-green-100 text-green-700' : 
                paymentMethod === 'Khalti' ? 'bg-purple-100 text-purple-700' : 
                'bg-blue-100 text-blue-700'
              }`}>
                {paymentMethod}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-700 mb-4 uppercase text-xs tracking-wider">Order Summary</h3>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 h-10 w-10 rounded-md flex items-center justify-center text-xs font-bold text-gray-500">
                      {item.quantity}x
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {typeof item.category === 'string' ? item.category : 'Item'}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-800">
                    Rs.{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4 flex justify-between items-center mb-8">
            <span className="text-lg font-bold text-gray-800">Total Amount</span>
            <span className="text-2xl font-bold text-blue-600">Rs.{Number(total).toFixed(2)}</span>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 print:hidden">
            <button 
              onClick={() => window.print()} 
              className="w-full border border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition"
            >
              🖨️ Print Receipt
            </button>
            <Link 
              to="/" 
              className="w-full bg-black text-white font-bold py-3 rounded-xl text-center hover:bg-gray-800 transition"
            >
              Continue Shopping
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;