import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

// Define product interface
interface Product {
  id: number;
  name: string;
  price: string;
  oldPrice: string | null;
  rating: number;
  reviews: number;
  images: string[];
  category: string;
  colors: Array<{ name: string; hex: string }>;
  sizes: string[];
}

// Import products from ProductDetail
const PRODUCTS: Record<string, Product> = {
  "97": {
    id: 97,
    name: "Unisex Blue Graphic Backpack",
    price: "$15.00",
    oldPrice: null,
    rating: 3,
    reviews: 1,
    images: ["https://picsum.photos/900/900?random=150"],
    category: "bags",
    colors: [{ name: "Blue", hex: "#0000FF" }],
    sizes: ["M", "L"]
  },
  "45": {
    id: 45,
    name: "Weekend Duffle Bag",
    price: "$88.00",
    oldPrice: "$100.00",
    rating: 4.3,
    reviews: 3,
    images: ["https://picsum.photos/900/900?random=151"],
    category: "bags",
    colors: [{ name: "Brown", hex: "#8B4513" }],
    sizes: ["M", "L"]
  },
  "98": {
    id: 98,
    name: "Men Blue Skinny Fit Jeans",
    price: "$45.00",
    oldPrice: "$60.00",
    rating: 4.2,
    reviews: 8,
    images: ["https://picsum.photos/900/900?random=152"],
    category: "men",
    colors: [{ name: "Blue", hex: "#0000FF" }],
    sizes: ["S", "M", "L", "XL"]
  },
  "99": {
    id: 99,
    name: "Women Off White Top",
    price: "$35.00",
    oldPrice: null,
    rating: 4.5,
    reviews: 12,
    images: ["https://picsum.photos/900/900?random=153"],
    category: "women",
    colors: [{ name: "White", hex: "#FFFFFF" }],
    sizes: ["XS", "S", "M", "L"]
  }
};

const Shop: React.FC = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const handleAddToCart = async (product: Product) => {
    try {
      const item = {
        productId: product.id,
        quantity: 1,
        name: product.name,
        price: parseFloat(product.price.replace('$', '')),
        image: product.images[0],
        category: product.category
      };
      
      await addToCart(item);
      console.log(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  // Get all products from all categories with error handling
  const allProducts = Object.values(PRODUCTS || {});
  
  // Ensure we have a valid array
  if (!Array.isArray(allProducts)) {
    console.error('PRODUCTS is not properly defined:', PRODUCTS);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Shop Loading Error</h2>
          <p className="text-gray-600">Unable to load products. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Filter products based on selected filters with error handling
  const filteredProducts = allProducts.filter(product => {
    if (!product) return false;
    
    const price = parseFloat(product.price?.replace('$', '') || '0');
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = price >= priceRange.min && price <= priceRange.max;
    const matchesSize = !selectedSize || (product.sizes && product.sizes.includes(selectedSize));
    const matchesColor = !selectedColor || (product.colors && product.colors.some((c: any) => c.name.toLowerCase() === selectedColor.toLowerCase()));
    
    return matchesCategory && matchesPrice && matchesSize && matchesColor;
  });

  // Get unique categories with error handling
  const categories = ['all', ...Array.from(new Set(allProducts.filter(p => p && p.category).map(p => p.category)))];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Product categories</h3>
              <ul className="space-y-2">
                {categories.map(category => (
                  <li key={category}>
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                        selectedCategory === category ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Filter by Price</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Min Price</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Max Price</label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      placeholder="1000"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Filter by Size</h3>
                <div className="flex flex-wrap gap-2">
                  {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                      className={`px-3 py-1 border rounded ${
                        selectedSize === size ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Filter by Color</h3>
                <div className="flex flex-wrap gap-2">
                  {['Red', 'Blue', 'Green', 'Black', 'White', 'Grey'].map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                      className={`px-3 py-1 border rounded ${
                        selectedColor === color ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Shop</h1>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Showing {filteredProducts.length} products
                  </span>
                  <select className="px-3 py-2 border border-gray-300 rounded">
                    <option>Sort by popularity</option>
                    <option>Sort by average rating</option>
                    <option>Sort by latest</option>
                    <option>Sort by price: low to high</option>
                    <option>Sort by price: high to low</option>
                  </select>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts && filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    if (!product || !product.id) return null;
                    
                    return (
                      <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <Link to={`/product/${encodeURIComponent(product.name)}`}>
                          <div className="aspect-square overflow-hidden">
                            <img
                              src={product.images?.[0] || 'https://picsum.photos/300/300?random=1'}
                              alt={product.name || 'Product'}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                              onError={(e) => {
                                e.currentTarget.src = 'https://picsum.photos/300/300?random=1';
                              }}
                            />
                          </div>
                        </Link>
                        <div className="p-4">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            <Link to={`/product/${encodeURIComponent(product.name || '')}`} className="hover:text-blue-600">
                              {product.name || 'Unknown Product'}
                            </Link>
                          </h3>
                          <div className="flex items-center mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-sm ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-sm text-gray-500 ml-2">({product.reviews || 0})</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-lg font-bold text-gray-900">{product.price}</span>
                              {product.oldPrice && (
                                <span className="text-sm text-gray-500 line-through ml-2">{product.oldPrice}</span>
                              )}
                            </div>
                            <button 
                              onClick={() => handleAddToCart(product)}
                              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setPriceRange({ min: 0, max: 1000 });
                        setSelectedSize('');
                        setSelectedColor('');
                      }}
                      className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
