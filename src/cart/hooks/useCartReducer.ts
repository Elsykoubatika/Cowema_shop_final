
import { CartState } from '../types/cart.types';
import { CartAction } from '../types/cartActions';

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_ITEMS':
      return {
        ...state,
        items: action.payload,
        lastUpdated: Date.now(),
        error: null
      };

    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex !== -1) {
        // Update existing item quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity
        };
        
        return {
          ...state,
          items: updatedItems,
          lastUpdated: Date.now(),
          error: null
        };
      } else {
        // Add new item
        return {
          ...state,
          items: [...state.items, action.payload],
          lastUpdated: Date.now(),
          error: null
        };
      }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        lastUpdated: Date.now(),
        error: null
      };

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload.id),
          lastUpdated: Date.now(),
          error: null
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        lastUpdated: Date.now(),
        error: null
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        appliedPromotion: null,
        deliveryInfo: null,
        lastUpdated: Date.now(),
        error: null
      };

    case 'SET_DELIVERY_INFO':
      return {
        ...state,
        deliveryInfo: action.payload,
        lastUpdated: Date.now()
      };

    case 'APPLY_PROMOTION':
      return {
        ...state,
        appliedPromotion: action.payload,
        lastUpdated: Date.now()
      };

    case 'REMOVE_PROMOTION':
      return {
        ...state,
        appliedPromotion: null,
        lastUpdated: Date.now()
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    default:
      return state;
  }
};
