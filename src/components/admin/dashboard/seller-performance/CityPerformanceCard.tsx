
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SellerData } from './types';
import { formatCurrency } from './utils';

interface CityPerformanceCardProps {
  sellersData: SellerData[];
}

const CityPerformanceCard: React.FC<CityPerformanceCardProps> = ({ sellersData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance par ville</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {['Brazzaville', 'Pointe-Noire', 'Dolisie'].map((city) => {
            const citySellers = sellersData.filter(s => s.city === city);
            const cityTotal = citySellers.reduce((sum, s) => sum + s.totalSales, 0);
            const cityOrders = citySellers.reduce((sum, s) => sum + s.ordersCount, 0);
            
            return (
              <div key={city} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{city}</h4>
                  <Badge variant="outline">{citySellers.length} vendeurs</Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-bold">{formatCurrency(cityTotal)}</div>
                  <div className="text-sm text-gray-600">{cityOrders} commandes</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CityPerformanceCard;
