
import { useState, useEffect } from 'react';
import { Product } from '../data/products';
import { CartItem } from './useCart';

export const useFlashOffer = (productsArray?: Product[] | CartItem[]) => {
  const [isFlashOfferOpen, setIsFlashOfferOpen] = useState(false);
  const [hasSeenOffer, setHasSeenOffer] = useState(false);
  const [flashProduct, setFlashProduct] = useState<Product | null>(null);
  
  // Function to select a random product for the flash offer
  const selectRandomFlashProduct = () => {
    const products = productsArray || [];
    if (!products || products.length === 0) return null;
    
    // First try to find YaBaBoss products
    const yaBaBossProducts = products.filter(product => 'isYaBaBoss' in product && product.isYaBaBoss);
    
    if (yaBaBossProducts.length > 0) {
      // Prioritize YA BA BOSS products
      const randomIndex = Math.floor(Math.random() * yaBaBossProducts.length);
      return yaBaBossProducts[randomIndex];
    } else if (products.length > 0) {
      // Fall back to any product if no YA BA BOSS products
      const randomIndex = Math.floor(Math.random() * products.length);
      return products[randomIndex];
    }
    
    return null;
  };
  
  // Initialize the flash offer product
  useEffect(() => {
    if (productsArray && productsArray.length && !flashProduct) {
      setFlashProduct(selectRandomFlashProduct() as Product);
    }
  }, [productsArray, flashProduct]);
  
  // Automatically show the flash offer after a delay - disabled for now to allow user to control it
  /*useEffect(() => {
    if (flashProduct && !hasSeenOffer) {
      const timer = setTimeout(() => {
        setIsFlashOfferOpen(true);
        setHasSeenOffer(true);
      }, 15000); // Show after 15 seconds
      
      return () => clearTimeout(timer);
    }
  }, [flashProduct, hasSeenOffer]);*/
  
  const handleOpenFlashModal = () => {
    // Make sure this actually opens the flash offer modal
    if (flashProduct) {
      setIsFlashOfferOpen(true);
    }
  };
  
  const handleCloseFlashModal = () => setIsFlashOfferOpen(false);
  
  return {
    flashProduct,
    isFlashModalOpen: isFlashOfferOpen,
    handleOpenFlashModal,
    handleCloseFlashModal
  };
};
