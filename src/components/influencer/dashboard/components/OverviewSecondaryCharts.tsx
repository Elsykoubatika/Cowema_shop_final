
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { Target, Calendar } from 'lucide-react';
import { PerformanceStats } from '@/hooks/useInfluencerPerformance';
import { MonthlyCommissionData, WeeklyConversionData } from '@/hooks/useInfluencerCommission';

interface OverviewSecondaryChartsProps {
  monthlyCommissionData: MonthlyCommissionData[];
  weeklyConversionData: WeeklyConversionData[];
  performanceStats: PerformanceStats | null;
  isLoading: boolean;
}

const OverviewSecondaryCharts: React.FC<OverviewSecondaryChartsProps> = ({ 
  monthlyCommissionData, 
  weeklyConversionData,
  performanceStats,
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="bg-gradient-to-br from-gray-50 to-gray-100 border-0 shadow-lg">
            <CardContent className="flex items-center justify-center py-16">
              <div className="animate-pulse text-center">
                <div className="h-4 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
                <div className="h-8 bg-gray-300 rounded w-24 mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Données de performance mensuelle basées sur les vraies commissions
  const performanceData = monthlyCommissionData.length > 0 
    ? monthlyCommissionData.map(item => ({
        name: item.month.substring(0, 3),
        commissions: item.totalCommissions,
        ventes: item.totalSales
      }))
    : [
        { name: 'Jan', commissions: 0, ventes: 0 },
        { name: 'Fév', commissions: 0, ventes: 0 },
        { name: 'Mar', commissions: 0, ventes: 0 }
      ];

  // Données de conversion hebdomadaire réelles
  const conversionData = weeklyConversionData.length > 0 
    ? weeklyConversionData.map((item, index) => ({
        name: `Sem ${index + 1}`,
        conversions: item.conversions
      }))
    : [
        { name: 'Sem 1', conversions: 0 },
        { name: 'Sem 2', conversions: 0 },
        { name: 'Sem 3', conversions: 0 },
        { name: 'Sem 4', conversions: 0 }
      ];

  const hasMonthlyData = monthlyCommissionData.length > 0 && monthlyCommissionData.some(item => item.totalCommissions > 0);
  const hasWeeklyData = weeklyConversionData.length > 0 && weeklyConversionData.some(item => item.conversions > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Performance globale */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Performance Mensuelle
            {performanceStats && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Rang #{performanceStats.totalOrders.rank}
              </span>
            )}
          </CardTitle>
          <CardDescription>
            {hasMonthlyData ? 'Commissions vs Ventes générées 💪' : 'Aucune donnée mensuelle disponible'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-64">
            {hasMonthlyData ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      `${value.toLocaleString()} FCFA`, 
                      name === 'commissions' ? 'Commissions' : 'Ventes'
                    ]}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="commissions" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ventes" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <Target className="h-12 w-12 mx-auto text-green-300 mb-2" />
                  <p className="text-green-600 font-medium">Commencez à vendre</p>
                  <p className="text-green-500 text-sm">Vos performances apparaîtront ici</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Taux de conversion avec données réelles */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            Conversions Hebdomadaires
            {performanceStats && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                {performanceStats.conversionRate.value.toFixed(1)}% taux
              </span>
            )}
          </CardTitle>
          <CardDescription>
            {hasWeeklyData ? 'Nombre de conversions par semaine 🎯' : 'Aucune conversion cette période'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-64">
            {hasWeeklyData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={conversionData}>
                  <defs>
                    <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip 
                    formatter={(value: number) => [`${value}`, 'Conversions']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="conversions" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorConversions)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <Calendar className="h-12 w-12 mx-auto text-purple-300 mb-2" />
                  <p className="text-purple-600 font-medium">Générez des conversions</p>
                  <p className="text-purple-500 text-sm">Vos taux apparaîtront ici</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewSecondaryCharts;
