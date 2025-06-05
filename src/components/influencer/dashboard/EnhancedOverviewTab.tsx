
import React from 'react';
import RefactoredEnhancedOverviewTab from './RefactoredEnhancedOverviewTab';

interface EnhancedOverviewTabProps {
  chartData: Array<{ month: string; amount: number }>;
  totalEarned: number;
  totalOrders: number;
}

const EnhancedOverviewTab: React.FC<EnhancedOverviewTabProps> = ({ 
  chartData, 
  totalEarned, 
  totalOrders 
}) => {
  return (
    <RefactoredEnhancedOverviewTab 
      chartData={chartData}
      totalEarned={totalEarned}
      totalOrders={totalOrders}
    />
  );
};

export default EnhancedOverviewTab;
