
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { TrendingUp, DollarSign, Sparkles, BarChart3 } from 'lucide-react';
import { PerformanceStats } from '@/hooks/useInfluencerPerformance';

interface ModernOverviewChartProps {
  chartData: Array<{ month: string; amount: number }>;
  performanceStats: PerformanceStats | null;
  isLoading: boolean;
}

const ModernOverviewChart: React.FC<ModernOverviewChartProps> = ({ 
  chartData, 
  performanceStats, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 border-0 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
        <CardContent className="flex items-center justify-center py-20 relative z-10">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto flex items-center justify-center animate-spin">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto opacity-20 animate-ping"></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Analyse des performances
              </h3>
              <p className="text-gray-600">Calcul de vos métriques en cours...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasData = chartData && chartData.length > 0 && chartData.some(item => item.amount > 0);

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 border-0 shadow-xl group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/8 group-hover:to-purple-500/8 transition-all duration-500"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full translate-y-12 -translate-x-12"></div>
      
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-800">
                Évolution des Commissions
              </CardTitle>
              {performanceStats && (
                <CardDescription className="flex items-center gap-2 mt-1">
                  <span className="text-gray-600">Classement #{performanceStats.totalEarned.rank}</span>
                  <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full">
                    Top {performanceStats.totalEarned.percentile}%
                  </span>
                </CardDescription>
              )}
            </div>
          </div>
          {hasData && (
            <div className="flex items-center gap-2 text-sm">
              {performanceStats?.totalEarned.trend === 'up' && (
                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                  <TrendingUp className="h-3 w-3" />
                  <span className="font-medium">Croissance</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        {hasData ? (
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.9}/>
                    <stop offset="50%" stopColor="#8B5CF6" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.5} />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748B"
                  fontSize={12}
                  fontWeight="500"
                  tick={{ fill: '#64748B' }}
                />
                <YAxis 
                  stroke="#64748B"
                  fontSize={12}
                  fontWeight="500"
                  tick={{ fill: '#64748B' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toLocaleString()} FCFA`, 'Commission']}
                  labelFormatter={(label) => `${label}`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                  labelStyle={{ color: '#374151', fontWeight: '600' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="url(#colorAmount)" 
                  strokeWidth={3}
                  fill="url(#colorAmount)" 
                  dot={{ fill: '#6366F1', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#6366F1', strokeWidth: 3, fill: '#FFFFFF' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="space-y-4">
              <div className="relative inline-block">
                <DollarSign className="h-16 w-16 text-gray-300 mx-auto" />
                <Sparkles className="h-6 w-6 text-blue-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-700">Votre parcours commence ici !</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  Partagez vos liens d'affiliation pour voir vos premières commissions apparaître dans ce graphique.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Commencer maintenant
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModernOverviewChart;
