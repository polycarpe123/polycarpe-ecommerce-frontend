import React from 'react';

const BuyNow: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container px-4 max-w-7xl mx-auto py-16'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>Buy Now</h1>
          <div className='max-w-2xl mx-auto'>
            <div className='bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg'>
              <h2 className='text-2xl font-semibold text-orange-800 mb-3'>Coming Soon!</h2>
              <p className='text-gray-700 text-lg leading-relaxed'>
                We're creating an express checkout experience for quick purchases. 
                This page will feature one-click buying, express payment options, and streamlined order processing.
              </p>
              <div className='mt-6'>
                <div className='inline-flex items-center gap-2 text-orange-600'>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className='font-medium'>Page under construction</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}  

export default BuyNow;