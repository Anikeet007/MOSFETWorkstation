import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Data for Categories
const categoryData = {
  "Laptops": ["Dell", "HP", "Acer", "Asus", "Apple"],
  "Adapters": ["Laptop Adapter", "Wall Adapter", "Universal"],
  "Storage": ["SSD", "HDD", "M.2", "RAM"],
  "Accessories": ["Keyboards", "Screens", "Internal Fans", "Hinges"]
};

const AdminPanel = ({ products, onAddProduct, onRemoveProduct }) => {
  // 🔐 AUTH STATE
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const [activeTab, setActiveTab] = useState('inventory'); 
  const [messages, setMessages] = useState([]); 
  const [file, setFile] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Laptops',
    subcategory: 'Dell',
  });

  // 1. Fetch Messages
  useEffect(() => {
    if (isAuthenticated) {
        fetchMessages();
    }
  }, [isAuthenticated]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/contact');
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // 🔑 SIMPLE PASSWORD CHECK (Change "admin123" to whatever you want)
    if (passwordInput === "mosfetispass") {
        setIsAuthenticated(true);
    } else {
        alert("❌ Incorrect Password!");
    }
  };

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      setNewProduct({ ...newProduct, category: value, subcategory: categoryData[value][0] });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !file) {
      return alert("Please fill in details and image");
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('category', newProduct.category);
    formData.append('subcategory', newProduct.subcategory);

    onAddProduct(formData);

    setNewProduct({ name: '', price: '', category: 'Laptops', subcategory: 'Dell' });
    setFile(null);
    document.getElementById("fileInput").value = "";
  };

  // 🔒 IF NOT LOGGED IN, SHOW LOGIN SCREEN
  if (!isAuthenticated) {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] bg-gray-50 rounded-xl border border-gray-200">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
                <div className="text-5xl mb-4">🛡️</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Access</h2>
                <p className="text-gray-500 mb-6 text-sm">Please enter the security password to manage the store.</p>
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <input 
                        type="password" 
                        placeholder="Enter Password" 
                        className="w-full border-2 border-gray-200 rounded-lg p-3 outline-none focus:border-blue-600 transition text-center text-lg"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        autoFocus
                    />
                    <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg">
                        Unlock Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
  }

  // 🔓 IF LOGGED IN, SHOW DASHBOARD
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 min-h-[600px] animate-fade-in">
      
      {/* HEADER TABS */}
      <div className="px-8 py-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
          <p className="text-gray-500 text-sm">Welcome back, Owner</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex bg-white rounded-lg p-1 border shadow-sm">
                <button 
                    onClick={() => setActiveTab('inventory')}
                    className={`px-4 py-2 text-sm font-bold rounded-md transition ${activeTab === 'inventory' ? 'bg-blue-600 text-white shadow' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    📦 Inventory
                </button>
                <button 
                    onClick={() => { setActiveTab('messages'); fetchMessages(); }}
                    className={`px-4 py-2 text-sm font-bold rounded-md transition flex items-center gap-2 ${activeTab === 'messages' ? 'bg-blue-600 text-white shadow' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    📬 Messages 
                    {messages.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{messages.length}</span>}
                </button>
            </div>
            <button onClick={() => setIsAuthenticated(false)} className="text-xs text-red-500 hover:underline font-bold">Logout</button>
        </div>
      </div>

      <div className="p-8">
        
        {/* --- TAB 1: INVENTORY MANAGER --- */}
        {activeTab === 'inventory' && (
          <div className="animate-fade-in">
            <h3 className="font-bold text-gray-700 mb-4">Add New Product</h3>
            
            <form onSubmit={handleSubmit} className="mb-10 p-6 bg-blue-50/50 rounded-xl border border-blue-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name</label>
                   <input name="name" value={newProduct.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 bg-white" placeholder="e.g. Dell XPS 15" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price ($)</label>
                   <input name="price" type="number" value={newProduct.price} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 bg-white" placeholder="0.00" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                   <select name="category" value={newProduct.category} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 bg-white">
                     {Object.keys(categoryData).map(cat => <option key={cat}>{cat}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subcategory</label>
                   <select name="subcategory" value={newProduct.subcategory} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 bg-white">
                     {categoryData[newProduct.category].map(sub => <option key={sub}>{sub}</option>)}
                   </select>
                </div>
                <div className="md:col-span-2">
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image</label>
                   <input id="fileInput" type="file" accept="image/*" onChange={handleFileChange} className="w-full border border-gray-300 rounded-lg p-3 bg-white cursor-pointer" />
                </div>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition">UPLOAD PRODUCT</button>
            </form>

            <div className="border-t pt-8">
               <h3 className="font-bold text-gray-700 mb-4">Current Stock ({products.length})</h3>
               <div className="space-y-3 h-96 overflow-y-auto pr-2">
                 {products.map((item) => (
                   <div key={item._id || item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-sm">
                      <div className="flex items-center gap-4">
                        <img src={item.imageUrl || "https://via.placeholder.com/50"} alt={item.name} className="w-12 h-12 object-contain rounded-md border" />
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                          <div className="flex gap-2 text-xs text-gray-500">
                             <span>{item.category}</span> • <span className="font-bold text-black">${item.price}</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => onRemoveProduct(item._id || item.id)} className="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 px-3 py-1.5 rounded">Remove</button>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: MESSAGES --- */}
        {activeTab === 'messages' && (
          <div className="animate-fade-in">
            <h3 className="font-bold text-gray-700 mb-6">Customer Messages</h3>
            {messages.length === 0 ? (
              <div className="text-center py-20 text-gray-400">No messages yet.</div>
            ) : (
              <div className="grid gap-4">
                {messages.map((msg, index) => (
                  <div key={index} className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900">{msg.name}</h4>
                      <span className="text-xs text-gray-400">{new Date(msg.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-blue-600 text-sm mb-3 font-medium">{msg.email}</p>
                    <div className="bg-gray-50 p-3 rounded-lg text-gray-700 text-sm leading-relaxed">
                      "{msg.message}"
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPanel;