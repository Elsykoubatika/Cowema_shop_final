
import React from 'react';
import { Wallet, TrendingUp } from 'lucide-react';

interface PaymentEmptyStateProps {
  availableToPayout: number;
  canRequestPayout: boolean;
  minPayoutAmount: number;
}

const PaymentEmptyState: React.FC<PaymentEmptyStateProps> = ({ 
  availableToPayout, 
  canRequestPayout, 
  minPayoutAmount 
}) => {
  return (
    <div className="py-16 px-8">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-blue-100 rounded-full mx-auto flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            <Wallet className="h-12 w-12 text-gray-400 relative z-10" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center animate-bounce">
            <span className="text-yellow-600 text-xl">💸</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-blue-600 bg-clip-text text-transparent">
            Vos premiers paiements arrivent ! 🎯
          </h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            {availableToPayout > 0 ? (
              <>
                Vous avez <span className="font-bold text-emerald-600">{availableToPayout.toLocaleString()} FCFA</span> en attente.
                {canRequestPayout ? (
                  <span className="text-green-700"> Vous pouvez maintenant demander un paiement ! 🎉</span>
                ) : (
                  <span className="text-blue-700"> Encore {(minPayoutAmount - availableToPayout).toLocaleString()} FCFA pour atteindre le minimum.</span>
                )}
              </>
            ) : (
              "Continuez à générer des commissions pour recevoir vos premiers paiements !"
            )}
          </p>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 space-y-4">
          <h4 className="font-bold text-amber-800 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-amber-600" />
            💡 Conseils pour augmenter vos gains
          </h4>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center gap-3 text-left">
              <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-amber-600 font-bold text-xs">1</span>
              </div>
              <span className="text-amber-700">Partagez régulièrement vos liens sur tous vos réseaux</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold text-xs">2</span>
              </div>
              <span className="text-amber-700">Créez du contenu engageant autour des produits</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold text-xs">3</span>
              </div>
              <span className="text-amber-700">Répondez aux questions de votre communauté</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚀</span>
            <div className="text-left">
              <h5 className="font-bold text-purple-800">Patience et persévérance !</h5>
              <p className="text-purple-700 text-sm">
                Vos efforts finiront par payer. Chaque partage compte !
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentEmptyState;
