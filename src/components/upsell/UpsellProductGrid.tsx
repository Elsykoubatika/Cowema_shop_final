
import React from 'react';
import UpsellProductCard from './UpsellProductCard';

interface UpsellProduct {
  name: string;
  discount: number;
  image: string;
  price?: number;
}

interface UpsellProductGridProps {
  products: UpsellProduct[];
  discount: number;
  selectedProducts: Record<string, boolean>;
  onCheckboxChange: (checked: boolean, productName: string) => void;
}

const UpsellProductGrid: React.FC<UpsellProductGridProps> = ({
  products,
  discount,
  selectedProducts,
  onCheckboxChange
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {products.map((product, index) => (
        <UpsellProductCard
          key={index}
          product={product}
          index={index}
          discount={discount}
          isSelected={selectedProducts[product.name] || false}
          onCheckboxChange={onCheckboxChange}
        />
      ))}
    </div>
  );
};

export default UpsellProductGrid;
