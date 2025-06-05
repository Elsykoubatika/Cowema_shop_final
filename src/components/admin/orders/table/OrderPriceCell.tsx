
import React from 'react';

interface OrderPriceCellProps {
  firstItem: any;
}

const OrderPriceCell: React.FC<OrderPriceCellProps> = ({ firstItem }) => {
  if (!firstItem?.price_at_time) {
    return <span className="text-gray-500">-</span>;
  }

  return (
    <div className="text-right">
      {firstItem.promo_price && firstItem.promo_price !== firstItem.price_at_time ? (
        <>
          <div className="line-through text-gray-400 text-sm">
            {firstItem.price_at_time.toLocaleString()} FCFA
          </div>
          <div className="font-semibold text-green-600">
            {firstItem.promo_price.toLocaleString()} FCFA
          </div>
        </>
      ) : (
        <div className="font-semibold">
          {firstItem.price_at_time.toLocaleString()} FCFA
        </div>
      )}
      <div className="text-xs text-gray-500">
        unitaire
      </div>
    </div>
  );
};

export default OrderPriceCell;
