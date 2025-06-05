
import React from 'react';
import { Percent } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";

interface UpsellProduct {
  name: string;
  discount: number;
  image: string;
  price?: number;
}

interface UpsellProductCardProps {
  product: UpsellProduct;
  index: number;
  discount: number;
  isSelected: boolean;
  onCheckboxChange: (checked: boolean, productName: string) => void;
}

const UpsellProductCard: React.FC<UpsellProductCardProps> = ({
  product,
  index,
  discount,
  isSelected,
  onCheckboxChange
}) => {
  // Formatage du prix
  const formatPrice = (price: number) => {
    return price.toLocaleString() + ' FCFA';
  };
  
  // Calcul du prix après réduction
  const calculateDiscountedPrice = (price: number) => {
    return Math.round(price * (1 - discount / 100));
  };

  return (
    <div className="bg-white rounded-md p-3 border border-amber-200 flex gap-3 items-center hover:shadow-md transition-shadow">
      <div className="w-20 h-20 bg-white rounded-md border border-amber-100 flex items-center justify-center overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="max-h-18 max-w-18 object-cover h-full w-full"
        />
      </div>
      
      <div className="flex-grow">
        <h4 className="font-semibold">{product.name}</h4>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-primary font-bold">
            {formatPrice(calculateDiscountedPrice(product.price || 0))}
          </span>
          <span className="text-gray-400 text-sm line-through">
            {formatPrice(product.price || 0)}
          </span>
          <span className="text-xs bg-red-100 text-red-800 px-1 rounded">
            -{discount}%
          </span>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <Checkbox 
            id={`upsell-checkbox-${index}`} 
            checked={isSelected}
            onCheckedChange={(checked) => onCheckboxChange(!!checked, product.name)}
            className="h-4 w-4 border-amber-500"
          />
          <label 
            htmlFor={`upsell-checkbox-${index}`} 
            className="text-sm font-medium cursor-pointer hover:text-primary transition-colors"
          >
            Ajouter
          </label>
        </div>
      </div>
    </div>
  );
};

export default UpsellProductCard;
