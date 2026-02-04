import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, Scale, Eye } from 'lucide-react';
import { productService, type Product } from '../services/productService';
import { categoryService, type Category } from '../services/categoryService';

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load products and categories in parallel
        const [productsData, categoriesData] = await Promise.all([
          productService.getProducts({ limit: 1000 }), // Get all products
          categoryService.getCategories()
        ]);

        // Ensure we have arrays
        const productsArray = Array.isArray(productsData.products) ? productsData.products : [];
        const categoriesArray = Array.isArray(categoriesData) ? categoriesData : [];
        
        setProducts(productsArray);
        setCategories(categoriesArray);
        
      } catch (err) {
        console.error('Error loading category data:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSelectOptions = (productId: string | number) => {
    navigate(`/products/${productId}`);
  };

  const filteredProducts = useMemo(() => {
    if (!categoryName) return [];
    
    return products.filter(product => {
      // Match category by name or ID
      const categoryMatch = 
        product.category?.toLowerCase() === categoryName.toLowerCase() ||
        (typeof product.categoryId === 'object' && product.categoryId?.name?.toLowerCase() === categoryName.toLowerCase()) ||
        product.categoryId === categoryName;
      
      const subcategoryMatch = !selectedSubcategory || 
        product.subcategory === selectedSubcategory ||
        (typeof product.subcategoryId === 'object' && product.subcategoryId?.name === selectedSubcategory);
      
      const colorMatch = !selectedColor || 
        (product.colors && product.colors.some((color: any) => 
          color.name?.toLowerCase() === selectedColor.toLowerCase()
        ));
      
      let priceMatch = true;
      if (selectedPriceRange) {
        const priceRanges = [
          { label: "$0.00 - $50.00", min: 0, max: 50 },
          { label: "$50.00 - $100.00", min: 50, max: 100 },
          { label: "$100.00 - $200.00", min: 100, max: 200 },
          { label: "$200.00 - $500.00", min: 200, max: 500 },
          { label: "$500.00+", min: 500, max: Infinity }
        ];
        
        const range = priceRanges.find(r => r.label === selectedPriceRange);
        if (range) {
          priceMatch = product.price >= range.min && product.price <= range.max;
        }
      }

      return categoryMatch && subcategoryMatch && colorMatch && priceMatch;
    });
  }, [categoryName, selectedSubcategory, selectedPriceRange, selectedColor, products]);

  // Get unique subcategories from filtered products
  const subcategories = useMemo(() => {
    const subcatMap = new Map<string, number>();
    filteredProducts.forEach(product => {
      const subcatName = product.subcategory || (typeof product.subcategoryId === 'object' ? product.subcategoryId?.name : '');
      if (subcatName) {
        subcatMap.set(subcatName, (subcatMap.get(subcatName) || 0) + 1);
      }
    });
    return Array.from(subcatMap.entries()).map(([name, count]) => ({ name, count }));
  }, [filteredProducts]);

  // Get unique colors from filtered products
  const colors = useMemo(() => {
    const colorMap = new Map<string, number>();
    filteredProducts.forEach(product => {
      if (product.colors) {
        product.colors.forEach((color: any) => {
          if (color.name) {
            colorMap.set(color.name, (colorMap.get(color.name) || 0) + 1);
          }
        });
      }
    });
    return Array.from(colorMap.entries()).map(([name, count]) => ({ name, count }));
  }, [filteredProducts]);

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategory(selectedSubcategory === subcategory ? "" : subcategory);
  };

  const handlePriceRangeChange = (range: string) => {
    setSelectedPriceRange(selectedPriceRange === range ? "" : range);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(selectedColor === color ? "" : color);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 max-w-7xl mx-auto py-8">
        <div className="bg-gray-100 border-b-4 border-gray-300">
          <div className="py-8">
            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
              <p className="text-gray-600 mt-2">{filteredProducts.length} products found</p>
            </div>
            <nav className="text-sm text-gray-600 text-center">
              <Link to="/" className="hover:text-blue-600">Home</Link> / 
              <Link to="/shop" className="hover:text-blue-600">Shop</Link> / 
              <span className="text-gray-900">{categoryName}</span>
            </nav>
          </div>
        </div>

        <div className="pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <a 
                      href={`/product-category/${category.name.toLowerCase()}`}
                      className={`block py-1 hover:text-blue-600 font-medium ${
                        category.name.toLowerCase() === categoryName?.toLowerCase() ? 'text-blue-600' : ''
                      }`}
                    >
                      {category.name}
                    </a>
                    {category.name.toLowerCase() === categoryName?.toLowerCase() && subcategories.length > 0 && (
                      <ul className="ml-4 mt-2 space-y-1">
                        {subcategories.map((sub) => (
                          <li key={sub.name}>
                            <button
                              onClick={() => handleSubcategoryChange(sub.name)}
                              className={`text-sm py-1 px-2 rounded ${
                                selectedSubcategory === sub.name ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                              }`}
                            >
                              {sub.name} ({sub.count})
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
              <h3 className="text-lg font-semibold mb-4">Filter by Price</h3>
              <div className="space-y-2">
                {[
                  { label: "$0.00 - $50.00", min: 0, max: 50 },
                  { label: "$50.00 - $100.00", min: 50, max: 100 },
                  { label: "$100.00 - $200.00", min: 100, max: 200 },
                  { label: "$200.00 - $500.00", min: 200, max: 500 },
                  { label: "$500.00+", min: 500, max: Infinity }
                ].map((range) => (
                  <label key={range.label} className="flex items-center">
                    <input
                      type="radio"
                      name="price"
                      checked={selectedPriceRange === range.label}
                      onChange={() => handlePriceRangeChange(range.label)}
                      className="mr-2"
                    />
                    {range.label}
                  </label>
                ))}
              </div>
            </div>

            {colors.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
                <h3 className="text-lg font-semibold mb-4">Filter by Color</h3>
                <div className="space-y-2">
                  {colors.map((color) => (
                    <label key={color.name} className="flex items-center">
                      <input
                        type="radio"
                        name="color"
                        checked={selectedColor === color.name.toLowerCase()}
                        onChange={() => handleColorChange(color.name.toLowerCase())}
                        className="mr-2"
                      />
                      <div 
                        className="w-4 h-4 rounded-full border mr-2 bg-gray-300"
                        style={{ backgroundColor: '#ccc' }}
                      />
                      {color.name} ({color.count})
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img 
                        src={product.images?.[0] || `https://picsum.photos/400/500?random=${product.id}`} 
                        alt={product.name} 
                        className="w-full h-64 object-cover" 
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button className="p-2 bg-white/80 rounded-full hover:bg-white">
                          <Heart size={16} />
                        </button>
                        <button className="p-2 bg-white/80 rounded-full hover:bg-white">
                          <Scale size={16} />
                        </button>
                        <button className="p-2 bg-white/80 rounded-full hover:bg-white">
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.shortDescription || product.description?.substring(0, 100) + '...'}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-lg font-bold text-gray-900">${product.price}</p>
                        {product.oldPrice && (
                          <p className="text-sm text-gray-400 line-through">${product.oldPrice}</p>
                        )}
                      </div>
                      <button 
                        onClick={() => handleSelectOptions(product.id)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                      >
                        Select options
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or browse other categories.</p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
