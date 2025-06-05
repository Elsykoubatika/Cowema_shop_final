
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { getStatusColor, getStatusLabel, calculateOrderMetrics } from './OrderTableUtils';
import EnhancedOrderItemCell from './EnhancedOrderItemCell';
import OrderQuantityCell from './OrderQuantityCell';
import OrderPriceCell from './OrderPriceCell';
import OrderCustomerCell from './OrderCustomerCell';
import OrderActionsCell from './OrderActionsCell';

interface OrderTableRowProps {
  order: any;
  onView: (orderId: string) => void;
  onStatusChange: (orderId: string, newStatus: string) => void;
  onContactWhatsApp: (order: any) => void;
  canManage: (order: any) => boolean;
  isUpdating?: string | null;
}

const OrderTableRow: React.FC<OrderTableRowProps> = ({
  order,
  onView,
  onStatusChange,
  onContactWhatsApp,
  canManage,
  isUpdating
}) => {
  const customerPhone = order.customer_info?.phone || 'Non spécifié';
  const orderItems = order.order_items || [];
  const firstItem = orderItems[0];
  const { totalItems, totalQuantity, totalDiscount } = calculateOrderMetrics(orderItems);

  console.log('🔍 OrderTableRow - Order items:', {
    orderId: order.id.substring(0, 8),
    itemsCount: orderItems.length,
    firstItem: firstItem ? {
      title: firstItem.title,
      image: firstItem.image,
      quantity: firstItem.quantity,
      price: firstItem.price_at_time
    } : 'No first item'
  });

  return (
    <TableRow key={order.id} className="hover:bg-gray-50">
      <TableCell className="font-mono text-sm">
        #{order.id.substring(0, 8)}
      </TableCell>
      
      <TableCell className="text-sm">
        {format(new Date(order.created_at), 'dd/MM HH:mm', { locale: fr })}
      </TableCell>
      
      <TableCell>
        <EnhancedOrderItemCell orderItems={orderItems} />
      </TableCell>
      
      <TableCell className="text-center">
        <OrderQuantityCell 
          firstItem={firstItem} 
          totalItems={totalItems} 
          totalQuantity={totalQuantity} 
        />
      </TableCell>
      
      <TableCell className="text-right">
        <OrderPriceCell firstItem={firstItem} />
      </TableCell>
      
      <TableCell className="text-right">
        {totalDiscount > 0 ? (
          <span className="text-green-600 font-medium">
            -{totalDiscount.toLocaleString()} FCFA
          </span>
        ) : (
          <span className="text-gray-500">-</span>
        )}
      </TableCell>
      
      <TableCell className="text-right">
        <span className="font-medium">
          {order.delivery_fee ? `${order.delivery_fee.toLocaleString()} FCFA` : '0 FCFA'}
        </span>
      </TableCell>
      
      <TableCell className="text-right font-semibold text-lg">
        {order.total_amount?.toLocaleString()} FCFA
      </TableCell>
      
      <TableCell className="max-w-xs">
        <OrderCustomerCell order={order} />
      </TableCell>
      
      <TableCell>
        <a 
          href={`tel:${customerPhone}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {customerPhone}
        </a>
      </TableCell>
      
      <TableCell>
        <Badge className={getStatusColor(order.status)}>
          {getStatusLabel(order.status)}
        </Badge>
      </TableCell>
      
      <TableCell>
        <OrderActionsCell 
          order={order}
          onView={onView}
          onContactWhatsApp={onContactWhatsApp}
        />
      </TableCell>
    </TableRow>
  );
};

export default OrderTableRow;
