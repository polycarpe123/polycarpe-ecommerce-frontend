// Sample products for testing
export const sampleProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
    price: 299.99,
    oldPrice: 399.99,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop"
    ],
    stock: 15,
    rating: 4.5,
    reviews: 128,
    featured: true,
    status: "active",
    sku: "WH-001",
    weight: 0.5,
    dimensions: { length: 20, width: 15, height: 8 },
    tags: ["wireless", "headphones", "audio", "bluetooth"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Smart Watch Pro",
    description: "Advanced fitness tracking, heart rate monitoring, and smartphone integration.",
    price: 199.99,
    oldPrice: null,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop"
    ],
    stock: 25,
    rating: 4.3,
    reviews: 89,
    featured: true,
    status: "active",
    sku: "SW-002",
    weight: 0.1,
    dimensions: { length: 4, width: 4, height: 1 },
    tags: ["smartwatch", "fitness", "health", "wearable"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable organic cotton t-shirt in various colors.",
    price: 29.99,
    oldPrice: 39.99,
    category: "Clothing",
    images: [
      "https://images.unsplash.com/photo-1521572163464-3c558bba6374?w=800&h=600&fit=crop"
    ],
    stock: 50,
    rating: 4.7,
    reviews: 234,
    featured: false,
    status: "active",
    sku: "CT-003",
    weight: 0.2,
    dimensions: { length: 30, width: 25, height: 2 },
    tags: ["clothing", "organic", "cotton", "sustainable"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    name: "Professional Camera Lens",
    description: "High-quality 50mm prime lens for professional photography.",
    price: 599.99,
    oldPrice: null,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop"
    ],
    stock: 8,
    rating: 4.8,
    reviews: 67,
    featured: false,
    status: "active",
    sku: "CL-004",
    weight: 0.8,
    dimensions: { length: 10, width: 10, height: 8 },
    tags: ["camera", "lens", "photography", "professional"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 5,
    name: "Yoga Mat Premium",
    description: "Extra thick, non-slip yoga mat with carrying strap.",
    price: 49.99,
    oldPrice: 69.99,
    category: "Sports",
    images: [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&h=600&fit=crop"
    ],
    stock: 30,
    rating: 4.6,
    reviews: 156,
    featured: true,
    status: "active",
    sku: "YM-005",
    weight: 2.0,
    dimensions: { length: 183, width: 61, height: 1 },
    tags: ["yoga", "fitness", "exercise", "mat"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 6,
    name: "Leather Backpack",
    description: "Genuine leather backpack with laptop compartment and multiple pockets.",
    price: 149.99,
    oldPrice: null,
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop"
    ],
    stock: 12,
    rating: 4.4,
    reviews: 92,
    featured: false,
    status: "active",
    sku: "LB-006",
    weight: 1.2,
    dimensions: { length: 30, width: 20, height: 45 },
    tags: ["backpack", "leather", "laptop", "travel"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 7,
    name: "Wireless Gaming Mouse",
    description: "High-precision gaming mouse with customizable RGB lighting.",
    price: 79.99,
    oldPrice: 99.99,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1615655987255-0e8b0b5b8e0e?w=800&h=600&fit=crop"
    ],
    stock: 20,
    rating: 4.5,
    reviews: 178,
    featured: false,
    status: "active",
    sku: "GM-007",
    weight: 0.15,
    dimensions: { length: 12, width: 7, height: 4 },
    tags: ["gaming", "mouse", "wireless", "rgb"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 8,
    name: "Stainless Steel Water Bottle",
    description: "Insulated water bottle that keeps drinks cold for 24 hours.",
    price: 34.99,
    oldPrice: null,
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1602143407391-40852f69b7e4?w=800&h=600&fit=crop"
    ],
    stock: 40,
    rating: 4.2,
    reviews: 89,
    featured: false,
    status: "active",
    sku: "WB-008",
    weight: 0.4,
    dimensions: { length: 8, width: 8, height: 25 },
    tags: ["water", "bottle", "insulated", "stainless"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Sample categories
export const sampleCategories = [
  {
    id: 1,
    name: "Electronics",
    description: "Latest electronic devices and gadgets",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=400&fit=crop",
    productCount: 4,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Clothing",
    description: "Fashion and apparel for all occasions",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=400&fit=crop",
    productCount: 1,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Sports",
    description: "Sports equipment and fitness gear",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
    productCount: 1,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    name: "Accessories",
    description: "Bags, bottles, and everyday accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=400&fit=crop",
    productCount: 2,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Initialize sample data in localStorage
export const initializeSampleData = () => {
  // Store products
  const existingProducts = localStorage.getItem('products');
  if (!existingProducts) {
    localStorage.setItem('products', JSON.stringify(sampleProducts));
  }

  // Store categories
  const existingCategories = localStorage.getItem('categories');
  if (!existingCategories) {
    localStorage.setItem('categories', JSON.stringify(sampleCategories));
  }

  // Initialize empty orders array
  const existingOrders = localStorage.getItem('guestOrders');
  if (!existingOrders) {
    localStorage.setItem('guestOrders', JSON.stringify([]));
  }

  // Initialize empty customers array
  const existingCustomers = localStorage.getItem('customers');
  if (!existingCustomers) {
    localStorage.setItem('customers', JSON.stringify([]));
  }

  console.log('Sample data initialized!');
};
