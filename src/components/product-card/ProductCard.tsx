
import React from 'react';
import { useUnifiedCart } from '@/cart/components/CartProvider';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, MapPin, Play, Zap, ExternalLink } from 'lucide-react';
import { calculateLoyaltyPoints } from '@/utils/loyaltyUtils';
import YaBaBossIcon from '@/components/icons/YaBaBossIcon';
import type { Product } from '@/types/product';

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  showWhatsAppButton?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  showWhatsAppButton = false
}) => {
  const { addItem: handleAddToCart } = useUnifiedCart();
  const navigate = useNavigate();
  
  // Get product title (support both name and title for backward compatibility)
  const productTitle = product.title || product.name;
  
  // Handle card click navigation
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons or interactive elements
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    console.log("Navigation vers la page de détail:", `/product/${product.id}`);
    navigate(`/product/${product.id}`);
  };
  
  // Handle add to cart - ensure proper price handling
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Create a clean product object with proper price structure
    const cartProduct = {
      ...product,
      title: productTitle,
      price: product.price || 0,
      promoPrice: product.promoPrice && typeof product.promoPrice === 'number' ? product.promoPrice : undefined,
      rating: product.rating || 0,
      loyaltyPoints: product.loyaltyPoints || calculateLoyaltyPoints(product.promoPrice || product.price)
    };
    
    console.log('ProductCard - Adding to cart:', cartProduct);
    
    if (onAddToCart) {
      onAddToCart(cartProduct);
    } else {
      handleAddToCart(cartProduct);
    }
  };

  // Handle external link click
  const handleExternalLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  // Check for promotion - ensure promoPrice is a valid number
  const hasPromo = product.promoPrice !== null && 
                   product.promoPrice !== undefined && 
                   typeof product.promoPrice === 'number' && 
                   product.promoPrice < product.price;
  
  // Calculate discount percentage
  const discount = hasPromo
    ? Math.round(((product.price - (product.promoPrice || product.price)) / product.price) * 100)
    : 0;

  // Calculate loyalty points with 1 decimal place - 1000 FCFA = 1 point
  const finalPrice = (hasPromo ? product.promoPrice : product.price) || 0;
  const loyaltyPoints = (finalPrice / 1000).toFixed(1);

  const isFlashOffer = product.isFlashOffer;

  return (
    <Card 
      className="product-card group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 w-full flex flex-col cursor-pointer relative hover:border-primary/30"
      onClick={handleCardClick}
      style={{ height: '350px' }}
    >
      {/* External Link Button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 z-20 bg-white/80 hover:bg-white shadow-sm"
        onClick={handleExternalLinkClick}
        title="Voir les détails"
      >
        <ExternalLink size={14} />
      </Button>

      {/* Flash Offer Banner */}
      {isFlashOffer && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white py-1 px-2 flex items-center justify-between z-10">
          <div className="flex items-center">
            <Zap size={16} className="mr-1" fill="currentColor" />
            <span className="text-xs font-bold">OFFRE FLASH</span>
          </div>
          {discount > 0 && (
            <span className="text-xs font-bold bg-yellow-400 text-black px-2 py-0.5 rounded">
              -{discount}%
            </span>
          )}
        </div>
      )}

      {/* YA BA BOSS Badge */}
      {product.isYaBaBoss && (
        <Badge 
          className={`absolute ${isFlashOffer ? 'top-8' : 'top-2'} left-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10`}
        >
          <YaBaBossIcon size={12} className="text-yellow-900" />
          YA BA BOSS
        </Badge>
      )}

      {/* Product Image */}
      <div className="relative bg-gray-50 overflow-hidden" style={{ height: '200px' }}>
        {product.images?.[0] ? (
          <img 
            src={product.images[0]} 
            alt={productTitle}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-sm">Pas d'image</span>
          </div>
        )}

        {/* Discount Badge for non-flash offers */}
        {hasPromo && !isFlashOffer && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </div>
        )}

        {/* Video indicator */}
        {product.videoUrl && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
            <Play size={12} fill="currentColor" className="mr-0.5" />
            Vidéo disponible
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-3 flex flex-col justify-between flex-grow">
        <div className="space-y-1">
          {/* Product Title */}
          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 leading-tight mb-1 hover:text-primary transition-colors">
            {productTitle}
          </h3>
          
          {/* Price */}
          <div className="flex items-baseline gap-2">
            {hasPromo ? (
              <>
                <span className="text-base font-bold text-green-600">
                  {(product.promoPrice || 0).toLocaleString()} FCFA
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {product.price.toLocaleString()} FCFA
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-green-600">
                {product.price.toLocaleString()} FCFA
              </span>
            )}
          </div>
          
          {/* Loyalty Points */}
          <div className="text-xs text-amber-600 flex items-center">
            <YaBaBossIcon size={12} className="text-amber-500 mr-1" />
            {loyaltyPoints} point{parseFloat(loyaltyPoints) !== 1 ? 's' : ''}
          </div>
        </div>
        
        {/* Footer with location and cart button */}
        <div className="mt-auto pt-2 flex items-center justify-between">
          {/* Location */}
          {(product.city || product.location) && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin size={12} />
              <span className="truncate">{product.city || product.location}</span>
            </div>
          )}
          
          {/* Cart Button */}
          <Button 
            onClick={handleAddToCartClick}
            className="w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 text-white p-0 flex items-center justify-center shadow-sm transition-all duration-200 hover:scale-110 ml-auto"
            disabled={product.stock === 0}
            variant="default"
            size="sm"
            title="Ajouter au panier"
          >
            <ShoppingCart size={18} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;

export type { Product };
