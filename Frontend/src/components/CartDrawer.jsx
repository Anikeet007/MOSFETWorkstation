import React from 'react';

const CartDrawer = ({ isOpen, onClose, cartItems, onRemove, onUpdateQuantity, onCheckout }) => {
  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      {/* Dark Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Drawer Box */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-6 animate-slide-in">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Your Cart ({cartItems.length})</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-red-500 text-2xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Cart Items List */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 space-y-4">
            <div className="text-6xl">🛒</div>
            <p className="text-lg">Your cart is empty.</p>
            <button onClick={onClose} className="text-blue-600 hover:underline font-bold">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                
                {/* Image */}
                <div className="w-16 h-16 bg-white rounded-md border flex-shrink-0 overflow-hidden">
                   <img 
                     src={item.imageUrl || item.image || "https://via.placeholder.com/50"} 
                     alt={item.name} 
                     className="w-full h-full object-contain" 
                   />
                </div>
                
                {/* Details */}
                <div className="flex-1 px-4">
                  <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                  <p className="text-blue-600 font-bold text-sm">Rs.{item.price}</p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-2">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, -1)} 
                      className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="text-sm font-semibold">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, 1)} 
                      className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove Button */}
                <button 
                  onClick={() => onRemove(item.id)} 
                  className="text-red-400 hover:text-red-600 p-2"
                  title="Remove Item"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer with Total */}
        {cartItems.length > 0 && (
          <div className="mt-6 border-t pt-4 bg-white">
            <div className="flex justify-between text-xl font-bold mb-4 text-gray-800">
              <span>Total:</span>
              <span>Rs.{total.toFixed(2)}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg active:scale-[0.98]"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;