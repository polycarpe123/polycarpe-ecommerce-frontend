import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService, type Product } from '../services/productService';
import { TabSkeleton } from './SkeletonLoader';

interface TabProduct {
  id: string | number;
  name: string;
  price: string;
  oldPrice?: string;
  image: string;
  rating: number;
  category?: string;
}

const ProductTabs: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('RECENT');
  const [products, setProducts] = useState<Record<string, TabProduct[]>>({
    RECENT: [],
    FEATURED: [],
    ON_SALE: [],
    TOP_RATED: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadAllProducts = async () => {
    try {
      setLoading(true);
      
      // Load recent products
      const recentResponse = await productService.getProducts({ limit: 8, sortBy: 'createdAt', sortOrder: 'desc' });
      const recentProducts = recentResponse.products.map((product: Product): TabProduct => ({
        id: typeof product.id === 'string' ? product.id : String(product.id),
        name: product.name,
        price: `$${product.price}`,
        oldPrice: product.oldPrice ? `$${product.oldPrice}` : undefined,
        image: product.images?.[0] || `https://picsum.photos/300/300?random=${product.id}`,
        rating: product.rating || 0,
        category: product.category
      }));

      // Load featured products
      const featuredResponse = await productService.getProducts({ featured: true, limit: 8 });
      const featuredProducts = featuredResponse.products.map((product: Product): TabProduct => ({
        id: typeof product.id === 'string' ? product.id : String(product.id),
        name: product.name,
        price: `$${product.price}`,
        oldPrice: product.oldPrice ? `$${product.oldPrice}` : undefined,
        image: product.images?.[0] || `https://picsum.photos/300/300?random=${product.id}`,
        rating: product.rating || 0,
        category: product.category
      }));

      // Load on sale products (products with oldPrice)
      const onSaleResponse = await productService.getProducts({ limit: 8 });
      const onSaleProducts = onSaleResponse.products
        .filter((product: Product) => product.oldPrice && product.oldPrice > product.price)
        .map((product: Product): TabProduct => ({
          id: typeof product.id === 'string' ? product.id : String(product.id),
          name: product.name,
          price: `$${product.price}`,
          oldPrice: product.oldPrice ? `$${product.oldPrice}` : undefined,
          image: product.images?.[0] || `https://picsum.photos/300/300?random=${product.id}`,
          rating: product.rating || 0,
          category: product.category
        }));

      // Load top rated products
      const topRatedResponse = await productService.getProducts({ limit: 8, sortBy: 'rating', sortOrder: 'desc' });
      const topRatedProducts = topRatedResponse.products
        .filter((product: Product) => product.rating && product.rating >= 4)
        .map((product: Product): TabProduct => ({
          id: typeof product.id === 'string' ? product.id : String(product.id),
          name: product.name,
          price: `$${product.price}`,
          oldPrice: product.oldPrice ? `$${product.oldPrice}` : undefined,
          image: product.images?.[0] || `https://picsum.photos/300/300?random=${product.id}`,
          rating: product.rating || 0,
          category: product.category
        }));

      setProducts({
        RECENT: recentProducts,
        FEATURED: featuredProducts,
        ON_SALE: onSaleProducts,
        TOP_RATED: topRatedProducts
      });
    } catch (error) {
      console.error('Error loading products:', error);
      // Set empty arrays on error
      setProducts({
        RECENT: [],
        FEATURED: [],
        ON_SALE: [],
        TOP_RATED: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  const tabs = [
    { id: 'RECENT', label: 'Recent' },
    { id: 'FEATURED', label: 'Featured' },
    { id: 'ON_SALE', label: 'On Sale' },
    { id: 'TOP_RATED', label: 'Top Rated' }
  ];

  if (loading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-64 mx-auto"></div>
          </div>
          <div className="space-y-4">
            <TabSkeleton count={4} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our latest collection of premium products
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products[activeTab].map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="relative">
                {product.oldPrice && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                    {Math.round(((parseFloat(product.oldPrice.replace('$', '')) - parseFloat(product.price.replace('$', ''))) / parseFloat(product.oldPrice.replace('$', ''))) * 100)}% OFF
                  </div>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded text-sm">
                    <span className="text-yellow-500">★</span>
                    <span>{product.rating}</span>
                  </div>
                  {product.category && (
                    <span className="text-sm text-gray-500">{product.category}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{product.price}</p>
                    {product.oldPrice && (
                      <p className="text-sm text-gray-500 line-through">{product.oldPrice}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products[activeTab].length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products available in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
