
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useReviewSystem } from '@/hooks/useReviewSystem';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { Product } from '@/types/product';
import { toast } from 'sonner';

interface ReviewSubmissionFormProps {
  product: Product;
  onReviewSubmitted?: () => void;
}

const ReviewSubmissionForm: React.FC<ReviewSubmissionFormProps> = ({ 
  product, 
  onReviewSubmitted 
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { submitReview } = useReviewSystem(product);
  const { isAuthenticated, user } = useUnifiedAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour laisser un avis');
      return;
    }

    if (rating === 0) {
      toast.error('Veuillez sélectionner une note');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await submitReview({
        rating,
        comment
      });

      if (success) {
        toast.success('Votre avis a été soumis avec succès!');
        setRating(0);
        setComment('');
        onReviewSubmitted?.();
      } else {
        toast.error('Erreur lors de la soumission de votre avis');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Erreur lors de la soumission de votre avis');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <p className="text-gray-600">
          Connectez-vous pour laisser un avis sur ce produit
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-4">
      <h4 className="font-semibold mb-4">Laisser un avis</h4>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Note</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  size={24}
                  className={`${
                    star <= rating
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300 hover:text-yellow-200'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Commentaire (optionnel)</label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez votre expérience avec ce produit..."
            rows={4}
          />
        </div>

        <Button
          type="submit"
          disabled={rating === 0 || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Envoi en cours...' : 'Publier mon avis'}
        </Button>
      </form>
    </div>
  );
};

export default ReviewSubmissionForm;
