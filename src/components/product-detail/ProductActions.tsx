
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { Product } from '../../data/products';

interface ProductActionsProps {
  product: Product;
  addedToCart: boolean;
  onWhatsAppBuy: () => void;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({ 
  product, 
  addedToCart, 
  onWhatsAppBuy, 
  onAddToCart, 
  onRemoveFromCart 
}) => {
  return (
    <>
      {/* Added to cart confirmation */}
      {addedToCart && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-800">
          <p className="font-medium">✅ Ce produit a été ajouté à votre panier.</p>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <Button 
          variant="outline"
          size="sm"
          className="flex-1 flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white border-green-600"
          onClick={onWhatsAppBuy}
        >
          <MessageCircle size={16} />
          Acheter via WhatsApp
        </Button>
        
        {addedToCart ? (
          <Button 
            variant="destructive" 
            size="sm"
            className="flex items-center gap-1.5"
            onClick={onRemoveFromCart}
          >
            Retirer
          </Button>
        ) : (
          <Button 
            size="sm"
            className="flex items-center gap-1.5"
            onClick={onAddToCart}
          >
            <ShoppingCart size={16} />
            Ajouter
          </Button>
        )}
      </div>
    </>
  );
};

export default ProductActions;
