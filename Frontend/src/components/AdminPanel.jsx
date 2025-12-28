import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 👇 UPDATE THIS: Your Render Backend URL
const API_BASE_URL = "https://mosfetworkstation-backend.onrender.com"; 

const categoryData = {
  "Laptops": ["Dell", "HP", "Acer", "Asus", "Apple"],
  "Adapters": ["Laptop Adapter", "Wall Adapter", "Universal"],
  "Storage": ["SSD", "HDD", "M.2", "RAM"],
  "Accessories": ["Keyboards", "Screens", "Internal Fans", "Hinges"]
};

const AdminPanel = ({ products, onAddProduct, onRemoveProduct }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [activeTab, setActiveTab] = useState('inventory'); 
  const [messages, setMessages] = useState([]); 
  const [orders, setOrders] = useState([]); 
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Laptops',
    subcategory: 'Dell',
    image: '' // This will now store the Base64 string
  });

  useEffect(() => {
    if (isAuthenticated) {
        fetchMessages();
        fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/contact`);
      setMessages(res.data);
    } catch (err) { console.error("Error fetching messages:", err); }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/orders`);
      setOrders(res.data);
    } catch (err) { console.error("Error fetching orders:", err); }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const ADMIN_PASSWORD = "mosfet_secure_123"; 
    if (passwordInput === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
    } else {
        alert("❌ Incorrect Password!");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      setNewProduct({ ...newProduct, category: value, subcategory: categoryData[value][0] });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  // 👇 CHANGED: Convert file to Base64 string
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 1. Check file size (limit to 2MB to prevent DB bloat)
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large! Please choose an image under 2MB.");
        return;
      }

      // 2. Read file as Data URL (Base64)
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      return alert("Please fill in details and select an image");
    }

    // Pass the product object directly (contains image string)
    onAddProduct(newProduct);

    setNewProduct({ name: '', price: '', category: 'Laptops', subcategory: 'Dell', image: '' });
    document.getElementById("fileInput").value = "";
  };

  if (!isAuthenticated) {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] bg-gray-50 rounded-xl border border-gray-200">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Access</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="password" placeholder="Enter Password" className="w-full border-2 rounded-lg p-3 outline-none" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} autoFocus />
                    <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">Unlock Dashboard</button>
                </form>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 min-h-[600px] animate-fade-in">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
          <p className="text-gray-500 text-xs">Manage products and view sales</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border shadow-sm">
            <button onClick={() => setActiveTab('inventory')} className={`px-4 py-2 text-sm font-bold rounded-md transition ${activeTab === 'inventory' ? 'bg-blue-600 text-white shadow' : 'text-gray-500 hover:bg-gray-100'}`}>📦 Inventory</button>
            <button onClick={() => { setActiveTab('orders'); fetchOrders(); }} className={`px-4 py-2 text-sm font-bold rounded-md transition flex items-center gap-2 ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow' : 'text-gray-500 hover:bg-gray-100'}`}>
                🛍️ Orders {orders.length > 0 && <span className="bg-green-500 text-white text-[10px] px-1.5 rounded-full">{orders.length}</span>}
            </button>
            <button onClick={() => { setActiveTab('messages'); fetchMessages(); }} className={`px-4 py-2 text-sm font-bold rounded-md transition flex items-center gap-2 ${activeTab === 'messages' ? 'bg-blue-600 text-white shadow' : 'text-gray-500 hover:bg-gray-100'}`}>
                📬 Messages {messages.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{messages.length}</span>}
            </button>
        </div>
      </div>

      <div className="p-6 md:p-8">
        
        {/* --- TAB 1: INVENTORY --- */}
        {activeTab === 'inventory' && (
          <div className="animate-fade-in">
            <h3 className="font-bold text-gray-700 mb-4">Add New Product</h3>
            <form onSubmit={handleSubmit} className="mb-10 p-6 bg-blue-50/50 rounded-xl border border-blue-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div><label className="block text-xs font-bold text-gray-500 mb-1">Name</label><input name="name" value={newProduct.name} onChange={handleChange} className="w-full border rounded-lg p-3" /></div>
                <div><label className="block text-xs font-bold text-gray-500 mb-1">Price</label><input name="price" type="number" value={newProduct.price} onChange={handleChange} className="w-full border rounded-lg p-3" /></div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
                   <select name="category" value={newProduct.category} onChange={handleChange} className="w-full border rounded-lg p-3 bg-white">{Object.keys(categoryData).map(cat => <option key={cat}>{cat}</option>)}</select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">Subcategory</label>
                   <select name="subcategory" value={newProduct.subcategory} onChange={handleChange} className="w-full border rounded-lg p-3 bg-white">{categoryData[newProduct.category].map(sub => <option key={sub}>{sub}</option>)}</select>
                </div>
                <div className="md:col-span-2">
                   <label className="block text-xs font-bold text-gray-500 mb-1">Image</label>
                   <input id="fileInput" type="file" accept="image/*" onChange={handleFileChange} className="w-full border rounded-lg p-3 bg-white cursor-pointer" />
                </div>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg">UPLOAD PRODUCT</button>
            </form>
            <div className="space-y-3 h-96 overflow-y-auto pr-2">
               {products.map((item) => (
                 <div key={item._id || item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-4">
                      {/* Handle both new Base64 images and old URLs */}
                      <img src={item.imageUrl || item.image} alt={item.name} className="w-12 h-12 object-contain rounded-md border" />
                      <div><h4 className="font-bold text-sm">{item.name}</h4><span className="text-xs text-gray-500">${item.price}</span></div>
                    </div>
                    <button onClick={() => onRemoveProduct(item._id || item.id)} className="text-red-500 font-bold text-xs bg-red-50 px-3 py-1.5 rounded">Remove</button>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* --- TAB 2: ORDERS --- */}
        {activeTab === 'orders' && (
          <div className="animate-fade-in space-y-6">
             {orders.length === 0 ? <p className="text-gray-400 text-center py-10">No orders yet.</p> : orders.map((order) => (
               <div key={order._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                     <div><h4 className="font-bold text-gray-800">{order.customerName}</h4><p className="text-xs text-gray-500">{order.phone} • {order.address}</p></div>
                     <div className="text-right">
                       <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-1 ${order.paymentMethod === 'COD' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{order.paymentMethod}</span>
                       <p className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString()}</p>
                     </div>
                  </div>
                  <div className="p-4 bg-white">
                    <div className="space-y-2">{order.items.map((item, idx) => (<div key={idx} className="flex items-center justify-between text-sm"><div className="flex items-center gap-3"><span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">{item.quantity}x</span><span className="text-gray-700">{item.name}</span></div><span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span></div>))}</div>
                    <div className="mt-4 pt-4 border-t flex justify-between items-center"><span className="text-sm font-bold text-gray-500">TOTAL AMOUNT</span><span className="text-xl font-bold text-blue-600">${order.totalAmount}</span></div>
                  </div>
               </div>
             ))}
          </div>
        )}

        {/* --- TAB 3: MESSAGES --- */}
        {activeTab === 'messages' && (
          <div className="animate-fade-in grid gap-4">
             {messages.length === 0 ? <p className="text-gray-400 text-center">No messages.</p> : messages.map((msg, i) => (
               <div key={i} className="bg-white border p-4 rounded-xl shadow-sm">
                  <h4 className="font-bold">{msg.name}</h4>
                  <p className="text-blue-600 text-xs mb-2">{msg.email}</p>
                  <p className="text-gray-700 text-sm">{msg.message}</p>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;