
import { useCallback } from 'react';
import { UnifiedCartItem } from '../types/cart.types';

export const useCartUtilities = (items: UnifiedCartItem[]) => {
  const isInCart = useCallback((productId: string) => {
    return items.some(item => item.id === productId);
  }, [items]);

  const getItem = useCallback((productId: string) => {
    return items.find(item => item.id === productId);
  }, [items]);

  return {
    isInCart,
    getItem
  };
};
