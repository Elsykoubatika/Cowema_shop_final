
import React from 'react';
import EnhancedOverviewTab from './EnhancedOverviewTab';

interface OverviewTabProps {
  chartData: Array<{ month: string; amount: number }>;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ chartData }) => {
  // Mock data pour les statistiques
  const totalEarned = chartData.reduce((sum, item) => sum + item.amount, 0);
  const totalOrders = Math.floor(totalEarned / 1000); // Mock calculation

  return (
    <EnhancedOverviewTab 
      chartData={chartData}
      totalEarned={totalEarned}
      totalOrders={totalOrders}
    />
  );
};

export default OverviewTab;
