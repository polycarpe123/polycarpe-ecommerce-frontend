import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService, type Product } from '../services/productService';
import { categoryService, type Category } from '../services/categoryService';

interface FashionProduct {
  id: number;
  name: string;
  price: string;
  percentOff?: number;
  featured?: boolean;
  colors?: string[];
  image: string;
}

interface Banner {
  image: string;
  images: string[];
  eyebrow: string;
  title: string;
}

interface FashionShowcaseProps {
  title: string;
  menu: string[];
  banner: Banner;
  products?: FashionProduct[];
  borderColor?: string;
  titleColor?: string;
  category?: string;
}

const FashionShowcase: React.FC<FashionShowcaseProps> = ({ 
  title, 
  menu, 
  banner, 
  products: propProducts, 
  borderColor = 'gray-600', 
  titleColor = 'text-gray-900',
  category 
}) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<FashionProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [category]);

  const loadProducts = async () => {
    try {
      // If products are passed as props, use them
      if (propProducts && propProducts.length > 0) {
        const transformedProducts = propProducts.map(p => ({
          ...p,
          price: typeof p.price === 'number' ? `$${p.price}` : p.price
        }));
        setProducts(transformedProducts);
        setLoading(false);
        return;
      }

      // Otherwise, load from API/backend
      const filters: any = { limit: 8 };
      if (category) {
        filters.category = category;
      }

      const response = await productService.getProducts(filters);
      const fashionProducts = response.products.map((product: Product): FashionProduct => ({
        id: Number(product.id),
        name: product.name,
        price: `$${product.price}`,
        percentOff: product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : undefined,
        featured: product.featured,
        colors: product.tags?.slice(0, 3) || [],
        image: product.images?.[0] || `https://picsum.photos/300/300?random=${product.id}`
      }));
      
      setProducts(fashionProducts);
    } catch (error) {
      console.error('Error loading fashion products:', error);
      // Fallback to empty array or sample data
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  if (loading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading fashion products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      {/* Top Border Line */}
      <div className="container mx-auto px-4 max-w-7xl">
        <div className={`h-1 bg-gradient-to-r from-transparent via-${borderColor} to-transparent mb-12 shadow-md`}></div>
      </div>
      
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Three Column Vertical Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Column 1: Title and Menu */}
          <div className="flex flex-col lg:col-span-3 lg:pr-4">
            <h2 className={`text-3xl font-bold ${titleColor} mb-4`}>{title}</h2>
            <nav className="flex flex-col space-y-1">
              {menu.map((item, index) => (
                <button 
                  key={index} 
                  className="text-left px-4 py-1 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200"
                >
                  {item}
                </button>
              ))}
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
              <h3 className="text-white text-3xl font-bold mb-4">
                {banner.title}
              </h3>
              <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 self-start">
                Shop Now
              </button>
            </div>
          </div>

          {/* Column 3: Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:col-span-5 lg:pl-4">
            {products.slice(0, 6).map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="relative overflow-hidden">
                  {product.featured && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10 font-medium">
                      Featured
                    </span>
                  )}
                  {product.percentOff && (
                    <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full z-10 font-medium">
                      -{product.percentOff}%
                    </span>
                  )}
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-lg font-bold text-gray-900">{product.price}</p>
                  {product.colors && (
                    <div className="flex gap-1 mt-3">
                      {product.colors.slice(0, 3).map((color, index) => (
                        <div 
                          key={index} 
                          className="w-5 h-5 rounded-full border-2 border-white shadow-sm" 
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FashionSection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await categoryService.getCategories();
      const categoriesArray = Array.isArray(categoriesData) ? categoriesData : [];
      setCategories(categoriesArray);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading fashion collection...</p>
          </div>
        </div>
      </div>
    );
  }

  // Extract category names for menu items
  const categoryNames = Array.isArray(categories) 
    ? categories.slice(0, 5).map(cat => cat.name)
    : ["Trending", "Essentials", "Footwear", "Accessories", "Outerwear"];

  return (
    <div>
      <FashionShowcase
        title="Men's Fashion"
        borderColor="blue-400"
        titleColor="text-blue-600"
        menu={categoryNames}
        category="Men" // This will filter products by Men category
        banner={{
          image: "https://picsum.photos/1200/600?random=200",
          images: [
            "https://picsum.photos/1200/600?random=200",
            "https://picsum.photos/1200/600?random=201",
            "https://picsum.photos/1200/600?random=202",
          ],
          eyebrow: "MEN'S CLOTHINGS",
          title: "UP TO 50% OFF",
        }}
      />

      <FashionShowcase
        title="Women's Fashion"
        borderColor="pink-400"
        titleColor="text-pink-600"
        menu={categoryNames}
        category="Women" // This will filter products by Women category
        banner={{
          image: "https://picsum.photos/1200/600?random=203",
          images: [
            "https://picsum.photos/1200/600?random=203",
            "https://picsum.photos/1200/600?random=204",
            "https://picsum.photos/1200/600?random=205",
          ],
          eyebrow: "WOMEN'S STYLE",
          title: "NEW ARRIVALS",
        }}
      />

      <FashionShowcase
        title="Popular Fashion"
        borderColor="green-400"
        titleColor="text-green-600"
        menu={categoryNames}
        // No category filter - will show all products
        banner={{
          image: "https://picsum.photos/1200/600?random=206",
          images: [
            "https://picsum.photos/1200/600?random=206",
            "https://picsum.photos/1200/600?random=207",
            "https://picsum.photos/1200/600?random=208",
          ],
          eyebrow: "MOST LOVED",
          title: "PICKS OF THE WEEK",
        }}
      />
    </div>
  );
};

export default FashionSection;
