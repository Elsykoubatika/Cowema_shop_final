import { useState, useCallback, useMemo } from 'react';
import { Product, products } from '../../data/products';
import { useUpsellStrategy } from '../useUpsellStrategy';

export const useUpsellActions = (
  product: Product | null,
  setUpsellProduct: ((product: Product | null) => void) | null,
  setIsDirectOrderOpen: (isOpen: boolean) => void,
  setIsOrderFormOpen: (isOpen: boolean) => void,
  isDirectOrderOpen: boolean,
  isOrderFormOpen: boolean
) => {
  // Store internal state
  const [hasShownPageUpsellInternal, setHasShownPageUpsellInternal] = useState(false);
  const [pendingOrderType, setPendingOrderType] = useState<'whatsapp' | 'direct' | null>(null);
  
  const {
    isCheckoutUpsellOpen,
    triggerCheckoutUpsell,
    closeCheckoutUpsell,
    hasShownPageUpsell: strategyHasShownPageUpsell,
    setHasShownPageUpsell: strategySetHasShownPageUpsell
  } = useUpsellStrategy();

  // Stable page upsell state with proper memoization
  const hasShownPageUpsell = useMemo(() => {
    return strategyHasShownPageUpsell ?? hasShownPageUpsellInternal;
  }, [strategyHasShownPageUpsell, hasShownPageUpsellInternal]);
  
  const setHasShownPageUpsell = useMemo(() => {
    return strategySetHasShownPageUpsell ?? setHasShownPageUpsellInternal;
  }, [strategySetHasShownPageUpsell]);

  // Stable WhatsApp buy handler - DÉCLENCHE L'UPSELL D'ABORD
  const handleWhatsAppBuy = useCallback(() => {
    console.log("handleWhatsAppBuy called - triggering upsell first");
    if (product?.id) {
      // Stocker le type de commande en attente
      setPendingOrderType('whatsapp');
      // Déclencher l'upsell AVANT d'ouvrir le formulaire - call with product and products
      triggerCheckoutUpsell(product, products);
    } else {
      // Si aucun produit n'est disponible, ouvrir directement le formulaire
      setIsOrderFormOpen(true);
    }
  }, [product?.id, triggerCheckoutUpsell]);

  // Stable direct order handler - DÉCLENCHE L'UPSELL D'ABORD
  const handleDirectOrder = useCallback(() => {
    console.log("handleDirectOrder called - triggering upsell first");
    if (product?.id) {
      // Stocker le type de commande en attente
      setPendingOrderType('direct');
      // Déclencher l'upsell AVANT d'ouvrir le formulaire - call with product and products
      triggerCheckoutUpsell(product, products);
    } else {
      // Si aucun produit n'est disponible, ouvrir directement le formulaire
      setIsDirectOrderOpen(true);
    }
  }, [product?.id, triggerCheckoutUpsell]);

  // Stable accept upsell handler
  const handleAcceptUpsell = useCallback((productUpsell: Product) => {
    console.log("Accepting upsell product:", productUpsell);
    // Ajouter le produit upsell
    if (setUpsellProduct) {
      setUpsellProduct(productUpsell);
    }
    // Procéder à la commande avec le type en attente
    proceedToCheckout();
  }, [setUpsellProduct]);
  
  // Stable decline upsell handler
  const handleDeclineUpsell = useCallback(() => {
    console.log("Declining upsell");
    // Ne pas ajouter de produit upsell lorsqu'on refuse
    if (setUpsellProduct) {
      setUpsellProduct(null);
    }
    // Procéder à la commande avec le type en attente
    proceedToCheckout();
  }, [setUpsellProduct]);
  
  // Stable proceed to checkout handler
  const proceedToCheckout = useCallback(() => {
    console.log("Proceeding to checkout with pending order type:", pendingOrderType);
    // D'abord fermer le modal d'upsell
    closeCheckoutUpsell();
    
    // Ouvrir le bon formulaire selon le type en attente
    setTimeout(() => {
      if (pendingOrderType === 'whatsapp') {
        setIsOrderFormOpen(true);
      } else if (pendingOrderType === 'direct') {
        setIsDirectOrderOpen(true);
      }
      // Réinitialiser le type en attente
      setPendingOrderType(null);
    }, 100);
  }, [closeCheckoutUpsell, pendingOrderType, setIsOrderFormOpen, setIsDirectOrderOpen]);

  // Memoize the return object with stable dependencies
  return useMemo(() => ({
    isCheckoutUpsellOpen,
    hasShownPageUpsell,
    setHasShownPageUpsell,
    handleWhatsAppBuy,
    handleDirectOrder,
    handleAcceptUpsell,
    handleDeclineUpsell,
    closeCheckoutUpsell,
    triggerCheckoutUpsell
  }), [
    isCheckoutUpsellOpen,
    hasShownPageUpsell,
    setHasShownPageUpsell,
    handleWhatsAppBuy,
    handleDirectOrder,
    handleAcceptUpsell,
    handleDeclineUpsell,
    closeCheckoutUpsell,
    triggerCheckoutUpsell
  ]);
};
