import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryService, type Category } from '../services/categoryService';

const ProductCategories = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await categoryService.getCategories();
      // Ensure categories is always an array
      const categoriesArray = Array.isArray(categoriesData) ? categoriesData : [];
      setCategories(categoriesArray);
    } catch (error) {
      console.error('Error loading categories:', error);
      // Fallback to empty array or sample categories
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

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
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No categories available at the moment.</p>
          </div>
        ) : (
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
                {Array.isArray(categories) && categories.map((category) => (
                  <div 
                    key={category.id} 
                    onClick={() => handleCategoryClick(category.name)}
                    className="shrink-0 text-center cursor-pointer hover:transform hover:scale-105 transition-transform"
                  >
                    <div className="w-25 h-25 mx-auto mb-3 rounded-full overflow-hidden bg-white shadow-md">
                      <img 
                        src={category.image || `https://picsum.photos/100/100?random=${category.id}`} 
                        alt={category.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    {category.productCount > 0 && (
                      <span className="text-xs text-gray-500 block">({category.productCount} products)</span>
                    )}
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
        )}
      </div>
    </section>
  );
};

export default ProductCategories;
