
import { useCallback } from 'react';
import { useToast } from '../../hooks/use-toast';

export interface CartError {
  code: string;
  message: string;
  details?: any;
  severity: 'low' | 'medium' | 'high';
}

export const useCartErrorHandler = () => {
  const { toast } = useToast();

  const handleCartError = useCallback((error: any, context?: string) => {
    console.error('Cart error occurred:', error, 'Context:', context);

    let cartError: CartError;

    // Gestion spécifique des erreurs de panier
    if (error?.code === 'STOCK_INSUFFICIENT') {
      cartError = {
        code: 'STOCK_INSUFFICIENT',
        message: 'Stock insuffisant pour cette quantité',
        severity: 'medium'
      };
    } else if (error?.code === 'INVALID_PRODUCT') {
      cartError = {
        code: 'INVALID_PRODUCT',
        message: 'Produit invalide ou introuvable',
        severity: 'high'
      };
    } else if (error?.code === 'PROMO_EXPIRED') {
      cartError = {
        code: 'PROMO_EXPIRED',
        message: 'Ce code promo a expiré',
        severity: 'medium'
      };
    } else if (error?.code === 'DELIVERY_UNAVAILABLE') {
      cartError = {
        code: 'DELIVERY_UNAVAILABLE',
        message: 'Livraison non disponible dans cette zone',
        severity: 'medium'
      };
    } else if (error?.name === 'QuotaExceededError') {
      cartError = {
        code: 'STORAGE_FULL',
        message: 'Espace de stockage insuffisant. Veuillez vider votre cache.',
        severity: 'high'
      };
    } else if (error?.message?.includes('JSON')) {
      cartError = {
        code: 'CART_CORRUPTED',
        message: 'Données du panier corrompues. Le panier va être réinitialisé.',
        severity: 'high'
      };
    } else {
      cartError = {
        code: 'CART_UNKNOWN_ERROR',
        message: error?.message || 'Erreur inattendue du panier',
        details: error,
        severity: 'medium'
      };
    }

    // Ajouter le contexte si fourni
    if (context) {
      cartError.message = `${context}: ${cartError.message}`;
    }

    // Afficher l'erreur selon la sévérité
    switch (cartError.severity) {
      case 'high':
        toast({
          variant: "destructive",
          title: "Erreur critique",
          description: cartError.message,
          duration: 8000
        });
        break;
      case 'medium':
        toast({
          variant: "destructive",
          title: "Erreur",
          description: cartError.message,
          duration: 5000
        });
        break;
      case 'low':
        toast({
          title: "Attention",
          description: cartError.message,
          duration: 3000
        });
        break;
    }

    return cartError;
  }, [toast]);

  const validateCartItem = useCallback((item: any): boolean => {
    if (!item) return false;
    if (!item.id) return false;
    if (!item.title && !item.name) return false;
    if (typeof item.price !== 'number' || item.price < 0) return false;
    if (typeof item.quantity !== 'number' || item.quantity <= 0) return false;
    
    return true;
  }, []);

  const validateStock = useCallback((item: any, requestedQuantity: number): boolean => {
    if (item.stock !== undefined && item.stock < requestedQuantity) {
      handleCartError({
        code: 'STOCK_INSUFFICIENT',
        message: `Stock insuffisant. Disponible: ${item.stock}`
      });
      return false;
    }
    return true;
  }, [handleCartError]);

  return {
    handleCartError,
    validateCartItem,
    validateStock
  };
};
