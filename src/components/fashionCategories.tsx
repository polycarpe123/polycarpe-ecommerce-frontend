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
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="flex gap-2 mb-8">
          {menu.map((item, index) => (
            <button 
              key={index} 
              className="px-4 py-2 text-sm border rounded hover:bg-gray-50" 
              onClick={() => handleMenuClick(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative">
            <img src={banner.image} alt={banner.title} className="w-full h-64 object-cover rounded-lg" />
            <div className="absolute inset-0 flex flex-col justify-center items-start p-6 text-white">
              <span className="text-sm uppercase tracking-wide mb-2">{banner.eyebrow}</span>
              <h3 className="text-2xl font-bold">{banner.title}</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {products.slice(0, 4).map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="relative">
                  {product.featured && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
                      Featured
                    </span>
                  )}
                  {product.percentOff && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded z-10">
                      -{product.percentOff}%
                    </span>
                  )}
                  <img src={product.image} alt={product.name} className="w-full h-32 object-cover" />
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-medium mb-1 line-clamp-2">{product.name}</h4>
                  <p className="text-sm font-bold text-gray-900">{product.price}</p>
                  {product.colors && (
                    <div className="flex gap-1 mt-2">
                      {product.colors.map((color, index) => (
                        <div key={index} className="w-4 h-4 rounded-full border" style={{ backgroundColor: color }}></div>
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