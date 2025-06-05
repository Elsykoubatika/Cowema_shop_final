
import React from 'react';

interface OrderQuantityCellProps {
  firstItem: any;
  totalItems: number;
  totalQuantity: number;
}

const OrderQuantityCell: React.FC<OrderQuantityCellProps> = ({ 
  firstItem, 
  totalItems, 
  totalQuantity 
}) => {
  if (!firstItem) {
    return <span className="text-gray-500">0</span>;
  }

  return (
    <div className="text-center">
      <div className="font-semibold text-lg">{firstItem.quantity}</div>
      {totalItems > 1 && (
        <div className="text-xs text-blue-600">
          Total: {totalQuantity}
        </div>
      )}
      <div className="text-xs text-gray-500">
        sur {totalItems} article{totalItems > 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default OrderQuantityCell;
