
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface SalesData {
  month: string;
  revenue: number;
  orders: number;
}

interface SalesSegmentationChartProps {
  data: SalesData[];
}

const SalesSegmentationChart: React.FC<SalesSegmentationChartProps> = ({ data }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Mois: ${label}`}</p>
          <p className="text-blue-600">
            {`Revenus: ${formatCurrency(payload[0]?.value || 0)}`}
          </p>
          <p className="text-green-600">
            {`Commandes: ${payload[1]?.value || 0}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p>Aucune donnée de vente disponible</p>
          <p className="text-sm">Les données apparaîtront une fois les premières ventes enregistrées</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip content={<CustomTooltip />} />
          <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="Revenus" />
          <Bar yAxisId="right" dataKey="orders" fill="#10b981" name="Commandes" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesSegmentationChart;
