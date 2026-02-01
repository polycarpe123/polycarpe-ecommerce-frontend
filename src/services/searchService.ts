// Search Service
import type { Product } from './productService';

export interface SearchResult {
  id: string | number;
  name: string;
  price: number;
  image: string;
  category: string;
  type: 'product';
  relevance: number;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'category' | 'brand' | 'query';
  count?: number;
}

// Mock product data for search
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Men Hooded Navy Blue & Grey Track Jacket",
    slug: "men-hooded-navy-blue-grey-track-jacket",
    sku: "JACKET-001",
    price: 70,
    oldPrice: 95,
    description: "Comfortable and stylish track jacket for men",
    category: "Men's Fashion",
    images: ["https://picsum.photos/400/400?random=1"],
    colors: [{ name: "Navy Blue", hex: "#1D4ED8" }, { name: "Grey", hex: "#6B7280" }, { name: "White", hex: "#FFFFFF" }],
    sizes: [{ name: "S", inStock: true }, { name: "M", inStock: true }, { name: "L", inStock: true }, { name: "XL", inStock: true }],
    stock: 100,
    featured: true,
    rating: 4.5,
    reviews: 128,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    name: "Unisex Blue Graphic Backpack",
    slug: "unisex-blue-graphic-backpack",
    sku: "BACKPACK-001",
    price: 15,
    description: "Durable backpack with graphic design",
    category: "Accessories",
    images: ["https://picsum.photos/400/400?random=2"],
    colors: [{ name: "Blue", hex: "#3B82F6" }, { name: "Green", hex: "#10B981" }],
    sizes: [{ name: "One Size", inStock: true }],
    stock: 100,
    rating: 4.2,
    reviews: 89,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: 3,
    name: "Women's Floral Summer Dress",
    slug: "womens-floral-summer-dress",
    sku: "DRESS-001",
    price: 58,
    oldPrice: 68,
    description: "Elegant floral dress for summer",
    category: "Women's Fashion",
    images: ["https://picsum.photos/400/400?random=3"],
    colors: [{ name: "Pink", hex: "#EC4899" }, { name: "Yellow", hex: "#F59E0B" }, { name: "Green", hex: "#10B981" }],
    sizes: [{ name: "XS", inStock: true }, { name: "S", inStock: true }, { name: "M", inStock: true }, { name: "L", inStock: true }],
    stock: 100,
    featured: true,
    rating: 4.7,
    reviews: 156,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: 4,
    name: "Men's Classic White Sneakers",
    slug: "mens-classic-white-sneakers",
    sku: "SNEAKERS-001",
    price: 45,
    description: "Classic white sneakers for men",
    category: "Men's Fashion",
    images: ["https://picsum.photos/400/400?random=4"],
    colors: [{ name: "White", hex: "#FFFFFF" }, { name: "Black", hex: "#000000" }, { name: "Gray", hex: "#6B7280" }],
    sizes: [{ name: "S", inStock: true }, { name: "M", inStock: true }, { name: "L", inStock: true }, { name: "XL", inStock: true }, { name: "XXL", inStock: true }],
    stock: 100,
    rating: 4.4,
    reviews: 203,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: 5,
    name: "Men's Athletic Shorts",
    slug: "mens-athletic-shorts",
    sku: "SHORTS-001",
    price: 18,
    description: "Comfortable athletic shorts for sports",
    category: "Men's Fashion",
    images: ["https://picsum.photos/400/400?random=5"],
    colors: [{ name: "Black", hex: "#000000" }, { name: "Blue", hex: "#1D4ED8" }, { name: "Red", hex: "#EF4444" }],
    sizes: [{ name: "S", inStock: true }, { name: "M", inStock: true }, { name: "L", inStock: true }, { name: "XL", inStock: true }],
    stock: 100,
    rating: 4.3,
    reviews: 92,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  }
];

// Categories and brands for suggestions
const CATEGORIES = [
  "Men's Fashion",
  "Women's Fashion", 
  "Accessories",
  "Shoes",
  "Bags & Backpacks",
  "Watches",
  "Jewelry",
  "Beauty & Care"
];

const BRANDS = [
  "Nike",
  "Adidas", 
  "Puma",
  "Gucci",
  "Louis Vuitton",
  "Zara",
  "H&M",
  "Uniqlo"
];

export const searchService = {
  // Search products
  searchProducts: async (query: string, category?: string): Promise<SearchResult[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!query.trim()) return [];
    
    const lowercaseQuery = query.toLowerCase();
    let filteredProducts = MOCK_PRODUCTS;
    
    // Filter by category if specified
    if (category && category !== 'All') {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Search in product name, description, and category
    const results: SearchResult[] = filteredProducts
      .filter(product => 
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery)
      )
      .map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        category: product.category,
        type: 'product' as const,
        relevance: calculateRelevance(product, lowercaseQuery)
      }))
      .sort((a, b) => b.relevance - a.relevance);
    
    return results.slice(0, 10); // Limit to 10 results
  },

  // Get search suggestions
  getSuggestions: async (query: string): Promise<SearchSuggestion[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (!query.trim()) return [];
    
    const lowercaseQuery = query.toLowerCase();
    const suggestions: SearchSuggestion[] = [];
    
    // Category suggestions
    CATEGORIES.forEach(category => {
      if (category.toLowerCase().includes(lowercaseQuery)) {
        suggestions.push({
          id: `cat-${category}`,
          text: category,
          type: 'category',
          count: Math.floor(Math.random() * 100) + 10
        });
      }
    });
    
    // Brand suggestions
    BRANDS.forEach(brand => {
      if (brand.toLowerCase().includes(lowercaseQuery)) {
        suggestions.push({
          id: `brand-${brand}`,
          text: brand,
          type: 'brand',
          count: Math.floor(Math.random() * 50) + 5
        });
      }
    });
    
    // Query suggestions (popular searches)
    const popularQueries = [
      "summer dress", "running shoes", "leather bag", "casual shirt",
      "winter jacket", "sports shoes", "handbag", "men's watch"
    ];
    
    popularQueries.forEach(popularQuery => {
      if (popularQuery.toLowerCase().includes(lowercaseQuery)) {
        suggestions.push({
          id: `query-${popularQuery}`,
          text: popularQuery,
          type: 'query'
        });
      }
    });
    
    return suggestions.slice(0, 8);
  },

  // Get popular searches
  getPopularSearches: async (): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [
      "summer collection",
      "men's fashion",
      "women's dresses",
      "sports shoes",
      "leather bags",
      "accessories",
      "watches",
      "summer sale"
    ];
  }
};

// Calculate relevance score for search results
function calculateRelevance(product: Product, query: string): number {
  let score = 0;
  const name = product.name.toLowerCase();
  const description = product.description.toLowerCase();
  const category = product.category.toLowerCase();
  
  // Exact name match gets highest score
  if (name === query) score += 100;
  else if (name.includes(query)) score += 50;
  
  // Category match
  if (category === query) score += 30;
  else if (category.includes(query)) score += 15;
  
  // Description match
  if (description.includes(query)) score += 10;
  
  // Featured products get bonus
  if (product.featured) score += 5;
  
  // Higher rated products get bonus
  if (product.rating && product.rating >= 4.5) score += 3;
  
  return score;
}
