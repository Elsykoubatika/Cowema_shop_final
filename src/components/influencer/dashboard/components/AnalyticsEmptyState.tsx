
import React from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';

const AnalyticsEmptyState: React.FC = () => {
  return (
    <div className="py-16 px-8">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full mx-auto flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            <BarChart3 className="h-12 w-12 text-purple-400 relative z-10" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center animate-bounce">
            <span className="text-purple-600 text-xl">📊</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Vos analyses arrivent bientôt ! 📈
          </h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            Une fois que vous aurez généré vos premières ventes, vous verrez ici des analyses détaillées de vos performances ! 🎯
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 space-y-4">
          <h4 className="font-bold text-purple-800 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            Prochaines métriques disponibles
          </h4>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center gap-3 text-left">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-xs">📊</span>
              </div>
              <span className="text-purple-700">Taux de conversion détaillé</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-bold text-xs">📈</span>
              </div>
              <span className="text-purple-700">Analyse de croissance mensuelle</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-pink-600 font-bold text-xs">🎯</span>
              </div>
              <span className="text-purple-700">Performance par produit et catégorie</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚀</span>
            <div className="text-left">
              <h5 className="font-bold text-amber-800">Commencez dès maintenant !</h5>
              <p className="text-amber-700 text-sm">
                Partagez vos liens pour voir vos premières analyses apparaître.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsEmptyState;
