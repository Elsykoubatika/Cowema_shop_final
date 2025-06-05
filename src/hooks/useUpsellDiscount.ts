
import { useState } from 'react';
import { usePromotionStore } from './usePromotionStore';

type UpsellType = 'checkout_upsell' | 'post-purchase' | 'product-page';

export const useUpsellDiscount = () => {
  const { promotions } = usePromotionStore();
  const [appliedDiscounts, setAppliedDiscounts] = useState<Record<UpsellType, number>>({
    'checkout_upsell': 0,
    'post-purchase': 0,
    'product-page': 0
  });

  // Get active promotion discount rate
  const getActivePromoDiscount = (): number => {
    try {
      const now = new Date();
      const activePromos = promotions.filter(p => 
        p.isActive && new Date(p.expiryDate) > now
      );
      
      if (activePromos.length > 0) {
        return Math.max(...activePromos.map(p => p.discount));
      }
      
      return 0; // Default to 0 if no active promotions
    } catch (error) {
      console.error('Error getting active promo discount:', error);
      return 0; // Fallback to 0
    }
  };

  // Get upsell discount rate based on upsell type and other factors
  const getUpsellDiscount = (type: UpsellType = 'checkout_upsell'): number => {
    try {
      // If we've already calculated a discount for this type, return it
      if (appliedDiscounts[type] > 0) {
        return appliedDiscounts[type];
      }
      
      // Otherwise, calculate a new discount
      const baseDiscount = getActivePromoDiscount();
      let finalDiscount = baseDiscount;
      
      // Apply different logic based on upsell type
      switch (type) {
        case 'checkout_upsell':
          // Checkout upsells get +5% additional discount, but max 10% total
          finalDiscount = Math.min(baseDiscount + 5, 10);
          break;
          
        case 'post-purchase':
          // Post-purchase is mostly for notification on WhatsApp
          finalDiscount = baseDiscount + 5; // +5% from base
          break;
          
        case 'product-page':
          // Product page upsells use base discount
          finalDiscount = baseDiscount;
          break;
      }
      
      // Store the calculated discount for future reference
      setAppliedDiscounts(prev => ({
        ...prev,
        [type]: finalDiscount
      }));
      
      return finalDiscount;
    } catch (error) {
      console.error('Error calculating upsell discount:', error);
      return 5; // Fallback discount value for checkout upsell
    }
  };

  return {
    getUpsellDiscount,
    getActivePromoDiscount
  };
};
