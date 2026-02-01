import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ChevronDown, 
  Grid, 
  List, 
  Heart, 
  ShoppingCart, 
  Star,
  Package
} from 'lucide-react';
import { productService, type Product } from '../services/productService';
import { categoryService, type Category } from '../services/categoryService';
import { useCart } from '../contexts/CartContext';

interface ProductListState {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  viewMode: 'grid' | 'list';
  searchQuery: string;
  selectedCategory: string;
  priceRange: [number, number];
  sortBy: 'name' | 'price' | 'rating' | 'newest' | 'bestselling';
  sortOrder: 'asc' | 'desc';
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}

interface Filters {
  inStock: boolean;
  freeShipping: boolean;
  onSale: boolean;
  rating: number;
}

const ProductList: React.FC = () => {
  const { addToCart } = useCart();
  
  const [state, setState] = useState<ProductListState>({
    products: [],
    categories: [],
    loading: true,
    error: null,
    viewMode: 'grid',
    searchQuery: '',
    selectedCategory: 'all',
    priceRange: [0, 1000],
    sortBy: 'newest',
    sortOrder: 'desc',
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0
  });

  const [filters, setFilters] = useState<Filters>({
    inStock: true,
    freeShipping: false,
    onSale: false,
    rating: 0
  });

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, [state.currentPage, state.searchQuery, state.selectedCategory, state.priceRange, state.sortBy, state.sortOrder, filters]);

  const loadCategories = async () => {
    try {
      const categories = await categoryService.getCategories();
      setState(prev => ({ ...prev, categories: Array.isArray(categories) ? categories : [] }));
    } catch (error) {
      console.error('Error loading categories:', error);
      setState(prev => ({ ...prev, categories: [] }));
    }
  };

  const loadProducts = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const filters: any = {
        page: state.currentPage,
        limit: 12,
        search: state.searchQuery || undefined,
        category: state.selectedCategory !== 'all' ? state.selectedCategory : undefined,
        minPrice: state.priceRange[0] > 0 ? state.priceRange[0] : undefined,
        maxPrice: state.priceRange[1] < 1000 ? state.priceRange[1] : undefined,
        sortBy: state.sortBy === 'newest' ? 'createdAt' : state.sortBy,
        sortOrder: state.sortOrder
      };

      if (filters.inStock) {
        filters.inStock = true;
      }

      const response = await productService.getProducts(filters);
      
      setState(prev => ({
        ...prev,
        products: response.products,
        totalProducts: response.total,
        totalPages: response.totalPages,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Failed to load products. Please try again.' 
      }));
    }
  };

  const handleSearch = (query: string) => {
    setState(prev => ({ ...prev, searchQuery: query, currentPage: 1 }));
  };

  const handleCategoryChange = (category: string) => {
    setState(prev => ({ ...prev, selectedCategory: category, currentPage: 1 }));
  };

  const handleSortChange = (sortBy: typeof state.sortBy) => {
    setState(prev => ({ ...prev, sortBy, currentPage: 1 }));
  };

  const handlePriceRangeChange = (priceRange: [number, number]) => {
    setState(prev => ({ ...prev, priceRange, currentPage: 1 }));
  };

  const handlePageChange = (page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
  };

  const renderProductCard = (product: Product) => (
    <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative">
          {product.oldPrice && product.oldPrice > product.price && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
            </div>
          )}
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/300x300'}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded text-sm">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span>{product.rating || 0}</span>
            </div>
            <span className="text-sm text-gray-500">({product.reviews || 0})</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900">${product.price}</p>
              {product.oldPrice && (
                <p className="text-sm text-gray-500 line-through">${product.oldPrice}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Add to wishlist logic
                }}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Heart className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addToCart({
                    productId: String(product.id),
                    name: product.name,
                    price: product.price,
                    image: product.images?.[0] || '',
                    quantity: 1
                  });
                }}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  const renderProductListItem = (product: Product) => (
    <div key={product.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow">
      <div className="flex gap-6">
        <Link to={`/products/${product.id}`} className="flex-shrink-0">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/120x120'}
            alt={product.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
        </Link>
        <div className="flex-1">
          <Link to={`/products/${product.id}`} className="block">
            <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded text-sm">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span>{product.rating || 0}</span>
              </div>
              <span className="text-sm text-gray-500">({product.reviews || 0})</span>
            </div>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900">${product.price}</p>
              {product.oldPrice && (
                <p className="text-sm text-gray-500 line-through">${product.oldPrice}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  // Add to wishlist logic
                }}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Heart className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  addToCart({
                    productId: String(product.id),
                    name: product.name,
                    price: product.price,
                    image: product.images?.[0] || '',
                    quantity: 1
                  });
                }}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center bg-white rounded-lg shadow-sm p-8 max-w-md">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{state.error}</p>
            <button
              onClick={loadProducts}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Products</h1>
            <p className="text-lg text-gray-600">Browse our collection of high-quality products</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => {
                    setFilters({ inStock: true, freeShipping: false, onSale: false, rating: 0 });
                    setState(prev => ({
                      ...prev,
                      searchQuery: '',
                      selectedCategory: 'all',
                      priceRange: [0, 1000],
                      sortBy: 'newest',
                      sortOrder: 'desc',
                      currentPage: 1
                    }));
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={state.selectedCategory === 'all'}
                      onChange={() => handleCategoryChange('all')}
                      className="w-4 h-4 text-blue-600 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">All Categories</span>
                  </label>
                  {Array.isArray(state.categories) && state.categories.map(category => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={state.selectedCategory === category.name}
                        onChange={() => handleCategoryChange(category.name)}
                        className="w-4 h-4 text-blue-600 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={state.priceRange[0]}
                      onChange={(e) => handlePriceRangeChange([Number(e.target.value), state.priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={state.priceRange[1]}
                      onChange={(e) => handlePriceRangeChange([state.priceRange[0], Number(e.target.value)])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Filters */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Additional Filters</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.onSale}
                      onChange={(e) => setFilters(prev => ({ ...prev, onSale: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">On Sale</span>
                  </label>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Minimum Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === rating}
                        onChange={() => setFilters(prev => ({ ...prev, rating }))}
                        className="w-4 h-4 text-blue-600 border-gray-300"
                      />
                      <div className="ml-2 flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="ml-1 text-sm text-gray-700">& Up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Controls Bar */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Search Bar */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={state.searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    />
                  </div>
                </div>

                {/* Sort and View Controls */}
                <div className="flex items-center space-x-4">
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={`${state.sortBy}-${state.sortOrder}`}
                      onChange={(e) => {
                        const [sortBy, sortOrder] = e.target.value.split('-') as [typeof state.sortBy, typeof state.sortOrder];
                        handleSortChange(sortBy);
                        setState(prev => ({ ...prev, sortOrder }));
                      }}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="newest-desc">Newest First</option>
                      <option value="newest-asc">Oldest First</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating-desc">Highest Rated</option>
                      <option value="name-asc">Name: A-Z</option>
                      <option value="name-desc">Name: Z-A</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setState(prev => ({ ...prev, viewMode: 'grid' }))}
                      className={`p-2 ${state.viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setState(prev => ({ ...prev, viewMode: 'list' }))}
                      className={`p-2 ${state.viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-medium text-gray-900">{state.products.length}</span> of{' '}
                  <span className="font-medium text-gray-900">{state.totalProducts}</span> products
                </p>
              </div>
            </div>

            {/* Products Grid/List */}
            <div className="mb-8">
              {state.products.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12">
                  <div className="text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                    <button
                      onClick={() => {
                        setFilters({ inStock: true, freeShipping: false, onSale: false, rating: 0 });
                        setState(prev => ({
                          ...prev,
                          searchQuery: '',
                          selectedCategory: 'all',
                          priceRange: [0, 1000],
                          sortBy: 'newest',
                          sortOrder: 'desc',
                          currentPage: 1
                        }));
                      }}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              ) : (
                <div className={
                  state.viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-4'
                }>
                  {state.products.map(product =>
                    state.viewMode === 'grid' ? renderProductCard(product) : renderProductListItem(product)
                  )}
                </div>
              )}
            </div>

            {/* Pagination */}
            {state.totalPages > 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Page {state.currentPage} of {state.totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(state.currentPage - 1)}
                      disabled={state.currentPage === 1}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {/* Page Numbers */}
                    {[...Array(Math.min(5, state.totalPages))].map((_, index) => {
                      let pageNum;
                      if (state.totalPages <= 5) {
                        pageNum = index + 1;
                      } else if (state.currentPage <= 3) {
                        pageNum = index + 1;
                      } else if (state.currentPage >= state.totalPages - 2) {
                        pageNum = state.totalPages - 4 + index;
                      } else {
                        pageNum = state.currentPage - 2 + index;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 rounded-lg ${
                            state.currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(state.currentPage + 1)}
                      disabled={state.currentPage === state.totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
