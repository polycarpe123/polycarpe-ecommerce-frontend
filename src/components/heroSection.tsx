import React, { useState } from "react";

interface HeroSlide {
  eyebrow: string;
  title: string;
  copy: string;
  image: string;
}

const slides: HeroSlide[] = [
  {
    eyebrow: "New Collections 2019",
    title: "MEN'S FASHION",
    copy: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor!",
    image:
      "https://i.pinimg.com/1200x/32/5b/f0/325bf01cc35e1852870cef2f6ad5e35c.jpg",
  },
  {
    eyebrow: "Summer Collection 2019",
    title: "WOMEN'S STYLE",
    copy: "Discover the latest trends in women's fashion with exclusive deals up to 50% off!",
    image:
      "https://picsum.photos/900/900?random=41",
  },
  {
    eyebrow: "Kids Fashion 2019",
    title: "KIDS COLLECTION",
    copy: "Comfortable and stylish clothing for your little ones. Shop the best quality!",
    image:
      "https://picsum.photos/900/900?random=42",
  },
];


const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  const handlePrev = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setIsAnimating(true);
    }, 50);
  };

  const handleNext = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setIsAnimating(true);
    }, 50);
  };

  const current = slides[currentSlide];

  return (
    <section className="relative bg-white py-8">
      <div className="container px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Hero Section */}
          <div className="lg:col-span-2 relative">
            <img
              src={current.image}
              alt={current.title}
              className={`w-full h-[500px] object-cover rounded-lg transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-75'}`}
            />
            <div className={`absolute inset-0 flex flex-col justify-center items-start p-12 text-white transition-all duration-300 ${isAnimating ? 'opacity-100 translate-x-0' : 'opacity-75 translate-x-4'}`}>
              <span className="text-sm uppercase tracking-wider mb-3 font-semibold">{current.eyebrow}</span>
              <h2 className="text-5xl font-bold mb-4 leading-tight">{current.title}</h2>
              <p className="text-lg mb-8 max-w-lg leading-relaxed">{current.copy}</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors text-lg">
                Shop Now
              </button>
            </div>
            
            {/* Navigation Arrows */}
            <button 
              onClick={handlePrev} 
              aria-label="Previous slide"
              className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10 bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={handleNext} 
              aria-label="Next slide"
              className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10 bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* First Promotional Card */}
            <div className="relative bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img
                src="https://picsum.photos/600/400?random=92"
                alt="White sneakers"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <span className="text-xs text-blue-600 uppercase tracking-wider font-semibold">WHITE SNEAKERS</span>
                <h3 className="text-2xl font-bold text-gray-900 mt-2 mb-1">MIN. 30% OFF</h3>
                <p className="text-gray-600 mb-4">Men Fashionable Shoes</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Shop Now
                </button>
              </div>
            </div>

            {/* Second Promotional Card */}
            <div className="relative bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img
                src="https://picsum.photos/600/400?random=93"
                alt="Women fashion"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <span className="text-xs text-blue-600 uppercase tracking-wider font-semibold">WOMEN'S FASHION</span>
                <h3 className="text-2xl font-bold text-gray-900 mt-2 mb-1">UP TO 65% OFF</h3>
                <p className="text-gray-600 mb-4">Shoes & Backpacks</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
