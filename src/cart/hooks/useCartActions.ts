import { useCallback } from 'react';
import { Dispatch } from 'react';
import { CartAction } from '../types/cartActions';
import { AddToCartProduct } from '../types/cart.types';
import { convertToCartItem } from '../utils/cartConversions';
import { useToast } from '../../hooks/use-toast';
import { usePromotionStore } from '../../hooks/usePromotionStore';

export const useCartActions = (
  dispatch: Dispatch<CartAction>,
  items: any[],
  subtotal: number
) => {
  const { toast } = useToast();
  const { applyPromoCode } = usePromotionStore();

  const addItem = useCallback((product: AddToCartProduct) => {
    try {
      console.log('Adding product to cart:', product);
      
      if (!product || !product.id) {
        throw new Error('Produit invalide');
      }

      // Validation du stock
      if (product.stock !== undefined && product.stock <= 0) {
        toast({
          variant: "destructive",
          title: "Stock épuisé",
          description: "Ce produit n'est plus disponible.",
        });
        return;
      }

      const cartItem = convertToCartItem(product, 1);
      dispatch({ type: 'ADD_ITEM', payload: cartItem });
      
      toast({
        title: "✅ Produit ajouté",
        description: `${cartItem.title} a été ajouté à votre panier.`,
        duration: 2000,
      });
      
      console.log('Product added successfully:', cartItem);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de l\'ajout au panier' });
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible d'ajouter le produit au panier",
      });
    }
  }, [dispatch, toast]);

  const removeItem = useCallback((productId: string) => {
    try {
      dispatch({ type: 'REMOVE_ITEM', payload: productId });
      
      toast({
        title: "Produit supprimé",
        description: "Le produit a été retiré de votre panier.",
      });
      
      console.log('Product removed from cart:', productId);
    } catch (error) {
      console.error('Error removing item from cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la suppression' });
    }
  }, [dispatch, toast]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    try {
      if (quantity < 0) {
        throw new Error('La quantité ne peut pas être négative');
      }
      
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
      console.log('Quantity updated:', productId, quantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la mise à jour' });
    }
  }, [dispatch]);

  const clearCart = useCallback(() => {
    try {
      dispatch({ type: 'CLEAR_CART' });
      
      toast({
        title: "Panier vidé",
        description: "Tous les produits ont été supprimés du panier.",
      });
      
      console.log('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors du vidage du panier' });
    }
  }, [dispatch, toast]);

  const setDeliveryInfo = useCallback((city: string, neighborhood: string) => {
    try {
      dispatch({ type: 'SET_DELIVERY_INFO', payload: { city, neighborhood } });
      console.log('Delivery info updated:', city, neighborhood);
    } catch (error) {
      console.error('Error setting delivery info:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la mise à jour des informations de livraison' });
    }
  }, [dispatch]);

  const applyPromotion = useCallback(async (promoCode: string) => {
    try {
      const result = await applyPromoCode(promoCode, subtotal);
      
      if (result.success) {
        dispatch({ type: 'APPLY_PROMOTION', payload: promoCode });
        toast({
          title: "🎉 Code promo appliqué",
          description: `Vous économisez ${result.discount?.toLocaleString()} FCFA !`,
        });
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Code promo invalide",
          description: result.message,
        });
        return false;
      }
    } catch (error) {
      console.error('Error applying promotion:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'appliquer le code promo",
      });
      return false;
    }
  }, [dispatch, subtotal, applyPromoCode, toast]);

  const removePromotion = useCallback(() => {
    dispatch({ type: 'REMOVE_PROMOTION' });
    toast({
      title: "Code promo retiré",
      description: "Le code promo a été supprimé de votre commande.",
    });
  }, [dispatch, toast]);

  return {
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setDeliveryInfo,
    applyPromotion,
    removePromotion
  };
};
