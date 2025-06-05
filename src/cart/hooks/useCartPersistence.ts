import { useEffect, useCallback, useRef } from 'react';
import { UnifiedCartItem } from '../types/cart.types';
import { sanitizeCartData } from '../utils/cartConversions';

const CART_STORAGE_KEY = 'cowema-unified-cart';
const LEGACY_CART_KEY = 'cowema_cart'; // Ancien clé à nettoyer
const MAX_STORAGE_ATTEMPTS = 3;

export const useCartPersistence = (
  items: UnifiedCartItem[],
  setItems: (items: UnifiedCartItem[]) => void
) => {
  const hasLoadedRef = useRef(false);
  const lastSavedItemsRef = useRef<string>('');

  // Load cart from localStorage on mount - une seule fois
  const loadCart = useCallback(() => {
    if (hasLoadedRef.current) return;
    
    try {
      // Nettoyer l'ancien stockage s'il existe
      const legacyCart = localStorage.getItem(LEGACY_CART_KEY);
      if (legacyCart) {
        console.log('Cleaning up legacy cart storage...');
        localStorage.removeItem(LEGACY_CART_KEY);
      }

      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        const sanitized = sanitizeCartData(parsed);
        setItems(sanitized);
        console.log('Cart loaded from localStorage:', sanitized.length, 'items');
        lastSavedItemsRef.current = JSON.stringify(sanitized);
      }
      hasLoadedRef.current = true;
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(LEGACY_CART_KEY);
      hasLoadedRef.current = true;
    }
  }, [setItems]);

  // Save cart to localStorage with retry mechanism - seulement si changé
  const saveCart = useCallback((cartItems: UnifiedCartItem[]) => {
    const currentItemsString = JSON.stringify(cartItems);
    
    // Ne sauvegarder que si les items ont vraiment changé
    if (currentItemsString === lastSavedItemsRef.current) {
      return;
    }

    let attempts = 0;
    const trySave = () => {
      try {
        localStorage.setItem(CART_STORAGE_KEY, currentItemsString);
        console.log('Cart saved to localStorage:', cartItems.length, 'items');
        lastSavedItemsRef.current = currentItemsString;
        return true;
      } catch (error) {
        attempts++;
        console.error(`Error saving cart (attempt ${attempts}):`, error);
        
        if (attempts < MAX_STORAGE_ATTEMPTS) {
          // Try to free up space
          localStorage.removeItem(CART_STORAGE_KEY);
          return trySave();
        }
        return false;
      }
    };
    
    trySave();
  }, []);

  // Auto-save when items change - seulement après le premier chargement
  useEffect(() => {
    if (!hasLoadedRef.current) return;
    
    // Sauvegarder seulement si on a des items ou si on passe de quelque chose à vide
    if (items.length > 0 || lastSavedItemsRef.current !== '[]') {
      saveCart(items);
    }
  }, [items, saveCart]);

  // Load cart on mount - une seule fois
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return { loadCart, saveCart };
};
