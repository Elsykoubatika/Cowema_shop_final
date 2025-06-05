
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, AlertCircle } from 'lucide-react';
import { useInfluencerCommissions } from '@/hooks/influencer/useInfluencerCommissions';
import { useInfluencerOrders } from '@/hooks/influencer/useInfluencerOrders';
import { useInfluencerStore } from '@/hooks/useInfluencerStore';
import EnhancedAnalyticsStatsCards from './components/EnhancedAnalyticsStatsCards';
import AnalyticsChart from './components/AnalyticsChart';
import AnalyticsEmptyState from './components/AnalyticsEmptyState';

interface AnalyticsTabProps {
  influencerStats?: {
    totalOrders: number;
    totalSalesAmount: number;
    avgOrderValue: number;
    totalCommissions: number;
    totalSales: number;
    averageConversion: number;
  };
  commissionRate?: number;
  totalEarned?: number;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ 
  influencerStats, 
  commissionRate, 
  totalEarned 
}) => {
  const { currentUserInfluencer } = useInfluencerStore();
  const { stats: commissionStats, isLoading: commissionsLoading, error: commissionsError } = useInfluencerCommissions();
  const { stats: orderStats, isLoading: ordersLoading, error: ordersError } = useInfluencerOrders();

  const isLoading = commissionsLoading || ordersLoading;
  const error = commissionsError || ordersError;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="relative mx-auto w-16 h-16">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                📊 Analyse de vos données 📊
              </h3>
              <p className="text-gray-600">Génération de vos statistiques avancées...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto" />
            <h3 className="text-xl font-bold text-red-800">Erreur de chargement</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasAnalytics = orderStats.deliveredOrders > 0 || commissionStats.totalCommissions > 0;
  const effectiveCommissionRate = commissionRate || currentUserInfluencer?.commissionRate || 5;

  return (
    <div className="space-y-6">
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
          <CardTitle className="flex items-center gap-3 text-gray-800">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            Analyses détaillées
          </CardTitle>
          <CardDescription className="text-gray-600">
            Statistiques avancées de vos performances
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {hasAnalytics ? (
            <div className="space-y-8">
              <EnhancedAnalyticsStatsCards 
                orderStats={orderStats}
                commissionStats={commissionStats}
                commissionRate={effectiveCommissionRate}
              />
              <AnalyticsChart 
                orderStats={orderStats}
                commissionStats={commissionStats}
              />
            </div>
          ) : (
            <AnalyticsEmptyState />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
