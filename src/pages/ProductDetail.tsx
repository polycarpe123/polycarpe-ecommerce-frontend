import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Heart, Star, Truck, RefreshCw, Shield, Share2 } from "lucide-react";
import CartModal from "../components/CartModal";

const PRODUCTS: Record<string, any> = {
  "97": {
    id: 97,
    name: "Unisex Blue Graphic Backpack",
    price: "$15.00",
    oldPrice: null,
    rating: 3,
    reviews: 1,
    images: [
      "https://picsum.photos/900/900?random=200",
      "https://picsum.photos/900/900?random=201",
      "https://picsum.photos/900/900?random=202",
      "https://picsum.photos/900/900?random=203",
    ],
    colors: [
      { name: "Dark Blue", hex: "#1E3A8A" },
      { name: "Red", hex: "#DC2626" },
    ],
    sizes: ["One Size"],
    description: "Two-way zip closure. Top carry handle; padded, adjustable shoulder straps. Flat base with protective feet for stability. Nylon with leather trim. Designer Laptopbags.",
    brand: "Fashion",
    fabric: "Nylon with leather trim",
    fit: "One Size",
    features: [
      "30 Day Return Policy",
      "Cash on Delivery available", 
      "Free Delivery"
    ],
    offers: [
      {
        title: "Bank Offer",
        description: "10% instant discount on VISA Cards",
        terms: "T & C"
      },
      {
        title: "Special Price", 
        description: "Get extra 20% off (price inclusive of discount)",
        terms: "T & C"
      },
      {
        title: "No cost EMI",
        description: "$9/month. Standard EMI also available",
        terms: "View Plans"
      }
    ],
    specifications: {
      "Material": "Nylon with leather trim",
      "Closure": "Two-way zip",
      "Straps": "Padded, adjustable shoulder straps",
      "Base": "Flat base with protective feet",
      "Handle": "Top carry handle",
      "Category": "Designer Laptopbags"
    }
  },
  "1": {
    id: 1,
    name: "Men Hooded Navy Blue & Grey Track Jacket",
    price: "$70.00",
    oldPrice: "$86.00",
    rating: 4.5,
    reviews: 3,
    images: [
      "https://picsum.photos/900/900?random=50",
      "https://picsum.photos/900/900?random=51",
      "https://picsum.photos/900/900?random=52",
      "https://picsum.photos/900/900?random=53",
    ],
    colors: [
      { name: "Navy", hex: "#1D4ED8" },
      { name: "Grey", hex: "#6B7280" },
      { name: "Black", hex: "#111827" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Comfortable and stylish men's hooded track jacket featuring navy blue and grey color blocking.",
    brand: "SportWear",
    fabric: "100% polyester • Water-resistant • Breathable",
    fit: "Regular fit with adjustable drawstrings",
    features: [
      "30 Day Return Policy",
      "Cash on Delivery available",
      "Free Delivery"
    ],
    offers: [],
    specifications: {
      "Material": "100% Polyester",
      "Fit": "Regular fit",
      "Features": "Water-resistant, Breathable",
      "Closure": "Zip closure with drawstrings",
      "Pockets": "Side pockets"
    }
  },
  "2": {
    id: 2,
    name: "Women Off White Printed Blouse",
    price: "$47.00",
    oldPrice: "$67.00",
    rating: 2.7,
    reviews: 3,
    images: [
      "https://picsum.photos/900/900?random=54",
      "https://picsum.photos/900/900?random=55",
      "https://picsum.photos/900/900?random=56",
      "https://picsum.photos/900/900?random=57",
    ],
    colors: [
      { name: "Off White", hex: "#F5F5F0" },
      { name: "Cream", hex: "#FFFDD0" },
      { name: "Beige", hex: "#F5DEB3" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "Elegant women's printed blouse in off-white with beautiful floral print.",
    brand: "Fashion Co",
    fabric: "100% cotton • Breathable • Comfortable",
    fit: "Regular fit • Short sleeves",
  },
  "3": {
    id: 3,
    name: "Men Blue Colourblocked Mid-Top Sneakers",
    price: "$45.00",
    oldPrice: "$56.00",
    rating: 5,
    reviews: 3,
    images: [
      "https://picsum.photos/900/900?random=58",
      "https://picsum.photos/900/900?random=59",
      "https://picsum.photos/900/900?random=60",
      "https://picsum.photos/900/900?random=61",
    ],
    colors: [
      { name: "Blue", hex: "#1D4ED8" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#111827" },
    ],
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    description:
      "Stylish blue and white color-blocked sneakers for casual everyday wear.",
    brand: "SportStyle",
    fabric: "Leather & Canvas • Rubber Sole",
    fit: "Unisex sizing • True to size",
  },
  "4": {
    id: 4,
    name: "Women Blue Skinny Fit Stretchable Jeans",
    price: "$70.00",
    oldPrice: "$85.00",
    rating: 4,
    reviews: 2,
    images: [
      "https://picsum.photos/900/900?random=62",
      "https://picsum.photos/900/900?random=63",
      "https://picsum.photos/900/900?random=64",
      "https://picsum.photos/900/900?random=65",
    ],
    colors: [
      { name: "Dark Blue", hex: "#1E3A8A" },
      { name: "Light Blue", hex: "#3B82F6" },
      { name: "Black", hex: "#111827" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "Comfortable and flattering women's skinny jeans with stretch fabric.",
    brand: "DenimPro",
    fabric: "98% Cotton, 2% Elastane • Stretchable",
    fit: "Skinny fit • Mid-rise",
  },
  "5": {
    id: 5,
    name: "Men Khaki Solid Bomber Jacket",
    price: "$124.00",
    oldPrice: "$155.00",
    rating: 3.5,
    reviews: 1,
    images: [
      "https://picsum.photos/900/900?random=96",
      "https://picsum.photos/900/900?random=97",
      "https://picsum.photos/900/900?random=98",
      "https://picsum.photos/900/900?random=99",
    ],
    colors: [
      { name: "Khaki", hex: "#C9B37E" },
      { name: "Navy", hex: "#001A33" },
      { name: "Olive", hex: "#556B2F" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Premium men's bomber jacket in solid khaki color. Perfect for casual outings.",
    brand: "CasualWear",
    fabric: "100% Polyester • Water-resistant",
    fit: "Regular fit • Zip closure",
  },
  "6": {
    id: 6,
    name: "Men Navy Blue & Grey Track Jacket",
    price: "$105.00",
    oldPrice: "$130.00",
    rating: 4,
    reviews: 2,
    images: [
      "https://picsum.photos/900/900?random=116",
      "https://picsum.photos/900/900?random=117",
      "https://picsum.photos/900/900?random=118",
      "https://picsum.photos/900/900?random=119",
    ],
    colors: [
      { name: "Navy", hex: "#001A33" },
      { name: "Grey", hex: "#808080" },
      { name: "Black", hex: "#000000" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Classic track jacket in navy blue with grey accents.",
    brand: "TrackWear",
    fabric: "Polyester blend • Breathable",
    fit: "Athletic fit",
  },
  "21": {
    id: 21,
    name: "Floral Midi Summer Dress",
    price: "$58.00",
    oldPrice: "$68.00",
    rating: 4.5,
    reviews: 4,
    images: [
      "https://picsum.photos/900/900?random=120",
      "https://picsum.photos/900/900?random=121",
      "https://picsum.photos/900/900?random=122",
      "https://picsum.photos/900/900?random=123",
    ],
    colors: [
      { name: "Pink", hex: "#EC4899" },
      { name: "Yellow", hex: "#F59E0B" },
      { name: "Green", hex: "#10B981" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Beautiful floral midi dress perfect for summer occasions.",
    brand: "SummerStyle",
    fabric: "100% Cotton • Breathable",
    fit: "A-line fit • V-neckline",
  },
  "22": {
    id: 22,
    name: "Beige Trench Coat",
    price: "$129.00",
    oldPrice: "$165.00",
    rating: 3.8,
    reviews: 2,
    images: [
      "https://picsum.photos/900/900?random=124",
      "https://picsum.photos/900/900?random=125",
      "https://picsum.photos/900/900?random=126",
      "https://picsum.photos/900/900?random=127",
    ],
    colors: [
      { name: "Beige", hex: "#F5DEB3" },
      { name: "Camel", hex: "#C19A6B" },
      { name: "Black", hex: "#000000" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "Timeless beige trench coat - a wardrobe essential for every season.",
    brand: "ClassicWear",
    fabric: "100% Wool • Premium quality",
    fit: "Tailored fit • Double-breasted",
  },
  "23": {
    id: 23,
    name: "Classic Leather Tote",
    price: "$95.00",
    oldPrice: "$105.00",
    rating: 4.2,
    reviews: 3,
    images: [
      "https://picsum.photos/900/900?random=128",
      "https://picsum.photos/900/900?random=129",
      "https://picsum.photos/900/900?random=130",
      "https://picsum.photos/900/900?random=131",
    ],
    colors: [
      { name: "Brown", hex: "#8B6F47" },
      { name: "Black", hex: "#000000" },
      { name: "Tan", hex: "#D2B48C" },
    ],
    sizes: ["One Size"],
    description: "Spacious leather tote bag perfect for daily use and travel.",
    brand: "LeatherCo",
    fabric: "Premium leather • Durable",
    fit: "Large capacity • Shoulder handles",
  },
  "24": {
    id: 24,
    name: "White Button-Up Shirt",
    price: "$42.00",
    oldPrice: "$52.00",
    rating: 4.6,
    reviews: 5,
    images: [
      "https://picsum.photos/900/900?random=132",
      "https://picsum.photos/900/900?random=133",
      "https://picsum.photos/900/900?random=134",
      "https://picsum.photos/900/900?random=135",
    ],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Light Blue", hex: "#ADD8E6" },
      { name: "Pink", hex: "#FFC0CB" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "Classic white button-up shirt - versatile and timeless piece.",
    brand: "Essentials",
    fabric: "100% Cotton • Wrinkle-resistant",
    fit: "Fitted • Long sleeves",
  },
  "25": {
    id: 25,
    name: "High-Waist Skinny Jeans",
    price: "$68.00",
    oldPrice: "$78.00",
    rating: 4.3,
    reviews: 3,
    images: [
      "https://picsum.photos/900/900?random=136",
      "https://picsum.photos/900/900?random=137",
      "https://picsum.photos/900/900?random=138",
      "https://picsum.photos/900/900?random=139",
    ],
    colors: [
      { name: "Dark Blue", hex: "#00008B" },
      { name: "Light Blue", hex: "#87CEEB" },
      { name: "Black", hex: "#000000" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Flattering high-waist skinny jeans with great stretch.",
    brand: "DenimCo",
    fabric: "Cotton blend • Stretchable",
    fit: "Skinny fit • High-waist",
  },
  "26": {
    id: 26,
    name: "Court Sneakers",
    price: "$59.00",
    oldPrice: "$69.00",
    rating: 4.4,
    reviews: 3,
    images: [
      "https://picsum.photos/900/900?random=104",
      "https://picsum.photos/900/900?random=105",
      "https://picsum.photos/900/900?random=106",
      "https://picsum.photos/900/900?random=107",
    ],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" },
      { name: "Grey", hex: "#808080" },
    ],
    sizes: ["5", "6", "7", "8", "9", "10", "11"],
    description: "Classic court-style sneakers for casual everyday wear.",
    brand: "SneakerCo",
    fabric: "Canvas & Rubber",
    fit: "Unisex • True to size",
  },
  "41": {
    id: 41,
    name: "Puffer Jacket in Olive",
    price: "$138.00",
    oldPrice: "$157.00",
    rating: 4.1,
    reviews: 2,
    images: [
      "https://picsum.photos/900/900?random=100",
      "https://picsum.photos/900/900?random=101",
      "https://picsum.photos/900/900?random=102",
      "https://picsum.photos/900/900?random=103",
    ],
    colors: [
      { name: "Olive", hex: "#556B2F" },
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#001A33" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Warm and stylish puffer jacket in trendy olive color.",
    brand: "WinterWear",
    fabric: "Polyester • Insulated",
    fit: "Regular fit • Water-resistant",
  },
  "42": {
    id: 42,
    name: "Minimalist Leather Backpack",
    price: "$110.00",
    oldPrice: "$135.00",
    rating: 4.7,
    reviews: 6,
    images: [
      "https://picsum.photos/900/900?random=108",
      "https://picsum.photos/900/900?random=109",
      "https://picsum.photos/900/900?random=110",
      "https://picsum.photos/900/900?random=111",
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Brown", hex: "#8B4513" },
      { name: "Grey", hex: "#808080" },
    ],
    sizes: ["One Size"],
    description:
      "Sleek minimalist leather backpack perfect for work and travel.",
    brand: "UrbanStyle",
    fabric: "Premium leather • Durable",
    fit: "Spacious • Laptop compartment",
  },
  "43": {
    id: 43,
    name: "Retro High-Top Sneakers",
    price: "$85.00",
    oldPrice: "$100.00",
    rating: 4.2,
    reviews: 3,
    images: [
      "https://picsum.photos/900/900?random=112",
      "https://picsum.photos/900/900?random=113",
      "https://picsum.photos/900/900?random=114",
      "https://picsum.photos/900/900?random=115",
    ],
    colors: [
      { name: "Black", hex: "#111827" },
      { name: "Gold", hex: "#F59E0B" },
      { name: "White", hex: "#FFFFFF" },
    ],
    sizes: ["5", "6", "7", "8", "9", "10", "11", "12"],
    description: "Vintage-inspired high-top sneakers with modern comfort.",
    brand: "RetroStyle",
    fabric: "Canvas & Rubber • Cushioned",
    fit: "High-top • Ankle support",
  },
  "44": {
    id: 44,
    name: "Cable Knit Sweater",
    price: "$64.00",
    oldPrice: "$75.00",
    rating: 4.5,
    reviews: 4,
    images: [
      "https://picsum.photos/900/900?random=150",
      "https://picsum.photos/900/900?random=151",
      "https://picsum.photos/900/900?random=152",
      "https://picsum.photos/900/900?random=153",
    ],
    colors: [
      { name: "Cream", hex: "#FFFDD0" },
      { name: "Navy", hex: "#001A33" },
      { name: "Grey", hex: "#808080" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Cozy cable knit sweater perfect for layering in any season.",
    brand: "CozyWear",
    fabric: "100% Wool • Soft",
    fit: "Regular fit • Crew neck",
  },
  "45": {
    id: 45,
    name: "Weekend Duffle Bag",
    price: "$88.00",
    oldPrice: "$100.00",
    rating: 4.3,
    reviews: 3,
    images: [
      "https://picsum.photos/900/900?random=154",
      "https://picsum.photos/900/900?random=155",
      "https://picsum.photos/900/900?random=156",
      "https://picsum.photos/900/900?random=157",
    ],
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#001A33" },
      { name: "Grey", hex: "#808080" },
    ],
    sizes: ["One Size"],
    description:
      "Spacious duffle bag perfect for weekend getaways and gym trips.",
    brand: "TravelPro",
    fabric: "Canvas & Leather • Durable",
    fit: "Large capacity • Multiple compartments",
  },
  "46": {
    id: 46,
    name: "Denim Chore Jacket",
    price: "$92.00",
    oldPrice: "$110.00",
    rating: 4,
    reviews: 2,
    images: [
      "https://picsum.photos/900/900?random=158",
      "https://picsum.photos/900/900?random=159",
      "https://picsum.photos/900/900?random=160",
      "https://picsum.photos/900/900?random=161",
    ],
    colors: [
      { name: "Indigo", hex: "#4B0082" },
      { name: "Black", hex: "#000000" },
      { name: "Vintage", hex: "#6495ED" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Classic denim chore jacket with authentic vintage look.",
    brand: "DenimCo",
    fabric: "100% Denim • Durable",
    fit: "Relaxed fit • Button-front",
  },
};

const ProductDetail: React.FC = () => {
  const { name } = useParams();
  
  // Find product by name (decode URI and search through all products)
  const decodedName = name ? decodeURIComponent(name) : "";
  const product = Object.values(PRODUCTS).find(p => p.name === decodedName);

  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">Product not found</div>
      </div>
    );
  }

  const discount = Math.round(
    ((parseFloat(product.oldPrice) - parseFloat(product.price)) /
      parseFloat(product.oldPrice)) *
      100,
  );

  const handleAddToCart = () => {
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item,
        ),
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          id: product.id,
          name: product.name,
          price: parseFloat(product.price.replace('$', '')),
          quantity: qty,
          image: product.images[0],
        },
      ]);
    }
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string | number, quantity: number) => {
    const numId = typeof id === 'string' ? parseInt(id) : id;
    if (quantity <= 0) {
      setCartItems(cartItems.filter((item) => item.id !== numId));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === numId ? { ...item, quantity } : item,
        ),
      );
    }
  };

  const handleRemoveItem = (id: string | number) => {
    const numId = typeof id === 'string' ? parseInt(id) : id;
    setCartItems(cartItems.filter((item) => item.id !== numId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <nav className="text-sm text-gray-600 mb-6">
          <a href="#" className="hover:text-blue-600">Home</a> / <a href="#" className="hover:text-blue-600">Shop</a> / {product.name}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* IMAGE GALLERY */}
          <div>
            <div className="mb-4">
              <img src={product.images[selectedImg]} alt={product.name} className="w-full h-96 object-cover rounded-lg" />
            </div>
            <div className="flex gap-2">
              {product.images.map((img: string, i: number) => (
                <button
                  key={i}
                  className={`w-16 h-16 rounded border-2 overflow-hidden ${
                    i === selectedImg ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedImg(i)}
                >
                  <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCT DETAILS */}
          <div>
            <h1 className="text-2xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={
                      i < Math.floor(product.rating) ? "currentColor" : "none"
                    }
                    className="text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-gray-900">{product.price}</span>
              {product.oldPrice && (
                <>
                  <span className="text-lg text-gray-500 line-through">{product.oldPrice}</span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">Save {discount}%</span>
                </>
              )}
            </div>

            <p className="text-green-600 font-medium mb-6">In Stock</p>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Color: {product.colors[selectedColor].name}</label>
              <div className="flex gap-2">
                {product.colors.map((color: any, i: number) => (
                  <button
                    key={i}
                    className={`w-8 h-8 rounded-full border-2 ${
                      i === selectedColor ? 'border-gray-800' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColor(i)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Size</label>
              <div className="flex gap-2">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    className={`px-4 py-2 border rounded ${
                      size === selectedSize
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-50"
                >
                  −
                </button>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-16 h-8 text-center border rounded"
                  readOnly
                />
                <button 
                  onClick={() => setQty(qty + 1)}
                  className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700"
              >
                + Add to Cart
              </button>
              <button 
                onClick={() => alert("Proceeding to checkout")}
                className="flex-1 bg-gray-900 text-white py-3 px-6 rounded hover:bg-gray-800"
              >
                Buy Now
              </button>
              <button 
                title="Add to Wishlist"
                className="p-3 border rounded hover:bg-gray-50"
              >
                <Heart size={20} />
              </button>
              <button 
                title="Share"
                className="p-3 border rounded hover:bg-gray-50"
              >
                <Share2 size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Truck size={20} className="text-green-600" />
                <div>
                  <p className="font-medium">Free Delivery</p>
                  <p className="text-sm text-gray-600">Orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw size={20} className="text-blue-600" />
                <div>
                  <p className="font-medium">30 Day Return</p>
                  <p className="text-sm text-gray-600">Easy returns</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-purple-600" />
                <div>
                  <p className="font-medium">Safe Checkout</p>
                  <p className="text-sm text-gray-600">Secure payment</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="bg-white rounded-lg p-6">
          <div className="flex border-b mb-6">
            <button 
              className={`px-4 py-2 font-medium ${
                tab === "desc" ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setTab("desc")}
            >
              Description
            </button>
            <button 
              className={`px-4 py-2 font-medium ${
                tab === "specs" ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setTab("specs")}
            >
              Specifications
            </button>
            <button 
              className={`px-4 py-2 font-medium ${
                tab === "reviews" ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setTab("reviews")}
            >
              Reviews ({product.reviews})
            </button>
          </div>

          <div>
            {tab === "desc" && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Product Description</h3>
                <p className="text-gray-700 mb-4">{product.description}</p>
                <p className="text-gray-700">
                  Consectetur adipiscing elit. Ut laoreet ligula in felis
                  viverra egestas. Donec egestas sit amet augue convallis
                  fermentum. Mauris at risus. Orci varius natoque penatibus et
                  magnis dis parturient montes, nascetur ridiculus mus.
                </p>
              </div>
            )}
            {tab === "specs" && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                <div className="space-y-2">
                  <p><strong>Brand:</strong> {product.brand}</p>
                  <p><strong>Fabric:</strong> {product.fabric}</p>
                  <p><strong>Fit:</strong> {product.fit}</p>
                </div>
              </div>
            )}
            {tab === "reviews" && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Customer Reviews</h3>
                <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default ProductDetail;
