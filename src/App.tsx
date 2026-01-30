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
import ErrorBoundary from './components/ErrorBoundary';

import HeroBanner from './components/heroSection';
import ProductCategories from './components/productCategories';
import FeaturedProducts from './components/featuredProducts';
import FashionSection from './components/fashionSection';
import CategorySection from './components/fashionCategories';
import ProductTabs from './components/productTabs';
import Footer from './components/layout/footer';
import ProductDetail from './pages/ProductDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

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
    <HeroBanner />
    <ProductCategories />
    <FeaturedProducts />
    <FashionSection />
    <CategorySection />
    <ProductTabs />
  </>
);

function App() {
  console.log('App component rendering');
  return (
    <ErrorBoundary>
      <WishlistProvider>
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
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/customers" element={<AdminCustomers />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </WishlistProvider>
    </ErrorBoundary>
  )
}

export default App;
