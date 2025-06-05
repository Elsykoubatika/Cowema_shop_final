
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProductReview {
  id: string;
  userId: string;
  productId?: string;
  externalProductId?: string;
  rating: number;
  comment?: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  // Additional fields from join
  userProfile?: {
    nom: string;
    firstName?: string;
    lastName?: string;
  };
}

export const useSupabaseReviews = () => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all reviews
  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('product_reviews')
        .select(`
          *,
          profiles!inner(nom, first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Erreur lors du chargement des avis');
        return;
      }

      const formattedReviews: ProductReview[] = data.map(review => ({
        id: review.id,
        userId: review.user_id,
        productId: review.product_id,
        externalProductId: review.external_product_id,
        rating: review.rating,
        comment: review.comment,
        isVerifiedPurchase: review.is_verified_purchase,
        createdAt: review.created_at,
        userProfile: {
          nom: review.profiles.nom,
          firstName: review.profiles.first_name,
          lastName: review.profiles.last_name
        }
      }));

      setReviews(formattedReviews);
    } catch (error) {
      console.error('Error in fetchReviews:', error);
      toast.error('Erreur lors du chargement des avis');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add new review
  const addReview = useCallback(async (reviewData: {
    userId: string;
    productId?: string;
    externalProductId?: string;
    rating: number;
    comment?: string;
  }): Promise<ProductReview | null> => {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .insert({
          user_id: reviewData.userId,
          product_id: reviewData.productId,
          external_product_id: reviewData.externalProductId,
          rating: reviewData.rating,
          comment: reviewData.comment
        })
        .select(`
          *,
          profiles!inner(nom, first_name, last_name)
        `)
        .single();

      if (error) {
        console.error('Error adding review:', error);
        toast.error('Erreur lors de l\'ajout de l\'avis');
        return null;
      }

      const newReview: ProductReview = {
        id: data.id,
        userId: data.user_id,
        productId: data.product_id,
        externalProductId: data.external_product_id,
        rating: data.rating,
        comment: data.comment,
        isVerifiedPurchase: data.is_verified_purchase,
        createdAt: data.created_at,
        userProfile: {
          nom: data.profiles.nom,
          firstName: data.profiles.first_name,
          lastName: data.profiles.last_name
        }
      };

      setReviews(prev => [newReview, ...prev]);
      toast.success('Avis ajouté avec succès');
      return newReview;
    } catch (error) {
      console.error('Error in addReview:', error);
      toast.error('Erreur lors de l\'ajout de l\'avis');
      return null;
    }
  }, []);

  // Get reviews for a specific product
  const getReviewsForProduct = useCallback((productId: string): ProductReview[] => {
    return reviews.filter(review => 
      review.productId === productId || review.externalProductId === productId
    );
  }, [reviews]);

  // Get average rating for a product
  const getProductRating = useCallback((productId: string): { average: number; count: number } => {
    const productReviews = getReviewsForProduct(productId);
    if (productReviews.length === 0) {
      return { average: 0, count: 0 };
    }

    const average = productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length;
    return { average: Number(average.toFixed(1)), count: productReviews.length };
  }, [getReviewsForProduct]);

  // Update review
  const updateReview = useCallback(async (reviewId: string, updates: {
    rating?: number;
    comment?: string;
  }): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('product_reviews')
        .update(updates)
        .eq('id', reviewId);

      if (error) {
        console.error('Error updating review:', error);
        toast.error('Erreur lors de la mise à jour de l\'avis');
        return false;
      }

      setReviews(prev => prev.map(review => 
        review.id === reviewId ? { ...review, ...updates } : review
      ));

      toast.success('Avis mis à jour avec succès');
      return true;
    } catch (error) {
      console.error('Error in updateReview:', error);
      toast.error('Erreur lors de la mise à jour de l\'avis');
      return false;
    }
  }, []);

  // Delete review
  const deleteReview = useCallback(async (reviewId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('product_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) {
        console.error('Error deleting review:', error);
        toast.error('Erreur lors de la suppression de l\'avis');
        return false;
      }

      setReviews(prev => prev.filter(review => review.id !== reviewId));
      toast.success('Avis supprimé avec succès');
      return true;
    } catch (error) {
      console.error('Error in deleteReview:', error);
      toast.error('Erreur lors de la suppression de l\'avis');
      return false;
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    isLoading,
    addReview,
    updateReview,
    deleteReview,
    getReviewsForProduct,
    getProductRating,
    refetch: fetchReviews
  };
};
