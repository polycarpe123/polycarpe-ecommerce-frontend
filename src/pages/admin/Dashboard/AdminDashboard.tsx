import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings, 
  DollarSign,
  ShoppingCart,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  BarChart3,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';

interface StatCard {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<StatCard[]>([]);

  // Check if user is admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // Mock stats data
  useEffect(() => {
    setStats([
      {
        title: 'Total Revenue',
        value: '$45,231',
        change: 12.5,
        icon: <DollarSign className="w-6 h-6" />,
        color: 'bg-blue-500'
      },
      {
        title: 'Total Orders',
        value: '1,234',
        change: 8.2,
        icon: <ShoppingCart className="w-6 h-6" />,
        color: 'bg-green-500'
      },
      {
        title: 'Total Products',
        value: '567',
        change: -2.4,
        icon: <Package className="w-6 h-6" />,
        color: 'bg-purple-500'
      },
      {
        title: 'Total Customers',
        value: '8,912',
        change: 15.3,
        icon: <Users className="w-6 h-6" />,
        color: 'bg-orange-500'
      }
    ]);
  }, []);

  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <ShoppingBag className="w-5 h-5" />, label: 'Products', path: '/admin/products' },
    { icon: <ShoppingCart className="w-5 h-5" />, label: 'Orders', path: '/admin/orders' },
    { icon: <Users className="w-5 h-5" />, label: 'Customers', path: '/admin/customers' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics', path: '/admin/analytics' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/admin/settings' },
  ];

  if (!isAuthenticated || user?.role !== 'admin') {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center justify-between h-16 px-6 bg-gray-800">
          <h1 className="text-xl font-bold text-white">Kapee Admin</h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-8">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              {/* Search Bar */}
              <div className="relative ml-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative text-gray-600 hover:text-gray-900">
                <Bell className="w-6 h-6" />
              </button>

              {/* Back to Store */}
              <Link 
                to="/"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm font-medium"
              >
                Back to Store
              </Link>

              {/* User Profile */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.firstName?.[0] || 'A'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
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
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Revenue Chart Placeholder</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((order) => (
                  <div key={order} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Order #{1000 + order}</p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${((order || 0) * 45.99).toFixed(2)}</p>
                      <p className="text-sm text-green-600">Completed</p>
                    </div>
                  </div>
                ))}
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
                  {['Backpack', 'Sweater', 'Shoes', 'Jacket'].map((product, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            Export Orders
                          </button>
                        </div>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3"></div>
                          <div>
                            <p className="font-medium text-gray-900">{product}</p>
                            <p className="text-sm text-gray-500">Category {index + 1}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">${(index + 1) * 15.99}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{Math.floor(Math.random() * 100) + 20}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">${((Math.floor(Math.random() * 1000) + 500) || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
