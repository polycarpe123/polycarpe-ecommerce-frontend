import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Package, 
  DollarSign, 
  Users, 
  Eye, 
  ChevronRight,
  Plus,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { orderService } from '../services/orderService';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  activeUsers: number;
  averageOrderValue: number;
  conversionRate: number;
}

interface RecentOrder {
  id: string | number;
  orderNumber: string;
  customerEmail: string;
  total: number;
  status: string;
  createdAt: string;
}

interface TopProduct {
  id: string | number;
  name: string;
  sales: number;
  revenue: number;
  stock: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    activeUsers: 0,
    averageOrderValue: 0,
    conversionRate: 0
  });
  
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [products, categories, orders, orderStats] = await Promise.all([
        productService.getProducts({ limit: 1000 }),
        categoryService.getCategories(),
        orderService.getCustomerOrders(),
        orderService.getOrderStats()
      ]);

      // Calculate stats
      const totalRevenue = orderStats.totalRevenue || 0;
      const totalOrders = orderStats.totalOrders || 0;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      setStats({
        totalProducts: products.total || 0,
        totalCategories: categories.length,
        totalOrders,
        totalRevenue,
        pendingOrders: orderStats.pendingOrders || 0,
        activeUsers: 0, // TODO: Implement customer service
        averageOrderValue,
        conversionRate: 0 // TODO: Calculate from analytics
      });

      // Get recent orders (last 5)
      const recent = orders.orders.slice(0, 5).map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerEmail: order.customerEmail || 'guest@example.com',
        total: order.total,
        status: order.status,
        createdAt: order.createdAt
      }));
      setRecentOrders(recent);

      // Get top products (mock data for now)
      const topProductsData = products.products.slice(0, 5).map(product => ({
        id: product.id,
        name: product.name,
        sales: Math.floor(Math.random() * 100) + 10,
        revenue: product.price * (Math.floor(Math.random() * 50) + 5),
        stock: product.stock || 0
      }));
      setTopProducts(topProductsData);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-purple-600 bg-purple-100';
      case 'shipped': return 'text-indigo-600 bg-indigo-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
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
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
            onClick={loadDashboardData}
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your e-commerce store.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalProducts}</h3>
            <p className="text-gray-600 text-sm">Total Products</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 rounded-lg p-3">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+8%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalOrders}</h3>
            <p className="text-gray-600 text-sm">Total Orders</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-lg p-3">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+23%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">${(stats.totalRevenue || 0).toFixed(0)}</h3>
            <p className="text-gray-600 text-sm">Total Revenue</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 rounded-lg p-3">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+15%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalCategories}</h3>
            <p className="text-gray-600 text-sm">Categories</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/products"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Plus className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Add Product</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              to="/admin/categories"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Plus className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Add Category</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              to="/admin/orders"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">View Orders</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              to="/admin/analytics"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-gray-900">Analytics</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
        </div>

        {/* Recent Orders and Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                <Link
                  to="/admin/orders"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No recent orders
                </div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">{order.customerEmail}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${(order.total || 0).toFixed(2)}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{formatDate(order.createdAt)}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Top Products</h2>
                <Link
                  to="/admin/products"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {topProducts.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No products available
                </div>
              ) : (
                topProducts.map((product, index) => (
                  <div key={product.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-600">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 truncate max-w-xs">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sales} sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${(product.revenue || 0).toFixed(0)}</p>
                        <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
