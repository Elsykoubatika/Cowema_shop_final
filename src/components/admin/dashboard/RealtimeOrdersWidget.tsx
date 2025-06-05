
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';
import { useNavigate } from 'react-router-dom';
import { Eye, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const RealtimeOrdersWidget: React.FC = () => {
  const {
    newOrders,
    updatedOrders,
    hasNewOrders,
    hasUpdatedOrders,
    clearNewOrders,
    clearUpdatedOrders
  } = useRealtimeOrders();
  
  const navigate = useNavigate();

  const handleViewOrder = (orderId: string) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'confirmed':
        return 'default';
      case 'processing':
        return 'outline';
      case 'shipped':
        return 'outline';
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'En attente',
      'confirmed': 'Confirmée',
      'processing': 'En traitement',
      'shipped': 'Expédiée',
      'delivered': 'Livrée',
      'cancelled': 'Annulée'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="space-y-4">
      {/* Nouvelles commandes */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              🆕 Nouvelles commandes
              {hasNewOrders && (
                <Badge variant="destructive" className="animate-pulse">
                  {newOrders.length}
                </Badge>
              )}
            </CardTitle>
            {hasNewOrders && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearNewOrders}
                title="Marquer comme vues"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!hasNewOrders ? (
            <p className="text-muted-foreground text-center py-4">
              Aucune nouvelle commande
            </p>
          ) : (
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {newOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3 border rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                    onClick={() => handleViewOrder(order.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">#{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.total_amount.toLocaleString()} FCFA
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(order.created_at), {
                            addSuffix: true,
                            locale: fr
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Commandes mises à jour */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Mises à jour
              {hasUpdatedOrders && (
                <Badge variant="outline">
                  {updatedOrders.length}
                </Badge>
              )}
            </CardTitle>
            {hasUpdatedOrders && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearUpdatedOrders}
                title="Marquer comme vues"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!hasUpdatedOrders ? (
            <p className="text-muted-foreground text-center py-4">
              Aucune mise à jour récente
            </p>
          ) : (
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {updatedOrders.map((order) => (
                  <div
                    key={`${order.id}-${order.updated_at}`}
                    className="p-3 border rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => handleViewOrder(order.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">#{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.total_amount.toLocaleString()} FCFA
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(order.updated_at), {
                            addSuffix: true,
                            locale: fr
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RealtimeOrdersWidget;
