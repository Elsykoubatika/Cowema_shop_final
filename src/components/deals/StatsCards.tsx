
import React from 'react';
import { Crown, Flame } from 'lucide-react';
import { Product } from '@/types/product';

interface StatsCardsProps {
  selectedDeals: Product[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ selectedDeals }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-gradient-to-br from-red-600/80 to-red-700/80 backdrop-blur-sm rounded-xl p-6 text-center border border-red-500/30">
        <div className="text-3xl font-black text-white mb-2 flex items-center justify-center gap-2">
          <Flame size={24} />
          {selectedDeals.filter(p => p.isFlashOffer).length}
        </div>
        <div className="text-sm text-red-100 font-medium">
          Flash Offers
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-yellow-600/80 to-yellow-700/80 backdrop-blur-sm rounded-xl p-6 text-center border border-yellow-500/30">
        <div className="text-3xl font-black text-white mb-2 flex items-center justify-center gap-2">
          <Crown size={24} />
          {selectedDeals.filter(p => p.isYaBaBoss).length}
        </div>
        <div className="text-sm text-yellow-100 font-medium">
          Ya Ba Boss
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-green-600/80 to-green-700/80 backdrop-blur-sm rounded-xl p-6 text-center border border-green-500/30">
        <div className="text-3xl font-black text-white mb-2">
          {selectedDeals.filter(p => p.promoPrice && p.promoPrice < p.price).length}
        </div>
        <div className="text-sm text-green-100 font-medium">
          Promos Actives
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-blue-600/80 to-blue-700/80 backdrop-blur-sm rounded-xl p-6 text-center border border-blue-500/30">
        <div className="text-3xl font-black text-white mb-2">
          {new Set(selectedDeals.map(p => p.category)).size}
        </div>
        <div className="text-sm text-blue-100 font-medium">
          Catégories
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
