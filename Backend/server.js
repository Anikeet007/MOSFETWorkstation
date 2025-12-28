require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const MONGO_URI = process.env.MONGO_URI; 

if (!MONGO_URI) {
  console.error("❌ Error: MONGO_URI is missing in .env file.");
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Cloud MongoDB Connected"))
    .catch((err) => console.error("❌ Cloud DB Error:", err));
}

// 2. Define Database Schemas
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  subcategory: String,
  specs: String,
  image: String
});
const Product = mongoose.model('Product', productSchema);

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

const orderSchema = new mongoose.Schema({
  customerName: String,
  address: String,
  phone: String,
  items: Array, // Stores the cart items
  totalAmount: Number,
  paymentMethod: String, // 'COD', 'eSewa', 'Khalti'
  status: { type: String, default: "Pending" }, // 'Pending', 'Paid', 'Delivered'
  date: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);



// --- ROUTES ---

app.get('/', (req, res) => res.send("Mosfet Backend Running!"));

// GET Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Product (Base64 Image Version)
app.post('/api/products', async (req, res) => {
  try {
    // We receive the image as a string in req.body.image now
    const newProduct = new Product(req.body);
    await newProduct.save();
    console.log("✅ Product Saved:", newProduct.name);
    res.json(newProduct);
  } catch (err) {
    console.error("Save Error:", err.message);
    res.status(500).json({ error: "Failed to save product" });
  }
});

// DELETE Product
app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

// POST Contact
app.post('/api/contact', async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.json({ message: "Saved" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET Contacts
app.get('/api/contact', async (req, res) => {
  const contacts = await Contact.find().sort({ date: -1 });
  res.json(contacts);
});

// POST Order
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.json({ message: "Order Success!", orderId: newOrder._id });
  } catch (err) { res.status(500).json({ error: "Order failed" }); }
});

// GET Orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ error: "Failed to fetch orders" }); }
});

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// 1. Define Order Schema

// ... existing routes ...

// 2. NEW ROUTE: Place Order
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    console.log("📦 New Order Placed:", newOrder._id);
    
    // Return the Order ID (crucial for payment tracking)
    res.json({ message: "Order Success!", orderId: newOrder._id });
  } catch (err) {
    res.status(500).json({ error: "Failed to place order" });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 }); // Sort by newest first
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});
 
