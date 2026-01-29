import React, { useState } from "react";
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const [openSections, setOpenSections] = useState({
    information: false,
    service: false,
    account: false,
    newsletter: false,
  });
  const [email, setEmail] = useState('');

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container px-4 max-w-7xl mx-auto py-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 lg:gap-4">
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block">
              <h2 className="text-2xl font-bold text-blue-400 mb-3 hover:text-blue-300 transition-colors cursor-pointer">kapee.</h2>
            </Link>
            <p className="text-gray-300 mb-4">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
            </p>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-blue-400">📍</span>
                <span className="text-sm">Lorem Ipsum, 2046 Lorem Ipsum</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-400">📞</span>
                <span className="text-sm">576-245-2478</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-400">✉️</span>
                <span className="text-sm">info@kapee.com</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-blue-400">🕒</span>
                <span className="text-sm">Mon - Fri / 9:00 AM - 6:00 PM</span>
              </div>
            </div>
            <div className="flex gap-2">
              <a href="#" className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center hover:bg-blue-700">
                f
              </a>
              <a href="#" className="w-8 h-8 bg-black rounded flex items-center justify-center hover:bg-gray-800">
                𝕏
              </a>
              <a href="#" className="w-8 h-8 bg-blue-700 rounded flex items-center justify-center hover:bg-blue-800">
                in
              </a>
              <a href="#" className="w-8 h-8 bg-pink-600 rounded flex items-center justify-center hover:bg-pink-700">
                📷
              </a>
              <a href="#" className="w-8 h-8 bg-red-600 rounded flex items-center justify-center hover:bg-red-700">
                ▶️
              </a>
            </div>
          </div>

          <div>
            <button 
              onClick={() => toggleSection("information")}
              className="md:hidden w-full flex justify-between items-center py-2 text-left font-semibold"
            >
              INFORMATION
              <span className={`transform transition-transform ${openSections.information ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            <h3 className="hidden md:block font-semibold mb-3">INFORMATION</h3>
            <div className={`${openSections.information || 'md:block'} ${!openSections.information && 'hidden'}`}>
              <ul className="space-y-1">
                <li><a href="#" className="text-gray-300 hover:text-white text-sm">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white text-sm">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white text-sm">Terms & Conditions</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white text-sm">Returns & Exchanges</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white text-sm">Shipping & Delivery</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white text-sm">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div>
            <button 
              onClick={() => toggleSection("service")}
              className="md:hidden w-full flex justify-between items-center py-2 text-left font-semibold"
            >
              OUR SERVICE
              <span className={`transform transition-transform ${openSections.service ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            <h3 className="hidden md:block font-semibold mb-3">OUR SERVICE</h3>
            <div className={`${openSections.service || 'md:block'} ${!openSections.service && 'hidden'}`}>
              <ul className="space-y-1">
                <li><a href="#" className="text-gray-300 hover:text-white text-sm">Track Order</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white text-sm">Wishlist</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white text-sm">Login</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white text-sm">Cart</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white text-sm">Support</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white text-sm">FAQ</a></li>
              </ul>
            </div>
          </div>

          <div>
            <button 
              onClick={() => toggleSection("account")}
              className="md:hidden w-full flex justify-between items-center py-2 text-left font-semibold"
            >
              MY ACCOUNT
              <span className={`transform transition-transform ${openSections.account ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            <h3 className="hidden md:block font-semibold mb-3">MY ACCOUNT</h3>
            <div className={`${openSections.account || 'md:block'} ${!openSections.account && 'hidden'}`}>
              <ul className="space-y-1">
                <li><a href="#" className="text-gray-300 hover:text-white text-sm">My Account</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white text-sm">Order History</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white text-sm">Wishlist</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white text-sm">Newsletter</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white text-sm">Affiliate</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white text-sm">Returns</a></li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <button 
              onClick={() => toggleSection("newsletter")}
              className="md:hidden w-full flex justify-between items-center py-2 text-left font-semibold"
            >
              NEWSLETTER
              <span className={`transform transition-transform ${openSections.newsletter ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            <h3 className="hidden md:block font-semibold mb-3">NEWSLETTER</h3>
            <div className={`${openSections.newsletter || 'md:block'} ${!openSections.newsletter && 'hidden'}`}>
              <p className="text-gray-300 text-sm mb-3">
                Subscribe to get special offers, free giveaways, and
                once-in-a-lifetime deals.
              </p>
              
              {/* Newsletter Signup Form */}
              <form onSubmit={handleNewsletterSubmit} className="mb-3">
                <div className="flex flex-col gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-gray-700 text-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            Kapee © 2024 by PressLayouts All Rights Reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-sm bg-gray-800 px-2 py-1 rounded">VISA</span>
            <span className="text-sm bg-gray-800 px-2 py-1 rounded">PayPal</span>
            <span className="text-sm bg-gray-800 px-2 py-1 rounded">Discover</span>
            <span className="text-sm bg-gray-800 px-2 py-1 rounded">Maestro</span>
            <span className="text-sm bg-gray-800 px-2 py-1 rounded">MC</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;