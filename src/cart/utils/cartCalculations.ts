
import { UnifiedCartItem } from '../types/cart.types';

export const calculateItemTotal = (item: UnifiedCartItem): number => {
  const effectivePrice = (item.promoPrice && item.promoPrice > 0) ? item.promoPrice : item.price;
  return effectivePrice * item.quantity;
};

export const calculateCartTotal = (items: UnifiedCartItem[]): number => {
  return items.reduce((total, item) => total + calculateItemTotal(item), 0);
};

export const calculateTotalQuantity = (items: UnifiedCartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

export const getEffectivePrice = (item: UnifiedCartItem): number => {
  return (item.promoPrice && item.promoPrice > 0) ? item.promoPrice : item.price;
};

export const hasDiscount = (item: UnifiedCartItem): boolean => {
  return Boolean(item.promoPrice && item.promoPrice > 0 && item.promoPrice < item.price);
};

export const calculateSavings = (item: UnifiedCartItem): number => {
  if (!hasDiscount(item)) return 0;
  return (item.price - (item.promoPrice || 0)) * item.quantity;
};

export const calculateTotalSavings = (items: UnifiedCartItem[]): number => {
  return items.reduce((total, item) => total + calculateSavings(item), 0);
};
