import React from 'react';

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

interface FashionShowcaseProps {
  title: string;
  menu: string[];
  banner: Banner;
  products: Product[];
}

const FashionShowcase: React.FC<FashionShowcaseProps> = ({ title, menu, banner, products }) => {
  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="flex gap-2 mb-8">
          {menu.map((item, index) => (
            <button key={index} className="px-4 py-2 text-sm border rounded hover:bg-gray-50">
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
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
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

const FashionSection: React.FC = () => {
  return (
    <div>
      <FashionShowcase
        title="Men's Fashion"
        menu={["Wallets", "T-Shirts", "Shirts", "Jeans", "Jackets & Coats"]}
        banner={{
          image:
            "https://picsum.photos/1200/600?random=200",
          images: [
            "https://picsum.photos/1200/600?random=200",
            "https://picsum.photos/1200/600?random=201",
            "https://picsum.photos/1200/600?random=202",
          ],
          eyebrow: "MEN'S CLOTHINGS",
          title: "UP TO 50% OFF",
        }}
        products={[
          {
            id: 1,
            name: "Men Hooded Navy Blue & Grey Track Jacket",
            price: "$70.00–$95.00",
            percentOff: 19,
            featured: true,
            colors: ["#1D4ED8", "#111827", "#efefef"],
            image:
              "https://picsum.photos/900/900?random=70",
          },
          {
            id: 2,
            name: "Women Off White Printed Blouse",
            price: "$47.00",
            featured: true,
            image:
              "https://picsum.photos/900/900?random=71",
          },
          {
            id: 3,
            name: "Men Blue Colourblocked Mid-Top Sneakers",
            price: "$45.00",
            percentOff: 20,
            image:
              "https://picsum.photos/900/900?random=72",
          },
          {
            id: 4,
            name: "Women Blue Skinny Fit Stretchable Jeans",
            price: "$70.00–$78.00",
            percentOff: 7,
            colors: ["#1E3A8A", "#3B82F6", "#111827"],
            image:
              "https://picsum.photos/900/900?random=73",
          },
          {
            id: 5,
            name: "Men Khaki Solid Bomber Jacket",
            price: "$124.00",
            image:
              "https://picsum.photos/900/900?random=74",
          },
          {
            id: 6,
            name: "Men Navy Blue & Grey Track Jacket",
            price: "$105.00",
            image:
              "https://picsum.photos/900/900?random=75",
          },
        ]}
      />

      <FashionShowcase
        title="Women's Fashion"
        menu={["Trousers & Capris", "Tops", "Shorts & Skirts", "Lingerie & Underwear", "Jeans", "Dresses"]}
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

      <FashionShowcase
        title="Popular Fashion"
        menu={[
          "Trending",
          "Essentials",
          "Footwear",
          "Accessories",
          "Outerwear",
        ]}
        banner={{
          image:
            "https://picsum.photos/1200/600?random=206",
          images: [
            "https://picsum.photos/1200/600?random=206",
            "https://picsum.photos/1200/600?random=207",
            "https://picsum.photos/1200/600?random=208",
          ],
          eyebrow: "MOST LOVED",
          title: "PICKS OF THE WEEK",
        }}
        products={[
          {
            id: 41,
            name: "Puffer Jacket in Olive",
            price: "$138.00",
            percentOff: 12,
            image:
              "https://picsum.photos/900/900?random=145",
          },
          {
            id: 42,
            name: "Minimalist Leather Backpack",
            price: "$110.00",
            featured: true,
            image:
              "https://picsum.photos/900/900?random=146",
          },
          {
            id: 43,
            name: "Retro High-Top Sneakers",
            price: "$85.00",
            colors: ["#111827", "#F59E0B"],
            image:
              "https://picsum.photos/900/900?random=77",
          },
          {
            id: 44,
            name: "Cable Knit Sweater",
            price: "$64.00",
            image:
              "https://picsum.photos/900/900?random=147",
          },
          {
            id: 45,
            name: "Weekend Duffle Bag",
            price: "$88.00",
            image:
              "https://picsum.photos/900/900?random=148",
          },
          {
            id: 46,
            name: "Denim Chore Jacket",
            price: "$92.00",
            image:
              "https://picsum.photos/900/900?random=149",
          },
        ]}
      />

    </div>
  );
};

export default FashionSection;
