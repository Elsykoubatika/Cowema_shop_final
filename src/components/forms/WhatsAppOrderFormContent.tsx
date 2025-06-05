
import React from 'react';
import { OrderFormItem, OrderFormCustomer } from '@/types/orderForm';
import CustomerInfoForm from './CustomerInfoForm';
import OrderItemsDisplay from './OrderItemsDisplay';
import OrderSummaryDisplay from './OrderSummaryDisplay';
import PromoCodeSection from './PromoCodeSection';

interface WhatsAppOrderFormContentProps {
  items: OrderFormItem[];
  customer: OrderFormCustomer;
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

const WhatsAppOrderFormContent: React.FC<WhatsAppOrderFormContentProps> = ({
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
    <div className="space-y-6">
      {/* Order Items */}
      <OrderItemsDisplay
        items={items}
        onQuantityChange={onQuantityChange}
        onRemoveItem={onRemoveItem}
      />

      {/* Customer Information */}
      <CustomerInfoForm
        customer={customer}
        cities={cities}
        onUpdateField={onUpdateCustomerField}
      />

      {/* Promo Code Section */}
      <PromoCodeSection
        promoCode={promoCode}
        appliedPromo={appliedPromo}
        onPromoCodeChange={onPromoCodeChange}
        onValidatePromo={onValidatePromo}
      />

      {/* Order Summary */}
      <OrderSummaryDisplay
        subtotal={subtotal}
        promoDiscount={promoDiscount}
        deliveryFee={deliveryFee}
        total={total}
      />

      {/* WhatsApp Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Commande via WhatsApp
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>
                Votre commande sera envoyée directement via WhatsApp à notre équipe. 
                Vous recevrez une confirmation et pourrez suivre votre commande en temps réel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppOrderFormContent;
