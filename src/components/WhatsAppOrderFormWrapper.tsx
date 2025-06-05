
import React, { useCallback, useState } from 'react';
import OptimizedWhatsAppOrderForm from './forms/OptimizedWhatsAppOrderForm';
import CheckoutUpsellModal from './CheckoutUpsellModal';
import { Product, products } from '../data/products';
import { useUpsellStrategy } from '../hooks/useUpsellStrategy';
import { useAuthStore } from '../hooks/useAuthStore';
import { useReferralCode } from '../hooks/useReferralCode';

interface WhatsAppOrderFormWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  upsellProducts?: any[]; // For ProductModal compatibility
  cartItems?: any[]; // For CartOrderButton compatibility
}

const WhatsAppOrderFormWrapper: React.FC<WhatsAppOrderFormWrapperProps> = ({
  isOpen,
  onClose,
  product,
  upsellProducts = [],
  cartItems = []
}) => {
  const [isCheckoutUpsellOpen, setIsCheckoutUpsellOpen] = useState(false);
  const { triggerCheckoutUpsell, closeCheckoutUpsell } = useUpsellStrategy();

  const handleOrderComplete = useCallback((orderId: string) => {
    console.log('Order completed:', orderId);
    // Close the form
    onClose();
    
    // Optionally trigger upsell
    setIsCheckoutUpsellOpen(true);
  }, [onClose]);

  const handleAcceptUpsell = useCallback((upsellProduct: Product) => {
    console.log('Upsell accepted:', upsellProduct);
    closeCheckoutUpsell();
    setIsCheckoutUpsellOpen(false);
  }, [closeCheckoutUpsell]);

  const handleDeclineUpsell = useCallback(() => {
    console.log('Upsell declined');
    closeCheckoutUpsell();
    setIsCheckoutUpsellOpen(false);
  }, [closeCheckoutUpsell]);

  // Prepare items array with the single product or cart items
  const items = React.useMemo(() => {
    let allItems: any[] = [];

    // Add cart items if provided
    if (cartItems && cartItems.length > 0) {
      allItems = [...cartItems];
    }

    // Add main product if provided and not already in items
    if (product && !allItems.some(item => item.id === String(product.id))) {
      allItems.push({
        id: String(product.id),
        title: product.title || product.name,
        price: product.price,
        promoPrice: product.promoPrice || null,
        quantity: 1,
        image: Array.isArray(product.images) ? product.images[0] : product.images || '',
        category: product.category
      });
    }

    // Add upsell products if provided
    if (upsellProducts && upsellProducts.length > 0) {
      const upsellItems = upsellProducts.map(upsell => ({
        id: String(upsell.id || Math.random()),
        title: upsell.title || upsell.name,
        price: upsell.price,
        promoPrice: upsell.promoPrice || null,
        quantity: upsell.quantity || 1,
        image: Array.isArray(upsell.images) ? upsell.images[0] : upsell.image || upsell.images || '',
        category: upsell.category
      }));
      allItems = [...allItems, ...upsellItems];
    }

    return allItems;
  }, [product, cartItems, upsellProducts]);

  return (
    <>
      <OptimizedWhatsAppOrderForm
        isOpen={isOpen}
        onClose={onClose}
        items={items}
        onOrderComplete={handleOrderComplete}
      />

      {isCheckoutUpsellOpen && product && (
        <CheckoutUpsellModal
          isOpen={isCheckoutUpsellOpen}
          onClose={() => setIsCheckoutUpsellOpen(false)}
          onAccept={handleAcceptUpsell}
          onDecline={handleDeclineUpsell}
          mainProduct={product}
        />
      )}
    </>
  );
};

export default WhatsAppOrderFormWrapper;
