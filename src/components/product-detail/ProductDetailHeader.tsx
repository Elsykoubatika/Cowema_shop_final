
import React from 'react';
import { ArrowLeft, ShoppingCart, Share2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedCart } from '../../cart/components/CartProvider';

interface ProductDetailHeaderProps {
  productId: string;
  productTitle?: string;
  addedToCart: boolean;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
  onWhatsAppBuy: () => void;
  onCartClick: () => void;
}

const ProductDetailHeader: React.FC<ProductDetailHeaderProps> = ({
  productId,
  productTitle,
  addedToCart,
  onAddToCart,
  onRemoveFromCart,
  onWhatsAppBuy,
  onCartClick
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { totalItems } = useUnifiedCart();

  const handleGoToProducts = () => {
    navigate('/products');
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = productTitle || 'Découvrez ce produit';
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
          text: `Regardez ce produit: ${title}`
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Lien copié",
          description: "Le lien du produit a été copié dans le presse-papier.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de copier le lien.",
        });
      }
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center flex-1 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoToProducts}
            className="mr-3 hover:bg-gray-100 flex-shrink-0 p-2"
            aria-label="Retour aux produits"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {productTitle || 'Détail du produit'}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="hover:bg-gray-100 p-2"
            aria-label="Partager ce produit"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onCartClick}
            className="relative hover:bg-gray-50 p-2"
            aria-label={`Panier - ${totalItems} articles`}
          >
            <ShoppingCart className="h-4 w-4" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium min-w-4">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailHeader;
