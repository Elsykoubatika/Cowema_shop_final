
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface ProductNotFoundProps {
  totalCartItems: number;
  onCartClick: () => void;
}

const ProductNotFound: React.FC<ProductNotFoundProps> = ({ totalCartItems, onCartClick }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-6">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <ShoppingCart size={48} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Produit introuvable</h1>
          <p className="text-gray-600">
            Le produit que vous recherchez n'existe plus ou a été supprimé.
          </p>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/products')} 
            className="w-full flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour aux produits
          </Button>
          
          {totalCartItems > 0 && (
            <Button 
              variant="outline" 
              onClick={onCartClick}
              className="w-full flex items-center justify-center gap-2"
            >
              <ShoppingCart size={16} />
              Voir le panier ({totalCartItems})
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductNotFound;
