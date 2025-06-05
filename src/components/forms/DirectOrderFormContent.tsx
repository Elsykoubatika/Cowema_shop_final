
import React from 'react';
import OrderItemsDisplay from './OrderItemsDisplay';
import CustomerInfoForm from './CustomerInfoForm';
import PromoCodeSection from './PromoCodeSection';
import OrderSummaryDisplay from './OrderSummaryDisplay';
import DirectOrderInstructions from './DirectOrderInstructions';

interface DirectOrderFormContentProps {
  items: any[];
  customer: any;
  cities: any[];
  promoCode: string;
  appliedPromo: any;
  subtotal: number;
  promoDiscount: number;
  deliveryFee: number;
  total: number;
  onUpdateCustomerField: (field: string, value: string) => void;
  onQuantityChange: (itemId: string, change: number) => void;
  onRemoveItem: (itemId: string) => void;
  onPromoCodeChange: (value: string) => void;
  onValidatePromo: () => void;
}

const DirectOrderFormContent: React.FC<DirectOrderFormContentProps> = ({
  items,
  customer,
  cities,
  promoCode,
  appliedPromo,
  subtotal,
  promoDiscount,
  deliveryFee,
  total,
  onUpdateCustomerField,
  onQuantityChange,
  onRemoveItem,
  onPromoCodeChange,
  onValidatePromo
}) => {
  return (
    <>
      {/* Instructions */}
      <DirectOrderInstructions />

      {/* Order items */}
      <div>
        <h3 className="font-medium mb-3">Articles commandés ({items.length})</h3>
        <OrderItemsDisplay
          items={items}
          onQuantityChange={onQuantityChange}
          onRemoveItem={onRemoveItem}
        />
      </div>

      {/* Customer information form */}
      <CustomerInfoForm
        customer={customer}
        cities={cities}
        onUpdateField={onUpdateCustomerField}
        errors={{}}
      />

      {/* Promo code */}
      <PromoCodeSection
        promoCode={promoCode}
        appliedPromo={appliedPromo}
        onPromoCodeChange={onPromoCodeChange}
        onValidatePromo={onValidatePromo}
      />

      {/* Order summary */}
      <OrderSummaryDisplay
        subtotal={subtotal}
        promoDiscount={promoDiscount}
        deliveryFee={deliveryFee}
        total={total}
        appliedPromo={appliedPromo}
        city={customer.city}
        neighborhood={customer.neighborhood}
      />
    </>
  );
};

export default DirectOrderFormContent;
