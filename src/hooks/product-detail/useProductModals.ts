
import { useState, useEffect } from 'react';
import { Product } from '../../data/products';

export const useProductModals = (
  product: Product | null, 
  initialHasShownPageUpsell: boolean | null, 
  initialSetHasShownPageUpsell: ((value: boolean) => void) | null
) => {
  // Initialize local state
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [isDirectOrderOpen, setIsDirectOrderOpen] = useState(false);
  const [showTimedPopup, setShowTimedPopup] = useState(false);
  const [upsellProduct, setUpsellProduct] = useState<Product | null>(null);
  const [localHasShownPageUpsell, setLocalHasShownPageUpsell] = useState(false);

  // Use provided values or local state
  const hasShownPageUpsell = initialHasShownPageUpsell !== null ? initialHasShownPageUpsell : localHasShownPageUpsell;
  const setHasShownPageUpsell = initialSetHasShownPageUpsell || setLocalHasShownPageUpsell;

  // Show timed popup after 20 seconds if user hasn't seen it yet
  useEffect(() => {
    if (product && !hasShownPageUpsell) {
      const timer = setTimeout(() => {
        setShowTimedPopup(true);
        setHasShownPageUpsell(true);
      }, 20000); // 20 seconds
      
      return () => clearTimeout(timer);
    }
  }, [product, hasShownPageUpsell, setHasShownPageUpsell]);

  return {
    isOrderFormOpen,
    setIsOrderFormOpen,
    isDirectOrderOpen,
    setIsDirectOrderOpen,
    showTimedPopup,
    setShowTimedPopup,
    upsellProduct,
    setUpsellProduct,
    hasShownPageUpsell,
    setHasShownPageUpsell
  };
};
