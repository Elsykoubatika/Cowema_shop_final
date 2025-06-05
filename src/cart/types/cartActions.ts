
export type CartAction =
  | { type: 'SET_ITEMS'; payload: import('./cart.types').UnifiedCartItem[] }
  | { type: 'ADD_ITEM'; payload: import('./cart.types').UnifiedCartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DELIVERY_INFO'; payload: { city: string; neighborhood: string } }
  | { type: 'APPLY_PROMOTION'; payload: string }
  | { type: 'REMOVE_PROMOTION' };
