import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Promotion } from '@/hooks/usePromotionStore';
import { PromotionMetric } from '@/hooks/admin/metrics/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle } from 'lucide-react';

interface MetricsTabProps {
  isLoading: boolean;
  error: string | null;
  metrics: Record<string, PromotionMetric>;
  promotions: Promotion[];
  topPerformingPromos: Array<{ id: string; promo?: Promotion } & PromotionMetric>;
  onExportMetrics: () => void;
  onExportPromotions: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const MetricsTab: React.FC<MetricsTabProps> = ({
  isLoading,
  error,
  metrics,
  promotions,
  topPerformingPromos,
  onExportMetrics,
  onExportPromotions
}) => {
  // Vérifier s'il y a des données réelles
  const hasRealData = Object.values(metrics).some(metric => 
    metric.usageCount > 0 || metric.views > 0 || metric.totalRevenue > 0
  );

  // Calculer les données pour les graphiques seulement s'il y a des données réelles
  const conversionData = hasRealData ? promotions.map(promo => {
    const metric = metrics[promo.id];
    return {
      name: promo.code,
      conversion: metric?.conversionRate || 0,
      utilisations: metric?.usageCount || 0
    };
  }).filter(item => item.conversion > 0 || item.utilisations > 0).slice(0, 5) : [];

  const revenueData = hasRealData ? promotions.map(promo => {
    const metric = metrics[promo.id];
    return {
      name: promo.code,
      revenue: metric?.totalRevenue || 0,
      type: promo.discountType === 'percentage' ? 'Pourcentage' : 'Fixe'
    };
  }).filter(item => item.revenue > 0).slice(0, 5) : [];

  const typeDistribution = promotions.reduce((acc, promo) => {
    const type = promo.discountType === 'percentage' ? 'Pourcentage' : 'Fixe';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(typeDistribution).map(([type, count]) => ({
    name: type,
    value: count
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Analyse de performance</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onExportMetrics}>
            Exporter les métriques (CSV)
          </Button>
          <Button variant="outline" size="sm" onClick={onExportPromotions}>
            Exporter les promotions (CSV)
          </Button>
        </div>
      </div>
    
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState />
      ) : !hasRealData ? (
        <NoDataState />
      ) : (
        <>
          <BestPerformingPromotions topPerformingPromos={topPerformingPromos} />
          <PerformanceCharts 
            conversionData={conversionData}
            revenueData={revenueData}
            pieData={pieData}
          />
        </>
      )}
    </div>
  );
};

// Composants internes
const LoadingState = () => (
  <Card>
    <CardContent className="flex items-center justify-center h-40">
      <div className="text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2">Chargement des métriques...</p>
      </div>
    </CardContent>
  </Card>
);

const ErrorState = () => (
  <Card>
    <CardContent className="p-6">
      <div className="text-center text-red-500">
        <p>Erreur lors du chargement des métriques. Veuillez réessayer.</p>
      </div>
    </CardContent>
  </Card>
);

// Nouvel état pour indiquer l'absence de données
const NoDataState = () => (
  <Card>
    <CardContent className="p-6">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Aucune donnée de performance</h3>
        <p className="text-muted-foreground mb-4">
          Il n'y a pas encore d'utilisation ou de vente liée à vos promotions.
        </p>
        <div className="text-sm text-gray-600">
          <p>Les métriques apparaîtront ici quand :</p>
          <ul className="mt-2 space-y-1">
            <li>• Des clients consulteront vos promotions</li>
            <li>• Des codes promos seront utilisés</li>
            <li>• Des commandes seront passées avec ces promotions</li>
          </ul>
        </div>
      </div>
    </CardContent>
  </Card>
);

const BestPerformingPromotions = ({ topPerformingPromos }: { topPerformingPromos: Array<{ id: string; promo?: Promotion } & PromotionMetric> }) => {
  // Filtrer seulement les promotions avec des données réelles
  const realPerformingPromos = topPerformingPromos.filter(item => 
    item.usageCount > 0 || item.conversionRate > 0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Promotions les plus performantes</CardTitle>
      </CardHeader>
      <CardContent>
        {realPerformingPromos.length > 0 ? (
          <div className="space-y-4">
            {realPerformingPromos.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium">{item.promo?.code}</p>
                  <p className="text-sm text-muted-foreground">{item.promo?.description}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline">
                      {item.promo?.discountType === 'percentage' ? `${item.promo?.discount}%` : `${item.promo?.discount} FCFA`}
                    </Badge>
                    <Badge variant="secondary">
                      {item.promo?.target === 'ya-ba-boss' ? 'Ya Ba Boss' : 'Tous produits'}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{item.conversionRate.toFixed(1)}% de conversion</p>
                  <p className="text-sm">{item.usageCount} utilisations</p>
                  <p className="text-xs text-muted-foreground">{item.totalRevenue.toLocaleString()} FCFA générés</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <p className="text-muted-foreground">
              Aucune performance à afficher pour le moment
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Les données apparaîtront après les premières utilisations
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const PerformanceCharts = ({ 
  conversionData, 
  revenueData, 
  pieData 
}: { 
  conversionData: any[];
  revenueData: any[];
  pieData: any[];
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card>
      <CardHeader>
        <CardTitle>Taux de conversion par promotion</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        {conversionData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Conversion']} />
              <Bar dataKey="conversion" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Aucune donnée de conversion disponible
          </div>
        )}
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>Revenu généré par promotion</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        {revenueData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value.toLocaleString()} FCFA`, 'Revenu']} />
              <Bar dataKey="revenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Aucun revenu généré pour le moment
          </div>
        )}
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>Répartition par type de remise</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
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
        <CardTitle>Utilisations par promotion</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        {conversionData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="utilisations" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Aucune utilisation enregistrée
          </div>
        )}
      </CardContent>
    </Card>
  </div>
);

export default MetricsTab;
