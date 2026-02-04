import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from '../contexts/WishlistContext';
import { productService, type Product } from '../services/productService';
import { ProductSkeleton } from './SkeletonLoader';

interface FP { 
  id: string | number;
  name: string;
  category: string;
  price: string;
  oldPrice?: string;
  image: string;
  rating: number;
  reviews: number;
  featured?: boolean;
}

const FeaturedProducts: React.FC = () => {
  const navigate = useNavigate();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [products, setProducts] = useState<FP[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const response = await productService.getProducts({ featured: true, limit: 8 });
      const featuredProducts = response.products.map((product: Product): FP => ({
        id: typeof product.id === 'string' ? product.id : String(product.id), // Keep as string
        name: product.name,
        category: product.category || 'Uncategorized',
        price: `$${product.price}`,
        oldPrice: product.oldPrice ? `$${product.oldPrice}` : undefined,
        image: product.images?.[0] || `https://picsum.photos/300/300?random=${product.id}`,
        rating: product.rating || 0,
        reviews: product.reviews || 0,
        featured: product.featured || false
      }));
      setProducts(featuredProducts);
    } catch (error) {
      console.error('Error loading featured products:', error);
      // Fallback to sample data if everything fails
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const toggle = (product: FP) => {
    const productId = typeof product.id === 'string' ? Number(product.id) : product.id;
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      });
    }
  };

  if (loading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ProductSkeleton count={8} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium products designed to enhance your lifestyle
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <button
                  onClick={() => toggle(p)}
                  aria-label="Wishlist"
                  className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white z-10"
                >
                  <span className={`text-lg ${isInWishlist(typeof p.id === 'string' ? Number(p.id) : p.id) ? 'text-red-500' : 'text-gray-400'}`}>
                    ♥
                  </span>
                </button>
                <img src={p.image} alt={p.name} className="w-full h-48 object-cover" />
              </div>
              <div className="p-4 cursor-pointer text-gray-900" onClick={() => navigate(`/products/${p.id}`)}>
                <p className="text-sm text-gray-500 mb-1">{p.category}</p>
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2" title={p.name}>{p.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded text-sm">
                    <span className="text-yellow-500">★</span>
                    <span>{p.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({p.reviews})</span>
                </div>
                <p className="font-bold text-gray-900">{p.price}</p>
                {p.oldPrice && (
                  <p className="text-sm text-gray-500 line-through">{p.oldPrice}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured products available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts;
