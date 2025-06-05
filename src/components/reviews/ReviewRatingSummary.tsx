
import React from 'react';
import { Star } from 'lucide-react';

interface ReviewRatingSummaryProps {
  averageRating: number;
  displayRating: string;
  totalReviews: number;
  reviewCounts: { stars: number; count: number }[];
}

const ReviewRatingSummary: React.FC<ReviewRatingSummaryProps> = ({ 
  averageRating, 
  displayRating,
  totalReviews,
  reviewCounts
}) => {
  // Fonction pour afficher correctement le texte en français selon le nombre
  const getReviewsText = (count: number) => {
    return count === 1 ? '1 avis' : `${count} avis`;
  };

  return (
    <div className="bg-white p-6 mb-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Left side - Big rating display */}
        <div className="flex flex-col items-start">
          <div className="text-5xl font-bold text-gray-800 mb-2">
            {displayRating}
          </div>
          <div className="flex text-green-600 mb-2">
            {Array(5).fill(0).map((_, i) => (
              <Star 
                key={i} 
                size={20}
                fill={i < Math.floor(averageRating) ? "currentColor" : "none"}
                fillOpacity={i < Math.floor(averageRating) ? 1 : 0.2}
                stroke={i < Math.ceil(averageRating) ? "currentColor" : "#e5e7eb"}
              />
            ))}
            <span className="ml-2 text-gray-700 font-medium">{averageRating > 0 ? averageRating.toFixed(1) : '—'}</span>
          </div>
          <div className="text-sm text-gray-600">
            {getReviewsText(totalReviews)}
          </div>
        </div>
        
        {/* Right side - Bar chart */}
        <div className="flex-1 w-full">
          <div className="space-y-1.5">
            {reviewCounts.map(({ stars, count }) => {
              // Calculate percentage of reviews with this rating
              const percentage = totalReviews > 0 
                ? (count / totalReviews) * 100
                : 0;
              
              return (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 w-4">{stars}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewRatingSummary;
