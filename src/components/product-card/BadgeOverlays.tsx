
import React from 'react';
import { Badge } from '@/components/ui/badge';
import YaBaBossIcon from '@/components/icons/YaBaBossIcon';

export interface BadgeOverlaysProps {
  isNew?: boolean;
  discount?: number;
  isOutOfStock?: boolean;
  isYaBaBoss?: boolean;
  isCarouselItem?: boolean;
}

const BadgeOverlays: React.FC<BadgeOverlaysProps> = ({
  isNew,
  discount = 0,
  isOutOfStock = false,
  isYaBaBoss = false,
  isCarouselItem = false
}) => {
  return (
    <div className={`absolute top-2 left-2 flex flex-col gap-1 ${isCarouselItem ? 'z-20' : ''}`}>
      {isNew && (
        <Badge className="bg-blue-500 hover:bg-blue-500 border-blue-500">
          Nouveau
        </Badge>
      )}
      
      {discount > 0 && (
        <Badge className="bg-red-500 hover:bg-red-500 border-red-500">
          -{discount}%
        </Badge>
      )}
      
      {isOutOfStock && (
        <Badge className="bg-gray-500 hover:bg-gray-500 border-gray-500">
          Épuisé
        </Badge>
      )}
      
      {isYaBaBoss && (
        <Badge className="bg-yellow-500 hover:bg-yellow-500 border-yellow-500 flex items-center">
          <YaBaBossIcon size={12} className="mr-1 text-white" />
          YA BA BOSS
        </Badge>
      )}
    </div>
  );
};

export default BadgeOverlays;
