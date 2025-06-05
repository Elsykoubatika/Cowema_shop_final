import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, CheckCircle } from 'lucide-react';
import { PromotionMetric } from '../../../../hooks/admin/metrics/types';

interface RevenueTabProps {
  metrics: Record<string, PromotionMetric>;
}

const RevenueTab: React.FC<RevenueTabProps> = ({ metrics }) => {
  const metricsArray = Object.values(metrics);

  const revenueData = metricsArray.map(metric => ({
    name: metric.code,
    Revenus: metric.revenueGenerated
  }));

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-4">Revenus générés par code promo</h4>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={revenueData}
              margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip formatter={(value: any) => [`${value} €`, 'Revenus']} />
              <Legend />
              <Bar dataKey="Revenus" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-4">Efficacité des promotions</h4>
        <div className="space-y-3">
          {[...metricsArray]
            .sort((a, b) => b.revenueGenerated - a.revenueGenerated)
            .map((metric) => (
              <div key={metric.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <h5 className="font-medium">{metric.code}</h5>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <span className="text-xs flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> {metric.conversionRate.toFixed(1)}% de conversion
                    </span>
                    <span className="text-xs flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> {metric.usageCount} utilisations
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-600">{metric.revenueGenerated.toLocaleString('fr-FR')} €</div>
                  <div className="text-xs text-gray-500">
                    {(metric.revenueGenerated / metric.usageCount || 0).toFixed(0)} € par utilisation
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueTab;
