
import React from 'react';
import Header from '../Header';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

interface ErrorStateProps {
  error: string;
  totalCartItems: number;
  onCartClick: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  totalCartItems, 
  onCartClick 
}) => {
  const navigate = useNavigate();

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    navigate('/products');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItemsCount={totalCartItems} onCartClick={onCartClick} />
      
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center">
          <div className="mb-6">
            <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Oops! Une erreur s'est produite
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            {error || "Impossible de charger le produit demandé."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleRetry} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Réessayer
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleGoBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour aux produits
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
