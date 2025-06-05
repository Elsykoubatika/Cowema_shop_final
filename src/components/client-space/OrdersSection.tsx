
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Calendar, CreditCard, Eye, RefreshCw, Clock } from 'lucide-react';
import { useSupabaseOrders } from '@/hooks/useSupabaseOrders';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

const OrdersSection: React.FC = () => {
  const { user } = useUnifiedAuth();
  const { userOrders, isLoading, fetchOrders } = useSupabaseOrders();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { 
        variant: 'outline' as const, 
        label: 'En attente', 
        color: 'text-orange-600 border-orange-300 bg-orange-50' 
      },
      confirmed: { 
        variant: 'secondary' as const, 
        label: 'Confirmée', 
        color: 'text-blue-600 border-blue-300 bg-blue-50' 
      },
      shipped: { 
        variant: 'default' as const, 
        label: 'Expédiée', 
        color: 'text-purple-600 border-purple-300 bg-purple-50' 
      },
      delivered: { 
        variant: 'default' as const, 
        label: 'Livrée', 
        color: 'text-green-600 border-green-300 bg-green-50' 
      },
      cancelled: { 
        variant: 'destructive' as const, 
        label: 'Annulée', 
        color: 'text-red-600 border-red-300 bg-red-50' 
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge variant={config.variant} className={`${config.color} font-medium`}>
        {config.label}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-orange-500" />;
      case 'confirmed':
        return <Package size={16} className="text-blue-500" />;
      case 'shipped':
        return <Package size={16} className="text-purple-500" />;
      case 'delivered':
        return <Package size={16} className="text-green-500" />;
      case 'cancelled':
        return <Package size={16} className="text-red-500" />;
      default:
        return <Package size={16} className="text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package size={20} />
            Historique de mes commandes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            <span className="text-gray-600">Chargement de vos commandes...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Package size={20} />
          Historique de mes commandes
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {userOrders.length} commande{userOrders.length !== 1 ? 's' : ''}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOrders}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Actualiser
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {userOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Package size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune commande</h3>
            <p className="text-gray-500 mb-6">Vous n'avez pas encore passé de commande</p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-primary hover:bg-primary/90"
            >
              Découvrir nos produits
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((order) => (
              <div 
                key={order.id} 
                className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <span className="font-semibold text-gray-900">
                        Commande #{order.id.slice(0, 8)}
                      </span>
                      <div className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package size={14} />
                    <span>
                      {order.order_items?.length || 0} article{(order.order_items?.length || 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <CreditCard size={14} />
                    <span className="font-semibold text-gray-900">
                      {order.total_amount.toLocaleString()} FCFA
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={14} />
                    <span>
                      {order.status === 'delivered' ? 'Livrée' : 
                       order.status === 'shipped' ? 'En cours de livraison' : 
                       order.status === 'confirmed' ? 'Confirmée' : 'En attente'}
                    </span>
                  </div>
                </div>

                {order.order_items && order.order_items.length > 0 && (
                  <div className="border-t pt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Articles commandés :</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {order.order_items.slice(0, 4).map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-medium">
                            {item.quantity}
                          </div>
                          <span className="text-gray-700 truncate">
                            {item.title || 'Article'}
                          </span>
                          {item.price_at_time && (
                            <span className="text-gray-500 ml-auto">
                              {item.price_at_time.toLocaleString()} FCFA
                            </span>
                          )}
                        </div>
                      ))}
                      {order.order_items.length > 4 && (
                        <div className="text-sm text-gray-500 col-span-full">
                          et {order.order_items.length - 4} autre{order.order_items.length - 4 !== 1 ? 's' : ''} article{order.order_items.length - 4 !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4 pt-3 border-t">
                  <div className="text-sm text-gray-500">
                    {order.delivery_address && (
                      <span>
                        Livraison: {(order.delivery_address as any)?.city || 'Non spécifiée'}
                      </span>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-primary border-primary hover:bg-primary hover:text-white"
                    onClick={() => {
                      // Ici on pourrait ajouter une modal pour voir les détails
                      console.log('Voir détails de la commande:', order.id);
                    }}
                  >
                    <Eye size={14} />
                    Voir détails
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersSection;
