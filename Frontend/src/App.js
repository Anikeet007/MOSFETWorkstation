import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Link } from 'react-router-dom'; 
import MobileNav from './components/MobileNav';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel';
import HeroSlider from './components/HeroSlider';
import { About, Contact, Blog } from './components/Pages';
import Footer from './components/Footer';
import CheckoutModal from './components/CheckoutModal';
import OrderSuccess from './components/OrderSuccess';

function App() {
  // --- STATE ---
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const API_URL = "https://mosfetworkstation-backend.onrender.com";

  // --- FETCH DATA ---
  useEffect(() => {
    axios.get(API_URL)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error connecting to server:", err));
  }, []);

// --- SMART FILTERING LOGIC ---
  const safeProducts = Array.isArray(products) ? products : [];
  
  const filteredProducts = safeProducts.filter((item) => {
      // 1. Prepare terms (lowercase for case-insensitive matching)
      const categoryTerm = selectedCategory ? selectedCategory.toLowerCase() : "";
      const searchTerm = searchQuery.toLowerCase();

      const matchesMenu = !selectedCategory || (
         (item.name && item.name.toLowerCase().includes(categoryTerm)) ||
         (item.category && item.category.toLowerCase().includes(categoryTerm)) ||
         (item.subcategory && item.subcategory.toLowerCase().includes(categoryTerm))
      );

      const matchesSearch = !searchTerm || (
         (item.name && item.name.toLowerCase().includes(searchTerm)) ||
         (item.category && item.category.toLowerCase().includes(searchTerm)) ||
         (item.subcategory && item.subcategory.toLowerCase().includes(searchTerm))
      );

      // 4. Return item ONLY if it matches BOTH
      return matchesMenu && matchesSearch;
  });
  
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        // If item is already in cart, just increase the number
        return prev.map((item) => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // If item is new, add it to the list
      return [...prev, { ...product, quantity: 1 }];
    });
    
    // 🛑 I removed the line "setIsCartOpen(true)" here.
    // Now the red number will go up, but the drawer stays closed!
  };

  const removeFromCart = (id) => setCartItems((prev) => prev.filter((item) => item.id !== id));
  
  const updateQuantity = (id, amount) => {
    setCartItems((prev) => prev.map((item) => {
        if (item.id === id) return { ...item, quantity: Math.max(1, item.quantity + amount) };
        return item;
    }));
  };

    const clearCart = () => setCartItems([]);

const addProduct = async (productData) => {
    try {
      // Axios automatically sets the correct headers for FormData
      const response = await axios.post(API_URL, productData);
      setProducts([...products, response.data]); 
      alert("✅ Product Uploaded Successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Error uploading product.");
    }
  };
  const removeProduct = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setProducts(products.filter((item) => item._id !== id));
    } catch (error) { alert("❌ Error deleting product."); }
  };

  // --- RENDER ---
  return (
    // 👇 Updated line with 'pt-16' for mobile spacing
<div className="bg-white min-h-screen font-sans flex flex-col pb-20 md:pb-0 pt-16 md:pt-0">
      <Routes>
        
        {/* 🏠 ROUTE 1: MAIN SHOP (Visible to Everyone) */}
        <Route path="/" element={
          <>
           <Navbar 
              totalItems={cartItems.reduce((sum, item) => sum + item.quantity, 0)} 
              onCartClick={() => setIsCartOpen(true)} 
              onCategoryClick={setSelectedCategory}
              onSearch={setSearchQuery} 
            />

           <MobileNav 
               onCategoryClick={setSelectedCategory} 
               onSearch={setSearchQuery} 
               products={products}
               onAdd={addToCart}
            />

           <CartDrawer 
              isOpen={isCartOpen} 
              onClose={() => setIsCartOpen(false)} 
              cartItems={cartItems} 
              onRemove={removeFromCart} 
              onUpdateQuantity={updateQuantity}
              onCheckout={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
            />

             <CheckoutModal 
              isOpen={isCheckoutOpen} 
              onClose={() => setIsCheckoutOpen(false)}
              cartItems={cartItems}
              total={cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
              onClearCart={clearCart}
            />

            {/* HERO SLIDER */}
            {!selectedCategory && !searchQuery && (
               // 👇 CHANGE THIS LINE:
               <HeroSlider onClickCategory={setSelectedCategory} />
            )}

      {/* --- HEADER LOGIC (Mobile & Desktop Compatible) --- */}
                  {searchQuery ? (
                     // 🔍 CASE A: SEARCH RESULTS
                     <div className="border-b border-gray-100 pb-4 mb-6">
                        <h1 className="text-xl font-bold text-gray-700">
                           Search Results for "<span className="text-blue-600">{searchQuery}</span>"
                        </h1>
                        <p className="text-gray-400 text-xs mt-1">Found {filteredProducts.length} items</p>
                     </div>
                  ) : selectedCategory ? (
                     // 📂 CASE B: CATEGORY SELECTED (With Back Link)
                     <div>
                       <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <span 
                            className="cursor-pointer hover:text-blue-600 hover:underline flex items-center gap-1" 
                            onClick={() => setSelectedCategory(null)}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                            Back to Home
                          </span>
                          <span>/</span>
                          <span className="font-semibold text-gray-800">{selectedCategory}</span>
                       </div>
                       <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{selectedCategory}</h1>
                     </div>
                  ) : (
                     // 🏠 CASE C: HOME PAGE (Latest Arrivals)
                     <div className="border-b pb-4 mb-6">
                       <h1 className="text-3xl font-bold text-gray-900">Latest Arrivals</h1>
                       <p className="text-gray-500 text-sm mt-1">Upgrade your workstation with our newest gear.</p>
                     </div>
                  )}

            {/* 2. PRODUCT GRID SECTION */}
            {filteredProducts.length === 0 ? (
              // EMPTY STATE
              <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 ">
                <div className="text-5xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold text-gray-700 mb-2">No Products Found</h2>
                <p className="text-gray-500 mb-6">
                  We currently don't have any items in <span className="font-bold text-black">"{selectedCategory}"</span>.
                </p>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition"
                >
                  View All Products
                </button>
              </div>
            ) : (
              // NORMAL GRID STATE
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
                {filteredProducts.map((item) => (
                  <ProductCard 
                    key={item._id || item.id} 
                    product={{ ...item, id: item._id, image: item.imageUrl || item.image }} 
                    onAdd={addToCart} 
                  />
                ))}
              </div>
            )}
            
            <Footer/>
          </>
        } />

         <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        {/* 🔒 ROUTE 2: ADMIN PANEL */}
        <Route path="/admin" element={
          <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-bold">
                  ← Go to Shop
                </Link>
              </div>
              <AdminPanel products={products} onAddProduct={addProduct} onRemoveProduct={removeProduct} />
            </div>
          </div>
        } />

      </Routes>
    </div>
  );
}

export default App;