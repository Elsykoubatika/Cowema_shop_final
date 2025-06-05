import React from 'react';
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Eye, Copy, CheckCircle } from 'lucide-react';
import { PromotionMetric } from '../../../../hooks/admin/metrics/types';

interface EngagementTabProps {
  metrics: Record<string, PromotionMetric>;
}

const EngagementTab: React.FC<EngagementTabProps> = ({ metrics }) => {
  const metricsArray = Object.values(metrics);
  
  return (
    <div className="space-y-8">
      <div>
        <h4 className="text-sm font-medium mb-4">Taux d'engagement par promotion</h4>
        <div className="space-y-4">
          {metricsArray.map(metric => (
            <div key={metric.id} className="flex justify-between items-center p-3 border rounded">
              <div>
                <h5 className="font-medium">{metric.code}</h5>
                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="text-xs flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {metric.timesViewed} vues
                  </span>
                  <span className="text-xs flex items-center gap-1">
                    <Copy className="h-3 w-3" /> {metric.timesCopied} copies
                  </span>
                  <span className="text-xs flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> {metric.timesApplied} utilisations
                  </span>
                  <span className="text-xs">
                    {metric.usageLimit !== null 
                      ? `${metric.usageLimit - metric.usageCount} utilisations restantes`
                      : "Utilisations illimitées"}
                  </span>
                </div>
              </div>
              <div>
                <Badge variant={metric.conversionRate > 10 ? "default" : "secondary"}>
                  {metric.conversionRate.toFixed(1)}% de conversion
                </Badge>
                {metric.usageLimitReached && (
                  <Badge variant="destructive" className="ml-2">Limite atteinte</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-4">Évolution de l'engagement</h4>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={[
                { name: 'Semaine 1', Vues: 400, Copies: 240, Utilisations: 100 },
                { name: 'Semaine 2', Vues: 600, Copies: 320, Utilisations: 150 },
                { name: 'Semaine 3', Vues: 550, Copies: 280, Utilisations: 130 },
                { name: 'Semaine 4', Vues: 700, Copies: 390, Utilisations: 180 },
              ]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Vues" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Copies" stroke="#82ca9d" />
              <Line type="monotone" dataKey="Utilisations" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EngagementTab;
