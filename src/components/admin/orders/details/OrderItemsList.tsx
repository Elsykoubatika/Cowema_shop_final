
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import OrderItemCard from './OrderItemCard';

interface OrderItemsListProps {
  orderItems: any[];
  totalQuantity: number;
  subtotal: number;
  order: any;
}

const OrderItemsList: React.FC<OrderItemsListProps> = ({ 
  orderItems, 
  totalQuantity, 
  subtotal, 
  order 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Articles commandés ({orderItems.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orderItems.length > 0 ? (
          <div className="space-y-6">
            {orderItems.map((item: any, index: number) => (
              <OrderItemCard key={index} item={item} index={index} />
            ))}
            
            {/* Récapitulatif final */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
              <div className="flex justify-between text-lg">
                <span className="font-medium">Sous-total ({totalQuantity} articles):</span>
                <span className="font-bold">{subtotal.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span>Frais de livraison:</span>
                <span className="font-medium">{order.delivery_fee ? `${order.delivery_fee.toLocaleString()} FCFA` : 'Gratuit'}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold border-t pt-3 text-blue-600">
                <span>Total:</span>
                <span>{order.total_amount?.toLocaleString()} FCFA</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun article trouvé pour cette commande</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderItemsList;
