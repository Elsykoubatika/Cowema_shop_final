
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Share2, MapPin } from 'lucide-react';
import { ProductCache } from '@/types/productCache';

interface ProductCatalogCardProps {
  product: ProductCache;
  onCopyLink: (product: ProductCache) => void;
  onShare: (product: ProductCache) => void;
}

const ProductCatalogCard: React.FC<ProductCatalogCardProps> = ({
  product,
  onCopyLink,
  onShare
}) => {
  const calculateDiscount = (price: number, promoPrice?: number): number => {
    if (!promoPrice || promoPrice >= price) return 0;
    return Math.round(((price - promoPrice) / price) * 100);
  };

  const calculateCommission = (price: number, promoPrice?: number): number => {
    const finalPrice = promoPrice || price;
    return Math.round(finalPrice * 0.05); // 5% de commission
  };

  const discount = calculateDiscount(product.price, product.promoPrice);
  const commission = calculateCommission(product.price, product.promoPrice);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock <= 5 && product.stock > 0;

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-200 ${isOutOfStock ? 'opacity-60' : ''}`}>
      <div className="relative">
        <img
          src={product.images?.[0] || '/placeholder.svg'}
          alt={product.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        
        {/* Badges en haut à gauche */}
        <div className="absolute top-2 left-2 flex gap-1 flex-wrap max-w-[70%]">
          {product.isFlashOffer && (
            <Badge variant="destructive" className="text-xs">
              ⚡ Flash
            </Badge>
          )}
          {product.isYaBaBoss && (
            <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs">
              👑 YaBaBoss
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Badge stock en haut à droite */}
        {(isLowStock || isOutOfStock) && (
          <div className="absolute top-2 right-2">
            <Badge 
              variant={isOutOfStock ? "destructive" : "outline"} 
              className={isOutOfStock ? "" : "bg-orange-100 text-orange-800 border-orange-300"}
            >
              {isOutOfStock ? 'Rupture' : 'Stock limité'}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        
        {/* Prix */}
        <div className="flex items-center gap-2 mb-3">
          {product.promoPrice && product.promoPrice < product.price ? (
            <>
              <span className="text-lg font-bold text-green-600">
                {product.promoPrice.toLocaleString()} FCFA
              </span>
              <span className="text-sm text-gray-500 line-through">
                {product.price.toLocaleString()} FCFA
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-green-600">
              {product.price.toLocaleString()} FCFA
            </span>
          )}
        </div>

        {/* Informations détaillées */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Commission:</span>
            <span className="font-medium text-green-600">
              {commission.toLocaleString()} FCFA
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Stock:</span>
            <span className={`font-medium ${isLowStock ? 'text-orange-600' : isOutOfStock ? 'text-red-600' : 'text-blue-600'}`}>
              {product.stock} unités
            </span>
          </div>
          {product.city && (
            <div className="flex justify-between text-sm items-center">
              <span className="text-muted-foreground">Ville:</span>
              <span className="font-medium flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {product.city}
              </span>
            </div>
          )}
          {product.category && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Catégorie:</span>
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
            </div>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => onCopyLink(product)}
            className="flex-1"
            disabled={isOutOfStock}
          >
            <Copy className="h-3 w-3 mr-1" />
            Copier lien
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onShare(product)}
            disabled={isOutOfStock}
            title="Partager"
          >
            <Share2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Message de rupture de stock */}
        {isOutOfStock && (
          <div className="mt-3 text-center">
            <Badge variant="destructive" className="text-xs">
              Produit indisponible
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCatalogCard;
