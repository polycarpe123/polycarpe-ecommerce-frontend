import React from 'react';
import FashionSection from '../components/FashionSection';
import FeaturedProducts from '../components/FeaturedProducts';
import ProductCategories from '../components/ProductCategories';
import HeroBanner from '../components/HeroSection';
import ProductTabs from '../components/ProductTabs';

const Home: React.FC = () => {
  return (
    <>
      <HeroBanner />
      <ProductCategories />
      <FeaturedProducts />
      <FashionSection/>
      <ProductTabs />
    </>
  );
};

export default Home;
