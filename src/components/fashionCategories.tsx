import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryService, type Category } from '../services/categoryService';
import { productService } from '../services/productService';
import { FashionCardSkeleton } from './SkeletonLoader';

interface Banner {
  image: string;
  images: string[];
  eyebrow: string;
  title: string;
}

interface CategoryWithCount extends Category {
  productCount: number;
}

const FashionCategories: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoriesWithCounts();
  }, []);

  const loadCategoriesWithCounts = async () => {
    try {
      setLoading(true);
      
      // Load categories and products in parallel
      const [categoriesData, productsData] = await Promise.all([
        categoryService.getCategories(),
        productService.getProducts({ limit: 1000 }) // Get all products to count
      ]);

      // Ensure categories is always an array
      const categoriesArray = Array.isArray(categoriesData) ? categoriesData : [];
      
      // Ensure products is always an array
      const productsArray = Array.isArray(productsData.products) ? productsData.products : [];
      
      // Count products per category
      const categoriesWithCounts = categoriesArray.map((category: Category) => {
        const productCount = productsArray.filter((product: any) => {
          const productCategory = product.category || '';
          const productCategoryId = product.categoryId || '';
          
          return productCategory === category.name || 
                 (typeof productCategoryId === 'object' && productCategoryId?.name === category.name) ||
                 productCategoryId === category.id ||
                 productCategoryId === category.name;
        }).length;
        
        return {
          ...category,
          productCount
        };
      });
      
      setCategories(categoriesWithCounts);
      
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to sample categories with counts
      setCategories([
        { id: 1, name: 'Dresses', slug: 'dresses', image: 'https://picsum.photos/200/200?random=301', productCount: 24 },
        { id: 2, name: 'Tops', slug: 'tops', image: 'https://picsum.photos/200/200?random=302', productCount: 45 },
        { id: 3, name: 'Bottoms', slug: 'bottoms', image: 'https://picsum.photos/200/200?random=303', productCount: 32 },
        { id: 4, name: 'Outerwear', slug: 'outerwear', image: 'https://picsum.photos/200/200?random=304', productCount: 18 },
        { id: 5, name: 'Accessories', slug: 'accessories', image: 'https://picsum.photos/200/200?random=305', productCount: 56 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/product-category/${categoryName.toLowerCase()}`);
  };

  // Default banner data
  const banner: Banner = {
    image: "https://picsum.photos/1200/600?random=204",
    images: [
      "https://picsum.photos/1200/600?random=204",
      "https://picsum.photos/1200/600?random=205",
    ],
    eyebrow: "FASHION COLLECTION",
    title: "SHOP BY CATEGORY",
  };

  if (loading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent mb-12 shadow-md"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3 lg:pr-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-24 mb-4"></div>
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-4 lg:mx-4">
              <div className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg">
                <div className="w-full h-[500px] bg-gray-200 animate-pulse"></div>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-4">
                <FashionCardSkeleton count={4} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      {/* Top Border Line */}
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent mb-12 shadow-md"></div>
      </div>
      
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Three Column Vertical Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Column 1: Title and Menu */}
          <div className="flex flex-col lg:col-span-3 lg:pr-4">
            <h2 className="text-3xl font-bold text-orange-600 mb-4">Fashion Categories</h2>
            <nav className="flex flex-col space-y-1">
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((category) => (
                  <button 
                    key={category.id} 
                    className="text-left px-4 py-1 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    {category.name}
                  </button>
                ))
              ) : (
                // Fallback menu items
                ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Accessories'].map((item) => (
                  <button 
                    key={item} 
                    className="text-left px-4 py-1 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200"
                    onClick={() => handleCategoryClick(item)}
                  >
                    {item}
                  </button>
                ))
              )}
            </nav>
          </div>

          {/* Column 2: Vertical Banner */}
          <div className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg lg:col-span-4 lg:mx-4">
            <img 
              src={banner.image} 
              alt={banner.title} 
              className="w-full h-full min-h-[500px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8">
              <span className="text-white/90 text-sm uppercase tracking-wider mb-2 font-medium">
                {banner.eyebrow}
              </span>
              <h3 className="text-white text-3xl font-bold mb-2">{banner.title}</h3>
              <button 
                className="bg-white text-gray-900 px-6 py-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => navigate('/products')}
              >
                Shop Now
              </button>
            </div>
          </div>

          {/* Column 3: Category Grid */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-4">
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="group cursor-pointer bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={category.image || `https://picsum.photos/200/200?random=${category.id}`}
                        alt={category.name}
                        className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-gray-900 mb-1 text-sm">{category.name}</h4>
                      <p className="text-xs text-gray-500">{category.productCount} items</p>
                    </div>
                  </div>
                ))
              ) : (
                // Fallback categories
                [
                  { id: 1, name: 'Dresses', slug: 'dresses', image: 'https://picsum.photos/200/200?random=301', productCount: 24 },
                  { id: 2, name: 'Tops', slug: 'tops', image: 'https://picsum.photos/200/200?random=302', productCount: 45 },
                  { id: 3, name: 'Bottoms', slug: 'bottoms', image: 'https://picsum.photos/200/200?random=303', productCount: 32 },
                  { id: 4, name: 'Outerwear', slug: 'outerwear', image: 'https://picsum.photos/200/200?random=304', productCount: 18 },
                ].map((category) => (
                  <div
                    key={category.id}
                    className="group cursor-pointer bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-gray-900 mb-1 text-sm">{category.name}</h4>
                      <p className="text-xs text-gray-500">{category.productCount} items</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FashionCategories;
