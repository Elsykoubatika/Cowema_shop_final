
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  DollarSign,
  Users,
  Truck
} from 'lucide-react';

interface OrdersStatsProps {
  stats: {
    total: number;
    pending: number;
    confirmed: number;
    delivered: number;
    totalAmount: number;
  };
  additionalStats?: {
    unassigned?: number;
    myOrders?: number;
  };
}

const OrdersStats: React.FC<OrdersStatsProps> = ({ stats, additionalStats }) => {
  const formatAmount = (amount: number) => {
    return `${amount.toLocaleString()} FCFA`;
  };

  const statCards = [
    {
      title: "Total commandes",
      value: stats.total,
      icon: ShoppingCart,
      color: "text-blue-600"
    },
    {
      title: "En attente",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      title: "Confirmées",
      value: stats.confirmed,
      icon: CheckCircle,
      color: "text-purple-600"
    },
    {
      title: "Livrées",
      value: stats.delivered,
      icon: Truck,
      color: "text-green-600"
    },
    {
      title: "Chiffre d'affaires",
      value: formatAmount(stats.totalAmount),
      icon: DollarSign,
      color: "text-emerald-600",
      isAmount: true
    }
  ];

  // Add additional stats if provided
  if (additionalStats?.unassigned !== undefined) {
    statCards.splice(1, 0, {
      title: "Non assignées",
      value: additionalStats.unassigned,
      icon: Users,
      color: "text-orange-600"
    });
  }

  if (additionalStats?.myOrders !== undefined) {
    statCards.splice(-1, 0, {
      title: "Mes commandes",
      value: additionalStats.myOrders,
      icon: Users,
      color: "text-indigo-600"
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrdersStats;
