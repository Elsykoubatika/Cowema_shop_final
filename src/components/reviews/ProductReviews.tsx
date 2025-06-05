
import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useReviewSystem } from '@/hooks/useReviewSystem';
import { Product } from '@/types/product';
import ReviewsList from './ReviewsList';
import ReviewSubmissionForm from './ReviewSubmissionForm';

interface ProductReviewsProps {
  product: Product;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ product }) => {
  const { reviews, isLoading, fetchReviews, getProductRating } = useReviewSystem(product);
  const [rating, setRating] = useState({ average: 0, count: 0 });

  useEffect(() => {
    if (product?.externalApiId) {
      fetchReviews(product.externalApiId);
    }
  }, [product?.externalApiId]);

  useEffect(() => {
    const currentRating = getProductRating();
    setRating(currentRating);
  }, [reviews, getProductRating]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Avis clients</h3>
        
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                className={`${
                  i < Math.floor(rating.average)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {rating.average.toFixed(1)} sur 5 ({rating.count} avis)
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <ReviewSubmissionForm product={product} onReviewSubmitted={() => fetchReviews(product.externalApiId)} />
        <ReviewsList reviews={reviews} />
      </div>
    </div>
  );
};

export default ProductReviews;
