
import React from 'react';
import { useReviewData } from '../hooks/useReviewData';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface CustomerReviewsProps {
  reviewsType?: 'general' | 'yaBaBoss';
  productId?: string;
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({ 
  reviewsType = 'general',
  productId = 'general'
}) => {
  const { reviews, averageRating, totalReviews, ratingDistribution } = useReviewData(productId, reviewsType);

  if (!reviews || reviews.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Avis clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Aucun avis disponible pour le moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Avis clients ({totalReviews})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= averageRating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            {ratingDistribution.map((item) => (
              <div key={item.rating} className="flex items-center gap-2">
                <span className="text-sm w-8">{item.rating}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {reviews.slice(0, 3).map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <Badge variant="outline">Vérifié</Badge>
              </div>
              <p className="text-gray-700 mb-2">{review.comment}</p>
              <p className="text-sm text-gray-500">
                Publié le {new Date(review.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerReviews;
