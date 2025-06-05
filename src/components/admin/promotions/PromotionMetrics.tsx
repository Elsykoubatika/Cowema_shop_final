
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity } from 'lucide-react';
import { usePromotionMetrics } from '../../../hooks/admin/usePromotionMetrics';
import { Promotion } from '../../../hooks/usePromotionStore';

// Import refactored components
import OverviewTab from './metrics/OverviewTab';
import EngagementTab from './metrics/EngagementTab';
import ConversionTab from './metrics/ConversionTab';
import RevenueTab from './metrics/RevenueTab';
import MetricsHeader from './metrics/MetricsHeader';
import LoadingState from './metrics/LoadingState';
import ErrorState from './metrics/ErrorState';

interface PromotionMetricsProps {
  promotions: Promotion[];
}

const PromotionMetrics: React.FC<PromotionMetricsProps> = ({ promotions }) => {
  const { metrics, isLoading, error, exportMetricsToCSV, dateRange, setDateRange } = usePromotionMetrics();
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error) {
    return <ErrorState errorMessage={error} />;
  }
  
  const handleExport = () => {
    exportMetricsToCSV();
  };
  
  const getDateRangeText = () => {
    switch(dateRange) {
      case '7days': return '7 derniers jours';
      case '30days': return '30 derniers jours';
      case '90days': return '90 derniers jours';
      case 'all': 
      default: return 'Tout le temps';
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Métriques des promotions</span>
            </CardTitle>
            <CardDescription>
              Analyses de performance de vos codes promotionnels
            </CardDescription>
          </div>
          <MetricsHeader 
            dateRange={dateRange} 
            onDateRangeChange={value => setDateRange(value as any)}
            onExport={handleExport}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="conversion">Conversion</TabsTrigger>
            <TabsTrigger value="revenue">Revenus</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <OverviewTab metrics={metrics} />
          </TabsContent>
          
          <TabsContent value="engagement">
            <EngagementTab metrics={metrics} />
          </TabsContent>
          
          <TabsContent value="conversion">
            <ConversionTab metrics={metrics} />
          </TabsContent>

          <TabsContent value="revenue">
            <RevenueTab metrics={metrics} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4 text-xs text-gray-500">
        Les données affichées sont pour la période: {getDateRangeText()}
      </CardFooter>
    </Card>
  );
};

export default PromotionMetrics;
