
import { useState, useEffect } from 'react';
import { usePromotionStore } from './usePromotionStore';
import { toast } from 'sonner';

export const useActivePromotions = () => {
  const { promotions, cleanExpiredPromotions, setActivePromotion, activePromotion } = usePromotionStore();
  const [isLoading, setIsLoading] = useState(false);

  // Auto-activate the best promotion
  useEffect(() => {
    const activateBestPromotion = () => {
      cleanExpiredPromotions();
      
      const validPromotions = promotions.filter(promo => 
        promo.isActive && new Date(promo.expiryDate) > new Date()
      );

      if (validPromotions.length > 0) {
        // Sort by discount amount (highest first)
        const bestPromotion = validPromotions.sort((a, b) => {
          if (a.discountType === 'percentage' && b.discountType === 'percentage') {
            return b.discount - a.discount;
          }
          if (a.discountType === 'fixed' && b.discountType === 'fixed') {
            return b.discount - a.discount;
          }
          // Prefer percentage discounts for mixed types
          if (a.discountType === 'percentage') return -1;
          if (b.discountType === 'percentage') return 1;
          return 0;
        })[0];

        if (!activePromotion || activePromotion.id !== bestPromotion.id) {
          setActivePromotion(bestPromotion);
          
          // Show promotion notification
          const discountText = bestPromotion.discountType === 'percentage' 
            ? `${bestPromotion.discount}%` 
            : `${bestPromotion.discount} FCFA`;
            
          toast.success(`🎉 Promotion active: ${discountText} de réduction!`, {
            description: `Code: ${bestPromotion.code} - ${bestPromotion.description}`,
            duration: 8000,
          });
        }
      } else if (activePromotion) {
        setActivePromotion(null);
      }
    };

    activateBestPromotion();
    
    // Check every minute for expired promotions
    const interval = setInterval(activateBestPromotion, 60000);
    
    return () => clearInterval(interval);
  }, [promotions, activePromotion, setActivePromotion, cleanExpiredPromotions]);

  const applyPromoCode = (code: string, orderTotal: number) => {
    const promotion = promotions.find(p => 
      p.code.toUpperCase() === code.toUpperCase() && 
      p.isActive && 
      new Date(p.expiryDate) > new Date()
    );

    if (!promotion) {
      return { success: false, message: 'Code promo invalide ou expiré' };
    }

    if (orderTotal < promotion.minPurchaseAmount) {
      return { 
        success: false, 
        message: `Montant minimum requis: ${promotion.minPurchaseAmount} FCFA` 
      };
    }

    let discount = 0;
    if (promotion.discountType === 'percentage') {
      discount = (orderTotal * promotion.discount) / 100;
    } else {
      discount = promotion.discount;
    }

    // Ensure discount doesn't exceed order total
    discount = Math.min(discount, orderTotal);

    return {
      success: true,
      discount,
      promotion,
      newTotal: orderTotal - discount
    };
  };

  const getActivePromotionForTarget = (target: 'all' | 'ya-ba-boss') => {
    if (!activePromotion) return null;
    
    if (activePromotion.target === target || activePromotion.target === 'all') {
      return activePromotion;
    }
    
    return null;
  };

  return {
    promotions,
    activePromotion,
    isLoading,
    applyPromoCode,
    getActivePromotionForTarget,
    cleanExpiredPromotions
  };
};
