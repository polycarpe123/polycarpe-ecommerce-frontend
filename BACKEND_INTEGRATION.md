# Backend Integration Guide

## 🎯 Integration Overview

This guide will help you integrate your existing Node.js/Express TypeScript backend with the React frontend.

## 📋 Prerequisites

1. ✅ Backend API endpoints ready
2. ✅ Frontend setup completed
3. ✅ Environment variables configured

## 🔧 Setup Instructions

### 1. Environment Configuration

Create a `.env` file in your root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your backend URL:

```env
VITE_API_URL=http://localhost:3001/api
VITE_NODE_ENV=development
```

### 2. Install Dependencies

```bash
npm install axios
```

### 3. Backend API Endpoints Required

Your backend should have these endpoints:

#### Authentication (`/api/auth`)
- `POST /auth/login` - User login
- `POST /auth/register` - User registration  
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update profile
- `POST /auth/forgot-password` - Forgot password
- `POST /auth/reset-password` - Reset password

#### Products (`/api/products`)
- `GET /products` - Get all products (with filters)
- `GET /products/:id` - Get single product
- `GET /products/slug/:slug` - Get product by slug
- `GET /products/featured` - Get featured products
- `GET /products/search` - Search products
- `GET /products/:id/related` - Get related products

#### Categories (`/api/categories`)
- `GET /categories` - Get all categories

#### Cart (`/api/cart`)
- `GET /cart` - Get user's cart
- `POST /cart/items` - Add item to cart
- `PUT /cart/items/:id` - Update cart item
- `DELETE /cart/items/:id` - Remove cart item
- `DELETE /cart` - Clear cart
- `GET /cart/count` - Get cart item count

## 🔄 Integration Steps

### Step 1: Update ProductDetail.tsx

Replace the hardcoded PRODUCTS object with API calls:

```tsx
// Before
const PRODUCTS: Record<string, any> = { ... };

// After
import { productService } from '../services/productService';
import { useApp } from '../contexts/AppContext';

const ProductDetail: React.FC = () => {
  const { addToCart } = useApp();
  const { name } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await productService.getProductBySlug(name || '');
        setProduct(productData);
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [name]);

  // Handle add to cart
  const handleAddToCart = async (quantity: number, color?: string, size?: string) => {
    try {
      await addToCart({
        productId: product.id,
        quantity,
        color,
        size,
      });
      // Show success message
    } catch (error) {
      // Show error message
    }
  };

  // Rest of your component...
};
```

### Step 2: Update FeaturedProducts.tsx

Replace mock data with API calls:

```tsx
import { productService } from '../services/productService';
import { useApp } from '../contexts/AppContext';

const FeaturedProducts: React.FC = () => {
  const { addToCart } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const featuredData = await productService.getFeaturedProducts(8);
        setProducts(featuredData);
      } catch (error) {
        console.error('Failed to load featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  // Rest of your component...
};
```

### Step 3: Update Header.tsx

Integrate authentication and cart:

```tsx
import { useApp } from '../contexts/AppContext';

const Navigation: React.FC = () => {
  const { 
    user, 
    isAuthenticated, 
    login, 
    logout, 
    getCartCount,
    cart 
  } = useApp();

  const cartCount = getCartCount();

  // Update SIGN IN button
  const handleSignIn = () => {
    if (isAuthenticated) {
      logout();
    } else {
      // Open auth modal
      setIsAuthOpen(true);
    }
  };

  // Update cart display
  const cartTotal = cart?.total || 0;

  // Rest of your component...
};
```

### Step 4: Update AuthModal.tsx

Connect with authentication service:

```tsx
import { useApp } from '../contexts/AppContext';

const AuthModal: React.FC = ({ isOpen, onClose }) => {
  const { login, register } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({ firstName, lastName, email, password });
      }
      onClose();
    } catch (error) {
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component...
};
```

### Step 5: Update CartModal.tsx

Connect with cart service:

```tsx
import { useApp } from '../contexts/AppContext';

const CartModal: React.FC = ({ isOpen, onClose }) => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal 
  } = useApp();

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      await updateQuantity(itemId, quantity);
    } catch (error) {
      // Show error message
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      // Show error message
    }
  };

  // Rest of your component...
};
```

## 🧪 Testing the Integration

### 1. Start Your Backend

```bash
cd your-backend-folder
npm run dev
```

### 2. Start Your Frontend

```bash
npm run dev
```

### 3. Test Features

- ✅ User registration/login
- ✅ Product browsing
- ✅ Add to cart
- ✅ Cart management
- ✅ Checkout process

## 🚨 Common Issues & Solutions

### CORS Issues

Add CORS middleware to your Express backend:

```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
```

### Authentication Token Issues

Ensure your backend accepts Bearer tokens:

```javascript
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // Verify token
  }
  next();
});
```

### API Response Format

Ensure your backend returns consistent JSON responses:

```javascript
// Success response
{
  "success": true,
  "data": { ... }
}

// Error response
{
  "success": false,
  "message": "Error message"
}
```

## 📝 Next Steps

1. **Test all API endpoints**
2. **Implement error handling**
3. **Add loading states**
4. **Implement payment integration**
5. **Add admin panel integration**

## 🎉 Integration Complete!

Once you've completed these steps, your frontend will be fully integrated with your backend API. Users can:

- Register and login
- Browse real products
- Add items to cart
- Manage their cart
- Complete checkout

For any issues, check the browser console and network tabs for API errors.
