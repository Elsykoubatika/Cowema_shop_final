
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, ShoppingCart, Eye, Calendar, Download, MapPin, Smartphone } from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';

const AnalyticsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('7d');
  
  const getDateRange = () => {
    const end = endOfDay(new Date());
    let start;
    
    switch (dateRange) {
      case '1d': start = startOfDay(new Date()); break;
      case '7d': start = startOfDay(subDays(new Date(), 7)); break;
      case '30d': start = startOfDay(subDays(new Date(), 30)); break;
      case '90d': start = startOfDay(subDays(new Date(), 90)); break;
      default: start = startOfDay(subDays(new Date(), 7));
    }
    
    return { start, end };
  };

  // Analytics des visites
  const { data: siteVisits = [] } = useQuery({
    queryKey: ['site-visits-analytics', dateRange],
    queryFn: async () => {
      const { start, end } = getDateRange();
      const { data, error } = await supabase
        .from('site_visits')
        .select('*')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .order('created_at');
      
      if (error) throw error;
      return data;
    }
  });

  // Analytics des commandes
  const { data: ordersAnalytics = [] } = useQuery({
    queryKey: ['orders-analytics', dateRange],
    queryFn: async () => {
      const { start, end } = getDateRange();
      const { data, error } = await supabase
        .from('customer_orders')
        .select('*')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .order('created_at');
      
      if (error) throw error;
      return data;
    }
  });

  // Stats des produits
  const { data: productStats = [] } = useQuery({
    queryKey: ['product-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_stats')
        .select('*')
        .order('views', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  // Tracking comportemental
  const { data: behavioralData = [] } = useQuery({
    queryKey: ['behavioral-tracking', dateRange],
    queryFn: async () => {
      const { start, end } = getDateRange();
      const { data, error } = await supabase
        .from('behavioral_tracking')
        .select('*')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());
      
      if (error) throw error;
      return data;
    }
  });

  // Calculs des métriques
  const totalVisits = siteVisits.length;
  const uniqueVisitors = new Set(siteVisits.map(v => v.visitor_id)).size;
  const totalOrders = ordersAnalytics.length;
  const totalRevenue = ordersAnalytics.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const conversionRate = totalVisits > 0 ? (totalOrders / totalVisits * 100).toFixed(2) : '0';

  // Données pour les graphiques
  const visitsByDay = siteVisits.reduce((acc, visit) => {
    const day = format(new Date(visit.created_at), 'dd/MM');
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const ordersByDay = ordersAnalytics.reduce((acc, order) => {
    const day = format(new Date(order.created_at), 'dd/MM');
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys({...visitsByDay, ...ordersByDay}).map(day => ({
    day,
    visits: visitsByDay[day] || 0,
    orders: ordersByDay[day] || 0,
    revenue: ordersAnalytics
      .filter(o => format(new Date(o.created_at), 'dd/MM') === day)
      .reduce((sum, o) => sum + (o.total_amount || 0), 0)
  }));

  // Top pages
  const topPages = siteVisits.reduce((acc, visit) => {
    acc[visit.page_path] = (acc[visit.page_path] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topPagesData = Object.entries(topPages)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([page, count]) => ({ page, count }));

  // Données géographiques
  const citiesData = siteVisits.reduce((acc, visit) => {
    const city = visit.city || 'Inconnu';
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCities = Object.entries(citiesData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([city, count]) => ({ city, count }));

  // Données des appareils
  const deviceData = behavioralData.reduce((acc, data) => {
    const deviceType = data.user_agent?.includes('Mobile') ? 'Mobile' : 
                      data.user_agent?.includes('Tablet') ? 'Tablet' : 'Desktop';
    acc[deviceType] = (acc[deviceType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const deviceChartData = Object.entries(deviceData).map(([device, count]) => ({
    device,
    count,
    percentage: ((count / behavioralData.length) * 100).toFixed(1)
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard Analytics</h1>
          <p className="text-gray-600">Analysez les performances de votre site</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Aujourd'hui</SelectItem>
              <SelectItem value="7d">7 derniers jours</SelectItem>
              <SelectItem value="30d">30 derniers jours</SelectItem>
              <SelectItem value="90d">90 derniers jours</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-600" />
              Visites totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisits.toLocaleString()}</div>
            <Badge variant="secondary" className="mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% vs période précédente
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              Visiteurs uniques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueVisitors.toLocaleString()}</div>
            <Badge variant="secondary" className="mt-1">
              +8% vs période précédente
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-purple-600" />
              Commandes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
            <Badge variant="secondary" className="mt-1">
              +15% vs période précédente
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} FCFA</div>
            <Badge variant="secondary" className="mt-1">
              +22% vs période précédente
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <Badge variant="secondary" className="mt-1">
              +2% vs période précédente
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="traffic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="traffic">Trafic</TabsTrigger>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution du trafic</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="visits" stackId="1" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pages les plus visitées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPagesData.map((item, index) => (
                    <div key={item.page} className="flex justify-between items-center">
                      <span className="font-medium truncate flex-1">{item.page}</span>
                      <Badge variant="outline">{item.count} visites</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top des villes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topCities.map((item, index) => (
                    <div key={item.city} className="flex justify-between items-center">
                      <span className="font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {item.city}
                      </span>
                      <Badge variant="outline">{item.count} visiteurs</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des commandes et revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="orders" fill="#8884d8" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Produits les plus consultés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {productStats.map((stat, index) => (
                  <div key={stat.id} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <div className="font-medium">Produit #{stat.product_id?.substring(0, 8)}</div>
                      <div className="text-sm text-gray-600">
                        {stat.views} vues • {stat.purchases} achats
                      </div>
                    </div>
                    <Badge variant="outline">
                      {stat.purchases > 0 ? ((stat.purchases / stat.views) * 100).toFixed(1) : 0}% conversion
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par appareil</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={deviceChartData}
                      dataKey="count"
                      nameKey="device"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ device, percentage }) => `${device} (${percentage}%)`}
                    >
                      {deviceChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sessions par jour de la semaine</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="visits" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
