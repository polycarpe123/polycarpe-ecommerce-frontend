// Product Service API
import api from './api';

interface BackendProduct {
  _id?: string;
  id?: string | number;
  name: string;
  slug?: string;
  sku?: string;
  price: number;
  oldPrice?: number;
  costPrice?: number;
  description?: string;
  shortDescription?: string;
  images?: string[];
  category?: string;
  categoryId?: string | number | { name: string };
  subcategory?: string;
  subcategoryId?: string | number;
  colors?: { name: string; hex: string; inStock?: boolean }[];
  sizes?: { name: string; inStock?: boolean }[];
  variants?: ProductVariant[];
  brand?: string;
  brandId?: string | number;
  fabric?: string;
  fit?: string;
  features?: string[];
  offers?: string[];
  tags?: string[];
  rating?: number;
  reviews?: number;
  quantity?: number;
  stock?: number;
  status?: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string | number;
  name: string;
  slug: string;
  sku: string;
  price: number;
  oldPrice?: number;
  costPrice?: number;
  description: string;
  shortDescription?: string;
  images: string[];
  category: string;
  categoryId?: string | number;
  subcategory?: string;
  subcategoryId?: string | number;
  colors?: { name: string; hex: string; inStock?: boolean }[];
  sizes?: { name: string; inStock?: boolean }[];
  variants?: ProductVariant[];
  brand?: string;
  brandId?: string | number;
  fabric?: string;
  fit?: string;
  features?: string[];
  offers?: string[];
  tags?: string[];
  rating?: number;
  reviews?: number;
  stock?: number;
  trackInventory?: boolean;
  allowBackorder?: boolean;
  featured?: boolean;
  status?: 'active' | 'inactive' | 'draft';
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string | number;
  updatedBy?: string | number;
}

export interface ProductVariant {
  id: string | number;
  productId: string | number;
  sku: string;
  name: string;
  price?: number;
  oldPrice?: number;
  color?: { name: string; hex: string };
  size?: string;
  image?: string;
  stock?: number;
  inStock?: boolean;
}

