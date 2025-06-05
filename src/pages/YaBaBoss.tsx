
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import HeroBanner from '../components/ya-ba-boss/HeroBanner';
import BenefitsSection from '../components/ya-ba-boss/BenefitsSection';
import MembershipLevels from '../components/ya-ba-boss/MembershipLevels';
import FeaturedProducts from '../components/ya-ba-boss/FeaturedProducts';
import TestimonialsSection from '../components/ya-ba-boss/TestimonialsSection';
import FaqSection from '../components/ya-ba-boss/FaqSection';
import CallToAction from '../components/ya-ba-boss/CallToAction';
import { useCart } from '../hooks/useCart';
import { useHybridProducts } from '../hooks/useHybridProducts';

const YaBaBoss = () => {
  const { getCartItemsCount, handleAddToCart } = useCart();
  const { products } = useHybridProducts();

  // Filter for YaBaBoss products
  const yaBaBossProducts = products.filter(product => product.isYaBaBoss);

  const handleCartClick = () => {
    const cartButton = document.querySelector('[data-cart-toggle]') as HTMLElement;
    if (cartButton) {
      cartButton.click();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <Header cartItemsCount={getCartItemsCount()} onCartClick={handleCartClick} />
      
      <main className="flex-grow">
        <HeroBanner />
        <BenefitsSection />
        <MembershipLevels />
        <FeaturedProducts 
          products={yaBaBossProducts}
          handleAddToCart={handleAddToCart}
        />
        <TestimonialsSection />
        <FaqSection />
        <CallToAction />
      </main>
      
      <Footer />
      <Cart />
    </div>
  );
};

export default YaBaBoss;
