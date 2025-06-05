
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Phone, 
  MessageSquare, 
  UserPlus,
  Edit,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface OrderCardProps {
  order: any;
  onView?: (orderId: string) => void;
  onAssignToSelf?: (orderId: string) => void;
  onStatusChange?: (orderId: string, status: string) => void;
  onContactWhatsApp?: (order: any) => void;
  canAssignToSelf?: boolean;
  canManage?: boolean;
  isAssigning?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onView,
  onAssignToSelf,
  onStatusChange,
  onContactWhatsApp,
  canAssignToSelf = false,
  canManage = false,
  isAssigning = false
}) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmée';
      case 'shipped':
        return 'Expédiée';
      case 'delivered':
        return 'Livrée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const formatAmount = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) {
      return '0 FCFA';
    }
    return `${amount.toLocaleString()} FCFA`;
  };

  const getRelativeDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true,
      locale: fr
    });
  };

  const customerName = `${order.customer_info?.firstName || ''} ${order.customer_info?.lastName || ''}`.trim() || 'Client';
  const customerCity = order.customer_info?.city || order.delivery_address?.city || 'Non spécifiée';
  const customerPhone = order.customer_info?.phone || '';

  const getAssignmentStatus = () => {
    if (!order.assigned_to) {
      return { text: 'Non assignée', variant: 'secondary' as const };
    }
    return { text: 'Assignée', variant: 'outline' as const };
  };

  const assignmentStatus = getAssignmentStatus();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            {/* Header with order ID and status */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-medium">
                #{order.id.substring(0, 8)}
              </span>
              <Badge className={getStatusBadgeClass(order.status)}>
                {getStatusText(order.status)}
              </Badge>
              <Badge variant={assignmentStatus.variant}>
                {assignmentStatus.text}
              </Badge>
            </div>

            {/* Customer info */}
            <div className="space-y-1">
              <p className="font-medium text-gray-900">{customerName}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {customerCity}
                </div>
                {customerPhone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {customerPhone}
                  </div>
                )}
              </div>
            </div>

            {/* Order details */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {formatAmount(order.total_amount)}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {getRelativeDate(order.created_at)}
              </div>
            </div>

            {/* Order items preview */}
            {order.order_items && order.order_items.length > 0 && (
              <div className="text-xs text-gray-500">
                {order.order_items.length} article{order.order_items.length > 1 ? 's' : ''}
                {order.order_items.length <= 2 && (
                  <span> - {order.order_items.map((item: any) => item.title).join(', ')}</span>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 ml-4">
            <div className="flex gap-1">
              {onView && (
                <Button variant="outline" size="sm" onClick={() => onView(order.id)}>
                  <Eye className="h-3 w-3" />
                </Button>
              )}
              {customerPhone && onContactWhatsApp && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onContactWhatsApp(order)}
                  className="text-green-600 hover:text-green-700"
                >
                  <MessageSquare className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            {canAssignToSelf && onAssignToSelf && (
              <Button 
                size="sm"
                onClick={() => onAssignToSelf(order.id)}
                disabled={isAssigning}
                className="w-full"
              >
                <UserPlus className="h-3 w-3 mr-1" />
                {isAssigning ? 'Attribution...' : "M'assigner"}
              </Button>
            )}

            {canManage && onStatusChange && (
              <select
                className="text-xs p-1 border rounded"
                value={order.status}
                onChange={(e) => onStatusChange(order.id, e.target.value)}
              >
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmée</option>
                <option value="shipped">Expédiée</option>
                <option value="delivered">Livrée</option>
                <option value="cancelled">Annulée</option>
              </select>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
