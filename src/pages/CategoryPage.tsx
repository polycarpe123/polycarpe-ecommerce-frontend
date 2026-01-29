import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Scale, Eye } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  subcategory: string;
  description: string[];
  color: string;
  inStock: boolean;
}

interface Category {
  name: string;
  subcategories: { name: string; count: number }[];
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Women Off White Printed Blouson Top",
    price: "$45.00",
    image: "https://picsum.photos/400/500?random=100",
    category: "Women",
    subcategory: "Tops",
    description: ["Regular Fit.", "Short sleeves.", "100% cotton."],
    color: "white",
    inStock: true
  },
  {
    id: 2,
    name: "Women Blue Skinny Fit Stretchable Jeans",
    price: "$70.00",
    image: "https://picsum.photos/400/500?random=101",
    category: "Women",
    subcategory: "Jeans",
    description: ["Relaxed fit non-stretch denims.", "Zip fly with button closure."],
    color: "blue",
    inStock: true
  }
];

const categories: Category[] = [
  {
    name: "Women",
    subcategories: [
      { name: "Dresses", count: 1 },
      { name: "Jeans", count: 1 },
      { name: "Tops", count: 1 }
    ]
  }
];

const priceRanges = [
  { label: "$0.00 - $50.00", min: 0, max: 50 },
  { label: "$50.00 - $100.00", min: 50, max: 100 }
];

const colors = [
  { name: "Blue", value: "#0066cc", count: 3 },
  { name: "White", value: "#ffffff", count: 1 }
];

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const navigate = useNavigate();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  const handleSelectOptions = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      const categoryMatch = product.category.toLowerCase() === categoryName?.toLowerCase();
      const subcategoryMatch = !selectedSubcategory || product.subcategory === selectedSubcategory;
      const colorMatch = !selectedColor || product.color.toLowerCase() === selectedColor.toLowerCase();
      
      let priceMatch = true;
      if (selectedPriceRange) {
        const range = priceRanges.find(r => r.label === selectedPriceRange);
        if (range) {
          const price = parseFloat(product.price.replace('$', ''));
          priceMatch = price >= range.min && price <= range.max;
        }
      }

      return categoryMatch && subcategoryMatch && colorMatch && priceMatch;
    });
  }, [categoryName, selectedSubcategory, selectedPriceRange, selectedColor]);

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategory(selectedSubcategory === subcategory ? "" : subcategory);
  };

  const handlePriceRangeChange = (range: string) => {
    setSelectedPriceRange(selectedPriceRange === range ? "" : range);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(selectedColor === color ? "" : color);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Product categories</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.name}>
                    <a 
                      href={`/product-category/${category.name.toLowerCase()}`}
                      className="block py-1 hover:text-blue-600 font-medium"
                    >
                      {category.name}
                    </a>
                    {category.name.toLowerCase() === categoryName?.toLowerCase() && (
                      <ul className="ml-4 mt-2 space-y-1">
                        {category.subcategories.map((sub) => (
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
                {priceRanges.map((range) => (
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
                      className="w-4 h-4 rounded-full border mr-2"
                      style={{ backgroundColor: color.value }}
                    />
                    {color.name} ({color.count})
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
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
                      <p className="text-sm text-gray-500 mb-1">{product.subcategory}</p>
                      <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {product.description.slice(0, 2).join(" ")}
                      </p>
                      <p className="text-lg font-bold text-gray-900 mb-3">{product.price}</p>
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
  );
};

export default CategoryPage;
