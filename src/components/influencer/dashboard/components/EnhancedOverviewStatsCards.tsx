
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Trophy, Target, DollarSign, ShoppingBag } from 'lucide-react';
import { PerformanceStats } from '@/hooks/useInfluencerPerformance';

interface EnhancedOverviewStatsCardsProps {
  performanceStats: PerformanceStats | null;
  isLoading: boolean;
}

const EnhancedOverviewStatsCards: React.FC<EnhancedOverviewStatsCardsProps> = ({ 
  performanceStats, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border-0 shadow-lg animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                  <div className="w-16 h-6 bg-gray-300 rounded-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="w-20 h-4 bg-gray-300 rounded"></div>
                  <div className="w-24 h-8 bg-gray-300 rounded"></div>
                  <div className="w-16 h-3 bg-gray-300 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!performanceStats) {
    const defaultStats = [
      { 
        icon: DollarSign, 
        title: 'Gains Totaux', 
        value: '0 FCFA', 
        rank: '-',
        gradient: 'from-blue-500 via-blue-600 to-blue-700',
        bgPattern: 'from-blue-50 to-blue-100'
      },
      { 
        icon: ShoppingBag, 
        title: 'Commandes', 
        value: '0', 
        rank: '-',
        gradient: 'from-emerald-500 via-emerald-600 to-emerald-700',
        bgPattern: 'from-emerald-50 to-emerald-100'
      },
      { 
        icon: Target, 
        title: 'Conversion', 
        value: '0%', 
        rank: '-',
        gradient: 'from-purple-500 via-purple-600 to-purple-700',
        bgPattern: 'from-purple-50 to-purple-100'
      },
      { 
        icon: Trophy, 
        title: 'Panier Moyen', 
        value: '0 FCFA', 
        rank: '-',
        gradient: 'from-orange-500 via-orange-600 to-orange-700',
        bgPattern: 'from-orange-50 to-orange-100'
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {defaultStats.map((stat, index) => (
          <Card key={index} className={`group relative overflow-hidden bg-gradient-to-br ${stat.bgPattern} border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs font-medium bg-white/70 text-gray-600">
                    Nouveau
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Minus className="h-3 w-3" />
                    Commencez à vendre !
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      icon: DollarSign,
      title: 'Gains Totaux',
      value: `${performanceStats.totalEarned.value.toLocaleString()} FCFA`,
      rank: performanceStats.totalEarned.rank,
      trend: performanceStats.totalEarned.trend,
      trendValue: performanceStats.totalEarned.trendValue,
      gradient: 'from-blue-500 via-blue-600 to-blue-700',
      bgPattern: 'from-blue-50 to-blue-100',
      percentile: performanceStats.totalEarned.percentile
    },
    {
      icon: ShoppingBag,
      title: 'Commandes',
      value: performanceStats.totalOrders.value.toString(),
      rank: performanceStats.totalOrders.rank,
      trend: performanceStats.totalOrders.trend,
      trendValue: performanceStats.totalOrders.trendValue,
      gradient: 'from-emerald-500 via-emerald-600 to-emerald-700',
      bgPattern: 'from-emerald-50 to-emerald-100',
      percentile: performanceStats.totalOrders.percentile
    },
    {
      icon: Target,
      title: 'Conversion',
      value: `${performanceStats.conversionRate.value.toFixed(1)}%`,
      rank: performanceStats.conversionRate.rank,
      trend: performanceStats.conversionRate.trend,
      trendValue: performanceStats.conversionRate.trendValue,
      gradient: 'from-purple-500 via-purple-600 to-purple-700',
      bgPattern: 'from-purple-50 to-purple-100',
      percentile: performanceStats.conversionRate.percentile
    },
    {
      icon: Trophy,
      title: 'Panier Moyen',
      value: `${performanceStats.avgOrderValue.value.toLocaleString()} FCFA`,
      rank: performanceStats.avgOrderValue.rank,
      trend: performanceStats.avgOrderValue.trend,
      trendValue: performanceStats.avgOrderValue.trendValue,
      gradient: 'from-orange-500 via-orange-600 to-orange-700',
      bgPattern: 'from-orange-50 to-orange-100',
      percentile: performanceStats.avgOrderValue.percentile
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Minus;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-emerald-600 bg-emerald-100';
      case 'down': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => {
        const TrendIcon = getTrendIcon(stat.trend);
        const trendColorClass = getTrendColor(stat.trend);
        
        return (
          <Card key={index} className={`group relative overflow-hidden bg-gradient-to-br ${stat.bgPattern} border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-6 relative z-10">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.gradient} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className={`text-xs font-medium ${trendColorClass} border-0`}>
                      <TrendIcon className="h-3 w-3 mr-1" />
                      #{stat.rank}
                    </Badge>
                    <span className="text-xs text-gray-500">Top {stat.percentile}%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 transition-all duration-300 group-hover:text-gray-900">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1">
                    <TrendIcon className={`h-3 w-3 ${stat.trend === 'up' ? 'text-emerald-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'}`} />
                    <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-emerald-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
                      {stat.trend === 'up' ? '+' : stat.trend === 'down' ? '' : ''}{Math.abs(stat.trendValue).toFixed(1)}%
                    </span>
                    <span className="text-xs text-gray-500">vs période précédente</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default EnhancedOverviewStatsCards;
