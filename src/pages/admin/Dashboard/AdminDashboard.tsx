import React, { useState, useEffect } from 'react';
import { 
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { productService } from '../../../services/productService';
import { orderService } from '../../../services/orderService';
import { customerService } from '../../../services/customerService';
import RevenueChart from '../../../components/admin/RevenueChart';

interface StatCard {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);

  // Fetch real dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [productsResponse, ordersResponse, customersResponse] = await Promise.all([
          productService.getProducts({ limit: 1000 }),
          orderService.getAllOrders({ limit: 1000 }),
          customerService.getCustomers({ limit: 1000 })
        ]);

        const products = productsResponse.products || [];
        const orders = ordersResponse.orders || [];
        const customers = customersResponse.customers || [];

        // Calculate total revenue from orders
        const totalRevenue = orders.reduce((sum: number, order: any) => {
          return sum + (order.totalAmount || order.total || 0);
        }, 0);

        // Process revenue data for chart (last 7 days)
        const revenueData = processRevenueData(orders);
        setRevenueData(revenueData);

        // Get recent orders (last 5)
        const sortedOrders = orders
          .sort((a: any, b: any) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime())
          .slice(0, 5);

        // Get top products (by sales or views)
        const topProductsData = products
          .sort((a: any, b: any) => (b.sales || 0) - (a.sales || 0))
          .slice(0, 5);

        // Calculate stats
        const newStats: StatCard[] = [
          {
            title: 'Total Revenue',
            value: `$${totalRevenue.toLocaleString()}`,
            change: 12.5, // You could calculate this from historical data
            icon: <DollarSign className="w-6 h-6" />,
            color: 'bg-blue-500'
          },
          {
            title: 'Total Orders',
            value: orders.length.toLocaleString(),
            change: 8.2, // You could calculate this from historical data
            icon: <ShoppingCart className="w-6 h-6" />,
            color: 'bg-green-500'
          },
          {
            title: 'Total Products',
            value: products.length.toLocaleString(),
            change: -2.4, // You could calculate this from historical data
            icon: <Package className="w-6 h-6" />,
            color: 'bg-purple-500'
          },
          {
            title: 'Total Customers',
            value: customers.length.toLocaleString(),
            change: 15.3, // You could calculate this from historical data
            icon: <Users className="w-6 h-6" />,
            color: 'bg-orange-500'
          }
        ];

        setStats(newStats);
        setRecentOrders(sortedOrders);
        setTopProducts(topProductsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set empty arrays for real data only
        setStats([]);
        setRecentOrders([]);
        setTopProducts([]);
        setRevenueData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const processRevenueData = (orders: any[]) => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const dayRevenue = orders
        .filter(order => {
          const orderDate = new Date(order.createdAt || order.date);
          return orderDate.toDateString() === date.toDateString();
        })
        .reduce((sum, order) => sum + (order.totalAmount || order.total || 0), 0);
      
      last7Days.push({ date: dateStr, revenue: dayRevenue });
    }
    
    return last7Days;
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // Loading skeleton for stats cards
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="animate-pulse">
                <div className="flex items-center">
                  <div className="bg-gray-300 p-3 rounded-lg w-12 h-12"></div>
                  <div className="ml-4 flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-2 w-24"></div>
                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <div className="h-4 bg-gray-300 rounded w-8"></div>
                  <div className="h-4 bg-gray-300 rounded w-12 ml-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-20 ml-1"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stat.change > 0 ? (
                  <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${stat.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(stat.change)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview (Last 7 Days)</h3>
          {loading ? (
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="animate-pulse text-gray-500">Loading revenue data...</div>
            </div>
          ) : (
            <RevenueChart data={revenueData} />
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {loading ? (
              // Loading skeleton for recent orders
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="h-4 bg-gray-300 rounded mb-2 w-24"></div>
                      <div className="h-3 bg-gray-300 rounded w-20"></div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 bg-gray-300 rounded mb-2 w-16"></div>
                      <div className="h-3 bg-gray-300 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : recentOrders.length > 0 ? (
              recentOrders.map((order: any, index) => (
                <div key={order.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Order #{order.id || order.orderNumber}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt || order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ${(order.totalAmount || order.total || 0).toFixed(2)}
                    </p>
                    <p className={`text-sm ${
                      order.status === 'completed' ? 'text-green-600' : 
                      order.status === 'pending' ? 'text-yellow-600' : 
                      order.status === 'cancelled' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {order.status || 'Processing'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent orders found</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                // Loading skeleton for top products
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-lg mr-3 animate-pulse"></div>
                        <div>
                          <div className="h-4 bg-gray-300 rounded mb-2 w-24"></div>
                          <div className="h-3 bg-gray-300 rounded w-16"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : topProducts.length > 0 ? (
                topProducts.map((product: any, index) => (
                  <tr key={product.id || index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg mr-3"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.category || 'Uncategorized'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      ${(product.price || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {product.sales || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      ${((product.price || 0) * (product.sales || 0)).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
