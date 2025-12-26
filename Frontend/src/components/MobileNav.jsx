import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Using standard import without extension to let bundler resolve it
import ProductCard from './ProductCard'; 

// 2. Add 'products' and 'onAdd' to props
const MobileNav = ({ onCategoryClick, onSearch, products = [], onAdd }) => {
  const [activeTab, setActiveTab] = useState(null);
  const [localSearch, setLocalSearch] = useState(""); // Local state for immediate feedback

  const categories = [
    { name: "Laptops", items: ["Dell", "HP", "Acer", "Asus", "Apple"] },
    { name: "Adapters", items: ["Laptop Adapter", "Wall Adapter", "Universal"] },
    { name: "Storage", items: ["SSD", "HDD", "M.2", "RAM"] },
    { name: "Accessories", items: ["Keyboards", "Screens", "Internal Fans"] }
  ];

  const closeMenu = () => setActiveTab(null);

  // Filter products locally for the overlay
  const searchResults = localSearch
    ? products.filter((item) => {
        const term = localSearch.toLowerCase();
        return (
          (item.name && item.name.toLowerCase().includes(term)) ||
          (item.category && item.category.toLowerCase().includes(term)) ||
          (item.subcategory && item.subcategory.toLowerCase().includes(term))
        );
      })
    : [];

  return (
    <>
      {/* STICKY BOTTOM BAR */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 h-16 flex justify-around items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        
        {/* 1. MENU TAB */}
        <button onClick={() => setActiveTab(activeTab === 'menu' ? null : 'menu')} className={`flex flex-col items-center gap-1 ${activeTab === 'menu' ? 'text-blue-600' : 'text-gray-500'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          <span className="text-[10px] font-medium">Menu</span>
        </button>

        {/* 2. SEARCH TAB (Floating Button) */}
        <button onClick={() => setActiveTab(activeTab === 'search' ? null : 'search')} className={`flex flex-col items-center gap-1 ${activeTab === 'search' ? 'text-blue-600' : 'text-gray-500'}`}>
          <div className={`rounded-full p-3 -mt-8 shadow-lg border-4 border-white transition-colors ${activeTab === 'search' ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white'}`}>
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <span className="text-[10px] font-medium">Search</span>
        </button>

        {/* 3. CATEGORIES TAB */}
        <button onClick={() => setActiveTab(activeTab === 'categories' ? null : 'categories')} className={`flex flex-col items-center gap-1 ${activeTab === 'categories' ? 'text-blue-600' : 'text-gray-500'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          <span className="text-[10px] font-medium">Categories</span>
        </button>

      </div>

      {/* --- POPUP DRAWERS --- */}
      
      {/* MENU DRAWER */}
      {activeTab === 'menu' && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-[60]" onClick={closeMenu}>
           <div className="absolute bottom-16 left-0 w-full bg-white rounded-t-2xl p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
              <h3 className="font-bold text-lg mb-4 text-gray-800">Menu</h3>
              <div className="space-y-4">
                {/* 👇 These are now actual LINKS to the pages */}
                 <Link 
                   to="/about" 
                   onClick={closeMenu} 
                   className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center gap-3 text-gray-700 font-medium"
                 >
                    <span>ℹ️</span> About Us
                 </Link>

                 <Link 
                   to="/contact" 
                   onClick={closeMenu} 
                   className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center gap-3 text-gray-700 font-medium"
                 >
                    <span>📞</span> Any Feedback
                 </Link>

                 <Link 
                   to="/blog" 
                   onClick={closeMenu} 
                   className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center gap-3 text-gray-700 font-medium"
                 >
                    <span>📝</span> Blog
                 </Link>
              </div>
           </div>
        </div>
      )}

      {/* SEARCH OVERLAY (With Product Results!) */}
      {activeTab === 'search' && (
        <div className="md:hidden fixed inset-0 bg-white z-[60] flex flex-col">
           {/* Top Bar with Input */}
           <div className="flex items-center gap-2 p-4 border-b shadow-sm bg-white shrink-0">
              <button onClick={closeMenu} className="p-2 text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <div className="flex-1 relative">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search products..." 
                  value={localSearch}
                  onChange={(e) => {
                    setLocalSearch(e.target.value);
                    onSearch(e.target.value);
                  }}
                  className="w-full bg-gray-100 border-none rounded-full py-2 pl-4 pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {localSearch && (
                  <button onClick={() => { setLocalSearch(""); onSearch(""); }} className="absolute right-3 top-2.5 text-gray-400">✕</button>
                )}
              </div>
           </div>
           
           {/* Search Results Area */}
           <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {localSearch ? (
                 searchResults.length > 0 ? (
                   <div className="grid grid-cols-2 gap-4 pb-20">
                      {searchResults.map(item => (
                        <ProductCard 
                          key={item._id || item.id} 
                          product={item} 
                          onAdd={onAdd} // Allows adding to cart directly from search
                        />
                      ))}
                   </div>
                 ) : (
                   <div className="text-center mt-10 text-gray-500">No products found for "{localSearch}"</div>
                 )
              ) : (
                 <div className="text-center mt-10 text-gray-400">Type to search...</div>
              )}
           </div>
        </div>
      )}

      {/* CATEGORIES DRAWER */}
      {activeTab === 'categories' && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-[60]" onClick={closeMenu}>
           <div className="absolute bottom-16 left-0 w-full h-[70vh] bg-white rounded-t-2xl overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                 <h3 className="font-bold text-lg">Shop by Category</h3>
                 <button onClick={closeMenu} className="text-gray-500 text-2xl">×</button>
              </div>
              <div className="p-4 space-y-6">
                 {categories.map((cat) => (
                    <div key={cat.name}>
                       <h4 className="font-bold text-blue-900 mb-2 uppercase text-xs tracking-wider">{cat.name}</h4>
                       <div className="grid grid-cols-2 gap-3">
                          {cat.items.map(item => (
                             <button 
                               key={item} 
                               onClick={() => { onCategoryClick(item); closeMenu(); }}
                               className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 text-left hover:bg-blue-50 border border-transparent hover:border-blue-200"
                             >
                               {item}
                             </button>
                          ))}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;