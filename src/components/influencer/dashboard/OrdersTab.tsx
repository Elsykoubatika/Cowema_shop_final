
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from 'lucide-react';
import { useInfluencerOrders } from '@/hooks/influencer/useInfluencerOrders';
import OrdersStatsCards from './components/OrdersStatsCards';
import OrdersEmptyState from './components/OrdersEmptyState';
import OrdersSuccessState from './components/OrdersSuccessState';

interface OrdersTabProps {
  influencerStats?: {
    totalOrders: number;
    totalSalesAmount: number;
    avgOrderValue: number;
    totalCommissions: number;
    totalSales: number;
    averageConversion: number;
  };
}

const OrdersTab: React.FC<OrdersTabProps> = ({ influencerStats }) => {
  const { stats, isLoading, error, orders } = useInfluencerOrders();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="relative mx-auto w-16 h-16">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                📦 Chargement de vos commandes 📦
              </h3>
              <p className="text-gray-600">Récupération de votre historique de ventes...</p>
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

  const hasOrders = orders.length > 0;

  return (
    <div className="space-y-6">
      {hasOrders ? (
        <div className="space-y-6">
          <OrdersStatsCards stats={stats} />
          <OrdersSuccessState orders={orders} />
        </div>
      ) : (
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-0">
            <OrdersEmptyState />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrdersTab;
