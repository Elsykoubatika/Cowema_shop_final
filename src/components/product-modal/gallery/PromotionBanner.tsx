
import React from 'react';
import PromoCountdown from '../../../components/PromoCountdown';
import PromoDisplay from '../../../components/PromoDisplay';
import { useActivePromotion } from '../../../hooks/usePromotionStore';

interface PromotionBannerProps {
  isYaBaBoss: boolean;
}

const PromotionBanner: React.FC<PromotionBannerProps> = ({ isYaBaBoss }) => {
  // Get active promotion
  const activePromotion = useActivePromotion();
  
  if (isYaBaBoss) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg">
        {activePromotion && (activePromotion.target === 'all' || activePromotion.target === 'ya-ba-boss') ? (
          <PromoDisplay variant="compact" showDescription={false} productsType="ya-ba-boss" />
        ) : (
          <PromoCountdown 
            endDate={new Date()} 
            isYaBaBoss={true}
            productId={Math.random().toString()} 
          />
        )}
      </div>
    );
  }
  
  if (activePromotion && activePromotion.target === 'all') {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg">
        <PromoDisplay variant="compact" showDescription={false} productsType="all" />
      </div>
    );
  }
  
  return null;
};

export default PromotionBanner;
