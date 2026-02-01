import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { productService, type Product } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import type { Category } from '../../services/productService';

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  // Form state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    slug: '',
    sku: '',
    price: 0,
    oldPrice: 0,
    costPrice: 0,
    description: '',
    shortDescription: '',
    images: [],
    category: '',
    categoryId: '',
    subcategory: '',
    colors: [],
    sizes: [],
    brand: '',
    fabric: '',
    fit: '',
    features: [],
    offers: [],
    tags: [],
    rating: 0,
    reviews: 0,
    stock: 0,
    trackInventory: true,
    allowBackorder: false,
    featured: false,
    status: 'active',
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0
    },
    seo: {
      title: '',
      description: '',
      keywords: []
    }
  });

  // UI state
  const [newFeature, setNewFeature] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('');
  const [newSizeName, setNewSizeName] = useState('');

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const categoriesData = await categoryService.getCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProduct = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const product = await productService.getProduct(id);
      setFormData({
        ...product,
        dimensions: product.dimensions || { length: 0, width: 0, height: 0 },
        seo: product.seo || { title: '', description: '', keywords: [] }
      });
    } catch (err) {
      console.error('Error fetching product:', err);
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof Product] as any),
        [field]: value
      }
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), ...imageUrls]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }));
  };

  const addColor = () => {
    if (newColorName.trim() && newColorHex.trim()) {
      setFormData(prev => ({
        ...prev,
        colors: [...(prev.colors || []), {
          name: newColorName.trim(),
          hex: newColorHex.trim(),
          inStock: true
        }]
      }));
      setNewColorName('');
      setNewColorHex('');
    }
  };

  const removeColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors?.filter((_, i) => i !== index) || []
    }));
  };

  const addSize = () => {
    if (newSizeName.trim()) {
      setFormData(prev => ({
        ...prev,
        sizes: [...(prev.sizes || []), {
          name: newSizeName.trim(),
          inStock: true
        }]
      }));
      setNewSizeName('');
    }
  };

  const removeSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes?.filter((_, i) => i !== index) || []
    }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
      seo: {
        ...prev.seo,
        title: name
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEditing) {
        await productService.updateProduct(id!, formData);
        alert('Product updated successfully!');
      } else {
        await productService.createProduct(formData);
        alert('Product created successfully!');
      }
      navigate('/admin/products');
    } catch (err) {
      alert(`Failed to ${isEditing ? 'update' : 'create'} product`);
      console.error('Error saving product:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="text-gray-600 mt-2">
                {isEditing ? 'Update product information' : 'Create a new product'}
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/products')}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Old Price</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.oldPrice}
                  onChange={(e) => handleInputChange('oldPrice', parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost Price</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={(e) => handleInputChange('costPrice', parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fabric</label>
                <input
                  type="text"
                  value={formData.fabric}
                  onChange={(e) => handleInputChange('fabric', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fit</label>
                <input
                  type="text"
                  value={formData.fit}
                  onChange={(e) => handleInputChange('fit', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="rounded border-gray-300 mr-2"
                  />
                  <span className="text-sm text-gray-700">Featured Product</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.trackInventory}
                    onChange={(e) => handleInputChange('trackInventory', e.target.checked)}
                    className="rounded border-gray-300 mr-2"
                  />
                  <span className="text-sm text-gray-700">Track Inventory</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.allowBackorder}
                    onChange={(e) => handleInputChange('allowBackorder', e.target.checked)}
                    className="rounded border-gray-300 mr-2"
                  />
                  <span className="text-sm text-gray-700">Allow Backorder</span>
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Description</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Description *</label>
                <textarea
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Product Images</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Product Variants</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Colors */}
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-4">Colors</h3>
                
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Color name"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="w-20 h-10 border border-gray-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={addColor}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {formData.colors && formData.colors.length > 0 && (
                    <div className="space-y-2">
                      {formData.colors.map((color, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-6 h-6 rounded-full border border-gray-300"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span className="text-sm">{color.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeColor(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Sizes */}
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-4">Sizes</h3>
                
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Size name"
                      value={newSizeName}
                      onChange={(e) => setNewSizeName(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={addSize}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {formData.sizes && formData.sizes.length > 0 && (
                    <div className="space-y-2">
                      {formData.sizes.map((size, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded-lg">
                          <span className="text-sm">{size.name}</span>
                          <button
                            type="button"
                            onClick={() => removeSize(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Additional Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (g)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Length (cm)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.dimensions?.length}
                  onChange={(e) => handleNestedChange('dimensions', 'length', parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Width (cm)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.dimensions?.width}
                  onChange={(e) => handleNestedChange('dimensions', 'width', parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.dimensions?.height}
                  onChange={(e) => handleNestedChange('dimensions', 'height', parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Features</h2>
            
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add a feature"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              
              {formData.features && formData.features.length > 0 && (
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded-lg">
                      <span className="text-sm">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">SEO Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SEO Title</label>
                <input
                  type="text"
                  value={formData.seo?.title}
                  onChange={(e) => handleNestedChange('seo', 'title', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SEO Description</label>
                <textarea
                  rows={3}
                  value={formData.seo?.description}
                  onChange={(e) => handleNestedChange('seo', 'description', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
