import React from 'react';
import FashionSection from '../components/FashionSection';
import FeaturedProducts from '../components/FeaturedProducts';
import ProductCategories from '../components/ProductCategories';
import HeroSection from '../components/HeroSection';
import ProductTabs from '../components/ProductTabs';

const Home: React.FC = () => {
  return (
    <>
      <HeroSection />
      <ProductCategories />
      <FeaturedProducts />
      <FashionSection/>
      <ProductTabs />
    </>
  );
};

export default Home;
