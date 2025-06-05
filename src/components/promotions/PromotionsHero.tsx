
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Flame, Percent } from 'lucide-react';

interface PromotionsHeroProps {
  filteredProductsCount: number;
}

const PromotionsHero: React.FC<PromotionsHeroProps> = ({ filteredProductsCount }) => {
  return (
    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-16">
      <div className="container-cowema text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Flame size={32} fill="currentColor" />
          <h1 className="text-4xl md:text-5xl font-bold">Promotions</h1>
          <Percent size={32} />
        </div>
        <p className="text-xl opacity-90 max-w-2xl mx-auto">
          Profitez de nos meilleures offres avec des réductions exceptionnelles !
        </p>
        <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
          <Badge variant="secondary" className="bg-white/20 text-white">
            💥 Jusqu'à -50%
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white">
            🎯 {filteredProductsCount} articles en promo
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white">
            🚚 Livraison gratuite dès 25K
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default PromotionsHero;
