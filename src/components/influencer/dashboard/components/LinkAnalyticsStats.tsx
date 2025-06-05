
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MousePointer, 
  TrendingUp, 
  DollarSign, 
  Target,
  RefreshCw,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LinkAnalytics } from '@/hooks/useAffiliationAnalytics';

interface LinkAnalyticsStatsProps {
  analytics: LinkAnalytics;
  isLoading: boolean;
  onRefresh: () => void;
}

const LinkAnalyticsStats: React.FC<LinkAnalyticsStatsProps> = ({
  analytics,
  isLoading,
  onRefresh
}) => {
  const statsCards = [
    {
      title: 'Clics Totaux',
      value: analytics.totalClicks,
      icon: MousePointer,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12.5%',
      changeType: 'positive' as const
    },
    {
      title: 'Conversions',
      value: analytics.conversions,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8.3%',
      changeType: 'positive' as const
    },
    {
      title: 'Taux de Conversion',
      value: `${analytics.conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+2.1%',
      changeType: 'positive' as const
    },
    {
      title: 'Revenus Générés',
      value: `${analytics.revenue.toLocaleString()} FCFA`,
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '+15.7%',
      changeType: 'positive' as const
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                  <div className="w-12 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
                <div className="w-20 h-8 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">📊 Analytics en Temps Réel</h3>
          <p className="text-sm text-muted-foreground">
            Performances de vos liens d'affiliation
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className={`absolute inset-0 ${stat.bgColor} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
            <CardContent className="p-6 relative">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-green-100 text-green-700"
                  >
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sources de trafic */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Sources de Trafic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(analytics.clicksBySource).length > 0 ? (
              Object.entries(analytics.clicksBySource).map(([source, clicks]) => {
                const percentage = (clicks / analytics.totalClicks) * 100;
                return (
                  <div key={source} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium capitalize">{source}</span>
                      <span className="text-sm text-muted-foreground">
                        {clicks} clics ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune donnée de trafic pour le moment</p>
                <p className="text-sm">Partagez vos liens pour voir les statistiques</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkAnalyticsStats;
