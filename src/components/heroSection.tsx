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
      "https://picsum.photos/900/900?random=40",
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
    <section className="relative bg-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 relative">
            <button 
              onClick={handlePrev} 
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
            >
              ←
            </button>
            <button 
              onClick={handleNext} 
              aria-label="Next slide"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
            >
              →
            </button>

            <img
              src={current.image}
              alt={current.title}
              className={`w-full h-96 object-cover rounded-lg transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-75'}`}
            />
            <div className={`absolute inset-0 flex flex-col justify-center items-start p-8 text-white transition-all duration-300 ${isAnimating ? 'opacity-100 translate-x-0' : 'opacity-75 translate-x-4'}`}>
              <span className="text-sm uppercase tracking-wide mb-2">{current.eyebrow}</span>
              <h2 className="text-4xl font-bold mb-4">{current.title}</h2>
              <p className="text-lg mb-6 max-w-md">{current.copy}</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Shop Now
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md  flex flex-col">
              <div className="mb-4">
                <span className="text-sm text-gray-600 uppercase tracking-wide">WHITE SNEAKERS</span>
                <h3 className="text-xl font-bold text-gray-900">MIN. 30% OFF</h3>
                <p className="text-gray-600">Men Fashionable Shoes</p>
                <button className="mt-3 border border-gray-300 hover:border-gray-400 px-4 py-2 rounded text-gray-700 transition-colors">
                  Shop Now
                </button>
              </div>
              <img
                src="https://picsum.photos/600/600?random=92"
                alt="White sneakers"
                className="w-full h-32 object-cover rounded"
              />
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="mb-4">
                <span className="text-sm text-gray-600 uppercase tracking-wide">WOMEN'S FASHION</span>
                <h3 className="text-xl font-bold text-gray-900">UP TO 65% OFF</h3>
                <p className="text-gray-600">Shoes & Backpacks</p>
                <button className="mt-3 border border-gray-300 hover:border-gray-400 px-4 py-2 rounded text-gray-700 transition-colors">
                  Shop Now
                </button>
              </div>
              <img
                src="https://picsum.photos/600/600?random=93"
                alt="Women bags"
                className="w-full h-32 object-cover rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
