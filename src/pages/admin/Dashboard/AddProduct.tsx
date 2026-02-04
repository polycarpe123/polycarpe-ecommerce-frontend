import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { productService } from '../../../services/productService';
import { categoryService } from '../../../services/categoryService';
import ConfirmModal from '../../../components/admin/ConfirmModal';
import { createNotification } from '../../../services/notificationService';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string;
  sku: string;
  stock: number;
  status: 'active' | 'inactive';
  featured: boolean;
  images: string[];
  tags: string[];
}

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: ''
  });
  const [categories, setCategories] = useState<any[]>([
    { id: '507f1f77bcf86cd799439011', name: 'Electronics' }, // Mock MongoDB ObjectId
    { id: '507f1f77bcf86cd799439012', name: 'Clothing' },
    { id: '507f1f77bcf86cd799439013', name: 'Sports & Fitness' },
    { id: '507f1f77bcf86cd799439014', name: 'Accessories' }
  ]);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    oldPrice: undefined,
    category: '',
    sku: '',
    stock: 0,
    status: 'active',
    featured: false,
    images: [''],
    tags: []
  });

  // Auto-generate SKU when name changes
  const generateSKU = (name: string) => {
    if (!name.trim()) return '';
    return name
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 10) + '-' + Date.now().toString().slice(-4);
  };

  React.useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const cats = await categoryService.getCategories();
      const categoriesArray = Array.isArray(cats) ? cats : [];
      
      if (categoriesArray.length === 0) {
        // If API returns empty array, use sample categories
        const sampleCategories = [
          { id: '507f1f77bcf86cd799439011', name: 'Electronics' }, // Mock MongoDB ObjectId
          { id: '507f1f77bcf86cd799439012', name: 'Clothing' },
          { id: '507f1f77bcf86cd799439013', name: 'Sports & Fitness' },
          { id: '507f1f77bcf86cd799439014', name: 'Accessories' }
        ];
        setCategories(sampleCategories);
      } else {
        setCategories(categoriesArray);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      // Fallback to sample categories if API fails
      const sampleCategories = [
        { id: '507f1f77bcf86cd799439011', name: 'Electronics' }, // Mock MongoDB ObjectId
        { id: '507f1f77bcf86cd799439012', name: 'Clothing' },
        { id: '507f1f77bcf86cd799439013', name: 'Sports & Fitness' },
        { id: '507f1f77bcf86cd799439014', name: 'Accessories' }
      ];
      setCategories(sampleCategories);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => {
      const updatedData = {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? Number(value) : value
      };
      
      // Auto-generate SKU when name changes and SKU is empty
      if (name === 'name' && value && !prev.sku) {
        updatedData.sku = generateSKU(value);
      }
      
      return updatedData;
    });
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSuccessClose = () => {
    setSuccessModal({ isOpen: false, title: '', message: '' });
    navigate('/admin/products');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You must be logged in to create a product. Please login first.');
      setLoading(false);
      return;
    }

    // Validate required fields
    if (!formData.name.trim()) {
      setError('Product name is required');
      setLoading(false);
      return;
    }
    
    if (!formData.description.trim()) {
      setError('Product description is required');
      setLoading(false);
      return;
    }
    
    if (!formData.price || formData.price <= 0) {
      setError('Product price must be greater than 0');
      setLoading(false);
      return;
    }
    
    if (!formData.category.trim()) {
      setError('Product category is required');
      setLoading(false);
      return;
    }
    
    if (!formData.sku.trim()) {
      setError('Product SKU is required');
      setLoading(false);
      return;
    }

    try {
      // Filter out empty image URLs
      const validImages = formData.images.filter(img => img.trim() !== '');
      
      // Map frontend data to backend expected format
      const productData = {
        name: formData.name,
        price: Number(formData.price),
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
        description: formData.description,
        sku: formData.sku,
        categoryId: formData.category, // This should be a valid MongoDB ObjectId
        inStock: formData.status === 'active', // Convert status to boolean
        quantity: Number(formData.stock), // Rename stock to quantity
        featured: formData.featured,
        images: validImages,
        tags: formData.tags,
        status: formData.status
      };

      console.log('Creating product with data:', productData);
      console.log('Using token:', token ? 'Token exists' : 'No token');
      console.log('Full request payload:', JSON.stringify(productData, null, 2));
      
      const result = await productService.createProduct(productData);
      console.log('Product creation result:', result);
      
      // Check if product was actually created (has valid ID)
      if (result && (result.id || result._id)) {
        console.log('Product created successfully with ID:', result.id || result._id);
        
        // Create notification
        await createNotification.product.created(formData.name, result.id || result._id || 'unknown');
        
        // Show success modal
        setSuccessModal({
          isOpen: true,
          title: 'Product Created',
          message: `Product "${formData.name}" has been successfully created and added to the catalog.`
        });
      } else {
        throw new Error('Product creation failed - no valid ID returned');
      }
    } catch (error: any) {
      console.error('Error creating product:', error);
      
      // Better error messages
      if (error.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to create products. Admin or Vendor role required.');
      } else if (error.response?.status === 400) {
        setError('Invalid product data. Please check all fields.');
      } else {
        setError(`Failed to create product: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/products')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-2">Create a new product for your store</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU *
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category and Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Featured Product
                </label>
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Old Price ($)
                </label>
                <input
                  type="number"
                  name="oldPrice"
                  value={formData.oldPrice || ''}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images
              </label>
              {formData.images.map((image, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addImageField}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Add Another Image
              </button>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={handleTagsChange}
                placeholder="electronics, wireless, headphones"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>

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

export default AddProduct;
