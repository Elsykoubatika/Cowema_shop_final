
import { useMemo } from 'react';
import { UnifiedCartItem } from '../types/cart.types';
import { calculateCartTotal, calculateTotalQuantity } from '../utils/cartCalculations';
import { usePromotionStore } from '../../hooks/usePromotionStore';
import { useDeliveryFees } from '../../hooks/useDeliveryFees';

export const useCartCalculations = (
  items: UnifiedCartItem[],
  deliveryInfo: { city: string; neighborhood: string } | null | undefined,
  appliedPromotion: string | null | undefined
) => {
  const promotionStore = usePromotionStore();
  const { getDeliveryFee } = useDeliveryFees();

  const subtotal = useMemo(() => calculateCartTotal(items), [items]);
  const totalItems = useMemo(() => calculateTotalQuantity(items), [items]);
  
  const deliveryFee = useMemo(() => {
    if (!deliveryInfo) return 0;
    return getDeliveryFee(deliveryInfo.city, deliveryInfo.neighborhood);
  }, [deliveryInfo, getDeliveryFee]);

  const promotionDiscount = useMemo(() => {
    if (!appliedPromotion || !promotionStore) return 0;
    
    try {
      // Utiliser le hook Zustand correctement au lieu d'un appel synchrone
      const promotion = promotionStore.getActivePromotion(appliedPromotion);
      if (!promotion) return 0;
      
      let discount = 0;
      if (promotion.discountType === 'percentage') {
        discount = (subtotal * promotion.discount) / 100;
        if (promotion.maxDiscount) {
          discount = Math.min(discount, promotion.maxDiscount);
        }
      } else {
        discount = promotion.discount;
      }
      
      return discount;
    } catch (error) {
      console.error('Error calculating promotion discount:', error);
      return 0;
    }
  }, [appliedPromotion, subtotal, promotionStore]);

  const totalAmount = useMemo(() => {
    return Math.max(0, subtotal - promotionDiscount + deliveryFee);
  }, [subtotal, promotionDiscount, deliveryFee]);

  return {
    subtotal,
    totalItems,
    deliveryFee,
    promotionDiscount,
    totalAmount
  };
};
