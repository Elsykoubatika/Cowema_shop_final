
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Package, Sparkles } from 'lucide-react';

const OrdersEmptyState: React.FC = () => {
  return (
    <Card className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border-0 shadow-lg">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl animate-pulse"></div>
            <div className="relative flex items-center justify-center w-full h-full">
              <Package className="h-12 w-12 text-white" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Vos premières commandes arrivent bientôt ! 🚀
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Commencez à partager vos liens d'affiliation pour voir vos premières commandes livrées apparaître ici
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-purple-100">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
                <span className="text-purple-600 font-bold">1</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Partagez vos liens</h4>
              <p className="text-sm text-gray-600">Diffusez vos liens sur les réseaux sociaux</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Clients achètent</h4>
              <p className="text-sm text-gray-600">Via vos liens de parrainage uniques</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-green-100">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Commandes livrées</h4>
              <p className="text-sm text-gray-600">Vos commissions apparaissent ici !</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-6 text-white">
            <h4 className="font-bold text-lg mb-2">💡 Astuce pro</h4>
            <p className="text-purple-100">
              Plus vous partagez activement vos liens, plus vous générez de commandes livrées et de commissions !
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersEmptyState;
