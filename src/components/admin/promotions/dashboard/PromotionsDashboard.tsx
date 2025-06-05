
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Promotion } from '@/hooks/usePromotionStore';

interface PromotionsDashboardProps {
  activePromotions: Promotion[];
  totalPromotions: number;
  expiredPromotions: number;
  avgDiscount: number;
  conversionRate: string | number;
  isLoading: boolean;
}

const PromotionsDashboard: React.FC<PromotionsDashboardProps> = ({
  activePromotions,
  totalPromotions,
  expiredPromotions,
  avgDiscount,
  conversionRate,
  isLoading
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Promotions Actives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activePromotions.length}</div>
          <p className="text-xs text-muted-foreground">
            sur {totalPromotions} promotions totales
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Taux de Conversion Moyen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : conversionRate}
          </div>
          <p className="text-xs text-muted-foreground">
            basé sur toutes les promotions
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Remise Moyenne
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {avgDiscount.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            sur l'ensemble des promotions
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Promotions Expirées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{expiredPromotions}</div>
          <p className="text-xs text-muted-foreground">
            nettoyage recommandé
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromotionsDashboard;
