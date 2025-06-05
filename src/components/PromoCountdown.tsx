
import React from 'react';
import { useActivePromotion } from '../hooks/usePromotionStore';
import CountdownTimer from './CountdownTimer';
import { Clock } from 'lucide-react';

interface PromoCountdownProps {
  endDate: Date;
  isYaBaBoss?: boolean;
  productId?: string;
}

const PromoCountdown: React.FC<PromoCountdownProps> = ({ isYaBaBoss = false }) => {
  // Set fixed percentage to 82%
  const buyerPercentage = 82;
  
  // Use the active promotion if one exists
  const activePromotion = useActivePromotion();
  
  // If no active promotion, fall back to the default behavior
  if (!activePromotion) {
    return (
      <div className="text-xs text-gray-700">
        {buyerPercentage}% des clients achètent ce produit
      </div>
    );
  }
  
  // Only show YA BA BOSS promotions if this is a YA BA BOSS product
  if (isYaBaBoss && (activePromotion.target === 'ya-ba-boss' || activePromotion.target === 'all')) {
    return (
      <div className="bg-red-50 p-2 rounded border-l-4 border-red-500 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-red-600 font-medium text-sm">
          <Clock size={16} />
          <span>Offre expire dans</span>
          <CountdownTimer 
            expiryDate={activePromotion.expiryDate} 
            variant="compact" 
            className="font-bold"
          />
        </div>
        <div className="text-xs text-gray-700">{buyerPercentage}% des clients achètent ce produit</div>
      </div>
    );
  }
  
  // For non-YA BA BOSS products, only show if the promotion is for all products
  if (!isYaBaBoss && activePromotion.target === 'all') {
    return (
      <div className="bg-red-50 p-2 rounded border-l-4 border-red-500 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-red-600 font-medium text-sm">
          <Clock size={16} />
          <span>Offre expire dans</span>
          <CountdownTimer 
            expiryDate={activePromotion.expiryDate} 
            variant="compact" 
            className="font-bold"
          />
        </div>
        <div className="text-xs text-gray-700">{buyerPercentage}% des clients achètent ce produit</div>
      </div>
    );
  }
  
  // Default fallback if no promotion applies
  return (
    <div className="text-xs text-gray-700">
      {buyerPercentage}% des clients achètent ce produit
    </div>
  );
};

export default PromoCountdown;
