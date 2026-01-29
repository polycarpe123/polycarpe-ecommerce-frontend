import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: string;
  oldPrice?: string;
  image: string;
  rating: number;
  category?: string;
};

const productData: Record<string, Product[]> = {
  RECENT: [
    {
      id: 1,
      name: "Men Hooded Navy Blue & Grey Track Jacket",
      price: "$70.00",
      image:
        "https://picsum.photos/900/900?random=10",
      rating: 5,
    },
    {
      id: 2,
      name: "Navy Blue-Silver-White Multi Watch",
      price: "$49.00",
      oldPrice: "$85.00",
      image:
        "https://picsum.photos/900/900?random=11",
      rating: 4,
    },
    {
      id: 3,
      name: "Women Off White Printed Blouse",
      price: "$47.00",
      image:
        "https://picsum.photos/900/900?random=12",
      rating: 2.7,
    },
    {
      id: 4,
      name: "Men Blue Colourblocked Mid-Top Sneakers",
      price: "$120.00",
      image:
        "https://picsum.photos/900/900?random=13",
      rating: 2,
    },
  ],
  FEATURED: [
    {
      id: 21,
      name: "Men Hooded Navy Blue & Grey Track Jacket",
      price: "$70.00",
      image:
        "https://picsum.photos/900/900?random=14",
      rating: 5,
    },
    {
      id: 22,
      name: "Women Off White Printed Blouse",
      price: "$47.00",
      image:
        "https://picsum.photos/900/900?random=15",
      rating: 2.7,
    },
    {
      id: 23,
      name: "Men Blue Skinny Fit Stretchable Jeans",
      price: "$120.00",
      image:
        "https://picsum.photos/900/900?random=16",
      rating: 2,
    },
    {
      id: 24,
      name: "Men Khaki Solid Bomber Jacket",
      price: "$124.00",
      image:
        "https://picsum.photos/900/900?random=17",
      rating: 4.5,
    },
  ],
  "ON SALE": [
    {
      id: 41,
      name: "Men Hooded Navy Blue & Grey Track Jacket",
      price: "$70.00",
      image:
        "https://picsum.photos/900/900?random=18",
      rating: 5,
    },
    {
      id: 42,
      name: "Navy Blue-Silver-White Multi Watch",
      price: "$49.00",
      oldPrice: "$85.00",
      image:
        "https://picsum.photos/900/900?random=19",
      rating: 4,
    },
    {
      id: 43,
      name: "Men Navy & Red Checked Slim Shirt",
      price: "$99.00",
      image:
        "https://picsum.photos/900/900?random=20",
      rating: 3.5,
    },
    {
      id: 44,
      name: "Light Blue Solid Low Rise Jeans",
      price: "$89.00",
      image:
        "https://picsum.photos/900/900?random=21",
      rating: 3,
    },
  ],
  "TOP RATED": [
    {
      id: 61,
      name: "Men Hooded Navy Blue & Grey Track Jacket",
      price: "$70.00",
      image:
        "https://picsum.photos/900/900?random=22",
      rating: 5,
    },
    {
      id: 62,
      name: "Men Navy & White Striped Shirt",
      price: "$49.00",
      image:
        "https://picsum.photos/900/900?random=23",
      rating: 5,
    },
    {
      id: 63,
      name: "Women Blue Skinny Fit Stretchable Jeans",
      price: "$70.00",
      image:
        "https://picsum.photos/900/900?random=24",
      rating: 5,
    },
    {
      id: 64,
      name: "Men Navy Blue & Grey Track Jacket",
      price: "$105.00",
      image:
        "https://picsum.photos/900/900?random=25",
      rating: 5,
    },
  ],
};

const ProductTabs: React.FC = () => {
  const navigate = useNavigate();

  const handleProductClick = (product: Product) => {
    navigate(`/product/${encodeURIComponent(product.name)}`);
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(productData).map(([category, products]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b-2 border-blue-600 pb-2">{category}</h3>
              <div className="space-y-4">
                {products.map((p) => (
                  <div 
                    key={p.id} 
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleProductClick(p)}
                  >
                    <div className="flex gap-3 p-3">
                      <div className="w-16 h-16 flex shrink-0">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{p.name}</h4>
                        <div className="flex items-center gap-1 mb-1">
                          <div className="flex items-center gap-1 bg-yellow-100 px-1 py-0.5 rounded text-xs">
                            <span className="text-yellow-500">★</span>
                            <span>{p.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-sm">{p.price}</span>
                          {p.oldPrice && <span className="text-xs text-gray-500 line-through">{p.oldPrice}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductTabs;
