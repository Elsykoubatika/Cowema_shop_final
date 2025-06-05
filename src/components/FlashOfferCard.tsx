
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "../data/products";
import { Clock, Zap, ShoppingCart } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import CountdownTimer from './CountdownTimer';
import ProductCardRating from './ProductCardRating';
import { Badge } from "@/components/ui/badge";
import YaBaBossIcon from './icons/YaBaBossIcon';

interface FlashOfferCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onOpenModal: () => void;
}

const FlashOfferCard: React.FC<FlashOfferCardProps> = ({ 
  product, 
  onAddToCart,
  onOpenModal
}) => {
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
    toast({
      title: "Produit ajouté au panier",
      description: `${product.title || product.name} a été ajouté à votre panier.`,
    });
  };

  const discountPercentage = product.promoPrice 
    ? Math.round(((product.price - product.promoPrice) / product.price) * 100) 
    : 25;

  // Set expiry date to 1 hour from now for demo purposes
  const expiryDate = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-2 border-red-500 relative bg-gradient-to-b from-red-50 to-white">
      {/* Flash offer badge with animation */}
      <div className="absolute top-0 left-0 w-full z-10 bg-red-600 text-white py-1.5 px-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Zap size={16} className="text-yellow-300 animate-pulse" />
          <span className="font-bold">OFFRE FLASH</span>
        </div>
        <Badge className="bg-yellow-500 text-red-800 border-none">-{discountPercentage}%</Badge>
      </div>
      
      <div 
        className="relative pt-10"
        onClick={onOpenModal}
      >
        {/* Enlarged image with better padding and centering */}
        <div className="flex items-center justify-center p-2 bg-white">
          <img 
            src={product.images[0]} 
            alt={product.title || product.name} 
            className="w-full h-48 object-contain transition-transform hover:scale-105 p-2" 
          />
        </div>
        
        {product.isYaBaBoss && (
          <span className="absolute top-12 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <YaBaBossIcon size={12} className="text-white" />
            YA BA BOSS
          </span>
        )}
      </div>
      
      <CardContent className="p-4 bg-gradient-to-b from-white to-red-50">
        <h3 
          className="font-bold text-sm truncate mb-2"
          onClick={onOpenModal}
          title={product.title || product.name}
        >
          {product.title || product.name}
        </h3>
        
        {/* Ratings display - Pass product.id as string */}
        <ProductCardRating productId={product.id} />
        
        <div className="flex items-center justify-between my-2">
          <div>
            {product.promoPrice ? (
              <div className="flex flex-col">
                <span className="text-red-600 font-bold text-lg">{product.promoPrice.toLocaleString()} FCFA</span>
                <span className="text-gray-500 text-xs line-through">{product.price.toLocaleString()} FCFA</span>
              </div>
            ) : (
              <span className="text-red-600 font-bold">{product.price.toLocaleString()} FCFA</span>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-red-600 font-bold text-xs border border-red-200 bg-red-50 rounded-full px-2 py-1">
            <Clock size={12} className="text-red-600" />
            <CountdownTimer expiryDate={expiryDate} variant="compact" />
          </div>
        </div>
        
        <div className="flex gap-2 mt-3">
          <Button 
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} className="mr-1" /> Panier
          </Button>
          
          <Button 
            size="sm"
            className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            onClick={onOpenModal}
          >
            <Zap size={16} className="mr-1" /> Voir l'offre
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlashOfferCard;
