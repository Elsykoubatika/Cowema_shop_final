
import React from 'react';
import { Play, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SolarDemoCallToActionProps {
  productsCount: number;
  onNavigate: () => void;
}

const SolarDemoCallToAction: React.FC<SolarDemoCallToActionProps> = ({
  productsCount,
  onNavigate
}) => {
  if (productsCount > 3) {
    return (
      <div className="text-center">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 max-w-xl mx-auto">
          <div className="text-3xl mb-3">🎬</div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Encore {productsCount - 3} produit{productsCount - 3 > 1 ? 's' : ''} avec démonstration
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Découvrez tous nos tutoriels vidéo pour apprendre à maîtriser vos équipements solaires
          </p>
          <Button 
            onClick={onNavigate}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-md text-sm"
          >
            <Play size={16} className="mr-2" />
            Voir toutes les démonstrations
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  if (productsCount <= 3 && productsCount > 0) {
    return (
      <div className="text-center">
        <Button 
          onClick={onNavigate}
          variant="outline"
          className="px-6 py-2 hover:bg-blue-50 transition-colors text-sm"
        >
          <Play size={16} className="mr-2" />
          Voir la page dédiée aux démonstrations
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    );
  }

  return null;
};

export default SolarDemoCallToAction;
