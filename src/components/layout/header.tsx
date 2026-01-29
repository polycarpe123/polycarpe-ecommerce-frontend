import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CartModal from '../CartModal';

const Navigation: React.FC = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState<any[]>([]);

    const handleUpdateQuantity = (id: string | number, quantity: number) => {
        if (quantity <= 0) {
            setCartItems(cartItems.filter(item => item.id !== id));
        } else {
            setCartItems(cartItems.map(item => 
                item.id === id ? { ...item, quantity } : item
            ));
        }
    };

    const handleRemoveItem = (id: string | number) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };    
    return (
        <>
        <header>
        <div className="bg-blue-600 text-white py-1">
        <div className="container mx-auto px-4 py-1.5 max-w-7xl">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <select className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
                <option>ENGLISH</option>
                <option>SPANISH</option>
                <option>FRENCH</option>
              </select>
              <select className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
                <option>$ DOLLAR (US)</option>
                <option>€ EURO</option>
                <option>£ POUND</option>
              </select>
            </div>
            <div className="flex gap-4 items-center text-sm">
              <span>WELCOME TO OUR STORE!</span>
              <Link to="/blog" className="hover:text-gray-300">BLOG</Link>
              <Link to="/faq" className="hover:text-gray-300">FAQ</Link>
              <Link to="/contact" className="hover:text-gray-300">CONTACT US</Link>
            </div>
          </div>    
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-blue-600 shadow-md py-4">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div>
              <h1 className="text-3xl font-bold text-white">kapee.</h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8 bg-white rounded-full flex items-center p-1">
              <input
                type="text"
                placeholder="Search for products, categories, brands, sku..."
                className="flex-1 px-4 py-2 text-gray-700 bg-transparent outline-none"
              />
              <select className="px-3 py-1 text-gray-600 bg-transparent outline-none text-sm">
                <option>All Categories</option>
                <option>Electronics</option>
                <option>Clothing</option>
                <option>Books</option>
              </select>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">
                Search
              </button>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-8">
              <div className="text-white text-sm flex items-center gap-2">
                <span className="text-xl">👤</span>
                <div>
                  <span className="block">HELLO,</span>
                  <button className="hover:text-gray-300 font-medium">SIGN IN</button>
                </div>
              </div>

              <button className="relative text-white hover:text-gray-300">
                <span className="text-2xl">♡</span>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">0</span>
              </button>

              <div className="flex items-center gap-2">
                <button className="relative text-white hover:text-gray-300 cursor-pointer" onClick={() => setIsCartOpen(true)}>
                  <span className="text-2xl">🛒</span>
                </button>
                <span className="text-white text-sm font-medium">$0.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
        <nav className='bg-white shadow-md'>
            <div className='container mx-auto px-4 py-4 max-w-7xl flex items-center'>
                <div className='bg-white border-r px-6 py-2 flex items-center justify-between' style={{ width: '250px' }}>
                    <span className='text-gray-700 font-semibold'>SHOP BY DEPARTMENT</span>
                    <span className='text-gray-700 text-xl'>&#8801;</span> {/* Hamburger icon */}
                </div>
                <ul className='flex space-x-6 ml-8'>
                    <li><Link to="/" className='text-gray-700 hover:text-blue-800 font-medium flex items-center'>HOME <span className='ml-1 text-xs'>&#9662;</span></Link></li>
                    <li><Link to="/shop" className='text-gray-700 hover:text-blue-800 font-medium flex items-center'>SHOP <span className='ml-1 text-xs'>&#9662;</span></Link></li>
                    <li><Link to="/pages" className='text-gray-700 hover:text-blue-800 font-medium flex items-center'>PAGES <span className='ml-1 text-xs'>&#9662;</span></Link></li>
                    <li><Link to="/blog" className='text-gray-700 hover:text-blue-800 font-medium flex items-center'>BLOG <span className='ml-1 text-xs'>&#9662;</span></Link></li>
                    <li><Link to="/elements" className='text-gray-700 hover:text-blue-800 font-medium flex items-center'>ELEMENTS <span className='ml-1 text-xs'>&#9662;</span></Link></li>
                    <li><Link to="/buy-now" className='text-gray-700 hover:text-blue-800 font-medium'>BUY NOW</Link></li>
                </ul>
            </div>
        </nav>
        </header>
        <CartModal 
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
        />
        </>
    );
}

export default Navigation;