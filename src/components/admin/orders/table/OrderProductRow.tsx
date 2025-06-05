
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { getStatusColor, getStatusLabel } from './OrderTableUtils';
import EnhancedOrderItemCell from './EnhancedOrderItemCell';
import OrderCustomerCell from './OrderCustomerCell';
import OrderActionsCell from './OrderActionsCell';
import ProductLinkCell from './ProductLinkCell';
import OrderReceiptCell from './OrderReceiptCell';
import OrderSourceCell from './OrderSourceCell';

interface OrderProductRowProps {
  order: any;
  product: any;
  productIndex: number;
  onView: (orderId: string) => void;
  onStatusChange: (orderId: string, newStatus: string) => void;
  onContactWhatsApp: (order: any) => void;
  canManage: (order: any) => boolean;
  isUpdating?: string | null;
}

const OrderProductRow: React.FC<OrderProductRowProps> = ({
  order,
  product,
  productIndex,
  onView,
  onStatusChange,
  onContactWhatsApp,
  canManage,
  isUpdating
}) => {
  const customerPhone = order.customer_info?.phone || 'Non spécifié';
  
  // Calculer le sous-total pour ce produit
  const unitPrice = product.promo_price || product.price_at_time || 0;
  const subtotal = unitPrice * (product.quantity || 1);
  
  // Calculer la remise pour ce produit
  const originalPrice = product.price_at_time || 0;
  const promoPrice = product.promo_price || 0;
  const discount = promoPrice && promoPrice !== originalPrice 
    ? (originalPrice - promoPrice) * (product.quantity || 1)
    : 0;

  console.log('🔍 OrderProductRow - Product:', {
    orderId: order.id.substring(0, 8),
    productIndex,
    product: {
      title: product.title,
      image: product.image,
      quantity: product.quantity,
      price: product.price_at_time,
      promo_price: product.promo_price,
      product_id: product.product_id
    }
  });

  return (
    <TableRow key={`${order.id}-${productIndex}`} className="hover:bg-gray-50">
      <TableCell className="font-mono text-sm">
        #{order.id.substring(0, 8)}
      </TableCell>
      
      <TableCell className="text-sm">
        {format(new Date(order.created_at), 'dd/MM HH:mm', { locale: fr })}
      </TableCell>
      
      <TableCell>
        <EnhancedOrderItemCell orderItems={[product]} />
      </TableCell>
      
      <TableCell className="text-center">
        <div className="font-semibold text-lg">{product.quantity || 1}</div>
      </TableCell>
      
      <TableCell className="text-right">
        <div className="text-right">
          {product.promo_price && product.promo_price !== product.price_at_time ? (
            <>
              <div className="line-through text-gray-400 text-sm">
                {Number(product.price_at_time || 0).toLocaleString()} FCFA
              </div>
              <div className="font-semibold text-green-600">
                {Number(product.promo_price).toLocaleString()} FCFA
              </div>
            </>
          ) : (
            <div className="font-semibold">
              {Number(product.price_at_time || 0).toLocaleString()} FCFA
            </div>
          )}
        </div>
      </TableCell>
      
      <TableCell className="text-right font-semibold">
        {subtotal.toLocaleString()} FCFA
      </TableCell>
      
      <TableCell className="text-right">
        {discount > 0 ? (
          <span className="text-green-600 font-medium">
            -{discount.toLocaleString()} FCFA
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
        <OrderSourceCell order={order} />
      </TableCell>
      
      <TableCell>
        <ProductLinkCell product={product} />
      </TableCell>
      
      <TableCell>
        <OrderReceiptCell order={order} />
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

export default OrderProductRow;
