
import React from 'react';
import { Star } from 'lucide-react';
import { ReviewData } from '@/hooks/useReviewSystem';

interface ReviewsListProps {
  reviews: ReviewData[];
}

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aucun avis pour ce produit pour le moment.</p>
        <p className="text-sm mt-2">Soyez le premier à laisser un avis!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-lg">Avis clients ({reviews.length})</h4>
      
      {reviews.map((review) => (
        <div key={review.id} className="border rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">{review.userName}</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${
                      i < review.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString('fr-FR')}
            </span>
          </div>
          
          {review.comment && (
            <p className="text-gray-700 mt-2">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;
