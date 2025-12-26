const express = require('express');
const fs = require('fs'); 
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// 1. Connect to MongoDB
mongoose.connect('mongodb+srv://aniket_db_user:Mosfet@123@cluster0.5bm2uaq.mongodb.net/?appName=Cluster0')
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// 2. Setup Multer (Uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// Allow the app to show images from the 'uploads' folder
app.use('/uploads', express.static('uploads'));

// 3. Define Database Schemas
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  subcategory: String,
  specs: String,
  imageUrl: String
});
const Product = mongoose.model('Product', productSchema);

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', contactSchema);

// --- ROUTES ---

// 📩 POST: Save Contact Form Messages
app.post('/api/contact', async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    console.log("📬 New Message Received from:", req.body.name);
    res.json({ message: "Message received!" });
  } catch (err) {
    console.error("Contact Error:", err);
    res.status(500).json({ error: "Failed to save message" });
  }
});

// 👇 ADDED: GET Route to View Messages (For Admin)
app.get('/api/contact', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ date: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// 📤 UPLOAD ROUTE: Save Product
app.post('/api/products', upload.single('image'), async (req, res) => {
  console.log("\n📥 New Upload Request!"); 
  
  try {
    if (!req.file) throw new Error("Image file is missing!");

    const productData = {
      name: req.body.name,
      price: req.body.price, 
      category: req.body.category,
      subcategory: req.body.subcategory, 
      specs: req.body.specs || "", 
      imageUrl: `https://mosfetworkstation.onrender.com/uploads/${req.file.filename}` 
    };

    console.log("📦 Data to Save:", productData);

    const newProduct = new Product(productData);
    await newProduct.save();

    console.log("✅ SUCCESS: Product Saved!");
    res.status(201).json(newProduct);

  } catch (err) {
    console.error("❌ ERROR:", err.message); 
    res.status(500).json({ error: err.message });
  }
});

// GET ROUTE: Fetch Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE ROUTE: Remove Product & Image
app.delete('/api/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Delete image file if it exists
    if (product.imageUrl) {
        const filename = product.imageUrl.split('/').pop();
        const filePath = path.join(__dirname, 'uploads', filename);
        fs.unlink(filePath, (err) => {
            if (err) console.log("⚠️ File delete warning:", err.message);
            else console.log("🗑️ Image file deleted:", filename);
        });
    }

    await Product.findByIdAndDelete(id);
    res.json({ message: "Item and image deleted successfully!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete item" });
  }
});

// 4. Start Server
const PORT = 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// 1. Define Order Schema
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

// ... rest of your code ...