import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Users, MousePointer, ShoppingCart, Eye, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  totalSessions: number;
  uniqueUsers: number;
  totalEvents: number;
  averageSessionDuration: number;
  topEvents: Array<{ type: string; count: number }>;
  userFlow: Array<{ page: string; visits: number; bounceRate: number }>;
  conversionMetrics: {
    cartAdds: number;
    checkouts: number;
    purchases: number;
    conversionRate: number;
  };
}

const TrackingAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedTimeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      
      // Calculer la date de début selon la période sélectionnée
      const endDate = new Date();
      const startDate = new Date();
      
      switch (selectedTimeRange) {
        case '1d':
          startDate.setDate(endDate.getDate() - 1);
          break;
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        default:
          startDate.setDate(endDate.getDate() - 7);
      }

      // Appeler notre edge function pour récupérer les données
      const response = await fetch(`https://hvrlcwfbujadozdhwvon.supabase.co/functions/v1/get_tracking_analytics?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      
      const trackingData = await response.json();
      const processedData = processTrackingData(trackingData || []);
      setAnalyticsData(processedData);
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalyticsData(getDefaultAnalyticsData());
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultAnalyticsData = (): AnalyticsData => {
    return {
      totalSessions: 0,
      uniqueUsers: 0,
      totalEvents: 0,
      averageSessionDuration: 0,
      topEvents: [],
      userFlow: [],
      conversionMetrics: {
        cartAdds: 0,
        checkouts: 0,
        purchases: 0,
        conversionRate: 0
      }
    };
  };

  const processTrackingData = (data: any[]): AnalyticsData => {
    if (!data || data.length === 0) {
      return getDefaultAnalyticsData();
    }

    const sessions = new Set(data.map(d => d.session_id));
    const users = new Set(data.map(d => d.device_id));
    
    const allEvents = data.flatMap(d => d.events || []);
    const eventCounts: Record<string, number> = {};

    allEvents.forEach((event: any) => {
      if (event && event.type) {
        eventCounts[event.type] = (eventCounts[event.type] || 0) + 1;
      }
    });

    const topEvents = Object.entries(eventCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([type, count]) => ({ type, count: count as number }));

    // Calculer les métriques de conversion
    const cartAdds = eventCounts['cart_add'] || 0;
    const checkouts = eventCounts['checkout_start'] || 0;
    const purchases = eventCounts['purchase_complete'] || 0;
    const conversionRate = sessions.size > 0 ? (purchases / sessions.size) * 100 : 0;

    return {
      totalSessions: sessions.size,
      uniqueUsers: users.size,
      totalEvents: allEvents.length,
      averageSessionDuration: 0, // À calculer selon les timestamps
      topEvents,
      userFlow: [], // À implémenter selon les besoins
      conversionMetrics: {
        cartAdds,
        checkouts,
        purchases,
        conversionRate
      }
    };
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return <div className="p-6 text-center">Aucune donnée disponible</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Comportementaux</h2>
        <div className="flex space-x-2">
          {['1d', '7d', '30d'].map(range => (
            <Badge
              key={range}
              variant={selectedTimeRange === range ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedTimeRange(range)}
            >
              {range === '1d' ? '24h' : range === '7d' ? '7 jours' : '30 jours'}
            </Badge>
          ))}
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sessions</p>
                <p className="text-2xl font-bold">{analyticsData.totalSessions}</p>
              </div>
              <Users className="text-blue-500" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Utilisateurs uniques</p>
                <p className="text-2xl font-bold">{analyticsData.uniqueUsers}</p>
              </div>
              <Activity className="text-green-500" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Événements</p>
                <p className="text-2xl font-bold">{analyticsData.totalEvents}</p>
              </div>
              <MousePointer className="text-purple-500" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taux de conversion</p>
                <p className="text-2xl font-bold">{analyticsData.conversionMetrics.conversionRate.toFixed(1)}%</p>
              </div>
              <ShoppingCart className="text-orange-500" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Événements</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="behavior">Comportement</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Top Événements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.topEvents.map((event, index) => (
                  <div key={event.type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="font-medium">{event.type}</span>
                    </div>
                    <Badge>{event.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ajouts panier</p>
                    <p className="text-xl font-bold">{analyticsData.conversionMetrics.cartAdds}</p>
                  </div>
                  <ShoppingCart className="text-blue-500" size={20} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Checkouts</p>
                    <p className="text-xl font-bold">{analyticsData.conversionMetrics.checkouts}</p>
                  </div>
                  <Eye className="text-green-500" size={20} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Achats</p>
                    <p className="text-xl font-bold">{analyticsData.conversionMetrics.purchases}</p>
                  </div>
                  <Clock className="text-purple-500" size={20} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="behavior">
          <Card>
            <CardHeader>
              <CardTitle>Analyse comportementale</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Données détaillées sur le parcours utilisateur et les interactions.
                Cette section peut être étendue avec des graphiques et analyses plus poussées.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrackingAnalytics;
