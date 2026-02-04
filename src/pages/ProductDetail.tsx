import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Star, Share2, Truck, RefreshCw, Shield } from 'lucide-react';
import { productService, type Product } from '../services/productService';
import { useCart } from '../contexts/CartContext';
import AddToCartButton from '../components/AddToCartButton';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'specifications'>('description');
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const productData = await productService.getProduct(id);
        setProduct(productData);
        
        // Set default selections
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0].name);
        }
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0].name);
        }
        
        // Fetch related products
        try {
          const related = await productService.getRelatedProducts(id);
          setRelatedProducts(related);
        } catch (relatedError) {
          console.warn('Could not load related products:', relatedError);
          setRelatedProducts([]);
        }
        
      } catch (err) {
        setError('Failed to load product. Please try again later.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      // Create cart item with the structure expected by useCart
      const cartItem = {
        productId: product.id,
        quantity: quantity,
        color: selectedColor || undefined,
        size: selectedSize || undefined,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '/placeholder-image.jpg',
        category: product.category || 'General'
      };
      
      // Add to cart using the useCart hook (async)
      await addToCart(cartItem);
      
      console.log(`${product.name} added to cart!`);
      
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/checkout');
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    alert(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.shortDescription || product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  const isInStock = () => {
    if (!product) return false;
    if (product.stock === undefined) return true;
    return product.stock > 0;
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

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Product not found'}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <button onClick={() => navigate('/')} className="hover:text-blue-600">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/products')} className="hover:text-blue-600">Products</button>
          <span>/</span>
          <button onClick={() => navigate(`/category/${product.category}`)} className="hover:text-blue-600">
            {product.category}
          </button>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden relative">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleWishlist}
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Product Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-blue-600">${product.price}</span>
                {product.oldPrice && (
                  <span className="text-xl text-gray-500 line-through">${product.oldPrice}</span>
                )}
                {product.oldPrice && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                    {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-gray-600">({product.reviews || 0} reviews)</span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Write a review
              </button>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isInStock() ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`font-medium ${isInStock() ? 'text-green-600' : 'text-red-600'}`}>
                {isInStock() ? 'In Stock' : 'Out of Stock'}
              </span>
              {product.stock !== undefined && (
                <span className="text-gray-500">({product.stock} available)</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleShare}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-all ${
                        selectedColor === color.name
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${!color.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!color.inStock}
                    >
                      <div
                        className="w-5 h-5 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.hex }}
                      ></div>
                      <span className="text-sm">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.name}
                      onClick={() => setSelectedSize(size.name)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedSize === size.name
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${!size.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!size.inStock}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock || 99}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center border border-gray-300 rounded-lg px-3 py-2"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <AddToCartButton
                product={product}
                quantity={quantity}
                className="flex-1"
                showQuantity={false}
                onCartOpen={() => {
                  // Trigger cart modal open through global event
                  window.dispatchEvent(new CustomEvent('openCartModal'));
                }}
              />
              <button
                onClick={handleBuyNow}
                disabled={!isInStock()}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-200">
              <div className="text-center">
                <Truck className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Free Delivery</p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">30 Day Returns</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Secure Payment</p>
              </div>
            </div>

            {/* Product Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
                <ul className="space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-gray-600">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Offers */}
            {product.offers && product.offers.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Available Offers</h3>
                <div className="space-y-2">
                  {product.offers.map((offer, index) => (
                    <div key={index} className="bg-blue-50 p-3 rounded-lg">
                      <p className="font-medium text-blue-900">{offer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-12 bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['description', 'reviews', 'specifications'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <p>No reviews yet. Be the first to review this product!</p>
                  <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Write a Review
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-900">SKU:</span>
                    <span className="ml-2 text-gray-600">{product.sku}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Category:</span>
                    <span className="ml-2 text-gray-600">{product.category}</span>
                  </div>
                  {product.brand && (
                    <div>
                      <span className="font-medium text-gray-900">Brand:</span>
                      <span className="ml-2 text-gray-600">{product.brand}</span>
                    </div>
                  )}
                  {product.fabric && (
                    <div>
                      <span className="font-medium text-gray-900">Fabric:</span>
                      <span className="ml-2 text-gray-600">{product.fabric}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div>
                      <span className="font-medium text-gray-900">Weight:</span>
                      <span className="ml-2 text-gray-600">{product.weight}g</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div>
                      <span className="font-medium text-gray-900">Dimensions:</span>
                      <span className="ml-2 text-gray-600">
                        {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} cm
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                  className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{relatedProduct.name}</h3>
                    <p className="text-lg font-bold text-blue-600">${relatedProduct.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
