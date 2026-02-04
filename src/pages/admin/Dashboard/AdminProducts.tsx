import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Plus
} from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import ConfirmModal from '../../../components/admin/ConfirmModal';
import { createNotification } from '../../../services/notificationService';

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  stock: number;
  status: 'active' | 'inactive';
  image: string;
}

const AdminProducts: React.FC = () => {
  const { user, isAuthenticated } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    product: Product | null;
    loading: boolean;
  }>({
    isOpen: false,
    product: null,
    loading: false
  });
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: ''
  });

  // Mock products data
  useEffect(() => {
    setProducts([
      {
        id: 1,
        name: 'Unisex Blue Graphic Backpack',
        price: '$15.00',
        category: 'Bags',
        stock: 45,
        status: 'active',
        image: 'https://picsum.photos/seed/backpack/100/100.jpg'
      },
      {
        id: 2,
        name: 'Cable Knit Sweater',
        price: '$64.00',
        category: 'Clothing',
        stock: 23,
        status: 'active',
        image: 'https://picsum.photos/seed/sweater/100/100.jpg'
      },
      {
        id: 3,
        name: 'Weekend Duffle Bag',
        price: '$88.00',
        category: 'Bags',
        stock: 12,
        status: 'active',
        image: 'https://picsum.photos/seed/duffle/100/100.jpg'
      },
      {
        id: 4,
        name: 'Denim Chore Jacket',
        price: '$92.00',
        category: 'Clothing',
        stock: 0,
        status: 'inactive',
        image: 'https://picsum.photos/seed/jacket/100/100.jpg'
      }
    ]);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteClick = (product: Product) => {
    setDeleteModal({
      isOpen: true,
      product,
      loading: false
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.product) return;

    setDeleteModal(prev => ({ ...prev, loading: true }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create notification
      await createNotification.product.deleted(deleteModal.product.name, deleteModal.product.id);

      // Remove product from list
      setProducts(prev => prev.filter(p => p.id !== deleteModal.product!.id));

      // Close delete modal and show success modal
      setDeleteModal({ isOpen: false, product: null, loading: false });
      setSuccessModal({
        isOpen: true,
        title: 'Product Deleted',
        message: `Product "${deleteModal.product.name}" has been successfully deleted.`
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, product: null, loading: false });
  };

  const handleSuccessClose = () => {
    setSuccessModal({ isOpen: false, title: '', message: '' });
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <Link
          to="/admin/products/new"
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="Bags">Bags</option>
            <option value="Clothing">Clothing</option>
            <option value="Shoes">Shoes</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3 overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(product)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteModal.product?.name}"? This action cannot be undone.`}
        type="delete"
        confirmText="Delete"
        loading={deleteModal.loading}
      />

      {/* Success Modal */}
      <ConfirmModal
        isOpen={successModal.isOpen}
        onClose={handleSuccessClose}
        onConfirm={handleSuccessClose}
        title={successModal.title}
        message={successModal.message}
        type="success"
        confirmText="OK"
      />
    </div>
  );
};

export default AdminProducts;
