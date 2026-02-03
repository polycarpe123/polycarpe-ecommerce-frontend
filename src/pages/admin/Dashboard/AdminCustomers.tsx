import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Mail,
  Phone,
  Package,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { customerService, type Customer as CustomerType } from '../../../services/customerService';

interface Customer extends CustomerType {
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  orders?: Array<{
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
    itemCount: number;
  }>;
}

const AdminCustomers: React.FC = () => {
  const { user, isAuthenticated } = useApp();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCustomers, setExpandedCustomers] = useState<Set<string | number>>(new Set());

  // Check if user is admin
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      window.location.href = '/';
    }
  }, [isAuthenticated, user]);

  // Fetch customers from database
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        const customersData = await customerService.getCustomers();
        // Type assertion to handle the additional fields from backend
        setCustomers(customersData.customers as Customer[] || []);
      } catch (err) {
        console.error('Error loading customers:', err);
        setError('Failed to load customers');
        // Fallback to empty array
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role === 'admin') {
      loadCustomers();
    }
  }, [isAuthenticated, user]);

  const toggleCustomerOrders = (customerId: string | number) => {
    const newExpanded = new Set(expandedCustomers);
    if (newExpanded.has(customerId)) {
      newExpanded.delete(customerId);
    } else {
      newExpanded.add(customerId);
    }
    setExpandedCustomers(newExpanded);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated || user?.role !== 'admin') {
    return <div>Loading...</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Loading customers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
        <p className="text-gray-600">Manage your customer database</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <React.Fragment key={customer.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {customer.firstName.charAt(0).toUpperCase()}{customer.lastName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{customer.firstName} {customer.lastName}</p>
                          <p className="text-sm text-gray-500">ID: {customer.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-1 text-gray-400" />
                        {customer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Phone className="w-3 h-3 mr-1 text-gray-400" />
                        {customer.phone || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.totalOrders || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${(customer.totalSpent || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.orders && customer.orders.length > 0 && (
                        <button
                          onClick={() => toggleCustomerOrders(customer.id)}
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          {expandedCustomers.has(customer.id) ? (
                            <ChevronUp className="w-4 h-4 mr-1" />
                          ) : (
                            <ChevronDown className="w-4 h-4 mr-1" />
                          )}
                          {customer.orders.length} Orders
                        </button>
                      )}
                    </td>
                  </tr>
                  {expandedCustomers.has(customer.id) && customer.orders && customer.orders.length > 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900 flex items-center">
                            <Package className="w-4 h-4 mr-2" />
                            Order History
                          </h4>
                          <div className="space-y-2">
                            {customer.orders.map((order) => (
                              <div key={order.id} className="bg-white p-3 rounded border border-gray-200">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-gray-900">{order.orderNumber}</p>
                                    <p className="text-sm text-gray-500">
                                      {new Date(order.createdAt).toLocaleDateString()} • {order.itemCount} items
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium text-gray-900">${order.total.toFixed(2)}</p>
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {order.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
