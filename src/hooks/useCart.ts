
import { useUnifiedCart } from '../cart/components/CartProvider';
import { Product } from '../data/products';

// Hook de compatibilité pour maintenir l'interface existante
export const useCart = () => {
  const unifiedCart = useUnifiedCart();

  // Adapter les méthodes pour maintenir la compatibilité
  const handleAddToCart = (product: Product) => {
    // Convertir l'ID en string pour la cohérence
    const productWithStringId = {
      ...product,
      id: String(product.id)
    };
    unifiedCart.addItem(productWithStringId);
  };

  const handleRemoveFromCart = (productId: string | number) => {
    unifiedCart.removeItem(String(productId));
  };

  const getCartItemsCount = () => {
    return unifiedCart.totalItems;
  };

  const isInCart = (productId: string | number) => {
    return unifiedCart.isInCart(String(productId));
  };

  return {
    ...unifiedCart,
    handleAddToCart,
    handleRemoveFromCart,
    getCartItemsCount,
    isInCart,
    // Maintenir l'interface existante avec des adaptateurs
    items: unifiedCart.items,
    addItem: (product: Product) => {
      const productWithStringId = {
        ...product,
        id: String(product.id)
      };
      unifiedCart.addItem(productWithStringId);
    },
    removeItem: (productId: string | number) => unifiedCart.removeItem(String(productId)),
    updateQuantity: (productId: string | number, quantity: number) => 
      unifiedCart.updateQuantity(String(productId), quantity),
    clearCart: unifiedCart.clearCart,
    totalItems: unifiedCart.totalItems,
    totalAmount: unifiedCart.totalAmount
  };
};

// Type pour la compatibilité
export interface CartItem {
  id: string;
  title: string;
  name: string;
  price: number;
  promoPrice?: number;
  quantity: number;
  image?: string;
  category?: string;
  city?: string;
  loyaltyPoints?: number;
}
