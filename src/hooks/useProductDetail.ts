
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from './useCart';
import { useToast } from './use-toast';
import { useHybridProducts } from './useHybridProducts';
import { getProductExtension } from '@/services/apiService';
import { Product } from '../types/product';

export const useProductDetail = (productId?: string) => {
  const { id } = useParams<{ id: string }>();
  const finalProductId = productId || id;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { products, isLoading: isLoadingProducts } = useHybridProducts();
  const { isInCart, handleAddToCart, handleRemoveFromCart, totalItems, items } = useCart();
  const { toast } = useToast();

  // États pour les modales
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [isDirectOrderOpen, setIsDirectOrderOpen] = useState(false);
  const [isCheckoutUpsellOpen, setIsCheckoutUpsellOpen] = useState(false);
  const [orderAction, setOrderAction] = useState<'whatsapp' | 'direct' | null>(null);
  const [showTimedPopup, setShowTimedPopup] = useState(false);

  // Charger le produit et ses extensions
  useEffect(() => {
    const loadProductWithExtensions = async () => {
      if (!finalProductId || isLoadingProducts) return;

      try {
        setIsLoading(true);
        setError(null);

        console.log('🔍 Searching for product with ID:', finalProductId);
        console.log('📦 Available products:', products.length);

        // Recherche robuste du produit par différents critères
        const foundProduct = products.find(p => {
          const matches = [
            p.id === finalProductId,
            p.externalApiId === finalProductId,
            String(p.id) === String(finalProductId),
            p.externalApiId && String(p.externalApiId) === String(finalProductId)
          ];
          
          const isMatch = matches.some(Boolean);
          
          if (isMatch) {
            console.log('✅ Product match found:', {
              productName: p.name,
              internalId: p.id,
              externalId: p.externalApiId,
              searchId: finalProductId
            });
          }
          
          return isMatch;
        });

        if (!foundProduct) {
          console.error('❌ Product not found with ID:', finalProductId);
          console.log('🔍 Available products for debugging:', 
            products.slice(0, 5).map(p => ({
              name: p.name,
              id: p.id,
              externalId: p.externalApiId
            }))
          );
          setError('Produit non trouvé');
          setProduct(null);
          return;
        }

        // Charger les extensions depuis Supabase
        const extension = await getProductExtension(foundProduct.externalApiId || foundProduct.id);
        
        // Enrichir le produit avec les extensions
        const enrichedProduct: Product = {
          ...foundProduct,
          videoUrl: extension?.videoUrl || foundProduct.videoUrl || '',
          isYaBaBoss: extension?.isYaBaBoss !== undefined ? extension.isYaBaBoss : foundProduct.isYaBaBoss,
          isFlashOffer: extension?.isFlashOffer !== undefined ? extension.isFlashOffer : foundProduct.isFlashOffer,
          isActive: extension?.isActive !== undefined ? extension.isActive : foundProduct.isActive,
          keywords: extension?.keywords || foundProduct.keywords || []
        };

        console.log('🎬 Product loaded with extensions:', {
          productId: finalProductId,
          productName: enrichedProduct.name,
          hasVideo: !!enrichedProduct.videoUrl,
          isYaBaBoss: enrichedProduct.isYaBaBoss
        });

        setProduct(enrichedProduct);
      } catch (err) {
        console.error('❌ Error loading product with extensions:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProductWithExtensions();
  }, [finalProductId, products, isLoadingProducts]);

  // Actions du panier
  const handleAddToCartClick = useCallback(() => {
    if (product) {
      handleAddToCart(product);
      toast({
        title: "Produit ajouté",
        description: `${product.name || product.title} a été ajouté à votre panier.`,
      });
    }
  }, [product, handleAddToCart, toast]);

  const handleRemoveFromCartClick = useCallback(() => {
    if (product) {
      handleRemoveFromCart(product.id);
      toast({
        title: "Produit retiré",
        description: `${product.name || product.title} a été retiré de votre panier.`,
      });
    }
  }, [product, handleRemoveFromCart, toast]);

  // Actions de commande
  const handleWhatsAppBuy = useCallback(() => {
    setOrderAction('whatsapp');
    setIsOrderFormOpen(true);
  }, []);

  const handleDirectOrder = useCallback(() => {
    setOrderAction('direct');
    setIsDirectOrderOpen(true);
  }, []);

  // Actions d'upsell
  const handleAcceptUpsell = useCallback(() => {
    setIsCheckoutUpsellOpen(false);
    handleWhatsAppBuy();
  }, [handleWhatsAppBuy]);

  const handleDeclineUpsell = useCallback(() => {
    setIsCheckoutUpsellOpen(false);
    handleWhatsAppBuy();
  }, [handleWhatsAppBuy]);

  const closeCheckoutUpsell = useCallback(() => {
    setIsCheckoutUpsellOpen(false);
  }, []);

  const getAllOrderItems = useCallback(() => {
    return product ? [product] : [];
  }, [product]);

  const handleCartClick = useCallback(() => {
    const cartButton = document.querySelector('[data-cart-toggle]');
    if (cartButton instanceof HTMLElement) {
      cartButton.click();
    }
  }, []);

  return {
    product,
    isLoading,
    error,
    addedToCart: product ? isInCart(product.id) : false,
    isOrderFormOpen,
    isDirectOrderOpen,
    isCheckoutUpsellOpen,
    orderAction,
    totalCartItems: totalItems,
    handleAddToCart: handleAddToCartClick,
    handleRemoveFromCart: handleRemoveFromCartClick,
    handleWhatsAppBuy,
    handleDirectOrder,
    handleCartClick,
    handleAcceptUpsell,
    handleDeclineUpsell,
    closeCheckoutUpsell,
    setIsOrderFormOpen,
    setIsDirectOrderOpen,
    setShowTimedPopup,
    getAllOrderItems
  };
};
