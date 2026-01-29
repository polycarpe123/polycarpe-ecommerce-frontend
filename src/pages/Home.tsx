import React from 'react';
import FashionSection from '../components/fashionSection';
import FeaturedProducts from '../components/featuredProducts';
import ProductCategories from '../components/productCategories';
import HeroBanner from '../components/heroSection';
import ProductTabs from '../components/productTabs';

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
