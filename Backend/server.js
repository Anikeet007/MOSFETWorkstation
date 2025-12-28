require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
// Increase payload limit for Base64 images
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

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Add your Gmail address to .env
    pass: process.env.EMAIL_PASS  // Add your Gmail App Password to .env
  }
});

// --- DATABASE SCHEMAS ---

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  subcategory: String,
  specs: String,
  image: String
});
const Product = mongoose.model('Product', productSchema);

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

// Order Schema
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

// POST Contact Message
app.post('/api/contact', async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.json({ message: "Saved" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET Contact Messages
app.get('/api/contact', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 });
    res.json(contacts);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST Order (Place Order)
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    console.log("📦 New Order Placed:", newOrder._id);
    res.json({ message: "Order Success!", orderId: newOrder._id });
  } catch (err) { 
    console.error("Order Error:", err);
    res.status(500).json({ error: "Failed to place order" }); 
  }
});

// GET Orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ error: "Failed to fetch orders" }); }
});

app.put('/api/orders/:id/deliver', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = "Delivered";
    await order.save();

    // Send Email Notification
    if (order.email) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: order.email,
        subject: "📦 Order Delivered - Mosfet Workstation",
        text: `Hello ${order.customerName},\n\nGood news! Your order has been delivered successfully.\n\nItems: ${order.items.length}\nTotal: Rs.${order.totalAmount}\n\nThank you for choosing Mosfet Workstation!`
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log("Email Error:", error);
        else console.log("Email sent: " + info.response);
      });
    }

    res.json({ message: "Order marked as Delivered and Email Sent!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update order" });
  }
});

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));