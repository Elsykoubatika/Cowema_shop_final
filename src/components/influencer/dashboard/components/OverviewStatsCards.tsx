
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PerformanceStats } from '@/hooks/useInfluencerPerformance';

interface OverviewStatsCardsProps {
  performanceStats: PerformanceStats | null;
  isLoading: boolean;
}

const OverviewStatsCards: React.FC<OverviewStatsCardsProps> = ({ 
  performanceStats, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse">
            <CardContent className="p-4">
              <div className="text-center space-y-2">
                <div className="h-4 bg-gray-400 rounded w-3/4 mx-auto"></div>
                <div className="h-8 bg-gray-400 rounded w-1/2 mx-auto"></div>
                <div className="h-3 bg-gray-400 rounded w-2/3 mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!performanceStats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Gains Totaux', value: '0 FCFA', rank: '-' },
          { title: 'Commandes', value: '0', rank: '-' },
          { title: 'Conversion', value: '0%', rank: '-' },
          { title: 'Panier Moyen', value: '0 FCFA', rank: '-' }
        ].map((stat, index) => (
          <Card key={index} className="bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-600">{stat.value}</p>
                <p className="text-xs text-gray-400">Rang {stat.rank}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: 'Gains Totaux',
      value: `${performanceStats.totalEarned.value.toLocaleString()} FCFA`,
      rank: performanceStats.totalEarned.rank,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Commandes',
      value: performanceStats.totalOrders.value.toString(),
      rank: performanceStats.totalOrders.rank,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Conversion',
      value: `${performanceStats.conversionRate.value.toFixed(1)}%`,
      rank: performanceStats.conversionRate.rank,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Panier Moyen',
      value: `${performanceStats.avgOrderValue.value.toLocaleString()} FCFA`,
      rank: performanceStats.avgOrderValue.rank,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <Card key={index} className={`bg-gradient-to-r ${stat.color} text-white`}>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm opacity-90">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs opacity-75">Rang #{stat.rank}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OverviewStatsCards;
