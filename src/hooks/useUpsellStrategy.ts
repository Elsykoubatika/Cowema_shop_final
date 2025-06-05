
import { useState, useEffect, useMemo } from 'react';
import { Product } from '../data/products';
import { UnifiedCartItem } from '../cart/types/cart.types';
import { useAuthStore } from './useAuthStore';
import { useUpsellDiscount } from './useUpsellDiscount';
import { useProductRecommendations } from './useProductRecommendations';
import { getPostPurchaseUpsellMessage, isGoodUpsellCandidate } from '../utils/upsellHelpers';

export const useUpsellStrategy = () => {
  const [isCheckoutUpsellOpen, setIsCheckoutUpsellOpen] = useState(false);
  const [currentMainProduct, setCurrentMainProduct] = useState<Product | UnifiedCartItem | null>(null);
  const [hasShownPageUpsell, setHasShownPageUpsell] = useState(false);
  
  const { user } = useAuthStore();
  const { getUpsellDiscount } = useUpsellDiscount();
  const { 
    frequentlyBoughtProducts,
    recommendedUpsellProducts,
    generateRecommendations,
    getFrequentlyBoughtTogether,
    getCheckoutUpsellProducts
  } = useProductRecommendations();
  
  console.log('useUpsellStrategy state:', {
    isCheckoutUpsellOpen,
    hasMainProduct: !!currentMainProduct,
    hasShownPageUpsell,
    frequentlyBoughtCount: frequentlyBoughtProducts.length,
    recommendedCount: recommendedUpsellProducts.length
  });
  
  // Trigger checkout upsell modal
  const triggerCheckoutUpsell = (product: Product | UnifiedCartItem, allProducts: Product[]) => {
    console.log('Triggering checkout upsell for:', product.title || product.name);
    setCurrentMainProduct(product);
    generateRecommendations(product, allProducts);
    setIsCheckoutUpsellOpen(true);
  };
  
  // Close checkout upsell modal
  const closeCheckoutUpsell = () => {
    console.log('Closing checkout upsell');
    setIsCheckoutUpsellOpen(false);
  };
  
  // Trigger page upsell (based on user behavior)
  useEffect(() => {
    if (!hasShownPageUpsell) {
      const timer = setTimeout(() => {
        console.log('Page upsell timer triggered');
        setHasShownPageUpsell(true);
      }, 30000); // 30 seconds delay
      
      return () => clearTimeout(timer);
    }
  }, [hasShownPageUpsell]);

  // Memoized functions to prevent unnecessary re-renders
  const stableGetFrequentlyBoughtTogether = useMemo(() => getFrequentlyBoughtTogether, []);
  const stableGetCheckoutUpsellProducts = useMemo(() => getCheckoutUpsellProducts, []);
  
  const getPostPurchaseMessage = useMemo(() => {
    return (product: Product, customerName: string = '') => 
      getPostPurchaseUpsellMessage(product, getUpsellDiscount('post-purchase'), customerName || (user?.firstName || ''));
  }, [getUpsellDiscount, user]);
  
  return {
    isCheckoutUpsellOpen,
    currentMainProduct,
    hasShownPageUpsell,
    setHasShownPageUpsell,
    getUpsellDiscount,
    triggerCheckoutUpsell,
    closeCheckoutUpsell,
    getPostPurchaseUpsellMessage: getPostPurchaseMessage,
    isGoodUpsellCandidate,
    getFrequentlyBoughtTogether: stableGetFrequentlyBoughtTogether,
    getCheckoutUpsellProducts: stableGetCheckoutUpsellProducts,
    frequentlyBoughtProducts,
    recommendedUpsellProducts
  };
};
