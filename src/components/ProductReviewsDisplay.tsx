
import React from 'react';
import { Star, Verified, MapPin } from 'lucide-react';
import { useProductReviews, ProductReview } from '@/hooks/useProductReviews';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ProductReviewsDisplayProps {
  productId: string;
  limit?: number;
  showTitle?: boolean;
  compact?: boolean;
}

const ProductReviewsDisplay: React.FC<ProductReviewsDisplayProps> = ({
  productId,
  limit = 5,
  showTitle = true,
  compact = false
}) => {
  const { reviews, isLoading, averageRating, totalReviews } = useProductReviews(productId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {showTitle && <div className="h-6 bg-gray-200 rounded animate-pulse"></div>}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  const displayedReviews = reviews.slice(0, limit);

  if (displayedReviews.length === 0) {
    return null;
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={compact ? 12 : 16}
        className={`${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: fr
      });
    } catch {
      return 'Récemment';
    }
  };

  return (
    <div className={`space-y-${compact ? '3' : '4'}`}>
      {showTitle && (
        <div className="flex items-center justify-between">
          <h3 className={`font-semibold ${compact ? 'text-lg' : 'text-xl'}`}>
            Avis clients ({totalReviews})
          </h3>
          {averageRating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className={`font-medium ${compact ? 'text-sm' : ''}`}>
                {averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      )}

      <div className={`space-y-${compact ? '3' : '4'}`}>
        {displayedReviews.map((review) => (
          <div
            key={review.id}
            className={`border rounded-lg p-${compact ? '3' : '4'} bg-white shadow-sm`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {renderStars(review.rating)}
                </div>
                {review.is_verified_purchase && (
                  <Badge variant="secondary" className="text-xs flex items-center gap-1">
                    <Verified size={10} />
                    Achat vérifié
                  </Badge>
                )}
              </div>
              <span className={`text-gray-500 ${compact ? 'text-xs' : 'text-sm'}`}>
                {formatDate(review.created_at)}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className={`font-medium ${compact ? 'text-sm' : ''}`}>
                {review.customer_name}
              </span>
              {review.customer_city && (
                <div className="flex items-center gap-1 text-gray-500">
                  <MapPin size={12} />
                  <span className="text-xs">{review.customer_city}</span>
                </div>
              )}
            </div>

            {review.comment && (
              <p className={`text-gray-700 ${compact ? 'text-sm' : ''} leading-relaxed`}>
                {review.comment}
              </p>
            )}
          </div>
        ))}
      </div>

      {reviews.length > limit && (
        <div className="text-center">
          <button className="text-primary hover:underline text-sm">
            Voir tous les avis ({reviews.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductReviewsDisplay;
