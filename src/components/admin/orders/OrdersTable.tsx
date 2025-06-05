
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import OrderTableHeader from './table/OrderTableHeader';
import OrderProductRow from './table/OrderProductRow';

interface OrdersTableProps {
  orders: any[];
  onView: (orderId: string) => void;
  onStatusChange: (orderId: string, newStatus: string) => void;
  onContactWhatsApp: (order: any) => void;
  canManage: (order: any) => boolean;
  isUpdating?: string | null;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onView,
  onStatusChange,
  onContactWhatsApp,
  canManage,
  isUpdating
}) => {
  console.log('🔍 OrdersTable - Processing orders:', orders.length);

  // Créer une ligne pour chaque produit dans chaque commande
  const orderProductRows = [];
  
  for (const order of orders) {
    const orderItems = order.order_items || [];
    
    console.log(`🔍 Order ${order.id.substring(0, 8)} has ${orderItems.length} items:`, orderItems);
    
    if (orderItems.length === 0) {
      // Si pas d'articles, afficher quand même une ligne avec les infos de la commande
      orderProductRows.push({
        order,
        product: {
          id: 'no-product',
          title: 'Aucun article',
          quantity: 0,
          price_at_time: 0,
          image: null,
          product_id: null
        },
        productIndex: 0
      });
    } else {
      // Créer une ligne pour chaque produit
      orderItems.forEach((product: any, index: number) => {
        orderProductRows.push({
          order,
          product,
          productIndex: index
        });
      });
    }
  }

  console.log('🔍 Total product rows to display:', orderProductRows.length);

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <OrderTableHeader />
        <TableBody>
          {orderProductRows.map(({ order, product, productIndex }) => (
            <OrderProductRow
              key={`${order.id}-${productIndex}`}
              order={order}
              product={product}
              productIndex={productIndex}
              onView={onView}
              onStatusChange={onStatusChange}
              onContactWhatsApp={onContactWhatsApp}
              canManage={canManage}
              isUpdating={isUpdating}
            />
          ))}
        </TableBody>
      </Table>
      
      {orderProductRows.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucune commande trouvée
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
