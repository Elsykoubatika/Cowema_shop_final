
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, ShoppingCart, Package, DollarSign } from 'lucide-react';

interface DetailedStatsModalProps {
  statType: string;
  data: any;
  isOpen: boolean;
  onClose: () => void;
}

const DetailedStatsModal: React.FC<DetailedStatsModalProps> = ({
  statType,
  data,
  isOpen,
  onClose
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatDetails = () => {
    switch (statType) {
      case 'orders':
        return {
          title: 'Détails des Commandes',
          icon: ShoppingCart,
          mainValue: data.totalOrders,
          details: [
            { label: 'Commandes ce mois', value: Math.floor(data.totalOrders * 0.3), trend: data.monthlyGrowth.orders },
            { label: 'Commandes confirmées', value: Math.floor(data.totalOrders * 0.7), trend: 5.2 },
            { label: 'Commandes en attente', value: Math.floor(data.totalOrders * 0.2), trend: -2.1 },
            { label: 'Commandes livrées', value: Math.floor(data.totalOrders * 0.6), trend: 8.3 },
            { label: 'Taux de conversion', value: '3.2%', trend: 0.5 }
          ]
        };
      case 'customers':
        return {
          title: 'Détails des Clients',
          icon: Users,
          mainValue: data.totalCustomers,
          details: [
            { label: 'Nouveaux clients ce mois', value: Math.floor(data.totalCustomers * 0.15), trend: data.monthlyGrowth.customers },
            { label: 'Clients actifs', value: Math.floor(data.totalCustomers * 0.8), trend: 4.1 },
            { label: 'Clients fidèles (>3 commandes)', value: Math.floor(data.totalCustomers * 0.3), trend: 7.8 },
            { label: 'Taux de rétention', value: '68%', trend: 2.3 }
          ]
        };
      case 'products':
        return {
          title: 'Détails des Produits',
          icon: Package,
          mainValue: data.totalProducts,
          details: [
            { label: 'Produits ajoutés ce mois', value: Math.floor(data.totalProducts * 0.1), trend: data.monthlyGrowth.products },
            { label: 'Produits en stock', value: Math.floor(data.totalProducts * 0.9), trend: 2.1 },
            { label: 'Produits populaires (>10 ventes)', value: Math.floor(data.totalProducts * 0.2), trend: 5.4 },
            { label: 'Taux de rotation', value: '85%', trend: 3.2 }
          ]
        };
      case 'revenue':
        return {
          title: 'Détails des Revenus',
          icon: DollarSign,
          mainValue: formatCurrency(data.totalRevenue),
          details: [
            { label: 'Revenus ce mois', value: formatCurrency(data.totalRevenue * 0.25), trend: data.monthlyGrowth.revenue },
            { label: 'Panier moyen', value: formatCurrency(data.totalRevenue / Math.max(data.totalOrders, 1)), trend: 4.5 },
            { label: 'Revenus par client', value: formatCurrency(data.totalRevenue / Math.max(data.totalCustomers, 1)), trend: 6.2 },
            { label: 'Marge brute estimée', value: formatCurrency(data.totalRevenue * 0.35), trend: 8.1 }
          ]
        };
      default:
        return null;
    }
  };

  const statDetails = getStatDetails();

  if (!statDetails) return null;

  const Icon = statDetails.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {statDetails.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vue d'ensemble</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{statDetails.mainValue}</div>
              <p className="text-sm text-gray-600">Valeur totale actuelle</p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {statDetails.details.map((detail, index) => (
              <Card key={index}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{detail.label}</p>
                      <div className="text-xl font-bold">{detail.value}</div>
                    </div>
                    <Badge
                      variant={detail.trend >= 0 ? "default" : "destructive"}
                      className="flex items-center gap-1"
                    >
                      {detail.trend >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {Math.abs(detail.trend)}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailedStatsModal;
