
import React, { useMemo } from 'react';
import { Product } from '../../data/products';
import OptimizedWhatsAppOrderForm from '../forms/OptimizedWhatsAppOrderForm';
import OptimizedDirectOrderForm from '../forms/OptimizedDirectOrderForm';
import CheckoutUpsellModal from '../CheckoutUpsellModal';

interface ProductModalsProps {
  product: Product;
  isOrderFormOpen: boolean;
  isDirectOrderOpen: boolean;
  showTimedPopup: boolean;
  isCheckoutUpsellOpen: boolean;
  orderAction: 'whatsapp' | 'direct' | null;
  setIsOrderFormOpen: (open: boolean) => void;
  setIsDirectOrderOpen: (open: boolean) => void;
  setShowTimedPopup: (show: boolean) => void;
  closeCheckoutUpsell: () => void;
  handleAcceptUpsell: (product: Product) => void;
  handleDeclineUpsell: () => void;
  handleAddToCart: (product: Product) => void;
  handleOrderComplete: (orderId: string) => void;
  getAllOrderItems: () => any[];
}

const ProductModals: React.FC<ProductModalsProps> = ({
  product,
  isOrderFormOpen,
  isDirectOrderOpen,
  showTimedPopup,
  isCheckoutUpsellOpen,
  orderAction,
  setIsOrderFormOpen,
  setIsDirectOrderOpen,
  setShowTimedPopup,
  closeCheckoutUpsell,
  handleAcceptUpsell,
  handleDeclineUpsell,
  handleAddToCart,
  handleOrderComplete,
  getAllOrderItems
}) => {
  // Create a stable reference for order items to prevent unnecessary re-renders
  const orderItems = useMemo(() => {
    // Only recalculate when modals are actually open
    if (!isOrderFormOpen && !isDirectOrderOpen) {
      return [];
    }
    
    const items = getAllOrderItems();
    console.log('ProductModals - Order items calculated:', items.length);
    return items;
  }, [isOrderFormOpen, isDirectOrderOpen, getAllOrderItems]);
  
  console.log('ProductModals render state:', {
    isOrderFormOpen,
    isDirectOrderOpen,
    isCheckoutUpsellOpen,
    showTimedPopup,
    orderAction,
    orderItemsCount: orderItems.length
  });

  return (
    <>
      {isOrderFormOpen && (
        <OptimizedWhatsAppOrderForm
          isOpen={isOrderFormOpen}
          onClose={() => setIsOrderFormOpen(false)}
          items={orderItems}
          onOrderComplete={handleOrderComplete}
        />
      )}

      {isDirectOrderOpen && (
        <OptimizedDirectOrderForm
          isOpen={isDirectOrderOpen}
          onClose={() => setIsDirectOrderOpen(false)}
          items={orderItems}
          onOrderComplete={handleOrderComplete}
        />
      )}

      {isCheckoutUpsellOpen && (
        <CheckoutUpsellModal
          isOpen={isCheckoutUpsellOpen}
          onClose={closeCheckoutUpsell}
          onAccept={handleAcceptUpsell}
          onDecline={handleDeclineUpsell}
          mainProduct={product}
        />
      )}
    </>
  );
};

export default React.memo(ProductModals);
