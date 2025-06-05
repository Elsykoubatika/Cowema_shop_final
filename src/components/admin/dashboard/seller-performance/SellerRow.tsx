
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, TrendingUp } from 'lucide-react';
import { SellerData } from './types';
import { formatCurrency, getInitials, getPerformanceBadge } from './utils';

interface SellerRowProps {
  seller: SellerData;
}

const SellerRow: React.FC<SellerRowProps> = ({ seller }) => {
  const performance = getPerformanceBadge(seller.trend);

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarFallback>{getInitials(seller.name)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{seller.name}</h4>
            <Badge 
              variant={seller.status === 'active' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {seller.status === 'active' ? 'Actif' : 'Inactif'}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="h-3 w-3" />
            {seller.city}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 text-center">
        <div>
          <div className="text-sm font-medium">{formatCurrency(seller.totalSales)}</div>
          <div className="text-xs text-gray-500">Ventes totales</div>
        </div>
        <div>
          <div className="text-sm font-medium">{seller.ordersCount}</div>
          <div className="text-xs text-gray-500">Commandes</div>
        </div>
        <div>
          <div className="text-sm font-medium">{seller.conversionRate}%</div>
          <div className="text-xs text-gray-500">Conversion</div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={performance.color}>
            {performance.label}
          </Badge>
          <div className={`text-xs flex items-center gap-1 ${seller.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`h-3 w-3 ${seller.trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(seller.trend)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRow;
