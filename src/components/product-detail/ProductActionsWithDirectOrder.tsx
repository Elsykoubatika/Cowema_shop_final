import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, ShoppingCart, Tag, Loader2, Check } from 'lucide-react';
import { Product } from '../../data/products';
import { useToast } from '@/hooks/use-toast';
import { useActivePromotion } from '../../hooks/usePromotionStore';

interface ProductActionsWithDirectOrderProps {
  product: Product | null;
  addedToCart: boolean;
  onWhatsAppBuy: () => void;
  onDirectOrder: () => void;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
}

const ProductActionsWithDirectOrder: React.FC<ProductActionsWithDirectOrderProps> = ({
  product,
  addedToCart,
  onWhatsAppBuy,
  onDirectOrder,
  onAddToCart,
  onRemoveFromCart
}) => {
  const { toast } = useToast();
  const activePromotion = useActivePromotion();
  const [loadingStates, setLoadingStates] = useState({
    whatsapp: false,
    direct: false,
    cart: false
  });
  
  if (!product) return null;
  
  // Vérifier si une promotion s'applique à ce produit
  const isYaBaBoss = product.category === 'ya-ba-boss' || Boolean(product.isYaBaBoss);
  const hasPromotion = activePromotion && 
    (activePromotion.target === 'all' || (isYaBaBoss && activePromotion.target === 'ya-ba-boss'));

  // Check if product price meets minimum purchase requirement
  const meetsMinPurchase = hasPromotion ? 
    (product.price >= (activePromotion?.minPurchaseAmount || 0)) : false;

  // Enhanced handlers with loading states and better feedback
  const handleWhatsAppBuyClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    setLoadingStates(prev => ({ ...prev, whatsapp: true }));
    
    // Visual feedback via toast
    toast({
      title: "🎁 Vérification des offres spéciales...",
      description: "Nous préparons votre commande avec les meilleures offres !",
      duration: 2000,
    });
    
    // Simulation de délai puis déclencher l'upsell
    setTimeout(() => {
      onWhatsAppBuy(); // Cela va maintenant déclencher l'upsell d'abord
      setLoadingStates(prev => ({ ...prev, whatsapp: false }));
    }, 800);
  };

  const handleDirectOrderClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    setLoadingStates(prev => ({ ...prev, direct: true }));
    
    // Visual feedback via toast
    toast({
      title: "🎁 Recherche d'offres complémentaires...",
      description: "Vérification des produits fréquemment achetés ensemble...",
      duration: 2000,
    });
    
    // Simulation de délai puis déclencher l'upsell
    setTimeout(() => {
      onDirectOrder(); // Cela va maintenant déclencher l'upsell d'abord
      setLoadingStates(prev => ({ ...prev, direct: false }));
    }, 600);
  };

  const handleCartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    setLoadingStates(prev => ({ ...prev, cart: true }));
    
    if (addedToCart) {
      setTimeout(() => {
        onRemoveFromCart();
        setLoadingStates(prev => ({ ...prev, cart: false }));
        toast({
          title: "✅ Produit retiré",
          description: "Le produit a été retiré de votre panier",
          duration: 2000,
        });
      }, 300);
    } else {
      setTimeout(() => {
        onAddToCart();
        setLoadingStates(prev => ({ ...prev, cart: false }));
        toast({
          title: "🛒 Ajouté au panier",
          description: "Le produit a été ajouté avec succès",
          duration: 2000,
        });
      }, 300);
    }
  };

  // Format discount message based on discount type
  const getDiscountMessage = () => {
    if (!activePromotion) return "";
    
    if (!meetsMinPurchase) {
      return `Code ${activePromotion.code} applicable à partir de ${activePromotion.minPurchaseAmount}€ d'achat`;
    }
    
    if (activePromotion.discountType === 'fixed') {
      return `Économisez ${activePromotion.discount}€ avec le code ${activePromotion.code}`;
    } else {
      return `Économisez ${activePromotion.discount}% avec le code ${activePromotion.code}`;
    }
  };

  return (
    <div className="mt-6 space-y-4 relative">
      {/* Indicateur de promotion avec animation */}
      {hasPromotion && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-3 rounded-lg shadow-sm animate-fade-in transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-red-500 animate-pulse" />
            <span className="text-sm font-medium text-red-800">
              {getDiscountMessage()}
            </span>
          </div>
        </div>
      )}
      
      {/* Boutons principaux avec animations améliorées */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Bouton WhatsApp amélioré */}
        <Button 
          size="lg"
          disabled={loadingStates.whatsapp}
          className={`
            flex-1 min-h-[48px] flex items-center justify-center gap-2 
            bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 
            text-white font-semibold text-sm sm:text-base
            transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
            shadow-lg hover:shadow-xl focus:ring-4 focus:ring-green-200
            disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
            ${hasPromotion && meetsMinPurchase ? 'animate-pulse ring-2 ring-yellow-400' : ''}
          `}
          onClick={handleWhatsAppBuyClick}
          aria-label="Acheter via WhatsApp"
        >
          {loadingStates.whatsapp ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <MessageCircle size={18} />
          )}
          {loadingStates.whatsapp ? 'Vérification...' : 'Acheter via WhatsApp'}
        </Button>

        {/* Bouton commande directe amélioré */}
        <Button 
          size="lg"
          variant="destructive"
          disabled={loadingStates.direct}
          className={`
            flex-1 min-h-[48px] flex items-center justify-center gap-2
            bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800
            text-white font-semibold text-sm sm:text-base
            transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
            shadow-lg hover:shadow-xl focus:ring-4 focus:ring-red-200
            disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
            ${hasPromotion && meetsMinPurchase ? 'animate-pulse ring-2 ring-yellow-400' : ''}
          `}
          onClick={handleDirectOrderClick}
          aria-label="Commander directement"
        >
          {loadingStates.direct ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <span className="text-lg">⚡</span>
          )}
          {loadingStates.direct ? 'Recherche...' : 'Commander directement'}
        </Button>
      </div>
      
      {/* Bouton panier amélioré */}
      <div className="w-full">
        <Button 
          size="lg"
          disabled={loadingStates.cart}
          variant={addedToCart ? "destructive" : "default"}
          className={`
            w-full min-h-[48px] flex items-center justify-center gap-2
            font-semibold text-sm sm:text-base
            transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
            shadow-lg hover:shadow-xl focus:ring-4 
            disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
            ${addedToCart 
              ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-red-200' 
              : `bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-blue-200 ${hasPromotion && meetsMinPurchase ? 'ring-2 ring-yellow-400 animate-pulse' : ''}`
            }
          `}
          onClick={handleCartClick}
          aria-label={addedToCart ? "Retirer du panier" : "Ajouter au panier"}
        >
          {loadingStates.cart ? (
            <Loader2 size={18} className="animate-spin" />
          ) : addedToCart ? (
            <Check size={18} />
          ) : (
            <ShoppingCart size={18} />
          )}
          {loadingStates.cart 
            ? (addedToCart ? 'Suppression...' : 'Ajout...')
            : (addedToCart ? 'Retirer du panier' : 'Ajouter au panier')
          }
        </Button>
      </div>

      {/* Confirmation d'ajout au panier avec animation */}
      {addedToCart && !loadingStates.cart && (
        <div className="animate-fade-in bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-2 text-green-800">
            <Check className="h-5 w-5 text-green-600" />
            <p className="font-medium text-sm">Produit ajouté au panier avec succès!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductActionsWithDirectOrder;