export interface Category {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  banner?: string;
  parentId?: string | number;
  level?: number;
  sortOrder?: number;
  status?: 'active' | 'inactive';
  productCount: number;
  subcategories?: Category[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Brand {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  image?: string;
  website?: string;
  status?: 'active' | 'inactive';
  productCount: number;
  createdAt?: string;
  updatedAt?: string;
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
    status?: 'active' | 'inactive' | 'draft';
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price' | 'name' | 'rating' | 'createdAt' | 'stock';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.subcategory) params.append('subcategory', filters.subcategory);
    if (filters?.featured !== undefined) params.append('featured', filters.featured.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.brand) params.append('brand', filters.brand);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    try {
      const response = await api.get(`/products?${params}`);
      
      // Handle backend response format: { success: true, data: [...], pagination: {...} }
      if (response.data.success && response.data.data) {
        const products = response.data.data.map((product: BackendProduct) => ({
          id: product._id || product.id,
          name: product.name,
          slug: product.slug || product.name.toLowerCase().replace(/\s+/g, '-'),
          sku: product.sku || `PRD-${product._id}`,
          price: product.price,
          oldPrice: product.oldPrice,
          description: product.description,
          images: product.images || [],
          category: typeof product.categoryId === 'object' && product.categoryId?.name 
            ? product.categoryId.name 
            : product.category || 'Uncategorized',
          stock: product.quantity || product.stock || 0,
          status: product.status || 'active',
          featured: product.featured || false,
          rating: product.rating || 0,
          reviews: product.reviews || 0,
          tags: product.tags || [],
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }));
        
        return {
          products,
          total: response.data.pagination?.totalProducts || products.length,
          page: response.data.pagination?.currentPage || 1,
          totalPages: response.data.pagination?.totalPages || 1
        };
      }
      
      // Fallback for different response format
      return response.data;
    } catch {
      // Fallback to localStorage for guest users
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      let filteredProducts = Array.isArray(products) ? products : [];
      
      // Apply filters to localStorage data
      if (filters?.category) {
        filteredProducts = filteredProducts.filter(p => p.category === filters.category);
      }
      if (filters?.featured) {
        filteredProducts = filteredProducts.filter(p => p.featured === filters.featured);
      }
      if (filters?.search) {
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }
      if (filters?.limit) {
        filteredProducts = filteredProducts.slice(0, filters.limit);
      }
      
      return {
        products: filteredProducts,
        total: filteredProducts.length,
        page: 1,
        totalPages: 1
      };
    }
  },

  // Get single product by ID
  getProduct: async (id: string | number): Promise<Product> => {
    try {
      const response = await api.get(`/products/${id}`);
      
      // Handle backend response format: { success: true, data: {...} }
      if (response.data.success && response.data.data) {
        const product = response.data.data;
        
        // Transform to match frontend Product interface
        return {
          id: product._id || product.id,
          name: product.name,
          slug: product.slug || product.name.toLowerCase().replace(/\s+/g, '-'),
          sku: product.sku || `PRD-${product._id}`,
          price: product.price,
          oldPrice: product.oldPrice,
          costPrice: product.costPrice,
          description: product.description,
          shortDescription: product.shortDescription,
          images: product.images || [],
          category: typeof product.categoryId === 'object' && product.categoryId?.name 
            ? product.categoryId.name 
            : product.category || 'Uncategorized',
          categoryId: product.categoryId,
          subcategory: product.subcategory,
          subcategoryId: product.subcategoryId,
          colors: product.colors,
          sizes: product.sizes,
          variants: product.variants,
          brand: product.brand,
          brandId: product.brandId,
          fabric: product.fabric,
          fit: product.fit,
          features: product.features,
          offers: product.offers,
          tags: product.tags || [],
          rating: product.rating || 0,
          reviews: product.reviews || 0,
          stock: product.quantity || product.stock || 0,
          status: product.status || 'active',
          featured: product.featured || false,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        };
      }
      
      // Fallback for different response format
      return response.data;
    } catch {
      // Fallback to localStorage for guest users
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      const product = products.find((p: any) => p.id === id);
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      return product;
    }
  },

  // Get product by slug/name
  getProductBySlug: async (slug: string): Promise<Product> => {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },

  // Create new product
  createProduct: async (product: Partial<Product>): Promise<Product> => {
    try {
      const response = await api.post('/products', product);
      return response.data;
    } catch {
      // Fallback to localStorage for guest users
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      
      // Generate new ID (max existing ID + 1)
      const newId = products.length > 0 ? Math.max(...products.map((p: any) => Number(p.id))) + 1 : 1;
      
      const newProduct: Product = {
        id: newId,
        name: product.name || '',
        slug: product.name ? product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : '',
        sku: product.sku || '',
        price: product.price || 0,
        oldPrice: product.oldPrice,
        costPrice: product.costPrice,
        description: product.description || '',
        shortDescription: product.shortDescription,
        images: product.images || [],
        category: product.category || '',
        categoryId: product.categoryId,
        subcategory: product.subcategory,
        subcategoryId: product.subcategoryId,
        colors: product.colors,
        sizes: product.sizes,
        variants: product.variants,
        brand: product.brand,
        brandId: product.brandId,
        fabric: product.fabric,
        fit: product.fit,
        features: product.features,
        offers: product.offers,
        tags: product.tags || [],
        rating: 0,
        reviews: 0,
        stock: product.stock || 0,
        status: product.status || 'active',
        featured: product.featured || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to localStorage
      products.push(newProduct);
      localStorage.setItem('products', JSON.stringify(products));
      
      return newProduct;
    }
  },

  // Update product
  updateProduct: async (id: string | number, product: Partial<Product>): Promise<Product> => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: string | number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  // Bulk delete products
  bulkDeleteProducts: async (ids: (string | number)[]): Promise<void> => {
    await api.post('/products/bulk-delete', { ids });
  },

  // Update product status
  updateProductStatus: async (id: string | number, status: 'active' | 'inactive' | 'draft'): Promise<Product> => {
    const response = await api.patch(`/products/${id}/status`, { status });
    return response.data;
  },

  // Update product stock
  updateProductStock: async (id: string | number, stock: number): Promise<Product> => {
    const response = await api.patch(`/products/${id}/stock`, { stock });
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
    brand?: string;
    inStock?: boolean;
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
    if (filters?.brand) params.append('brand', filters.brand);
    if (filters?.inStock !== undefined) params.append('inStock', filters.inStock.toString());

    const response = await api.get(`/products/search?${params}`);
    return response.data;
  },

  // Get related products
  getRelatedProducts: async (productId: string | number, limit: number = 4): Promise<Product[]> => {
    try {
      const response = await api.get(`/products/${productId}/related?limit=${limit}`);
      
      // Handle backend response format: { success: true, data: [...] }
      if (response.data.success && response.data.data) {
        const products = response.data.data.map((product: BackendProduct) => ({
          id: product._id || product.id,
          name: product.name,
          slug: product.slug || product.name.toLowerCase().replace(/\s+/g, '-'),
          sku: product.sku || `PRD-${product._id}`,
          price: product.price,
          oldPrice: product.oldPrice,
          costPrice: product.costPrice,
          description: product.description,
          shortDescription: product.shortDescription,
          images: product.images || [],
          category: typeof product.categoryId === 'object' && product.categoryId?.name 
            ? product.categoryId.name 
            : product.category || 'Uncategorized',
          categoryId: product.categoryId,
          subcategory: product.subcategory,
          subcategoryId: product.subcategoryId,
          colors: product.colors,
          sizes: product.sizes,
          variants: product.variants,
          brand: product.brand,
          brandId: product.brandId,
          fabric: product.fabric,
          fit: product.fit,
          features: product.features,
          offers: product.offers,
          tags: product.tags || [],
          rating: product.rating || 0,
          reviews: product.reviews || 0,
          stock: product.quantity || product.stock || 0,
          status: product.status || 'active',
          featured: product.featured || false,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }));
        
        return products;
      }
      
      // Fallback for different response format
      return response.data;
    } catch {
      // Fallback to localStorage for guest users
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      const currentProduct = products.find((p: any) => p.id === productId);
      
      if (!currentProduct) {
        return [];
      }
      
      // Get products from the same category or random products
      const related = products
        .filter((p: any) => p.id !== productId && p.category === currentProduct.category)
        .slice(0, limit);
      
      // If not enough from same category, add random products
      if (related.length < limit) {
        const remaining = products
          .filter((p: any) => p.id !== productId && !related.some((r: any) => r.id === p.id))
          .slice(0, limit - related.length);
        related.push(...remaining);
      }
      
      return related;
    }
  },

  // Get product variants
  getProductVariants: async (productId: string | number): Promise<ProductVariant[]> => {
    const response = await api.get(`/products/${productId}/variants`);
    return response.data;
  },

  // Create product variant
  createProductVariant: async (productId: string | number, variant: Partial<ProductVariant>): Promise<ProductVariant> => {
    const response = await api.post(`/products/${productId}/variants`, variant);
    return response.data;
  },

  // Update product variant
  updateProductVariant: async (variantId: string | number, variant: Partial<ProductVariant>): Promise<ProductVariant> => {
    const response = await api.put(`/variants/${variantId}`, variant);
    return response.data;
  },

  // Delete product variant
  deleteProductVariant: async (variantId: string | number): Promise<void> => {
    await api.delete(`/variants/${variantId}`);
  },

  // Get product reviews
  getProductReviews: async (productId: string | number, page: number = 1, limit: number = 10): Promise<{
    reviews: any[];
    total: number;
    averageRating: number;
  }> => {
    const response = await api.get(`/products/${productId}/reviews?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Add product review
  addProductReview: async (productId: string | number, review: {
    rating: number;
    comment: string;
    title?: string;
  }): Promise<any> => {
    const response = await api.post(`/products/${productId}/reviews`, review);
    return response.data;
  },

  // Get product statistics
  getProductStats: async (id: string | number): Promise<{
    totalViews: number;
    totalSales: number;
    totalRevenue: number;
    averageRating: number;
    reviewCount: number;
    stockLevel: number;
  }> => {
    const response = await api.get(`/products/${id}/stats`);
    return response.data;
  },

  // Bulk update products
  bulkUpdateProducts: async (updates: {
    ids: (string | number)[];
    updateData: Partial<Product>;
  }): Promise<Product[]> => {
    const response = await api.post('/products/bulk-update', updates);
    return response.data;
  },

  // Duplicate product
  duplicateProduct: async (id: string | number, newName?: string): Promise<Product> => {
    const response = await api.post(`/products/${id}/duplicate`, { newName });
    return response.data;
  },
};
