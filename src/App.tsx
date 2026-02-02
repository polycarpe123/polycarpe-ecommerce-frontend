// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import About from './pages/About';
import Contact from './pages/Contact';
import Shop from './pages/Shop';
import Blog from './pages/Blog';
import BuyNow from './pages/Buy-Now';
import Elements from './pages/Elements';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CategoryPage from './pages/CategoryPage';
import Navigation from './components/layout/header';   
import './App.css'
import { AppProvider } from './contexts/AppContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import { initializeSampleData } from './data/sampleData';

import HeroSection from './components/HeroSection';
import ProductCategories from './components/ProductCategories';
import FeaturedProducts from './components/FeaturedProducts';
import FashionSection from './components/FashionSection';
import FashionCategories from './components/fashionCategories';
import ProductTabs from './components/ProductTabs';
import Footer from './components/layout/footer';
import ProductDetail from './pages/ProductDetail';
import ProductList from './pages/ProductList';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProductsDashboard from './pages/ProductsDashboard';
import CategoriesDashboard from './pages/CategoriesDashboard';
import OrdersDashboard from './pages/OrdersDashboard';
import AdminLayout from './pages/admin/AdminLayout';
import AdminCategoryManager from './components/admin/AdminCategoryManager';
import AdminDashboard from './pages/admin/Dashboard/AdminDashboard';
import AdminProducts from './pages/admin/Dashboard/AdminProducts';
import AdminOrders from './pages/admin/Dashboard/AdminOrders';
import AdminCustomers from './pages/admin/Dashboard/AdminCustomers';
import AdminAnalytics from './pages/admin/Dashboard/AdminAnalytics';
import AdminSettings from './pages/admin/Dashboard/AdminSettings';
import AddProduct from './pages/admin/Dashboard/AddProduct';

// Initialize sample data
initializeSampleData();

// Layout component for pages that need the full structure
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Navigation />
    <main>
      {children}
    </main>
    <Footer />
  </>
);

// Home page with all components
const HomePage: React.FC = () => (
  <>
    <HeroSection />
    <ProductCategories />
    <FeaturedProducts />
    <FashionSection />
    <FashionCategories />
    <ProductTabs />
  </>
);

function App() {
  console.log('App component rendering');
  return (
    <ErrorBoundary>
      <WishlistProvider>
        <AuthProvider>
          <CartProvider>
            <AppProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={
                    <MainLayout>
                      <HomePage />
                    </MainLayout>
                  } />
                  <Route path="/about" element={
                    <MainLayout>
                      <About />
                    </MainLayout>
                  } />
                  <Route path="/contact" element={
                    <MainLayout>
                      <Contact />
                    </MainLayout>
                  } />
                  <Route path="/blog" element={
                    <MainLayout>
                      <Blog />
                    </MainLayout>
                  } />
                  <Route path="/shop" element={
                    <MainLayout>
                      <Shop />
                    </MainLayout>
                  } />
                  <Route path="/products" element={
                    <MainLayout>
                      <ProductList />
                    </MainLayout>
                  } />
                  <Route path="/pages" element={
                    <MainLayout>
                      <About />
                    </MainLayout>
                  } />
                  <Route path="/buy-now" element={
                    <MainLayout>
                      <BuyNow />
                    </MainLayout>
                  } />
                  <Route path="/elements" element={
                    <MainLayout>
                      <Elements />
                    </MainLayout>
                  } />
                  <Route path="/cart" element={
                    <MainLayout>
                      <Cart />
                    </MainLayout>
                  } />
                  <Route path="/checkout" element={
                    <MainLayout>
                      <Checkout />
                    </MainLayout>
                  } />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/product-category/:categoryName" element={
                    <MainLayout>
                      <CategoryPage />
                    </MainLayout>
                  } />
                  <Route path="/product/:name" element={
                    <MainLayout>
                      <ProductDetail />
                    </MainLayout>
                  } />
                  <Route path="/products/:id" element={
                    <MainLayout>
                      <ProductDetail />
                    </MainLayout>
                  } />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route path="products" element={<ProductsDashboard />} />
                    <Route path="products/new" element={<AddProduct />} />
                    <Route path="categories" element={<CategoriesDashboard />} />
                    <Route path="category-manager" element={<AdminCategoryManager />} />
                    <Route path="orders" element={<OrdersDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="products-old" element={<AdminProducts />} />
                    <Route path="orders-old" element={<AdminOrders />} />
                    <Route path="customers" element={<AdminCustomers />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </AppProvider>
          </CartProvider>
        </AuthProvider>
      </WishlistProvider>
    </ErrorBoundary>
  )
}

export default App;
