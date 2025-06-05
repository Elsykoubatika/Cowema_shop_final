
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, X, Copy, Check } from 'lucide-react';
import { useAuthStore } from '../hooks/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Product } from '../data/products';
import { useToast } from '@/hooks/use-toast';
import { usePromotionStore } from '../hooks/usePromotionStore';

interface TimedUpsellPopupProps {
  productName: string;
  discount: number;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
  product?: Product | null;
}

const TimedUpsellPopup: React.FC<TimedUpsellPopupProps> = ({ 
  productName, 
  discount, 
  isOpen, 
  onClose,
  onAddToCart,
  product
}) => {
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const { promotions } = usePromotionStore();
  
  // Get the default promotion code from the promotions store
  const defaultPromoCode = promotions.find(p => p.isActive)?.code || "YABASPECIAL";
  
  // Countdown effect
  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else {
        clearInterval(timer);
        onClose();
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [minutes, seconds, isOpen, onClose]);
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(defaultPromoCode)
      .then(() => {
        setCopied(true);
        toast({
          title: "Code copié!",
          description: `Le code "${defaultPromoCode}" a été copié dans le presse-papiers.`,
          duration: 2000,
        });
        
        // Reset the copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Erreur lors de la copie:', err);
      });
  };
  
  const handleCheckout = () => {
    // Si nous avons un produit et une fonction d'ajout au panier, ajouter le produit au panier
    if (product && onAddToCart) {
      onAddToCart(product);
    }
    
    // Ouvrir le panier
    const cartButton = document.querySelector('.fixed.bottom-6.right-6 button');
    if (cartButton instanceof HTMLElement) {
      cartButton.click();
    }
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 text-white hover:text-gray-200"
          >
            <X size={20} />
          </button>
          
          <h2 className="text-xl font-bold mb-1 text-center">⚡ OFFRE FLASH EXCLUSIVE ⚡</h2>
          <div className="text-center text-white/90 text-sm mb-2">
            Pour {user?.nom || user?.firstName ? user.nom || user.firstName : 'vous'} uniquement
          </div>
        </div>
        
        <div className="p-5">
          <div className="text-center mb-4">
            <p className="text-lg font-bold mb-2">
              Profitez de <span className="text-red-600">-{discount}%</span> sur {productName}
            </p>
            <p className="text-gray-600">
              Cette offre exclusive expire dans:
            </p>
            
            <div className="flex justify-center gap-2 my-3">
              <div className="bg-gray-100 border border-gray-300 rounded-md p-2 min-w-[60px]">
                <span className="text-xl font-bold text-red-600">{minutes.toString().padStart(2, '0')}</span>
                <div className="text-xs text-gray-500">min</div>
              </div>
              <div className="flex items-center font-bold">:</div>
              <div className="bg-gray-100 border border-gray-300 rounded-md p-2 min-w-[60px]">
                <span className="text-xl font-bold text-red-600">{seconds.toString().padStart(2, '0')}</span>
                <div className="text-xs text-gray-500">sec</div>
              </div>
            </div>
            
            {/* Code promo copyable */}
            <div className="mt-3 mb-4">
              <p className="text-sm text-gray-600 mb-1">Utilisez ce code promo:</p>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-2 mx-auto bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-1.5 rounded-md font-mono font-bold hover:bg-yellow-100 transition-colors"
              >
                {defaultPromoCode}
                {copied ? (
                  <Check size={16} className="text-green-600" />
                ) : (
                  <Copy size={16} className="text-yellow-800" />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleCheckout}
              className="bg-green-600 hover:bg-green-700 text-white font-bold"
            >
              PROFITER DE CETTE OFFRE MAINTENANT
            </Button>
            <Button 
              variant="outline" 
              className="text-gray-500"
              onClick={onClose}
            >
              Je ne suis pas intéressé
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimedUpsellPopup;
