import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface FP { 
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  rating: number;
  reviews: number;
  featured?: boolean;
};

const products: FP[] = [
  {
    id: 1,
    category: "Shorts & Skirts",
    name: "Women Off White Printed Blouse",
    price: "$47.00",
    image:
      "https://picsum.photos/900/900?random=80",
    rating: 2,
    reviews: 3,
    featured: true,
  },
  {
    id: 2,
    category: "Luggage & Travel",
    name: "Unisex Blue Graphic Backpack",
    price: "$15.00",
    image:
      "https://picsum.photos/900/900?random=81",
    rating: 3,
    reviews: 1,
    featured: false,
  },
  {
    id: 3,
    category: "Casual Shoes",
    name: "Men Blue Colourblocked Mid-Top Sneakers",
    price: "$45.00",
    image:
      "https://picsum.photos/900/900?random=82",
    rating: 5,
    reviews: 3,
    featured: false,
  },
  {
    id: 4,
    category: "Jeans",
    name: "Men Blue Skinny Fit Stretchable Jeans",
    price: "$120.00",
    image:
      "https://picsum.photos/900/900?random=83",
    rating: 2,
    reviews: 1,
    featured: true,
  },
  {
    id: 5,
    category: "Lingerie & Nightwear",
    name: "Women Blue Skinny Fit Stretchable Jeans",
    price: "$70.00–$78.00",
    image:
      "https://picsum.photos/900/900?random=94",
    rating: 5,
    reviews: 1,
    featured: false,
  },
  {
    id: 6,
    category: "Accessories",
    name: "Blue Leather Belt",
    price: "$19.00",
    image:
      "https://picsum.photos/900/900?random=95",
    rating: 4,
    reviews: 6,
  },
];

const FeaturedProducts: React.FC = () => {
  const [wl, setWl] = useState<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggle = (id: number) =>
    setWl((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amt = 280 * 2; // roughly two cards
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amt : amt,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">View All</a>
        </div>

        <div className="relative">
          <button 
            aria-label="Previous" 
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
          >
            ←
          </button>
          <div 
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide mx-12"
          >
            <div className="flex gap-6 pb-4">
              {products.map((p) => (
                <div key={p.id} className="shrink-0 w-64">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      {p.featured && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
                          Featured
                        </span>
                      )}
                      <button
                        onClick={() => toggle(p.id)}
                        aria-label="Wishlist"
                        className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white z-10"
                      >
                        <span className={`text-lg ${wl.includes(p.id) ? 'text-red-500' : 'text-gray-400'}`}>
                          ♥
                        </span>
                      </button>
                      <img src={p.image} alt={p.name} className="w-full h-48 object-cover" />
                    </div>
                    <div className="p-4 cursor-pointer text-gray-900" onClick={() => navigate(`/product/${encodeURIComponent(p.name)}`)}>
                      <p className="text-sm text-gray-500 mb-1">{p.category}</p>
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2" title={p.name}>{p.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded text-sm">
                          <span className="text-yellow-500">★</span>
                          <span>{p.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">({p.reviews})</span>
                      </div>
                      <p className="font-bold text-gray-900">{p.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button 
            aria-label="Next" 
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
          >
            → 
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
