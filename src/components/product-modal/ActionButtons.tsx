
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart, MessageCircle } from 'lucide-react';

interface ActionButtonsProps {
  onAddToCart: () => void;
  onWhatsAppBuy: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onAddToCart, onWhatsAppBuy }) => {
  return (
    <div className="flex gap-3">
      <Button 
        variant="outline"
        size="sm"
        className="flex-1 flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white border-green-600"
        onClick={onWhatsAppBuy}
      >
        <MessageCircle size={16} />
        Commander via WhatsApp
      </Button>
      <Button 
        size="sm"
        className="flex-1 flex items-center justify-center gap-1.5"
        onClick={onAddToCart}
      >
        <ShoppingCart size={16} />
        Ajouter au panier
      </Button>
    </div>
  );
};

export default ActionButtons;
