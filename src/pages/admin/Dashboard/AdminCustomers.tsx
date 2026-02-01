import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Menu,
  X,
  ChevronRight,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Settings,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
}

const AdminCustomers: React.FC = () => {
  const { user, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    setCustomers([
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 234 567 8900',
        address: '123 Main St, New York, NY 10001',
        totalOrders: 12,
        totalSpent: 1250.75,
        joinDate: '2023-01-15'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1 234 567 8901',
        address: '456 Oak Ave, Los Angeles, CA 90001',
        totalOrders: 8,
        totalSpent: 890.50,
        joinDate: '2023-02-20'
      }
    ]);
  }, []);

  const menuItems = [
    { icon: <Package className="w-5 h-5" />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <Package className="w-5 h-5" />, label: 'Products', path: '/admin/products' },
    { icon: <ShoppingCart className="w-5 h-5" />, label: 'Orders', path: '/admin/orders' },
    { icon: <Users className="w-5 h-5" />, label: 'Customers', path: '/admin/customers' },
    { icon: <TrendingUp className="w-5 h-5" />, label: 'Analytics', path: '/admin/analytics' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/admin/settings' },
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated || user?.role !== 'admin') {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center justify-between h-16 px-6 bg-gray-800">
          <h1 className="text-xl font-bold text-white">Kapee Admin</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-8">
          {menuItems.map((item, index) => (
            <Link key={index} to={item.path} className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
              {item.icon}
              <span className="ml-3">{item.label}</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex-1 lg:ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600 hover:text-gray-900">
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900 ml-4">Customers</h2>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {customer.address}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="space-y-1">
                          <p className="flex items-center">
                            <Mail className="w-3 h-3 mr-1 text-gray-400" />
                            {customer.email}
                          </p>
                          <p className="flex items-center">
                            <Phone className="w-3 h-3 mr-1 text-gray-400" />
                            {customer.phone}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.totalOrders}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${(customer.totalSpent || 0).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.joinDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default AdminCustomers;
