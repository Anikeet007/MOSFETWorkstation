import React from 'react';

const Cart = ({ cartItems, onRemove, onUpdateQuantity }) => {
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="p-4 bg-white border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <ul className="space-y-4">
          {cartItems.map((item) => (
            <li key={item.id} className="flex justify-between items-center border-b pb-4">
              
              {/* Left Side: Image & Name */}
              <div className="flex items-center gap-3">
                 {/* Optional: Show small image if you want */}
                 {/* <img src={item.image} alt="" className="w-12 h-12 object-contain" /> */}
                 <div>
                    <h4 className="font-bold text-sm">{item.name}</h4>
                    <p className="text-gray-500 text-xs">Rs.{item.price}</p>
                    
                    {/* QUANTITY CONTROLS */}
                    <div className="flex items-center gap-3 mt-2">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 font-bold"
                        >
                          -
                        </button>
                        <span className="font-semibold">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 font-bold"
                        >
                          +
                        </button>
                    </div>
                 </div>
              </div>

              {/* Right Side: Price & Remove All */}
              <div className="flex flex-col items-end gap-1">
                <div className="font-bold">
                  Rs.{(item.price * item.quantity).toFixed(2)}
                </div>
                <button 
                  onClick={() => onRemove(item.id)}
                  className="text-red-500 text-xs hover:underline"
                >
                  Remove All
                </button>
              </div>

            </li>
          ))}
        </ul>
      )}

      {/* Footer Total */}
      <div className="mt-4 pt-4 border-t flex justify-between items-center">
        <span className="text-lg font-bold">Total:</span>
        <span className="text-xl font-bold text-red-600">Rs.{total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Cart;