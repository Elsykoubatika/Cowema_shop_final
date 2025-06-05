
import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Product } from '../data/products';
import CountdownTimer from './CountdownTimer';

interface FlashOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
  flashProduct: Product | null;
}

const FlashOfferModal: React.FC<FlashOfferModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  flashProduct
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!flashProduct) return null;

  const handleAddToCart = () => {
    if (flashProduct && onAddToCart) {
      onAddToCart(flashProduct);
      toast({
        title: "Produit ajouté au panier",
        description: `${flashProduct.title} a été ajouté à votre panier.`,
      });
      onClose();
    }
  };

  const handleViewProduct = () => {
    if (flashProduct) {
      navigate(`/product/${flashProduct.id}`);
      onClose();
    }
  };

  const discountPercentage = flashProduct.promoPrice 
    ? Math.round(((flashProduct.price - flashProduct.promoPrice) / flashProduct.price) * 100) 
    : 25;

  // Set expiry date to 30 minutes from now for demo purposes
  const expiryDate = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogTitle className="sr-only">Offre Flash Exclusive</DialogTitle>
        <DialogDescription className="sr-only">Offre spéciale à durée limitée</DialogDescription>
        
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 text-white hover:text-gray-200"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
          
          <h2 className="text-xl font-bold mb-1 text-center">⚡ OFFRE FLASH EXCLUSIVE ⚡</h2>
          <div className="text-center text-white/90 text-sm mb-2">
            Pour vous uniquement
          </div>
        </div>
        
        <div className="p-5">
          <div className="text-center mb-4">
            <div className="flex justify-center mb-3">
              <img 
                src={flashProduct.images[0]} 
                alt={flashProduct.title}
                className="h-40 w-40 object-contain"
              />
            </div>
            
            <p className="text-lg font-bold mb-2">
              {flashProduct.title}
            </p>
            
            <div className="flex justify-center items-center gap-3 mb-3">
              {flashProduct.promoPrice ? (
                <>
                  <span className="text-xl font-bold text-primary">{flashProduct.promoPrice.toLocaleString()} FCFA</span>
                  <span className="text-gray-500 text-sm line-through">{flashProduct.price.toLocaleString()} FCFA</span>
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">-{discountPercentage}%</span>
                </>
              ) : (
                <span className="text-xl font-bold text-primary">{flashProduct.price.toLocaleString()} FCFA</span>
              )}
            </div>
            
            <p className="text-gray-600 mb-2">
              Cette offre exclusive expire dans:
            </p>
            
            <div className="flex justify-center my-3">
              <CountdownTimer 
                expiryDate={expiryDate}
                className="mx-auto"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleAddToCart}
              className="bg-green-600 hover:bg-green-700 text-white font-bold flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              AJOUTER AU PANIER
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleViewProduct}
              className="border-primary text-primary hover:bg-primary/10"
            >
              VOIR LES DÉTAILS
            </Button>
            
            <Button 
              variant="ghost" 
              className="text-gray-500"
              onClick={onClose}
            >
              Non, merci
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FlashOfferModal;
