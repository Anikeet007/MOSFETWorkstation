import React from 'react';

const ProductCard = ({ product, onAdd }) => {
  if (!product) return null;

  return (
    <div className="group relative bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* IMAGE CONTAINER */}
      <div 
        onClick={() => onAdd(product)} 
        className="relative w-full h-48 bg-white flex items-center justify-center p-2 overflow-hidden cursor-pointer active:opacity-90"
      >
        <img 
          src={product.imageUrl || product.image || "https://via.placeholder.com/150"} 
          alt={product.name || "Product"} 
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" 
        />
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-1">
           <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
             {typeof product.category === 'string' ? product.category : 'General'}
           </div>
           {product.subcategory && typeof product.subcategory === 'string' && (
             <div className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
               {product.subcategory}
             </div>
           )}
        </div>

        <h3 className="font-bold text-gray-800 text-lg mb-2 leading-tight line-clamp-2 min-h-[3rem]">
          {product.name || "Unnamed Product"}
        </h3>

        {product.specs && typeof product.specs === 'string' && (
           <p className="text-xs text-gray-500 mb-3 line-clamp-1">
             {product.specs}
           </p>
        )}

        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">
            Rs.{typeof product.price === 'number' ? product.price : '0.00'}
          </span>
          
          <button 
            onClick={(e) => {
              e.stopPropagation(); 
              onAdd(product);
            }} 
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-600 transition-colors flex items-center gap-2 active:bg-gray-700"
          >
            <span>Add to Cart</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;