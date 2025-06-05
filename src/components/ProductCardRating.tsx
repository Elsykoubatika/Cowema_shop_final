
import React from 'react';
import { Star } from 'lucide-react';
import { useProductReviews } from '@/hooks/useProductReviews';

interface ProductCardRatingProps {
  productId: string;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ProductCardRating: React.FC<ProductCardRatingProps> = ({
  productId,
  showCount = true,
  size = 'sm'
}) => {
  const { averageRating, totalReviews, isLoading } = useProductReviews(productId);

  const starSize = size === 'sm' ? 12 : size === 'md' ? 16 : 20;
  const textSize = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base';

  if (isLoading) {
    return (
      <div className="flex items-center gap-1">
        <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (totalReviews === 0) {
    return (
      <div className="flex items-center gap-1 text-gray-400">
        <Star size={starSize} className="text-gray-300" />
        <span className={textSize}>Nouveau</span>
      </div>
    );
  }

  const renderStars = () => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={starSize}
        className={`${
          i < Math.round(averageRating)
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {renderStars()}
      </div>
      <span className={`${textSize} text-gray-600 font-medium`}>
        {averageRating.toFixed(1)}
      </span>
      {showCount && (
        <span className={`${textSize} text-gray-500`}>
          ({totalReviews})
        </span>
      )}
    </div>
  );
};

export default ProductCardRating;
