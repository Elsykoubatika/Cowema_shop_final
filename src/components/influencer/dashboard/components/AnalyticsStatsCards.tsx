
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Users, Target, TrendingUp, Calendar, Award } from 'lucide-react';
import { OrderStats } from '@/hooks/influencer/useInfluencerOrders';
import { CommissionStats } from '@/hooks/influencer/useInfluencerCommissions';

interface AnalyticsStatsCardsProps {
  orderStats: OrderStats;
  commissionStats: CommissionStats;
  commissionRate: number;
}

const AnalyticsStatsCards: React.FC<AnalyticsStatsCardsProps> = ({ 
  orderStats, 
  commissionStats, 
  commissionRate 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Taux de commission */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mx-auto mb-4">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-green-700 mb-1">{commissionRate}%</h3>
            <p className="text-sm text-green-600 font-medium">Taux de commission</p>
            <p className="text-xs text-green-500 mt-1">💰 Par vente</p>
          </div>
        </CardContent>
      </Card>

      {/* Commandes totales */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-blue-700 mb-1">{orderStats.deliveredOrders}</h3>
            <p className="text-sm text-blue-600 font-medium">Commandes livrées</p>
            <p className="text-xs text-blue-500 mt-1">🚚 Avec succès</p>
          </div>
        </CardContent>
      </Card>

      {/* Valeur moyenne des commandes */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-purple-700 mb-1">
              {orderStats.avgOrderValue.toLocaleString()}
            </h3>
            <p className="text-sm text-purple-600 font-medium">FCFA en moyenne</p>
            <p className="text-xs text-purple-500 mt-1">📊 Par commande</p>
          </div>
        </CardContent>
      </Card>

      {/* Gains totaux */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-orange-700 mb-1">
              {commissionStats.totalCommissions.toLocaleString()}
            </h3>
            <p className="text-sm text-orange-600 font-medium">FCFA de gains</p>
            <p className="text-xs text-orange-500 mt-1">💎 Total généré</p>
          </div>
        </CardContent>
      </Card>

      {/* Croissance mensuelle */}
      <Card className="bg-gradient-to-br from-pink-50 to-rose-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-pink-500 rounded-full mx-auto mb-4">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-pink-700 mb-1">
              {commissionStats.growthPercentage > 0 ? '+' : ''}{commissionStats.growthPercentage.toFixed(1)}%
            </h3>
            <p className="text-sm text-pink-600 font-medium">Croissance mensuelle</p>
            <p className="text-xs text-pink-500 mt-1">
              {commissionStats.growthPercentage > 0 ? '📈 En hausse' : commissionStats.growthPercentage < 0 ? '📉 En baisse' : '📊 Stable'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Taux de conversion estimé */}
      <Card className="bg-gradient-to-br from-teal-50 to-cyan-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-teal-500 rounded-full mx-auto mb-4">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-teal-700 mb-1">
              {orderStats.conversionRate.toFixed(1)}%
            </h3>
            <p className="text-sm text-teal-600 font-medium">Taux de conversion</p>
            <p className="text-xs text-teal-500 mt-1">🎯 Estimé</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsStatsCards;
