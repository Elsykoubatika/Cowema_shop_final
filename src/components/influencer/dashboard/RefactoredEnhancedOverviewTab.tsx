
import React from 'react';
import { useInfluencerPerformance } from '@/hooks/useInfluencerPerformance';
import { useInfluencerCommission } from '@/hooks/useInfluencerCommission';
import ModernOverviewChart from './components/ModernOverviewChart';
import OverviewSecondaryCharts from './components/OverviewSecondaryCharts';
import EnhancedOverviewStatsCards from './components/EnhancedOverviewStatsCards';

interface RefactoredEnhancedOverviewTabProps {
  chartData: Array<{ month: string; amount: number }>;
  totalEarned: number;
  totalOrders: number;
}

const RefactoredEnhancedOverviewTab: React.FC<RefactoredEnhancedOverviewTabProps> = ({ 
  chartData, 
  totalEarned, 
  totalOrders 
}) => {
  const { performanceStats, isLoading: performanceLoading } = useInfluencerPerformance('month');
  const { 
    monthlyCommissionData, 
    weeklyConversionData, 
    isLoading: commissionLoading 
  } = useInfluencerCommission();

  const isLoading = performanceLoading || commissionLoading;

  return (
    <div className="space-y-8">
      {/* Statistiques de performance modernisées */}
      <EnhancedOverviewStatsCards 
        performanceStats={performanceStats}
        isLoading={isLoading}
      />

      {/* Graphique principal des commissions modernisé */}
      <ModernOverviewChart 
        chartData={chartData}
        performanceStats={performanceStats}
        isLoading={isLoading}
      />

      {/* Graphiques secondaires avec données réelles */}
      <OverviewSecondaryCharts 
        monthlyCommissionData={monthlyCommissionData}
        weeklyConversionData={weeklyConversionData}
        performanceStats={performanceStats}
        isLoading={isLoading}
      />
    </div>
  );
};

export default RefactoredEnhancedOverviewTab;
