import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Eye,
  Menu,
  X,
  ChevronRight,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Settings,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { orderService, type Order } from '../../../services/orderService';

const AdminOrders: React.FC = () => {
  const { user, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch orders from database
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const ordersData = await orderService.getCustomerOrders(); // No customerId = all orders
        setOrders(ordersData.orders);
      } catch (err) {
        console.error('Error loading orders:', err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role === 'admin') {
      loadOrders();
    }
  }, [isAuthenticated, user]);

  // Refresh orders
  const refreshOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await orderService.getCustomerOrders(); // No customerId = all orders
      setOrders(ordersData.orders);
      setError(null);
    } catch (err) {
      console.error('Error refreshing orders:', err);
      setError('Failed to refresh orders');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { icon: <Package className="w-5 h-5" />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <Package className="w-5 h-5" />, label: 'Products', path: '/admin/products' },
    { icon: <ShoppingCart className="w-5 h-5" />, label: 'Orders', path: '/admin/orders' },
    { icon: <Users className="w-5 h-5" />, label: 'Customers', path: '/admin/customers' },
    { icon: <TrendingUp className="w-5 h-5" />, label: 'Analytics', path: '/admin/analytics' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/admin/settings' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'processing': return <Package className="w-4 h-4 text-blue-500" />;
      case 'shipped': return <Truck className="w-4 h-4 text-purple-500" />;
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const orderNumber = order.orderNumber?.toString() || order.id?.toString() || '';
    const customerEmail = order.customerEmail || '';
    const customerName = `${order.shippingAddress?.firstName} ${order.shippingAddress?.lastName}`.trim();
    
    const matchesSearch = orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

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
              
              <h2 className="text-xl font-semibold text-gray-900 ml-4">Orders</h2>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={refreshOrders}
                disabled={loading}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Export Orders
              </button>
            </div>
          </div>
        </header>

        {/* Orders Content */}
        <main className="p-6">
          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
              <span className="ml-2 text-gray-600">Loading orders...</span>
            </div>
          )}

          {/* Orders Content */}
          {!loading && !error && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="bg-blue-500 p-3 rounded-lg text-white">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="bg-green-500 p-3 rounded-lg text-white">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {orders.filter(o => o.status === 'delivered').length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="bg-yellow-500 p-3 rounded-lg text-white">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="bg-purple-500 p-3 rounded-lg text-white">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">In Transit</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {orders.filter(o => o.status === 'processing' || o.status === 'shipped').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  />
                </div>
              </div>
              
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-medium text-gray-900">{order.orderNumber || `#${order.id}`}</p>
                        <p className="text-sm text-gray-500">{order.customerEmail}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.shippingAddress ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}` : 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.items?.length || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${(order.total || 0).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(order.status)}
                          <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
            </>
          )}
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

export default AdminOrders;
