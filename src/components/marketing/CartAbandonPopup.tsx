import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Clock, Percent } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useUnifiedCart } from '../../cart/components/CartProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useFlashBannerSettings } from '../../hooks/useFlashBannerSettings';

interface CartAbandonPopupProps {
  delayMs?: number;
}

const CartAbandonPopup: React.FC<CartAbandonPopupProps> = ({ delayMs = 30000 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const { items, totalItems } = useUnifiedCart();
  const { settings } = useFlashBannerSettings();
  const navigate = useNavigate();

  // Get the discount percentage from settings, default to 10% if not configured
  const discountPercentage = settings?.cartAbandonDiscount || 10;

  // Show popup after delay if there are items in cart
  useEffect(() => {
    if (totalItems === 0) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs, totalItems]);

  // Countdown timer for the offer
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsOpen(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleContinueShopping = () => {
    setIsOpen(false);
  };

  const handleViewCart = () => {
    setIsOpen(false);
    // Redirect to checkout page where promo will be applied automatically
    navigate('/checkout');
  };

  const handleCloseAndDontShow = () => {
    setIsOpen(false);
    // Store in localStorage to not show again for this session
    localStorage.setItem('cartAbandonPopupDismissed', 'true');
  };

  // Don't show if already dismissed or no items in cart
  if (totalItems === 0 || localStorage.getItem('cartAbandonPopupDismissed')) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-0 bg-gradient-to-br from-red-50 to-orange-50">
        {/* Header with close button */}
        <div className="relative p-4 bg-gradient-to-r from-red-500 to-orange-500 text-white">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ShoppingCart size={24} />
              <h2 className="text-xl font-bold">Votre panier attend !</h2>
            </div>
            <p className="text-sm opacity-90">Ne perdez pas vos articles sélectionnés</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          {/* Discount offer */}
          <div className="bg-yellow-100 border-2 border-yellow-300 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Percent className="text-yellow-600" size={20} />
              <span className="text-2xl font-bold text-yellow-700">-{discountPercentage}%</span>
            </div>
            <p className="text-sm text-yellow-800 font-medium">
              Offre spéciale si vous terminez dans
            </p>
            
            {/* Countdown */}
            <div className="flex items-center justify-center gap-2 mt-2">
              <Clock className="text-red-500" size={16} />
              <span className="text-xl font-mono font-bold text-red-600">
                {formatTime(timeLeft)}
              </span>
            </div>
            
            {/* Promo code info */}
            <div className="mt-3 p-2 bg-white/70 rounded border border-yellow-400">
              <p className="text-xs text-yellow-800">
                Code <strong>ABANDON10</strong> sera appliqué automatiquement
              </p>
            </div>
          </div>

          {/* Cart summary */}
          <div className="text-sm text-gray-600 mb-4">
            <p>Vous avez <strong>{totalItems} article{totalItems > 1 ? 's' : ''}</strong> dans votre panier</p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleViewCart}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold"
              size="lg"
            >
              <ShoppingCart className="mr-2" size={18} />
              Terminer ma commande (-{discountPercentage}%)
            </Button>
            
            <Button 
              onClick={handleContinueShopping}
              variant="outline"
              className="w-full"
            >
              Continuer mes achats
            </Button>
            
            <button 
              onClick={handleCloseAndDontShow}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Ne plus afficher ce message
            </button>
          </div>
        </div>

        {/* Animated elements */}
        <div className="absolute top-4 left-4 w-3 h-3 bg-yellow-300 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 right-4 w-2 h-2 bg-red-300 rounded-full animate-bounce"></div>
      </DialogContent>
    </Dialog>
  );
};

export default CartAbandonPopup;
