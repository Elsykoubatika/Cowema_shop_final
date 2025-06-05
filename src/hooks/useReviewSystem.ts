
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { useUnifiedAuth } from './useUnifiedAuth';

export interface ReviewData {
  id: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
}

interface SubmitReviewData {
  rating: number;
  comment: string;
}

export const useReviewSystem = (product?: Product) => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUnifiedAuth();

  const submitReview = async (reviewData: SubmitReviewData) => {
    if (!user || !product) return false;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .insert({
          external_product_id: product.externalApiId,
          user_id: user.id,
          rating: reviewData.rating,
          comment: reviewData.comment,
          is_verified_purchase: false
        });

      if (error) {
        console.error('Error submitting review:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error submitting review:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async (productId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          profiles!inner(nom)
        `)
        .eq('external_product_id', productId);

      if (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      } else {
        const formattedReviews = data?.map(review => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          userName: review.profiles?.nom || 'Utilisateur',
          createdAt: review.created_at
        })) || [];
        setReviews(formattedReviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getProductReviews = () => reviews;
  
  const getProductRating = () => {
    if (reviews.length === 0) return { average: 0, count: 0 };
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return {
      average: totalRating / reviews.length,
      count: reviews.length
    };
  };

  return {
    reviews,
    isLoading,
    submitReview,
    fetchReviews,
    getProductReviews,
    getProductRating
  };
};
