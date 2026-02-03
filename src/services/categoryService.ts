// Category Service API
import api from './api';
import type { Category } from './productService';

// Re-export Category for convenience
export type { Category } from './productService';

// Category API calls
export const categoryService = {
  // Get all categories with optional filters
  getCategories: async (filters?: {
    parentId?: string | number;
    status?: 'active' | 'inactive';
    includeSubcategories?: boolean;
    includeProductCount?: boolean;
  }): Promise<Category[]> => {
    try {
      const params = new URLSearchParams();
      if (filters?.parentId) params.append('parentId', filters.parentId.toString());
      if (filters?.status) params.append('status', filters.status);
      if (filters?.includeSubcategories) params.append('includeSubcategories', 'true');
      if (filters?.includeProductCount) params.append('includeProductCount', 'true');

      const response = await api.get(`/categories?${params}`);
      
      // Handle backend response format: { success: true, data: [...] }
      if (response.data.success && response.data.data) {
        const categories = response.data.data.map((category: any) => ({
          id: category._id || category.id,
          name: category.name,
          slug: category.slug || category.name.toLowerCase().replace(/\s+/g, '-'),
          description: category.description,
          image: category.image,
          parentId: category.parentId,
          status: category.status || 'active',
          productCount: category.productCount || 0,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        }));
        
        return categories;
      }
      
      // Fallback for different response format
      return response.data;
    } catch {
      // Fallback to localStorage for guest users
      const categories = JSON.parse(localStorage.getItem('categories') || '[]');
      return Array.isArray(categories) ? categories : [];
    }
  },

  // Get single category by ID
  getCategory: async (id: string | number): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Get category by slug
  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const response = await api.get(`/categories/slug/${slug}`);
    return response.data;
  },

  // Create new category
  createCategory: async (category: Partial<Category>): Promise<Category> => {
    const response = await api.post('/categories', category);
    return response.data;
  },

  // Update category
  updateCategory: async (id: string | number, category: Partial<Category>): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, category);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id: string | number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },

  // Get category tree (hierarchical structure)
  getCategoryTree: async (): Promise<Category[]> => {
    const response = await api.get('/categories/tree');
    return response.data;
  },

  // Get root categories (no parent)
  getRootCategories: async (): Promise<Category[]> => {
    const response = await api.get('/categories/root');
    return response.data;
  },

  // Get subcategories of a parent category
  getSubcategories: async (parentId: string | number): Promise<Category[]> => {
    const response = await api.get(`/categories/${parentId}/subcategories`);
    return response.data;
  },

  // Update category sort order
  updateCategoryOrder: async (categoryOrders: { id: string | number; sortOrder: number }[]): Promise<void> => {
    await api.put('/categories/reorder', { categories: categoryOrders });
  },

  // Get featured categories
  getFeaturedCategories: async (limit: number = 6): Promise<Category[]> => {
    const response = await api.get(`/categories/featured?limit=${limit}`);
    return response.data;
  },

  // Search categories
  searchCategories: async (query: string): Promise<Category[]> => {
    const response = await api.get(`/categories/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Get category statistics
  getCategoryStats: async (id: string | number): Promise<{
    productCount: number;
    totalRevenue: number;
    averagePrice: number;
    subcategoryCount: number;
  }> => {
    const response = await api.get(`/categories/${id}/stats`);
    return response.data;
  },
};
