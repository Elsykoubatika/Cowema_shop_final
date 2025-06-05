
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Users, Target, TrendingUp, Calendar, Award, ArrowUp, ArrowDown } from 'lucide-react';
import { OrderStats } from '@/hooks/influencer/useInfluencerOrders';
import { CommissionStats } from '@/hooks/influencer/useInfluencerCommissions';

interface EnhancedAnalyticsStatsCardsProps {
  orderStats: OrderStats;
  commissionStats: CommissionStats;
  commissionRate: number;
}

const EnhancedAnalyticsStatsCards: React.FC<EnhancedAnalyticsStatsCardsProps> = ({ 
  orderStats, 
  commissionStats, 
  commissionRate 
}) => {
  const statsCards = [
    {
      title: "Taux de commission",
      value: `${commissionRate}%`,
      icon: DollarSign,
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-50 to-emerald-100",
      textColor: "text-green-700",
      subtitle: "💰 Par vente",
      change: null,
      description: "Commission fixe sur chaque vente"
    },
    {
      title: "Commandes livrées",
      value: orderStats.deliveredOrders.toString(),
      icon: Users,
      color: "from-blue-400 to-blue-500",
      bgColor: "from-blue-50 to-blue-100",
      textColor: "text-blue-700",
      subtitle: "🚚 Avec succès",
      change: orderStats.ordersGrowth,
      description: `${orderStats.thisMonthOrders} ce mois`
    },
    {
      title: "Valeur moyenne",
      value: `${orderStats.avgOrderValue.toLocaleString()} FCFA`,
      icon: Target,
      color: "from-purple-400 to-purple-500",
      bgColor: "from-purple-50 to-purple-100",
      textColor: "text-purple-700",
      subtitle: "📊 Par commande",
      change: null,
      description: "Panier moyen des clients"
    },
    {
      title: "Gains totaux",
      value: `${commissionStats.totalCommissions.toLocaleString()} FCFA`,
      icon: TrendingUp,
      color: "from-orange-400 to-orange-500",
      bgColor: "from-orange-50 to-orange-100",
      textColor: "text-orange-700",
      subtitle: "💎 Total généré",
      change: commissionStats.growthPercentage,
      description: `${commissionStats.thisMonthCommissions.toLocaleString()} FCFA ce mois`
    },
    {
      title: "Croissance mensuelle",
      value: `${commissionStats.growthPercentage > 0 ? '+' : ''}${commissionStats.growthPercentage.toFixed(1)}%`,
      icon: Calendar,
      color: "from-pink-400 to-rose-500",
      bgColor: "from-pink-50 to-rose-100",
      textColor: "text-pink-700",
      subtitle: commissionStats.growthPercentage > 0 ? '📈 En hausse' : commissionStats.growthPercentage < 0 ? '📉 En baisse' : '📊 Stable',
      change: null,
      description: "Évolution par rapport au mois dernier"
    },
    {
      title: "Taux de conversion",
      value: `${orderStats.conversionRate.toFixed(1)}%`,
      icon: Award,
      color: "from-teal-400 to-cyan-500",
      bgColor: "from-teal-50 to-cyan-100",
      textColor: "text-teal-700",
      subtitle: "🎯 Estimé",
      change: null,
      description: "Performance de vos liens"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsCards.map((stat, index) => (
        <Card 
          key={index}
          className={`bg-gradient-to-br ${stat.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group relative overflow-hidden`}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <div className={`w-full h-full bg-gradient-to-br ${stat.color} rounded-full transform translate-x-16 -translate-y-16`}></div>
          </div>
          
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className={`flex items-center justify-center w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              
              {stat.change !== null && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  stat.change > 0 
                    ? 'bg-green-100 text-green-700' 
                    : stat.change < 0 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-gray-100 text-gray-700'
                }`}>
                  {stat.change > 0 ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : stat.change < 0 ? (
                    <ArrowDown className="h-3 w-3" />
                  ) : null}
                  {Math.abs(stat.change).toFixed(1)}%
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className={`text-3xl font-bold ${stat.textColor} mb-1 group-hover:scale-105 transition-transform duration-300`}>
                {stat.value}
              </h3>
              <p className={`text-sm ${stat.textColor} font-medium`}>
                {stat.title}
              </p>
              <p className="text-xs opacity-75 mb-2">
                {stat.subtitle}
              </p>
              <p className={`text-xs ${stat.textColor} opacity-70`}>
                {stat.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EnhancedAnalyticsStatsCards;
