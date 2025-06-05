
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Calendar, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface OrderInfoCardProps {
  order: any;
  totalQuantity: number;
}

const OrderInfoCard: React.FC<OrderInfoCardProps> = ({ order, totalQuantity }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Informations de la commande
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">ID Commande</p>
            <p className="font-mono text-sm">{order.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Date de création</p>
            <p className="flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4" />
              {format(new Date(order.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Articles</p>
            <p className="text-lg font-semibold">{totalQuantity} article{totalQuantity > 1 ? 's' : ''}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Frais de livraison</p>
            <p className="font-medium">{order.delivery_fee ? `${order.delivery_fee.toLocaleString()} FCFA` : 'Gratuit'}</p>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total commande</span>
            <span className="flex items-center gap-1">
              <CreditCard className="h-5 w-5" />
              {order.total_amount?.toLocaleString()} FCFA
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderInfoCard;
