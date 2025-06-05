import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Star } from 'lucide-react';
import { useReviewStore } from '../hooks/useReviewStore';
import { useOrderStore } from '../hooks/useOrderStore';

interface ReviewFormProps {
  orderId: string;
  productId: string; // Changed from number to string
  customerId: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ orderId, productId, customerId }) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  
  const { toast } = useToast();
  const { addReview, hasReviewedProduct } = useReviewStore();
  const { getOrder } = useOrderStore();
  
  const order = getOrder(orderId);
  
  // Si la commande n'existe pas ou a déjà été notée
  if (!order || hasReviewedProduct(customerId, productId)) {
    return (
      <Card className="max-w-lg mx-auto my-8">
        <CardHeader>
          <CardTitle>Avis déjà soumis</CardTitle>
          <CardDescription>
            Vous avez déjà donné votre avis sur ce produit ou le lien n'est plus valide.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => window.location.href = "/"}>
            Retourner à l'accueil
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // Trouver le produit concerné dans la commande
  const product = order.items.find(item => item.id === productId); // Now both are strings
  
  if (!product) {
    return (
      <Card className="max-w-lg mx-auto my-8">
        <CardHeader>
          <CardTitle>Produit non trouvé</CardTitle>
          <CardDescription>
            Ce produit ne fait pas partie de votre commande.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => window.location.href = "/"}>
            Retourner à l'accueil
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating < 1) {
      toast({
        title: "Note requise",
        description: "Veuillez attribuer au moins une étoile.",
        variant: "destructive",
      });
      return;
    }
    
    // Ajouter la revue with string productId
    addReview(
      productId, // Now string
      customerId,
      `${order.customer.firstName} ${order.customer.lastName}`,
      rating,
      comment,
      orderId
    );
    
    // Afficher un message de confirmation
    toast({
      title: "Avis soumis",
      description: "Merci pour votre avis ! Un code de réduction de 10% vous sera envoyé prochainement.",
    });
    
    setIsSubmitted(true);
  };
  
  if (isSubmitted) {
    return (
      <Card className="max-w-lg mx-auto my-8">
        <CardHeader>
          <CardTitle>Merci pour votre avis !</CardTitle>
          <CardDescription>
            Votre avis a été soumis avec succès. Un code de réduction de 10% vous sera envoyé prochainement.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => window.location.href = "/"}>
            Retourner à l'accueil
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="max-w-lg mx-auto my-8">
      <CardHeader>
        <CardTitle>Donnez votre avis</CardTitle>
        <CardDescription>
          Partagez votre expérience avec {product.title}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="flex items-center justify-center mb-2">
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-32 h-32 object-contain" 
              />
            </div>
            <h3 className="text-center font-medium mb-4">{product.title}</h3>
            
            <div className="flex justify-center mb-6 gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`focus:outline-none ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <Star size={32} fill={star <= rating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
            
            <div className="mb-6">
              <label htmlFor="comment" className="block mb-2 text-sm font-medium">
                Votre commentaire
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Partagez votre expérience avec ce produit..."
                rows={5}
              />
            </div>
            
            <Button type="submit" className="w-full">
              Soumettre mon avis
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
