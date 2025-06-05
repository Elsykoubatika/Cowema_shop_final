
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Phone, Loader2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface ActionButtonsProps {
  onCartClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onWhatsAppClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isOutOfStock?: boolean;
  showWhatsAppButton?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onCartClick,
  onWhatsAppClick,
  isOutOfStock = false,
  showWhatsAppButton = false
}) => {
  const [loadingStates, setLoadingStates] = useState({
    cart: false,
    whatsapp: false
  });
  const [addedToCart, setAddedToCart] = useState(false);
  const { toast } = useToast();

  const handleCartClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    setLoadingStates(prev => ({ ...prev, cart: true }));
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    setTimeout(() => {
      onCartClick(e);
      setLoadingStates(prev => ({ ...prev, cart: false }));
      setAddedToCart(true);
      
      toast({
        title: "🛒 Produit ajouté",
        description: "Le produit a été ajouté au panier",
        duration: 2000,
      });
      
      // Reset success state after animation
      setTimeout(() => setAddedToCart(false), 2000);
    }, 300);
  };

  const handleWhatsAppClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    setLoadingStates(prev => ({ ...prev, whatsapp: true }));
    
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    setTimeout(() => {
      if (onWhatsAppClick) {
        onWhatsAppClick(e);
      }
      setLoadingStates(prev => ({ ...prev, whatsapp: false }));
    }, 500);
  };

  return (
    <div className="flex justify-between items-center mt-2 gap-2">
      {/* Bouton WhatsApp (si activé) */}
      {showWhatsAppButton && onWhatsAppClick && (
        <Button 
          variant="outline" 
          size="sm"
          disabled={loadingStates.whatsapp}
          className="flex items-center justify-center gap-1 text-green-600 border-green-600 hover:bg-green-50 transition-all duration-200 hover:scale-105 active:scale-95 min-h-[40px]"
          onClick={handleWhatsAppClick}
        >
          {loadingStates.whatsapp ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Phone size={14} />
          )}
          <span className="hidden sm:inline text-xs">
            {loadingStates.whatsapp ? 'Envoi...' : 'WhatsApp'}
          </span>
        </Button>
      )}
      
      {/* Espace à gauche si pas de bouton WhatsApp */}
      {!showWhatsAppButton && <div></div>}
      
      {/* Bouton panier arrondi et amélioré */}
      <Button 
        variant="default" 
        size="sm"
        disabled={isOutOfStock || loadingStates.cart}
        className={`
          w-11 h-11 rounded-full flex items-center justify-center p-0 
          transition-all duration-300 transform shadow-md
          ${addedToCart 
            ? 'bg-green-600 hover:bg-green-700 scale-110' 
            : 'bg-primary hover:bg-primary/90 hover:scale-110'
          }
          active:scale-95 focus:ring-4 focus:ring-primary/20
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        `}
        onClick={handleCartClick}
        aria-label={isOutOfStock ? "Produit épuisé" : "Ajouter au panier"}
      >
        {loadingStates.cart ? (
          <Loader2 size={18} className="animate-spin" />
        ) : addedToCart ? (
          <Check size={18} className="animate-bounce" />
        ) : (
          <ShoppingCart size={18} />
        )}
      </Button>
    </div>
  );
};

export default ActionButtons;
