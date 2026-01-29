import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 1, name: 'Men', image: 'https://picsum.photos/100/100?random=1' },
  { id: 2, name: 'Women', image: 'https://picsum.photos/100/100?random=2' },
  { id: 3, name: 'Shoes', image: 'https://picsum.photos/100/100?random=3' },
  { id: 4, name: 'Bags & Backpacks', image: 'https://picsum.photos/100/100?random=4' },
  { id: 5, name: 'Watches', image: 'https://picsum.photos/100/100?random=5' },
  { id: 6, name: 'Jewerly', image: 'https://picsum.photos/100/100?random=6' },
  { id: 7, name: 'Electronics', image: 'https://picsum.photos/100/100?random=1' },
  { id: 8, name: 'Clothing', image: 'https://picsum.photos/100/100?random=2' },
  { id: 9, name: 'Books', image: 'https://picsum.photos/100/100?random=3' },
  { id: 10, name: 'Home & Garden', image: 'https://picsum.photos/100/100?random=4' },
  { id: 11, name: 'Sports', image: 'https://picsum.photos/100/100?random=5' },
  { id: 12, name: 'Beauty', image: 'https://picsum.photos/100/100?random=6' },
];

const ProductCategories = () => {
const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const navigate = useNavigate();

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      const newScrollLeft =
        direction === "left"
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });

      setTimeout(checkScroll, 300);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/product-category/${categoryName.toLowerCase()}`);
  };

  React.useEffect(() => {
    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Previous categories"
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 ${!canScrollLeft ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
          >
            ←
          </button>

          <div 
            ref={scrollRef} 
            onScroll={checkScroll}
            className="overflow-x-auto scrollbar-hide mx-12"
          >
            <div className="flex gap-6 pb-4">
              {categories.map((category) => (
                <div 
                  key={category.id} 
                  onClick={() => handleCategoryClick(category.name)}
                  className="shrink-0 text-center cursor-pointer hover:transform hover:scale-105 transition-transform"
                >
                  <div className="w-25 h-25 mx-auto mb-3 rounded-full overflow-hidden bg-white shadow-md">
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Next categories"
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 ${!canScrollRight ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
