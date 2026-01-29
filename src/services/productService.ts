// Product Service API
import api from './api';

export interface Product {
  id: string | number;
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  images: string[];
  category: string;
  subcategory?: string;
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  brand?: string;
  fabric?: string;
  fit?: string;
  features?: string[];
  offers?: string[];
  rating?: number;
  reviews?: number;
  stock?: number;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string | number;
  name: string;
  image?: string;
  productCount: number;
  subcategories?: { name: string; count: number }[];
}

// Product API calls
export const productService = {
  // Get all products with optional filters
  getProducts: async (filters?: {
    category?: string;
    subcategory?: string;
    featured?: boolean;
    limit?: number;
    page?: number;
    search?: string;
  }): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.subcategory) params.append('subcategory', filters.subcategory);
    if (filters?.featured !== undefined) params.append('featured', filters.featured.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get(`/products?${params}`);
    return response.data;
  },

  // Get single product by ID
  getProduct: async (id: string | number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get product by slug/name
  getProductBySlug: async (slug: string): Promise<Product> => {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },

  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async (limit: number = 8): Promise<Product[]> => {
    const response = await api.get(`/products/featured?limit=${limit}`);
    return response.data;
  },

  // Search products
  searchProducts: async (query: string, filters?: {
    category?: string;
    priceRange?: [number, number];
    sortBy?: 'price' | 'name' | 'rating' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ products: Product[]; total: number }> => {
    const params = new URLSearchParams();
    params.append('q', query);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.priceRange) {
      params.append('minPrice', filters.priceRange[0].toString());
      params.append('maxPrice', filters.priceRange[1].toString());
    }
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await api.get(`/products/search?${params}`);
    return response.data;
  },

  // Get related products
  getRelatedProducts: async (productId: string | number, limit: number = 4): Promise<Product[]> => {
    const response = await api.get(`/products/${productId}/related?limit=${limit}`);
    return response.data;
  },
};
