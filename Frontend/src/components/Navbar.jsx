import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.jpeg'

const categories = [
  { name: "Laptops", items: ["Dell", "HP", "Acer", "Asus", "Apple"] },
  { name: "Adapters", items: ["Laptop Adapter", "Wall Adapter", "Universal"] },
  { name: "Storage", items: ["SSD", "HDD", "M.2", "RAM"] },
  { name: "Accessories", items: ["Keyboards", "Screens", "Internal Fans", "Hinges"] }
];

const Navbar = ({ totalItems, onCartClick, onCategoryClick, onSearch }) => {
  return (
    <>
      {/* --- DESKTOP HEADER (Hidden on Mobile) --- */}
      <header className="hidden md:flex flex-col w-full shadow-md sticky top-0 z-50 bg-white">
        
        {/* Row 1: Logo | Search | Cart */}
        <div className="flex justify-between items-center px-8 py-4 border-b border-gray-100">
          <Link to="/" onClick={() => onCategoryClick(null)} className="flex items-center gap-3 cursor-pointer group">
             <img src={logo} alt="MOSFET" className="h-12 w-12 object-contain group-hover:scale-105 transition" />
             <div className="flex flex-col leading-none">
               <span className="text-2xl font-black tracking-tighter text-gray-900">MOSFET</span>
               <span className="text-sm font-bold text-red-600 tracking-[0.2em] uppercase">Workstation</span>
             </div>
          </Link>

          <div className="flex-1 max-w-2xl mx-8 relative">
              <input 
                type="text" 
                placeholder="Search for laptop parts..." 
                onChange={(e) => onSearch(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-full py-2.5 pl-5 pr-12 focus:border-blue-600 focus:outline-none transition-colors text-gray-700"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </button>
          </div>

          <div className="relative cursor-pointer group" onClick={onCartClick}>
              <div className="p-2 bg-gray-100 rounded-full group-hover:bg-gray-200 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              {totalItems > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{totalItems}</span>}
          </div>
        </div>

        {/* Row 2: Categories */}
        <div className="bg-[#1a2332] text-white px-8 h-12 flex items-center justify-between shadow-inner">
          <div className="flex h-full items-center space-x-1">
            {categories.map((cat) => (
              <div key={cat.name} className="group relative h-full flex items-center px-4 hover:bg-white/10 cursor-pointer transition">
                <span className="text-sm font-bold uppercase tracking-wide flex items-center gap-1" onClick={() => onCategoryClick(cat.name)}>
                  {cat.name} <span className="text-[10px] opacity-70">▼</span>
                </span>
                <div className="absolute top-full left-0 w-56 bg-white shadow-2xl border-t-2 border-red-600 hidden group-hover:block z-50 text-gray-800 rounded-b-md">
                  {cat.items.map((item) => (
                    <div key={item} onClick={(e) => { e.stopPropagation(); onCategoryClick(item); }} className="block px-5 py-3 text-sm hover:bg-blue-50 hover:text-blue-600 border-b border-gray-100 last:border-0 transition-colors">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 text-xs font-medium text-gray-300">
              <span className="hover:text-white cursor-pointer">📍 Golmadi, Bhaktapur</span>
          </div>
        </div>
      </header>

      {/* --- MOBILE HEADER (Visible only on Mobile) --- */}
      <header className="md:hidden fixed top-0 left-0 w-full bg-white shadow-sm z-50 px-4 h-16 flex justify-between items-center">
         <Link to="/" onClick={() => onCategoryClick(null)} className="flex items-center gap-2">
             <img src={logo} alt="MOSFET" className="h-8 w-8 object-contain" />
               <div className="flex flex-col leading-none">
             <span className="text-lg font-black tracking-tighter text-gray-900">MOSFET</span>
             <span className="text-sm font-bold text-red-600 tracking-[0.2em] uppercase">Workstation</span>
             </div>
         </Link>
         
         <div className="relative cursor-pointer" onClick={onCartClick}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            {totalItems > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{totalItems}</span>}
         </div>
      </header>
    </>
  );
};

export default Navbar;