import React from 'react';
import { Link } from 'react-router-dom';
// 👇 Import the logos
import esewaLogo from '../assets/images/esewa.png';
import khaltiLogo from '../assets/images/khalti.png';

const Footer = () => (
  <footer className="bg-white border-t mt-20 pt-10 pb-16 md:pb-6">
    
    <div className="w-full px-6 md:px-12 flex flex-col md:flex-row justify-between gap-8 mb-10 text-center md:text-left">
      
      {/* 1. About Section */}
      <div className="md:w-1/3">
        <h4 className="font-bold text-blue-900 mb-4 uppercase tracking-wider">About MOSFET</h4>
        <p className="text-sm text-gray-500 leading-relaxed">
          Your trusted workstation for premium laptop accessories and genuine repair parts in Nepal. Quality guaranteed.
        </p>
      </div>

      {/* 2. Links Section */}
      <div>
        <div className="hidden md:block">
          <h4 className="font-bold text-blue-900 mb-4 uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-blue-600 transition-colors">Any Feedback</Link></li>
            <li><Link to="/blog" className="hover:text-blue-600 transition-colors">Tech Blog</Link></li>
          </ul>
        </div>
      </div>

      {/* 3. Contact Section */}
      <div>
        <h4 className="font-bold text-blue-900 mb-4 uppercase tracking-wider">Contact Us</h4>
        <div className="space-y-2 text-sm text-gray-500">
           <p>📍 Golmadi, Bhaktapur</p>
           <p>📞 +977 9765300233</p>
           <p>✉️ mosfetws@gmail.com</p>
        </div>
      </div>

      {/* 4. Payment Section (Updated with Logos) */}
      <div className="md:text-right flex flex-col items-center md:items-end ">
        <h4 className="font-bold text-blue-900 mb-4 uppercase tracking-wider">We Accept</h4>
        <div className="flex items-center gap-4 w-200">
          {/* eSewa Logo */}
          <div className="bg-white border border-gray-200 rounded-lg p-1 h-10 w-16 flex items-center justify-center overflow-hidden">
             <img src={esewaLogo} alt="eSewa" className="w-full h-full object-contain" />
          </div>
          {/* Khalti Logo */}
          <div className="bg-white border border-gray-200 rounded-lg p-1 h-10 w-16 flex items-center justify-center overflow-hidden">
             <img src={khaltiLogo} alt="Khalti" className="w-full h-full object-contain" />
             
          </div>
        </div>
      </div>

    </div>
    
    <div className="border-t pt-6 text-center text-[10px] text-gray-400 uppercase tracking-widest">
      © 2025 MOSFET Workstation. All Rights Reserved.
    </div>
  </footer>
);

export default Footer;