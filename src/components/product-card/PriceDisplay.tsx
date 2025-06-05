
import React from 'react';

export interface PriceDisplayProps {
  price: number;
  promoPrice?: number;
  oldPrice?: number;
  discount?: number;
  forceDark?: boolean;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ 
  price, 
  promoPrice, 
  oldPrice,
  discount,
  forceDark = false 
}) => {
  const textColorClass = forceDark ? 'text-gray-800' : '';
  const hasPromo = promoPrice !== undefined && promoPrice < price;
  
  return (
    <div className="flex flex-wrap gap-x-2 items-baseline">
      {/* Prix actuel (ou prix promo si disponible) */}
      <span className={`font-semibold ${hasPromo ? 'text-red-600' : textColorClass}`}>
        {(hasPromo ? promoPrice : price).toLocaleString()} FCFA
      </span>
      
      {/* Prix original barré si remise */}
      {hasPromo && (
        <span className="text-gray-400 text-sm line-through">
          {price.toLocaleString()} FCFA
        </span>
      )}
      
      {/* Ancien prix barré */}
      {oldPrice && oldPrice > price && !hasPromo && (
        <span className="text-gray-400 text-sm line-through">
          {oldPrice.toLocaleString()} FCFA
        </span>
      )}
      
      {/* Badge de remise */}
      {discount && discount > 0 && (
        <span className="text-xs font-medium text-red-600">
          -{discount}%
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;
