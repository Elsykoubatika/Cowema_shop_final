import React from 'react';
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PromotionMetric } from '../../../../hooks/admin/metrics/types';

interface ConversionTabProps {
  metrics: Record<string, PromotionMetric>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ConversionTab: React.FC<ConversionTabProps> = ({ metrics }) => {
  const metricsArray = Object.values(metrics);
  
  const conversionData = metricsArray.map(metric => ({
    name: metric.code,
    value: metric.conversionRate,
    conversionRate: `${metric.conversionRate.toFixed(1)}%`
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="text-sm font-medium mb-4">Taux de conversion</h4>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={conversionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, conversionRate }) => `${name}: ${conversionRate}`}
              >
                {conversionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-4">Meilleures promotions</h4>
        <div className="space-y-3">
          {[...metricsArray]
            .sort((a, b) => b.conversionRate - a.conversionRate)
            .slice(0, 5)
            .map((metric, index) => (
              <div key={metric.id} className="flex justify-between items-center p-3 border rounded">
                <div className="flex items-center gap-2">
                  <div className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                    {index + 1}
                  </div>
                  <div>
                    <h5 className="font-medium">{metric.code}</h5>
                    <span className="text-xs text-gray-500">{metric.timesApplied} utilisations</span>
                  </div>
                </div>
                <Badge>
                  {metric.conversionRate.toFixed(1)}%
                </Badge>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ConversionTab;
