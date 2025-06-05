
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Users, 
  DollarSign,
  Target,
  Crown,
  Medal,
  RefreshCw
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useInfluencerPerformance, PerformanceStats } from '@/hooks/useInfluencerPerformance';

interface PerformanceComparisonProps {
  currentUserStats: {
    totalEarned: number;
    totalOrders: number;
    conversionRate: number;
    avgOrderValue: number;
  };
}

const PerformanceComparison: React.FC<PerformanceComparisonProps> = ({
  currentUserStats
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const { performanceStats, isLoading, getTopInfluencers, refetch } = useInfluencerPerformance(selectedPeriod);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />;
      case 3:
        return <Medal className="h-4 w-4 text-amber-600" />;
      default:
        return <Award className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPerformanceColor = (percentile: number) => {
    if (percentile >= 80) return 'text-green-600';
    if (percentile >= 60) return 'text-blue-600';
    if (percentile >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceLevel = (percentile: number) => {
    if (percentile >= 90) return { label: 'Excellence', color: 'bg-green-500' };
    if (percentile >= 75) return { label: 'Très bon', color: 'bg-blue-500' };
    if (percentile >= 50) return { label: 'Bon', color: 'bg-yellow-500' };
    if (percentile >= 25) return { label: 'Moyen', color: 'bg-orange-500' };
    return { label: 'À améliorer', color: 'bg-red-500' };
  };

  const formatValue = (value: number, type: string) => {
    switch (type) {
      case 'revenue':
      case 'avgValue':
        return `${value.toLocaleString()} FCFA`;
      case 'rate':
        return `${value.toFixed(1)}%`;
      default:
        return value.toString();
    }
  };

  const getMetrics = (stats: PerformanceStats) => [
    {
      label: 'Revenus totaux',
      value: stats.totalEarned.value,
      rank: stats.totalEarned.rank,
      percentile: stats.totalEarned.percentile,
      trend: stats.totalEarned.trend,
      trendValue: stats.totalEarned.trendValue,
      type: 'revenue'
    },
    {
      label: 'Nombre de commandes',
      value: stats.totalOrders.value,
      rank: stats.totalOrders.rank,
      percentile: stats.totalOrders.percentile,
      trend: stats.totalOrders.trend,
      trendValue: stats.totalOrders.trendValue,
      type: 'number'
    },
    {
      label: 'Taux de conversion',
      value: stats.conversionRate.value,
      rank: stats.conversionRate.rank,
      percentile: stats.conversionRate.percentile,
      trend: stats.conversionRate.trend,
      trendValue: stats.conversionRate.trendValue,
      type: 'rate'
    },
    {
      label: 'Panier moyen',
      value: stats.avgOrderValue.value,
      rank: stats.avgOrderValue.rank,
      percentile: stats.avgOrderValue.percentile,
      trend: stats.avgOrderValue.trend,
      trendValue: stats.avgOrderValue.trendValue,
      type: 'avgValue'
    }
  ];

  const topInfluencers = getTopInfluencers(4);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Comparaison de Performance
          </CardTitle>
          <CardDescription>
            Chargement des données de performance...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
            <Skeleton className="h-64" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Comparaison de Performance
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refetch}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
        </CardTitle>
        <CardDescription>
          Votre position par rapport aux autres influenceurs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as 'week' | 'month' | 'quarter')}>
          <TabsList className="mb-6">
            <TabsTrigger value="week">Cette semaine</TabsTrigger>
            <TabsTrigger value="month">Ce mois</TabsTrigger>
            <TabsTrigger value="quarter">Ce trimestre</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedPeriod}>
            {performanceStats ? (
              <>
                {/* Métriques de performance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {getMetrics(performanceStats).map((metric, index) => {
                    const level = getPerformanceLevel(metric.percentile);
                    return (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{metric.label}</span>
                            <div className="flex items-center gap-1">
                              {getTrendIcon(metric.trend)}
                              <span className={`text-xs ${
                                metric.trend === 'up' ? 'text-green-500' : 
                                metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                              }`}>
                                {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '' : '±'}
                                {metric.trendValue.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl font-bold">
                              {formatValue(metric.value, metric.type)}
                            </span>
                            <Badge variant="outline" className="flex items-center gap-1">
                              {getRankIcon(metric.rank)}
                              #{metric.rank}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span>Performance</span>
                              <span className={getPerformanceColor(metric.percentile)}>
                                {metric.percentile}e percentile
                              </span>
                            </div>
                            <Progress 
                              value={metric.percentile} 
                              className="h-2"
                            />
                            <div className="flex justify-between items-center">
                              <Badge 
                                variant="secondary" 
                                className={`${level.color} text-white text-xs`}
                              >
                                {level.label}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Classement des top influenceurs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Top Influenceurs - {selectedPeriod === 'week' ? 'Semaine' : selectedPeriod === 'month' ? 'Mois' : 'Trimestre'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {topInfluencers.map((influencer, index) => (
                        <div
                          key={influencer.influencerId}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            influencer.isCurrentUser 
                              ? 'bg-blue-50 border-blue-200' 
                              : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {getRankIcon(influencer.rank)}
                              <span className="font-bold text-lg">#{influencer.rank}</span>
                            </div>
                            <div>
                              <p className={`font-medium ${
                                influencer.isCurrentUser ? 'text-blue-600' : ''
                              }`}>
                                {influencer.name}
                                {influencer.isCurrentUser && (
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    C'est vous !
                                  </Badge>
                                )}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-bold text-green-600">
                              {influencer.totalEarned.toLocaleString()} FCFA
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {influencer.totalOrders} commandes
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Conseils d'amélioration */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">
                        💡 Conseils pour améliorer votre classement
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Partagez plus fréquemment sur vos réseaux sociaux</li>
                        <li>• Concentrez-vous sur les produits à fort taux de conversion</li>
                        <li>• Utilisez les outils marketing pour créer du contenu engageant</li>
                        <li>• Analysez les stratégies des top influenceurs</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  Aucune donnée de performance disponible pour cette période
                </p>
                <Button onClick={refetch} variant="outline">
                  Réessayer
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PerformanceComparison;
