import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; 

const API_URL = "https://mosfetworkstation-backend.onrender.com/api/contact";


const PageHeader = ({ title }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b pb-6">
    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
    <Link 
      to="/" 
      className="mt-4 md:mt-0 self-start md:self-auto text-blue-600 hover:text-blue-800 font-bold text-lg flex items-center gap-2 transition-colors bg-blue-50 px-4 py-2 rounded-lg"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      Back to Shop
    </Link>
  </div>
);

// ℹ️ ABOUT PAGE
export const About = () => (
  <div className="max-w-5xl mx-auto p-6 pt-10 animate-fade-in pb-24">
    <PageHeader title="About Mosfet" />
    <div className="prose prose-xl text-gray-600 leading-relaxed mb-12">
      <p className="mb-6">
        Welcome to <strong className="text-blue-600">Mosfet Workstation</strong>, Nepal's premier destination for high-performance computer components. 
      </p>
      <p>
        Whether you are a professional video editor needing a workstation upgrade or a gamer looking for the perfect mouse, we have got you covered with authentic parts and expert advice.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100 shadow-sm"><h3 className="font-bold text-blue-900 mb-3 text-xl">Quality Guaranteed</h3><p className="text-gray-600">We strictly stock genuine parts from top global brands.</p></div>
      <div className="bg-green-50 p-8 rounded-2xl border border-green-100 shadow-sm"><h3 className="font-bold text-green-900 mb-3 text-xl">Expert Support</h3><p className="text-gray-600">Our technical team is here to guide you.</p></div>
      <div className="bg-purple-50 p-8 rounded-2xl border border-purple-100 shadow-sm"><h3 className="font-bold text-purple-900 mb-3 text-xl">Fast Delivery</h3><p className="text-gray-600">Rapid delivery across Kathmandu and major cities.</p></div>
    </div>
  </div>
);

// 📞 CONTACT PAGE (Functional!)
export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(''); // 'loading', 'success', 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all fields");
      return;
    }
    
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("❌ Invalid Email Format! Please enter a valid email address.");
      return;
    }


    setStatus('loading');
    try {
      // 👇 FIXED: Removed quotes around API_URL variable
      await axios.post(API_URL, formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' }); // Clear form
      alert("✅ Message Sent! We will contact you shortly.");
    } catch (err) {
      console.error(err);
      setStatus('error');
      alert("❌ Failed to send message. Is the server running?");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 pt-10 animate-fade-in pb-24">
      <PageHeader title="Contact Us" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left Side: Info & Map */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Get in Touch</h2>
          <p className="text-gray-500 text-lg mb-10 leading-relaxed">
            Have questions about a product or need a custom build? We are here to help. 
          </p>

          <div className="space-y-8 mb-12">
            <div className="flex items-start gap-6 p-4 rounded-xl hover:bg-gray-50 transition"><div className="bg-blue-100 p-4 rounded-full text-2xl shrink-0">📍</div><div><h3 className="font-bold text-gray-900 text-xl mb-1">Visit Store</h3><p className="text-gray-600 text-lg">Golmadi, Bhaktapur</p></div></div>
            <div className="flex items-start gap-6 p-4 rounded-xl hover:bg-gray-50 transition"><div className="bg-green-100 p-4 rounded-full text-2xl shrink-0">📞</div><div><h3 className="font-bold text-gray-900 text-xl mb-1">Call Us</h3><p className="text-gray-600 text-lg">+977-9765300233</p></div></div>
            <div className="flex items-start gap-6 p-4 rounded-xl hover:bg-gray-50 transition"><div className="bg-orange-100 p-4 rounded-full text-2xl shrink-0">✉️</div><div><h3 className="font-bold text-gray-900 text-xl mb-1">Email</h3><p className="text-gray-600 text-lg">mosfetws@gmail.com</p></div></div>
          </div>

          {/* Map */}
          <div>
             <h3 className="font-bold text-gray-800 text-xl mb-4 flex items-center gap-2"><span className="text-red-500">🗺️</span> Find us on Map</h3>
             <div className="w-full h-64 bg-gray-100 rounded-2xl overflow-hidden shadow-md border border-gray-200">
               <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.488173724248!2d85.43069687466968!3d27.67130297620326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb051ecf3fc3a5%3A0x376d1a74072c12!2sMOSFET%20workstation!5e0!3m2!1sen!2snp!4v1766490938540!5m2!1sen!2snp" width="100%" height="100%" style={{border:0}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map"></iframe>
             </div>
          </div>
        </div>

        {/* Right Side: Functional Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-3xl p-10 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-gray-800 mb-8">Send us a Message</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-base font-bold text-gray-700 mb-2 ml-1">Your Name</label>
                <input name="name" value={formData.name} onChange={handleChange} type="text" className="w-full border-2 border-gray-200 rounded-xl p-4 text-lg focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white" placeholder="John Doe" required />
              </div>
              <div>
                <label className="block text-base font-bold text-gray-700 mb-2 ml-1">Email Address</label>
                <input name="email" value={formData.email} onChange={handleChange} type="email" className="w-full border-2 border-gray-200 rounded-xl p-4 text-lg focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white" placeholder="john@example.com" required />
              </div>
              <div>
                <label className="block text-base font-bold text-gray-700 mb-2 ml-1">Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} className="w-full border-2 border-gray-200 rounded-xl p-4 text-lg focus:border-blue-500 outline-none h-48 transition bg-gray-50 focus:bg-white resize-none" placeholder="I need help finding a battery..." required></textarea>
              </div>
              <button disabled={status === 'loading'} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl text-lg hover:bg-blue-700 shadow-lg transition transform active:scale-[0.98] disabled:bg-gray-400">
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// 📝 BLOG PAGE
export const Blog = () => (
  <div className="max-w-6xl mx-auto p-6 pt-10 animate-fade-in pb-24">
    <PageHeader title="Tech Blog" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((post) => (
        <div key={post} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all cursor-pointer flex flex-col h-full">
          <div className="bg-gray-100 h-56 flex items-center justify-center text-gray-400 font-bold">Article Image {post}</div>
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-center gap-2 mb-3"><span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">GUIDE</span><span className="text-gray-400 text-xs font-medium">Dec 23, 2025</span></div>
            <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition">How to choose the right RAM</h2>
            <span className="text-blue-600 font-bold text-sm mt-auto group-hover:underline">Read Article →</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);