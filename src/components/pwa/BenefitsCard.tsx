
import React from 'react';
import { Zap, Sparkles, Pin, Shield } from 'lucide-react';

const BenefitsCard: React.FC = () => {
  return (
    <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1 bg-orange-100 rounded-full">
          <Zap className="h-4 w-4 text-orange-600" />
        </div>
        <p className="text-orange-800 font-semibold text-sm">Pourquoi installer Cowema ?</p>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1 text-orange-700">
          <Zap className="h-3 w-3" />
          <span>Accès en 1 clic</span>
        </div>
        <div className="flex items-center gap-1 text-orange-700">
          <Sparkles className="h-3 w-3" />
          <span>Plus rapide</span>
        </div>
        <div className="flex items-center gap-1 text-orange-700">
          <Pin className="h-3 w-3" />
          <span>Toujours visible</span>
        </div>
        <div className="flex items-center gap-1 text-orange-700">
          <Shield className="h-3 w-3" />
          <span>Fonctionne hors ligne</span>
        </div>
      </div>
    </div>
  );
};

export default BenefitsCard;
