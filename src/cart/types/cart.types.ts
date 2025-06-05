export interface UnifiedCartItem {
  id: string;
  productId: string;
  title: string;
  name: string;
  price: number;
  promoPrice?: number;
  quantity: number;
  image: string;
  category?: string;
  stock: number;
  metadata?: {
    isYaBaBoss?: boolean;
    isFlashOffer?: boolean;
    supplier?: string;
    location?: string;
  };
}

export interface DeliveryInfo {
  city: string;
  neighborhood: string;
}

export interface CartState {
  items: UnifiedCartItem[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number;
  deliveryInfo?: DeliveryInfo | null;
  appliedPromotion?: string | null;
}

export interface CartContextType extends CartState {
  addItem: (product: AddToCartProduct) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setDeliveryInfo: (city: string, neighborhood: string) => void;
  applyPromotion: (promoCode: string) => Promise<boolean>;
  removePromotion: () => void;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  promotionDiscount: number;
  totalAmount: number;
  isInCart: (productId: string) => boolean;
  getItem: (productId: string) => UnifiedCartItem | undefined;
  toggleCartVisibility: () => void;
  isCartVisible: boolean;
}

export interface AddToCartProduct {
  id: string | number;
  title?: string;
  name?: string;
  price: number | string;
  promoPrice?: number | string;
  images?: string[];
  image?: string;
  category?: string;
  stock?: number;
  isYaBaBoss?: boolean;
  isFlashOffer?: boolean;
  supplier?: string;
  location?: string;
}
