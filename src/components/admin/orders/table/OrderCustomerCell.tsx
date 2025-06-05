
import React from 'react';

interface OrderCustomerCellProps {
  order: any;
}

const OrderCustomerCell: React.FC<OrderCustomerCellProps> = ({ order }) => {
  const customerName = `${order.customer_info?.firstName || order.customer_info?.first_name || ''} ${order.customer_info?.lastName || order.customer_info?.last_name || ''}`.trim() || 'Client';
  const customerAddress = order.customer_info?.address || order.delivery_address?.address || 'Non spécifiée';

  return (
    <div>
      <p className="font-medium text-sm">{customerName}</p>
      <p className="text-xs text-gray-600 truncate" title={customerAddress}>
        {customerAddress}
      </p>
      <p className="text-xs text-gray-500">
        {order.customer_info?.city || order.delivery_address?.city || ''}
      </p>
    </div>
  );
};

export default OrderCustomerCell;
