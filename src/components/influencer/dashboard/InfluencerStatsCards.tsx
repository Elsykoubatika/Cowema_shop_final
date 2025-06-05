
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Users, Copy } from 'lucide-react';
import { Influencer } from '@/types/influencer';

interface InfluencerStatsCardsProps {
  totalEarned: number;
  availableToPayout: number;
  progressPercentage: number;
  totalOrders: number;
  influencerStats: any | null;
  referralCode: string;
  copyToClipboard: (text: string, label: string) => void;
}

const InfluencerStatsCards: React.FC<InfluencerStatsCardsProps> = ({
  totalEarned,
  availableToPayout,
  progressPercentage,
  totalOrders,
  influencerStats,
  referralCode,
  copyToClipboard
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Gains totaux
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEarned.toLocaleString()} FCFA</div>
          <p className="text-xs text-muted-foreground">
            Commission: {influencerStats?.commissionRate}%
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Disponible
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{availableToPayout.toLocaleString()} FCFA</div>
          <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {availableToPayout >= 10000 
              ? "Montant minimum atteint pour paiement" 
              : `${availableToPayout.toLocaleString()} / 10,000 FCFA pour paiement`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Commandes
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrders}</div>
          {influencerStats && (
            <p className="text-xs text-muted-foreground">
              {influencerStats.totalSalesAmount.toLocaleString()} FCFA de ventes totales
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Code promo
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{referralCode}</div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 w-full text-xs"
            onClick={() => copyToClipboard(referralCode, "Code promo")}
          >
            <Copy className="h-3 w-3 mr-1" /> Copier
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfluencerStatsCards;
