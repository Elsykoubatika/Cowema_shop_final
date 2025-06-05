import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, ShoppingCart, Users, TrendingUp, Download, Calendar } from 'lucide-react';
import { useAnalyticsDashboard } from '@/hooks/admin/useAnalyticsDashboard';
import DashboardCustomizer from './DashboardCustomizer';
import { Badge } from '@/components/ui/badge';

interface DashboardConfig {
  widgets: {
    revenue: boolean;
    orders: boolean;
    customers: boolean;
    conversion: boolean;
    traffic: boolean;
    behavioral: boolean;
    facebook: boolean;
  };
  dateRangeDefault: string;
  refreshInterval: number;
  chartTypes: {
    revenue: 'bar' | 'line' | 'area';
    orders: 'bar' | 'line' | 'area';
    traffic: 'bar' | 'line' | 'area';
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const defaultConfig: DashboardConfig = {
  widgets: {
    revenue: true,
    orders: true,
    customers: true,
    conversion: true,
    traffic: true,
    behavioral: true,
    facebook: true
  },
  dateRangeDefault: '30days',
  refreshInterval: 5,
  chartTypes: {
    revenue: 'bar',
    orders: 'line',
    traffic: 'area'
  },
  colors: {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f59e0b'
  }
};

const CustomizableAnalyticsDashboard: React.FC = () => {
  const [config, setConfig] = useState<DashboardConfig>(defaultConfig);
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const { metrics, isLoading, dateRange, setDateRange, refetch, exportMetrics } = useAnalyticsDashboard();

  useEffect(() => {
    const savedConfig = localStorage.getItem('dashboard_config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const saveConfig = () => {
    localStorage.setItem('dashboard_config', JSON.stringify(config));
    console.log('Configuration sauvegardée');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const renderChart = (type: 'bar' | 'line' | 'area', data: any[], dataKey: string, color: string) => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => dataKey === 'revenue' ? formatCurrency(Number(value)) : value} />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => dataKey === 'revenue' ? formatCurrency(Number(value)) : value} />
            <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.3} />
          </AreaChart>
        );
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => dataKey === 'revenue' ? formatCurrency(Number(value)) : value} />
            <Bar dataKey={dataKey} fill={color} />
          </BarChart>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Impossible de charger les métriques</p>
          <Button onClick={() => refetch()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <DashboardCustomizer
        config={config}
        onConfigChange={setConfig}
        onSave={saveConfig}
      />

      {/* Header personnalisable */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Analytics Personnalisé</h1>
          {appliedFilters.length > 0 && (
            <div className="flex gap-2 mt-2">
              {appliedFilters.map(filter => (
                <Badge key={filter} variant="secondary">{filter}</Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 derniers jours</SelectItem>
              <SelectItem value="30days">30 derniers jours</SelectItem>
              <SelectItem value="90days">90 derniers jours</SelectItem>
              <SelectItem value="year">1 an</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportMetrics} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPI Cards personnalisables */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {config.widgets.revenue && (
          <Card style={{ borderColor: config.colors.primary }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" style={{ color: config.colors.primary }} />
                Revenus totaux
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
              <p className="text-xs text-green-600 mt-1">+12% vs période précédente</p>
            </CardContent>
          </Card>
        )}

        {config.widgets.orders && (
          <Card style={{ borderColor: config.colors.secondary }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <ShoppingCart className="h-4 w-4 mr-2" style={{ color: config.colors.secondary }} />
                Commandes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalOrders}</div>
              <p className="text-xs text-green-600 mt-1">+8% vs période précédente</p>
            </CardContent>
          </Card>
        )}

        {config.widgets.customers && (
          <Card style={{ borderColor: config.colors.accent }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Users className="h-4 w-4 mr-2" style={{ color: config.colors.accent }} />
                Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalCustomers}</div>
              <p className="text-xs text-blue-600 mt-1">{metrics.customerMetrics.newCustomers} nouveaux</p>
            </CardContent>
          </Card>
        )}

        {config.widgets.conversion && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Panier moyen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.averageOrderValue)}</div>
              <p className="text-xs text-orange-600 mt-1">{metrics.conversionRate.toFixed(1)}% conversion</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Charts Grid personnalisables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {config.widgets.revenue && (
          <Card>
            <CardHeader>
              <CardTitle>Revenus mensuels</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                {renderChart(config.chartTypes.revenue, metrics.monthlyRevenue, 'revenue', config.colors.primary)}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {config.widgets.orders && (
          <Card>
            <CardHeader>
              <CardTitle>Évolution des commandes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                {renderChart(config.chartTypes.orders, metrics.monthlyRevenue, 'orders', config.colors.secondary)}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Section Facebook Pixel si activée */}
      {config.widgets.facebook && (
        <Card>
          <CardHeader>
            <CardTitle>Métriques Facebook Pixel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800">Conversions Facebook</h3>
                <p className="text-2xl font-bold text-blue-600">--</p>
                <p className="text-sm text-blue-600">En cours d'implémentation</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800">Événements trackés</h3>
                <p className="text-2xl font-bold text-green-600">--</p>
                <p className="text-sm text-green-600">PageView, AddToCart, etc.</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800">Audiences FB</h3>
                <p className="text-2xl font-bold text-purple-600">--</p>
                <p className="text-sm text-purple-600">Retargeting disponible</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomizableAnalyticsDashboard;
