
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Clock, CheckCircle, Truck, Eye, User, MapPin } from 'lucide-react';
import { Order } from '@/hooks/influencer/useInfluencerOrders';
import OrderDetailsModal from './OrderDetailsModal';

export interface OrdersSuccessStateProps {
  orders: Order[];
}

const OrdersSuccessState: React.FC<OrdersSuccessStateProps> = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Livrée';
      case 'shipped':
        return 'Expédiée';
      case 'processing':
        return 'En cours';
      case 'pending':
        return 'En attente';
      default:
        return status;
    }
  };

  return (
    <>
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
          <CardTitle className="flex items-center gap-3 text-gray-800">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
              <Package className="h-5 w-5 text-white" />
            </div>
            Historique des commandes
          </CardTitle>
          <CardDescription className="text-gray-600">
            Vos {orders.length} dernières commandes générées
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {orders.slice(0, 10).map((order, index) => (
              <div
                key={order.id || index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">
                      #{String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Commande {order.id?.slice(-8) || `CMD-${index + 1}`}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span>
                        {new Date(order.created_at || Date.now()).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                      {order.customer_info && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{order.customer_info.firstName} {order.customer_info.lastName}</span>
                        </div>
                      )}
                      {order.delivery_address?.city && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{order.delivery_address.city}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      {order.order_items.length} article(s)
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-900">
                      {(order.total_amount || 0).toLocaleString()} FCFA
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                      +{Math.round((order.total_amount || 0) * 0.05).toLocaleString()} FCFA
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <Badge 
                      className={`${getStatusColor(order.status || 'pending')} flex items-center gap-1 px-3 py-1`}
                    >
                      {getStatusIcon(order.status || 'pending')}
                      <span className="text-xs font-medium">
                        {getStatusText(order.status || 'pending')}
                      </span>
                    </Badge>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                      className="text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Détails
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {orders.length > 10 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Et {orders.length - 10} autres commandes...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
};

export default OrdersSuccessState;
