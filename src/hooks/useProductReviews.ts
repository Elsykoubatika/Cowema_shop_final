
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProductReview {
  id: string;
  external_product_id: string;
  user_id: string | null;
  rating: number;
  comment: string | null;
  is_verified_purchase: boolean;
  created_at: string;
  customer_name?: string;
  customer_city?: string;
}

export const useProductReviews = (productId?: string) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const fetchReviews = async (externalProductId: string) => {
    try {
      setIsLoading(true);
      
      // Récupérer les avis avec les informations des clients
      const { data, error } = await supabase
        .from('product_reviews')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            city
          )
        `)
        .eq('external_product_id', externalProductId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des avis:', error);
        return;
      }

      // Formatter les données avec les noms des clients
      const formattedReviews: ProductReview[] = data.map(review => ({
        id: review.id,
        external_product_id: review.external_product_id,
        user_id: review.user_id,
        rating: review.rating || 0,
        comment: review.comment,
        is_verified_purchase: review.is_verified_purchase || false,
        created_at: review.created_at,
        customer_name: review.profiles 
          ? `${review.profiles.first_name || ''} ${review.profiles.last_name || ''}`.trim()
          : 'Client anonyme',
        customer_city: review.profiles?.city || 'Congo'
      }));

      setReviews(formattedReviews);
      
      // Calculer la moyenne et le total
      const validRatings = formattedReviews.filter(r => r.rating > 0);
      const average = validRatings.length > 0 
        ? validRatings.reduce((sum, r) => sum + r.rating, 0) / validRatings.length 
        : 0;
      
      setAverageRating(average);
      setTotalReviews(validRatings.length);

    } catch (error) {
      console.error('Erreur lors de la récupération des avis:', error);
      toast.error('Erreur lors du chargement des avis');
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer les avis pour les produits populaires (utilisé dans la bannière)
  const fetchPopularProductsReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select(`
          external_product_id,
          rating,
          profiles:user_id (
            first_name,
            city
          )
        `)
        .not('rating', 'is', null)
        .gte('rating', 4);

      if (error) {
        console.error('Erreur lors de la récupération des avis populaires:', error);
        return {};
      }

      // Grouper par produit
      const reviewsByProduct: Record<string, { average: number; count: number; topCustomer?: string }> = {};
      
      data.forEach(review => {
        const productId = review.external_product_id;
        if (!reviewsByProduct[productId]) {
          reviewsByProduct[productId] = { average: 0, count: 0 };
        }
        
        reviewsByProduct[productId].average += review.rating;
        reviewsByProduct[productId].count += 1;
        
        // Garder un client exemple pour affichage
        if (!reviewsByProduct[productId].topCustomer && review.profiles) {
          reviewsByProduct[productId].topCustomer = `${review.profiles.first_name} de ${review.profiles.city}`;
        }
      });

      // Calculer les moyennes
      Object.keys(reviewsByProduct).forEach(productId => {
        const product = reviewsByProduct[productId];
        product.average = product.average / product.count;
      });

      return reviewsByProduct;
    } catch (error) {
      console.error('Erreur lors de la récupération des avis populaires:', error);
      return {};
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews(productId);
    }
  }, [productId]);

  return {
    reviews,
    isLoading,
    averageRating,
    totalReviews,
    fetchReviews,
    fetchPopularProductsReviews
  };
};
