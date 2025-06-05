
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AdminReview {
  id: string;
  customerName: string;
  productName: string;
  rating: number;
  comment?: string;
  date: string;
  status: 'pending' | 'published' | 'rejected';
  isVerifiedPurchase: boolean;
}

export const useAdminReviews = () => {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('product_reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          is_verified_purchase,
          user_id,
          product_id,
          external_product_id
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Erreur lors du chargement des avis');
        return;
      }

      // Transform data to AdminReview format with mock data since we don't have user/product names
      const transformedReviews: AdminReview[] = (data || []).map(review => ({
        id: review.id,
        customerName: review.user_id ? `Client-${review.user_id.slice(0, 8)}` : 'Client anonyme',
        productName: review.external_product_id || `Produit-${review.product_id?.slice(0, 8) || 'inconnu'}`,
        rating: review.rating || 0,
        comment: review.comment,
        date: review.created_at,
        status: 'published' as const, // Default status since we don't have this field
        isVerifiedPurchase: review.is_verified_purchase || false
      }));

      setReviews(transformedReviews);
    } catch (error) {
      console.error('Error in fetchReviews:', error);
      toast.error('Erreur lors du chargement des avis');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteReview = async (reviewId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('product_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) {
        console.error('Error deleting review:', error);
        toast.error('Erreur lors de la suppression');
        return false;
      }

      setReviews(prev => prev.filter(review => review.id !== reviewId));
      toast.success('Avis supprimé avec succès');
      return true;
    } catch (error) {
      console.error('Error in deleteReview:', error);
      toast.error('Erreur lors de la suppression');
      return false;
    }
  };

  const getStatistics = useCallback(() => {
    const totalReviews = reviews.length;
    const pendingReviews = reviews.filter(r => r.status === 'pending').length;
    const averageRating = totalReviews > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : '0.0';

    return {
      totalReviews,
      pendingReviews,
      averageRating: parseFloat(averageRating)
    };
  }, [reviews]);

  const refetch = useCallback(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    isLoading,
    deleteReview,
    getStatistics,
    refetch
  };
};
