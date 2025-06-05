
import React from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';

const CommissionsEmptyState: React.FC = () => {
  return (
    <div className="py-16 px-8">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mx-auto flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            <DollarSign className="h-12 w-12 text-purple-400 relative z-10" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center animate-bounce">
            <span className="text-yellow-600 text-xl">✨</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Vos premières commissions arrivent ! 🎯
          </h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            Une fois que vos commandes seront livrées, vous verrez ici l'historique détaillé de toutes vos commissions ! 💪
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 space-y-4">
          <h4 className="font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            Prochaines étapes pour vos premières commissions
          </h4>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center gap-3 text-left">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-xs">1</span>
              </div>
              <span className="text-gray-700">Commandes passées via vos liens</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xs">2</span>
              </div>
              <span className="text-gray-700">Expédition et livraison aux clients</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-xs">3</span>
              </div>
              <span className="text-gray-700">Commissions créditées automatiquement ici ! 🎉</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚀</span>
            <div className="text-left">
              <h5 className="font-bold text-amber-800">Continuez à partager !</h5>
              <p className="text-amber-700 text-sm">
                Plus vous partagez vos liens, plus vos commissions s'accumuleront ici.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionsEmptyState;
