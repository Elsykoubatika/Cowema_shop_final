
import { useMemo } from 'react';
import { useReviewStore } from './useReviewStore';

export const useReviewData = (productId: string, reviewsType?: 'general' | 'yaBaBoss') => {
  const { reviews, getProductReviews, addReview } = useReviewStore();

  const productReviews = useMemo(() => {
    return getProductReviews(String(productId));
  }, [productId, getProductReviews]);

  const averageRating = useMemo(() => {
    const totalReviews = productReviews.length;
    return totalReviews > 0 
      ? productReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;
  }, [productReviews]);

  const totalReviews = productReviews.length;

  const ratingDistribution = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const rating = i + 1;
      const count = productReviews.filter(review => review.rating === rating).length;
      return { rating, count, percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0 };
    }).reverse();
  }, [productReviews, totalReviews]);

  const submitReview = (rating: number, comment: string, customerName: string) => {
    // Generate dummy IDs for the missing parameters
    const customerId = 'customer-' + Date.now();
    const orderId = 'order-' + Date.now();
    
    addReview(String(productId), customerId, customerName, rating, comment, orderId);
  };

  return {
    reviews: productReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews,
    ratingDistribution,
    submitReview
  };
};
