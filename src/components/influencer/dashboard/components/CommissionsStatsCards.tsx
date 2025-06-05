
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { CommissionStats } from '@/hooks/influencer/useInfluencerCommissions';

interface CommissionsStatsCardsProps {
  stats: CommissionStats;
}

const CommissionsStatsCards: React.FC<CommissionsStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full mx-auto mb-3">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-green-700 mb-1">
              {stats.totalCommissions.toLocaleString()}
            </h3>
            <p className="text-sm text-green-600 font-medium">Total commissions</p>
            <p className="text-xs text-green-500 mt-1">💰 FCFA</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-blue-700 mb-1">
              {stats.paidCommissions.toLocaleString()}
            </h3>
            <p className="text-sm text-blue-600 font-medium">Commissions payées</p>
            <p className="text-xs text-blue-500 mt-1">✅ FCFA</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-500 rounded-full mx-auto mb-3">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-orange-700 mb-1">
              {stats.pendingCommissions.toLocaleString()}
            </h3>
            <p className="text-sm text-orange-600 font-medium">En attente</p>
            <p className="text-xs text-orange-500 mt-1">⏳ FCFA</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-full mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-purple-700 mb-1">
              {stats.thisMonthCommissions.toLocaleString()}
            </h3>
            <p className="text-sm text-purple-600 font-medium">Ce mois</p>
            <p className="text-xs text-purple-500 mt-1">
              {stats.growthPercentage > 0 ? '📈' : stats.growthPercentage < 0 ? '📉' : '📊'} 
              {stats.growthPercentage.toFixed(1)}%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionsStatsCards;
