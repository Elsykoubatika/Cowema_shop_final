
import React from 'react';
import { Sun, Battery, Zap, Play } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';

interface SolarDemoProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductImageClick: (productId: string) => void;
  onViewDetails: (productId: string) => void;
}

const SolarDemoProductCard: React.FC<SolarDemoProductCardProps> = ({
  product,
  onAddToCart,
  onProductImageClick,
  onViewDetails
}) => {
  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        {/* Product Image - Aspect ratio réduit */}
        <div 
          className="aspect-[4/3] bg-gray-100 overflow-hidden cursor-pointer"
          onClick={() => onProductImageClick(product.id)}
          title="Cliquer pour voir les détails du produit"
        >
          {product.images?.[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Sun className="text-gray-400" size={48} />
            </div>
          )}
        </div>

        {/* Badges réduits */}
        <div className="absolute top-2 left-2 flex gap-1">
          <Badge className="bg-yellow-500 text-black font-bold shadow-md text-xs px-2 py-0.5">
            <Sun size={10} className="mr-1" />
            SOLAIRE
          </Badge>
          {product.isYaBaBoss && (
            <Badge className="bg-red-500 text-white font-bold shadow-md text-xs px-2 py-0.5">
              YA BA BOSS
            </Badge>
          )}
          <Badge className="bg-blue-500 text-white font-bold shadow-md text-xs px-2 py-0.5">
            <Play size={10} className="mr-1" />
            VIDÉO
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Features - Taille réduite */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
            <Battery size={12} />
            <span>Longue durée</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            <Zap size={12} />
            <span>Haute efficacité</span>
          </div>
        </div>

        {/* Price - Taille réduite */}
        <div className="flex items-baseline gap-2 mb-3">
          {product.promoPrice ? (
            <>
              <span className="text-xl font-black text-green-600">
                {product.promoPrice.toLocaleString()} FCFA
              </span>
              <span className="text-base text-gray-400 line-through">
                {product.price.toLocaleString()} FCFA
              </span>
              <Badge className="bg-red-100 text-red-700 text-xs">
                -{Math.round(((product.price - product.promoPrice) / product.price) * 100)}%
              </Badge>
            </>
          ) : (
            <span className="text-xl font-black text-green-600">
              {product.price.toLocaleString()} FCFA
            </span>
          )}
        </div>

        {/* Actions - Boutons plus petits */}
        <div className="flex gap-2">
          <Button 
            onClick={() => onAddToCart(product)}
            className="flex-1 bg-green-600 hover:bg-green-700 transition-colors text-sm py-2"
            size="sm"
          >
            Ajouter au panier
          </Button>
          <Button 
            variant="outline"
            onClick={() => onViewDetails(product.id)}
            className="hover:bg-gray-50 transition-colors text-sm py-2"
            size="sm"
          >
            Détails
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SolarDemoProductCard;
