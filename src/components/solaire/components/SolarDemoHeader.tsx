
import React from 'react';
import { Play } from 'lucide-react';

interface SolarDemoHeaderProps {
  productsCount: number;
}

const SolarDemoHeader: React.FC<SolarDemoHeaderProps> = ({ productsCount }) => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-medium mb-3">
        <Play size={14} />
        <span className="text-sm">DÉMONSTRATIONS VIDÉO</span>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
        Produits Solaires avec Démonstrations
      </h2>
      
      <p className="text-base text-gray-600 max-w-2xl mx-auto mb-4">
        Découvrez nos produits solaires en action avec des démonstrations détaillées
      </p>
    </div>
  );
};

export default SolarDemoHeader;
