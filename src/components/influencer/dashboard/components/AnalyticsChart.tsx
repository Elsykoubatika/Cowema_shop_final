
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { OrderStats } from '@/hooks/influencer/useInfluencerOrders';
import { CommissionStats } from '@/hooks/influencer/useInfluencerCommissions';

interface AnalyticsChartProps {
  orderStats: OrderStats;
  commissionStats: CommissionStats;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ orderStats, commissionStats }) => {
  // Générer des données simulées pour les 6 derniers mois
  const generateMonthlyData = () => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
    const currentMonth = new Date().getMonth();
    
    return months.map((month, index) => {
      const isCurrentMonth = index === (currentMonth % 6);
      const baseOrders = Math.max(0, orderStats.deliveredOrders - (5 - index) * 2);
      const baseCommissions = Math.max(0, commissionStats.thisMonthCommissions - (5 - index) * 1000);
      
      return {
        month,
        commandes: isCurrentMonth ? orderStats.thisMonthOrders : Math.max(0, baseOrders + Math.floor(Math.random() * 5)),
        commissions: isCurrentMonth ? commissionStats.thisMonthCommissions : Math.max(0, baseCommissions + Math.floor(Math.random() * 2000)),
        ventes: isCurrentMonth ? orderStats.totalSalesAmount : Math.max(0, (baseCommissions + Math.floor(Math.random() * 2000)) * 20)
      };
    });
  };

  const monthlyData = generateMonthlyData();

  const conversionData = [
    { semaine: 'S1', taux: Math.max(0, orderStats.conversionRate - 2) },
    { semaine: 'S2', taux: Math.max(0, orderStats.conversionRate - 1) },
    { semaine: 'S3', taux: Math.max(0, orderStats.conversionRate + 0.5) },
    { semaine: 'S4', taux: orderStats.conversionRate },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Évolution des commissions */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-gray-800">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            Évolution des gains
          </CardTitle>
          <CardDescription>
            Progression de vos commissions sur 6 mois
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toLocaleString()} FCFA`, 'Commissions']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="commissions" 
                stroke="url(#blueGradient)" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Taux de conversion */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-gray-800">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            Taux de conversion
          </CardTitle>
          <CardDescription>
            Performance hebdomadaire de vos liens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="semaine" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Taux de conversion']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="taux" 
                fill="url(#greenGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsChart;
