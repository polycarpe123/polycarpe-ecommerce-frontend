import React, { useState, useEffect } from 'react';
import { useApp } from '../../../contexts/AppContext';
import { orderService } from '../../../services/orderService';
import { customerService } from '../../../services/customerService';
import { productService } from '../../../services/productService';
import RevenueChart from '../../../components/admin/RevenueChart';
import SalesChart from '../../../components/admin/SalesChart';
import CustomerChart from '../../../components/admin/CustomerChart';
import ProductChart from '../../../components/admin/ProductChart';

const AdminAnalytics: React.FC = () => {
  const { user, isAuthenticated } = useApp();
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [ordersResponse, customersResponse, productsResponse] = await Promise.all([
          orderService.getAllOrders({ limit: 1000 }),
          customerService.getCustomers({ limit: 1000 }),
          productService.getProducts({ limit: 1000 })
        ]);

        const orders = ordersResponse.orders || [];
        const customers = customersResponse.customers || [];
        const products = productsResponse.products || [];

        // Process revenue data (last 7 days)
        const revenueData = processRevenueData(orders);
        setRevenueData(revenueData);

        // Process sales data (monthly)
        const salesData = processSalesData(orders);
        setSalesData(salesData);

        // Process customer data (by segment)
        const customerData = processCustomerData(customers);
        setCustomerData(customerData);

        // Process product data (top performing)
        const productData = processProductData(products);
        setProductData(productData);

      } catch (error) {
        console.error('Error fetching analytics data:', error);
        // Set empty arrays for real data only
        setRevenueData([]);
        setSalesData([]);
        setCustomerData([]);
        setProductData([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role === 'admin') {
      fetchAnalyticsData();
    }
  }, [isAuthenticated, user]);

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

  const processSalesData = (orders: any[]) => {
    const monthlyData: { [key: string]: number } = {};
    
    orders.forEach(order => {
      const date = new Date(order.createdAt || order.date);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      monthlyData[monthKey]++;
    });
    
    return Object.entries(monthlyData)
      .map(([month, sales]) => ({ month, sales }))
      .slice(-6); // Last 6 months
  };

  const processCustomerData = (customers: any[]) => {
    const segments = {
      'New': 0,
      'Active': 0,
      'Inactive': 0,
      'VIP': 0
    };

    customers.forEach(customer => {
      const ordersCount = customer.totalOrders || 0;
      const lastOrderDate = customer.lastOrderDate ? new Date(customer.lastOrderDate) : null;
      const daysSinceLastOrder = lastOrderDate ? Math.floor((new Date().getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24)) : Infinity;

      if (ordersCount >= 10) {
        segments['VIP']++;
      } else if (daysSinceLastOrder <= 30 && ordersCount > 0) {
        segments['Active']++;
      } else if (daysSinceLastOrder > 90 && ordersCount > 0) {
        segments['Inactive']++;
      } else {
        segments['New']++;
      }
    });

    return Object.entries(segments).map(([name, value]) => ({ name, value }));
  };

  const processProductData = (products: any[]) => {
    return products
      .sort((a, b) => (b.sales || 0) - (a.sales || 0))
      .slice(0, 5)
      .map(product => ({
        name: product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name,
        revenue: (product.price || 0) * (product.sales || 0)
      }));
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        <p className="text-gray-600">View your store analytics and insights</p>
      </div>

      {/* Analytics Content */}
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

        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Analytics (Monthly)</h3>
          {loading ? (
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="animate-pulse text-gray-500">Loading sales data...</div>
            </div>
          ) : (
            <SalesChart data={salesData} />
          )}
        </div>

        {/* Customer Analytics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Segments</h3>
          {loading ? (
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="animate-pulse text-gray-500">Loading customer data...</div>
            </div>
          ) : (
            <CustomerChart data={customerData} />
          )}
        </div>

        {/* Product Analytics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products by Revenue</h3>
          {loading ? (
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="animate-pulse text-gray-500">Loading product data...</div>
            </div>
          ) : (
            <ProductChart data={productData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
