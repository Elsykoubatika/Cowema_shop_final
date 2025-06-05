
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, DollarSign } from 'lucide-react';
import { PerformanceStats } from '@/hooks/useInfluencerPerformance';

interface OverviewMainChartProps {
  chartData: Array<{ month: string; amount: number }>;
  performanceStats: PerformanceStats | null;
  isLoading: boolean;
}

const OverviewMainChart: React.FC<OverviewMainChartProps> = ({ 
  chartData, 
  performanceStats, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-600">Chargement des données de performance...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasData = chartData && chartData.length > 0 && chartData.some(item => item.amount > 0);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Évolution des Commissions
          {performanceStats && (
            <span className="text-sm font-normal text-blue-600">
              (Rang #{performanceStats.totalEarned.rank} - Top {performanceStats.totalEarned.percentile}%)
            </span>
          )}
        </CardTitle>
        <CardDescription>
          {hasData ? 
            'Vos gains au fil du temps' : 
            'Aucune commission générée pour le moment'
          }
          {performanceStats?.totalEarned.trend === 'up' && hasData && (
            <span className="text-green-600 font-medium"> - Tendance croissante ! 📈</span>
          )}
          {performanceStats?.totalEarned.trend === 'down' && hasData && (
            <span className="text-red-600 font-medium"> - En baisse 📉</span>
          )}
          {performanceStats?.totalEarned.trend === 'stable' && hasData && (
            <span className="text-blue-600 font-medium"> - Stable 📊</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  stroke="#6B7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                />
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <Tooltip 
                  formatter={(value: number) => [`${value.toLocaleString()} FCFA`, 'Commission']}
                  labelFormatter={(label) => `Mois: ${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-blue-200">
            <DollarSign className="h-16 w-16 mx-auto text-blue-300 mb-4" />
            <p className="text-blue-600 font-medium text-lg mb-2">Votre parcours commence ici !</p>
            <p className="text-blue-500 text-sm">
              Partagez vos liens pour voir vos premières commissions apparaître ! 🚀
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OverviewMainChart;
