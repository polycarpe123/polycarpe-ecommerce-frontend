import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Tag, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  AlertCircle,
  ChevronDown,
  Image as ImageIcon
} from 'lucide-react';
import { categoryService, type Category } from '../services/categoryService';

interface CategoryStats {
  totalCategories: number;
  activeCategories: number;
  totalProducts: number;
  averageProductsPerCategory: number;
  categoriesWithNoProducts: number;
}

const CategoriesDashboard: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<CategoryStats>({
    totalCategories: 0,
    activeCategories: 0,
    totalProducts: 0,
    averageProductsPerCategory: 0,
    categoriesWithNoProducts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'productCount' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    filterAndSortCategories();
  }, [categories, searchTerm, statusFilter, sortBy, sortOrder]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await categoryService.getCategories();
      
      // Ensure categories is always an array
      const safeCategoriesData = Array.isArray(categoriesData) ? categoriesData : [];
      setCategories(safeCategoriesData);
      
      // Calculate stats
      const activeCategories = safeCategoriesData.filter(cat => cat.status !== 'inactive');
      const totalProducts = safeCategoriesData.reduce((sum, cat) => sum + (Number(cat.productCount) || 0), 0);
      const averageProductsPerCategory = safeCategoriesData.length > 0 ? totalProducts / safeCategoriesData.length : 0;
      const categoriesWithNoProducts = safeCategoriesData.filter(cat => (Number(cat.productCount) || 0) === 0).length;
      
      setStats({
        totalCategories: safeCategoriesData.length,
        activeCategories: activeCategories.length,
        totalProducts,
        averageProductsPerCategory,
        categoriesWithNoProducts
      });
      
    } catch (error) {
      console.error('Error loading categories:', error);
      setError('Failed to load categories');
      setCategories([]); // Ensure categories is an empty array on error
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCategories = () => {
    // Ensure categories is an array before trying to iterate
    if (!Array.isArray(categories)) {
      setFilteredCategories([]);
      return;
    }
    
    let filtered = [...categories];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(category => category.status === statusFilter);
    }
    
    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'productCount':
          comparison = (a.productCount || 0) - (b.productCount || 0);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredCategories(filtered);
  };

  const handleDeleteCategory = async (categoryId: string | number) => {
    if (window.confirm('Are you sure you want to delete this category? This will also remove it from all products.')) {
      try {
        await categoryService.deleteCategory(categoryId);
        loadCategories(); // Reload categories
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'inactive':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-sm p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadCategories}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <Link
              to="/admin/categories/new"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </Link>
          </div>
          <p className="text-gray-600">Manage product categories and organize your store structure</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <Tag className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalCategories}</h3>
            <p className="text-gray-600 text-sm">Categories</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 rounded-lg p-3">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Active</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.activeCategories}</h3>
            <p className="text-gray-600 text-sm">Categories</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-lg p-3">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">Products</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalProducts}</h3>
            <p className="text-gray-600 text-sm">Total Products</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 rounded-lg p-3">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm text-gray-500">Empty</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.categoriesWithNoProducts}</h3>
            <p className="text-gray-600 text-sm">Categories</p>
          </div>
        </div>

        {/* Category Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Category Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{(stats.averageProductsPerCategory || 0).toFixed(1)}</div>
              <div className="text-sm text-gray-600">Avg Products/Category</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.activeCategories}</div>
              <div className="text-sm text-gray-600">Active Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.categoriesWithNoProducts}</div>
              <div className="text-sm text-gray-600">Empty Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalProducts}</div>
              <div className="text-sm text-gray-600">Total Products</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name</option>
                <option value="productCount">Product Count</option>
                <option value="createdAt">Date Created</option>
              </select>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Showing {filteredCategories.length} of {categories.length} categories
                </span>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setSortBy('name');
                    setSortOrder('asc');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Categories Grid */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredCategories.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500">
                  <Tag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No categories found</p>
                  <Link
                    to="/admin/categories/new"
                    className="mt-4 inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add your first category</span>
                  </Link>
                </div>
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  {/* Category Image */}
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Category Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {category.name}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(category.status || 'inactive')}`}>
                        {category.status || 'inactive'}
                      </span>
                    </div>
                    
                    {category.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {category.description}
                      </p>
                    )}

                    {/* Category Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{category.productCount || 0} products</span>
                      <span>Created {formatDate(category.createdAt || undefined)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-2 mt-4">
                    <Link
                      to={`/categories/${category.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/admin/categories/${category.id}/edit`}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesDashboard;
