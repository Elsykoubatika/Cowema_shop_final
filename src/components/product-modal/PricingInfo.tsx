
import React from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PricingInfoProps {
  price: number;
  promoPrice: number | null;
  isYaBaBoss: boolean;
}

const PricingInfo: React.FC<PricingInfoProps> = ({ price, promoPrice, isYaBaBoss }) => {
  const navigate = useNavigate();
  
  // Determine VIP badge level based on price
  const getVipBadge = () => {
    const currentPrice = promoPrice || price;
    if (currentPrice >= 50000) return { level: "Or", color: "bg-yellow-500" };
    if (currentPrice >= 20000) return { level: "Argent", color: "bg-gray-400" };
    return { level: "Bronze", color: "bg-amber-700" };
  };
  
  const vipBadge = getVipBadge();
  
  // Handle YA BA BOSS badge click
  const handleYaBaBossClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering other handlers
    navigate('/ya-ba-boss');
  };
  
  return (
    <div className="flex items-baseline gap-2 mb-4">
      {promoPrice ? (
        <>
          <span className="text-2xl font-bold text-primary">{promoPrice.toLocaleString()} FCFA</span>
          <span className="text-gray-400 line-through">{price.toLocaleString()} FCFA</span>
        </>
      ) : (
        <span className="text-2xl font-bold text-primary">{price.toLocaleString()} FCFA</span>
      )}
      
      {/* VIP Badge for YA BA BOSS products - now clickable */}
      {isYaBaBoss && (
        <span 
          className={`${vipBadge.color} text-white text-xs px-2 py-1 rounded-full ml-auto flex items-center gap-1 cursor-pointer hover:brightness-90`}
          onClick={handleYaBaBossClick}
        >
          <Star size={10} fill="currentColor" />
          {vipBadge.level}
        </span>
      )}
    </div>
  );
};

export default PricingInfo;
