
import React from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductReviewsDisplay from '../ProductReviewsDisplay';
import { useHybridProducts } from '@/hooks/useHybridProducts';
import { toast } from "sonner";

const TestimonialsSection: React.FC = () => {
  const { products } = useHybridProducts();
  
  // Filtrer pour obtenir les produits YA BA BOSS
  const yaBaBossProducts = products.filter(product => product.isYaBaBoss);
  
  const handleViewMoreTestimonials = () => {
    toast.success("Plus de témoignages seront disponibles prochainement!");
  };
  
  return (
    <section className="py-12 bg-gray-50">
      <div className="container-cowema">
        <h2 className="text-3xl font-bold mb-10 text-center flex items-center justify-center gap-2">
          <Star size={24} className="text-yellow-500" fill="currentColor" />
          Ce que disent nos clients YA BA BOSS
        </h2>
        
        {yaBaBossProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {yaBaBossProducts.slice(0, 6).map(product => (
              product.externalApiId && (
                <div key={product.id} className="bg-white rounded-lg p-6 shadow-lg">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{product.price} FCFA</p>
                  </div>
                  
                  <ProductReviewsDisplay 
                    productId={product.externalApiId}
                    limit={3}
                    showTitle={false}
                    compact={false}
                  />
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Aucun produit YA BA BOSS disponible pour le moment.</p>
          </div>
        )}
        
        <div className="mt-10 text-center">
          <Button 
            variant="outline" 
            onClick={handleViewMoreTestimonials} 
            className="py-2 px-6"
          >
            Voir plus de témoignages
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
