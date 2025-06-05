
import React, { createContext, useContext, useReducer, useMemo, useState } from 'react';
import { CartState, CartContextType } from '../types/cart.types';
import { cartReducer } from '../hooks/useCartReducer';
import { useCartPersistence } from '../hooks/useCartPersistence';
import { useCartActions } from '../hooks/useCartActions';
import { useCartCalculations } from '../hooks/useCartCalculations';
import { useCartUtilities } from '../hooks/useCartUtilities';

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
}

const initialCartState: CartState = {
  items: [],
  isLoading: false,
  error: null,
  lastUpdated: Date.now(),
  deliveryInfo: null,
  appliedPromotion: null
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  console.log('CartProvider rendering...');
  
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const [isCartVisible, setIsCartVisible] = useState(false);

  // Setup persistence
  useCartPersistence(state.items, (items) => {
    dispatch({ type: 'SET_ITEMS', payload: items });
  });

  // Calculations
  const {
    subtotal,
    totalItems,
    deliveryFee,
    promotionDiscount,
    totalAmount
  } = useCartCalculations(state.items, state.deliveryInfo, state.appliedPromotion);

  // Actions
  const {
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setDeliveryInfo,
    applyPromotion,
    removePromotion
  } = useCartActions(dispatch, state.items, subtotal);

  // Utilities
  const { isInCart, getItem } = useCartUtilities(state.items);

  const toggleCartVisibility = () => {
    setIsCartVisible(prev => !prev);
  };

  // Context value - note that applyPromotion is async and returns Promise<boolean>
  const contextValue: CartContextType = useMemo(() => ({
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setDeliveryInfo,
    applyPromotion, // This is async and returns Promise<boolean>
    removePromotion,
    totalItems,
    subtotal,
    deliveryFee,
    promotionDiscount,
    totalAmount,
    isInCart,
    getItem,
    toggleCartVisibility,
    isCartVisible
  }), [
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setDeliveryInfo,
    applyPromotion,
    removePromotion,
    totalItems,
    subtotal,
    deliveryFee,
    promotionDiscount,
    totalAmount,
    isInCart,
    getItem,
    isCartVisible
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useUnifiedCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useUnifiedCart must be used within a CartProvider');
  }
  return context;
};
