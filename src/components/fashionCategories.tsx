import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
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

interface FashionCategoryProps {
  title: string;
  menu: string[];
  banner: Banner;
  products: Product[];
}

const FashionCategory: React.FC<FashionCategoryProps> = ({ title, menu, banner, products }) => {
  const navigate = useNavigate();

  const handleMenuClick = (categoryName: string) => {
    navigate(`/product-category/${categoryName.toLowerCase()}`);
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

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
            <h2 className="text-3xl font-bold text-orange-600 mb-4">{title}</h2>
            <nav className="flex flex-col space-y-1">
              {menu.map((item, index) => (
                <button 
                  key={index} 
                  className="text-left px-4 py-1 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200"
                  onClick={() => handleMenuClick(item)}
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

const CategorySection: React.FC = () => {
    return (
    <div>
        <FashionCategory
        title="Fashion Categories"
        menu={["Women", "Watches", "Shoes", "Others", "Men", "Jewerly", "Beauty & Care", "Bags & Backpacks", "Accessories"]}
        banner={{
          image:
            "https://picsum.photos/1200/600?random=203",
          images: [
            "https://picsum.photos/1200/600?random=203",
            "https://picsum.photos/1200/600?random=204",
            "https://picsum.photos/1200/600?random=205",
          ],
          eyebrow: "WOMEN'S STYLE",
          title: "NEW ARRIVALS",
        }}
        products={[
          {
            id: 21,
            name: "Floral Midi Summer Dress",
            price: "$58.00",
            percentOff: 15,
            featured: true,
            colors: ["#EC4899", "#F59E0B", "#10B981"],
            image:
              "https://picsum.photos/900/900?random=140",
          },
          {
            id: 22,
            name: "Beige Trench Coat",
            price: "$129.00",
            image:
              "https://picsum.photos/900/900?random=141",
          },
          {
            id: 23,
            name: "Classic Leather Tote",
            price: "$95.00",
            percentOff: 10,
            image:
              "https://picsum.photos/900/900?random=142",
          },
          {
            id: 24,
            name: "White Button-Up Shirt",
            price: "$42.00",
            featured: true,
            image:
              "https://picsum.photos/900/900?random=143",
          },
          {
            id: 25,
            name: "High-Waist Skinny Jeans",
            price: "$68.00",
            image:
              "https://picsum.photos/900/900?random=144",
          },
          {
            id: 26,
            name: "Court Sneakers",
            price: "$59.00",
            image:
              "https://picsum.photos/900/900?random=76",
          },
        ]}
        />
      </div>
    );
};

export default CategorySection;