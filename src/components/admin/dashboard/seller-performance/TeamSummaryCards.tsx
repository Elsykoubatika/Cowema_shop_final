
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, Award } from 'lucide-react';
import { SellerData } from './types';
import { formatCurrency } from './utils';

interface TeamSummaryCardsProps {
  sellersData: SellerData[];
}

const TeamSummaryCards: React.FC<TeamSummaryCardsProps> = ({ sellersData }) => {
  const topPerformer = sellersData.reduce((prev, current) => 
    prev.totalSales > current.totalSales ? prev : current
  );

  const totalTeamSales = sellersData.reduce((sum, seller) => sum + seller.totalSales, 0);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Équipe de vente</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sellersData.length}</div>
          <p className="text-xs text-green-600">
            {sellersData.filter(s => s.status === 'active').length} actifs
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ventes totales équipe</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalTeamSales)}</div>
          <p className="text-xs text-green-600">+8.5% vs mois dernier</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Meilleur vendeur</CardTitle>
          <Award className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold">{topPerformer.name}</div>
          <p className="text-xs text-yellow-600">{formatCurrency(topPerformer.totalSales)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversion moyenne</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(sellersData.reduce((sum, s) => sum + s.conversionRate, 0) / sellersData.length).toFixed(1)}%
          </div>
          <p className="text-xs text-purple-600">Équipe de vente</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamSummaryCards;
