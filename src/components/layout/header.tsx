import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CartModal from '../CartModal';
import AuthModal from '../AuthModal';
import LogoutModal from '../LogoutModal';
import SearchDropdown from '../SearchDropdown';
import { useApp } from '../../contexts/AppContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { safeCurrency } from '../../utils/formatting';

const Navigation: React.FC = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { 
        user, 
        isAuthenticated, 
        logout, 
        cart, 
        getCartCount, 
        getCartTotal 
    } = useApp();

    const { wishlistCount } = useWishlist();

    const cartCount = getCartCount();
    const cartTotal = getCartTotal();

    const handleAuthClick = () => {
        if (isAuthenticated) {
            setIsLogoutOpen(true); // Show logout modal
        } else {
            setIsAuthOpen(true); // Show login modal
        }
    };

    const handleLogoutConfirm = () => {
        logout();
        setIsLogoutOpen(false);
    };

    const handleLogoutCancel = () => {
        setIsLogoutOpen(false);
    };

    const handleUpdateQuantity = (_id: string | number, _quantity: number) => {
        // TO DO: implement update quantity logic using useApp context
    };

    const handleRemoveItem = (_id: string | number) => {
        // TO DO: implement remove item logic using useApp context
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
              <Link to="/" className="inline-block">
                <h1 className="text-2xl md:text-3xl font-bold text-white hover:text-gray-200 transition-colors cursor-pointer">kapee.</h1>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <SearchDropdown 
                placeholder="Search for products, categories, brands..."
                className="bg-white rounded-full flex items-center p-1"
              />
            </div>

            {/* Right Section */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-white text-sm flex items-center gap-2">
                <span className="text-xl">👤</span>
                <div>
                  <span className="block">
                    {isAuthenticated ? `HELLO, ${user?.firstName || 'USER'}` : 'HELLO,'}
                  </span>
                  <div className="flex items-center gap-2">
                    {isAuthenticated && user?.role === 'admin' && (
                      <Link 
                        to="/admin/dashboard" 
                        className="text-xs bg-yellow-500 text-blue-900 px-2 py-1 rounded font-medium hover:bg-yellow-400 transition-colors"
                      >
                        ADMIN
                      </Link>
                    )}
                    <button 
                      onClick={handleAuthClick}
                      className="hover:text-gray-300 font-medium"
                    >
                      {isAuthenticated ? 'LOGOUT' : 'SIGN IN'}
                    </button>
                  </div>
                </div>
              </div>

              <button className="relative text-white hover:text-gray-300">
                <span className="text-2xl">♡</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button className="relative text-white hover:text-gray-300 cursor-pointer" onClick={() => setIsCartOpen(true)}>
                  <span className="text-2xl">🛒</span>
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                </button>
                <span className="text-white text-sm font-medium">{safeCurrency(cartTotal)}</span>
              </div>
            </div>

            {/* Mobile Right Icons */}
            <div className="flex md:hidden items-center gap-4">
              <button className="relative text-white hover:text-gray-300">
                <span className="text-2xl">♡</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <button className="relative text-white hover:text-gray-300" onClick={() => setIsCartOpen(true)}>
                <span className="text-2xl">🛒</span>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden mt-4">
            <SearchDropdown 
              placeholder="Search products..."
              className="bg-white rounded-full flex items-center p-1"
            />
          </div>
        </div>
      </div>
        <nav className='bg-white shadow-md'>
            <div className='container mx-auto px-4 py-4 max-w-7xl'>
                {/* Desktop Navigation */}
                <div className='hidden lg:flex items-center'>
                    <div className='bg-white border-r px-6 py-2 flex items-center justify-between' style={{ width: '250px' }}>
                        <span className='text-gray-700 font-semibold'>SHOP BY DEPARTMENT</span>
                        <span className='text-gray-700 text-xl'>&#8801;</span>
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

                {/* Mobile Navigation */}
                <div className='lg:hidden'>
                    <div className='bg-white border-r px-4 py-2 flex items-center justify-between'>
                        <span className='text-gray-700 font-semibold text-sm'>SHOP BY DEPARTMENT</span>
                        <span className='text-gray-700 text-lg'>&#8801;</span>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className='lg:hidden mt-4 border-t pt-4'>
                        <ul className='space-y-3'>
                            <li><Link to="/" className='text-gray-700 hover:text-blue-800 font-medium block py-2'>HOME</Link></li>
                            <li><Link to="/shop" className='text-gray-700 hover:text-blue-800 font-medium block py-2'>SHOP</Link></li>
                            <li><Link to="/pages" className='text-gray-700 hover:text-blue-800 font-medium block py-2'>PAGES</Link></li>
                            <li><Link to="/blog" className='text-gray-700 hover:text-blue-800 font-medium block py-2'>BLOG</Link></li>
                            <li><Link to="/elements" className='text-gray-700 hover:text-blue-800 font-medium block py-2'>ELEMENTS</Link></li>
                            <li><Link to="/buy-now" className='text-gray-700 hover:text-blue-800 font-medium block py-2'>BUY NOW</Link></li>
                        </ul>
                        <div className='mt-4 pt-4 border-t'>
                            <button 
                                onClick={() => setIsAuthOpen(true)}
                                className='w-full text-left text-gray-700 hover:text-blue-800 font-medium py-2'
                            >
                                SIGN IN
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
        </header>
        <CartModal 
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cart?.items || []}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
        />
        <AuthModal 
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
        />
        <LogoutModal 
            isOpen={isLogoutOpen}
            onConfirm={handleLogoutConfirm}
            onCancel={handleLogoutCancel}
        />
        </>
    );
}

export default Navigation;