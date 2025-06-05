
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';
import { OrderStats } from '@/hooks/influencer/useInfluencerOrders';

interface OrdersStatsCardsProps {
  stats: OrderStats;
}

const OrdersStatsCards: React.FC<OrdersStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-blue-700 mb-1">{stats.deliveredOrders}</h3>
            <p className="text-sm text-blue-600 font-medium">Commandes livrées</p>
            <p className="text-xs text-blue-500 mt-1">🚚 Avec succès</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mx-auto mb-4">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-green-700 mb-1">
              {stats.totalSalesAmount.toLocaleString()}
            </h3>
            <p className="text-sm text-green-600 font-medium">FCFA de ventes</p>
            <p className="text-xs text-green-500 mt-1">💰 Générées</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-purple-700 mb-1">
              {stats.avgOrderValue.toLocaleString()}
            </h3>
            <p className="text-sm text-purple-600 font-medium">FCFA en moyenne</p>
            <p className="text-xs text-purple-500 mt-1">📊 Par commande</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersStatsCards;
