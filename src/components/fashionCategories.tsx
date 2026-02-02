import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryService, type Category } from '../services/categoryService';
import { productService, type Product } from '../services/productService';
import { FashionCardSkeleton } from './SkeletonLoader';

interface Banner {
  image: string;
  images: string[];
  eyebrow: string;
  title: string;
}

const FashionCategories: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load categories and products in parallel
      const [categoriesData, productsData] = await Promise.all([
        categoryService.getCategories(),
        productService.getProducts({ limit: 6 })
      ]);

      // Ensure categories is always an array
      const categoriesArray = Array.isArray(categoriesData) ? categoriesData : [];
      setCategories(categoriesArray);
      
      // Ensure products is always an array
      const productsArray = Array.isArray(productsData.products) ? productsData.products : [];
      setProducts(productsArray);
      
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to empty arrays
      setCategories([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/product-category/${categoryName.toLowerCase()}`);
  };

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  // Default banner data
  const banner: Banner = {
    image: "https://picsum.photos/1200/600?random=204",
    images: [
      "https://picsum.photos/1200/600?random=204",
      "https://picsum.photos/1200/600?random=205",
    ],
    eyebrow: "FASHION COLLECTION",
    title: "NEW ARRIVALS",
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

          {/* Column 3: Product Grid */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-4">
              {Array.isArray(products) && products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="group cursor-pointer"
                    onClick={() => handleProductClick(Number(product.id))}
                  >
                    <div className="relative overflow-hidden rounded-lg mb-3">
                      {product.oldPrice && product.oldPrice > product.price && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium z-10">
                          {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                        </div>
                      )}
                      <img
                        src={product.images?.[0] || 'https://picsum.photos/300/300?random=' + product.id}
                        alt={product.name}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1 text-sm line-clamp-1">{product.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-600 font-bold">${product.price}</span>
                      {product.oldPrice && (
                        <span className="text-gray-400 line-through text-sm">${product.oldPrice}</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                // Fallback products
                [
                  { id: 21, name: "Floral Midi Summer Dress", price: 58.00, image: "https://picsum.photos/300/300?random=140" },
                  { id: 22, name: "Beige Trench Coat", price: 129.00, image: "https://picsum.photos/300/300?random=141" },
                  { id: 23, name: "Classic Leather Tote", price: 95.00, image: "https://picsum.photos/300/300?random=142" },
                  { id: 24, name: "White Button-Up Shirt", price: 42.00, image: "https://picsum.photos/300/300?random=143" },
                ].map((product) => (
                  <div
                    key={product.id}
                    className="group cursor-pointer"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="relative overflow-hidden rounded-lg mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1 text-sm line-clamp-1">{product.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-600 font-bold">${product.price}</span>
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
