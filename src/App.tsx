// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BuyNow from './pages/Buy-Now';
import Elements from './pages/Elements';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CategoryPage from './pages/CategoryPage';
import Navigation from './components/layout/header';   
import './App.css'
import { AppProvider } from './contexts/AppContext';

import HeroBanner from './components/heroSection';
import ProductCategories from './components/productCategories';
import FeaturedProducts from './components/featuredProducts';
import FashionSection from './components/fashionSection';
import CategorySection from './components/fashionCategories';
import ProductTabs from './components/productTabs';
import Footer from './components/layout/footer';
import ProductDetail from './pages/ProductDetail';

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
  return (
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
              <Blog />
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
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App;
