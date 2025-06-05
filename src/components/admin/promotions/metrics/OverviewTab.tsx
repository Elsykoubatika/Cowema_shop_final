import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Eye, Copy, CheckCircle, CircleDollarSign } from 'lucide-react';
import { PromotionMetric } from '../../../../hooks/admin/metrics/types';

interface OverviewTabProps {
  metrics: Record<string, PromotionMetric>;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ metrics }) => {
  const metricsArray = Object.values(metrics);
  
  // Préparation des données pour les graphiques
  const barChartData = metricsArray.map(metric => ({
    name: metric.code,
    Vues: metric.timesViewed,
    Copies: metric.timesCopied,
    Utilisations: metric.timesApplied
  }));
  
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-500" />
              Total des vues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metricsArray.reduce((sum, metric) => sum + metric.timesViewed, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Copy className="h-4 w-4 text-amber-500" />
              Total des copies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metricsArray.reduce((sum, metric) => sum + metric.timesCopied, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Total des utilisations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metricsArray.reduce((sum, metric) => sum + metric.usageCount, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CircleDollarSign className="h-4 w-4 text-emerald-500" />
              Revenus générés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metricsArray.reduce((sum, metric) => sum + metric.revenueGenerated, 0).toLocaleString('fr-FR')} €
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Performance par code promo</h4>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Vues" fill="#8884d8" />
              <Bar dataKey="Copies" fill="#82ca9d" />
              <Bar dataKey="Utilisations" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
