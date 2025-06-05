
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useOptimizedOrderForm } from '@/hooks/useOptimizedOrderForm';
import { useWhatsAppOrderSubmission } from './hooks/useWhatsAppOrderSubmission';
import OrderFormContainer from './OrderFormContainer';
import WhatsAppOrderFormContent from './WhatsAppOrderFormContent';

interface OptimizedWhatsAppOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  items: any[];
  onOrderComplete?: (orderId: string) => void;
}

const OptimizedWhatsAppOrderForm: React.FC<OptimizedWhatsAppOrderFormProps> = ({
  isOpen,
  onClose,
  items: initialItems,
  onOrderComplete
}) => {
  console.log('📲 OptimizedWhatsAppOrderForm - Rendering with:', {
    isOpen,
    initialItemsCount: initialItems?.length || 0,
    initialItems: initialItems?.slice(0, 2) // Log first 2 items
  });

  const {
    items,
    customer,
    promoCode,
    appliedPromo,
    cities,
    subtotal,
    deliveryFee,
    promoDiscount,
    total,
    isInitialized,
    updateCustomerField,
    handleQuantityChange,
    handleRemoveItem,
    handlePromoCodeChange,
    validatePromoCode,
    validateForm
  } = useOptimizedOrderForm(isOpen, initialItems);

  const {
    isSubmitting,
    handleSubmit
  } = useWhatsAppOrderSubmission({
    validateForm,
    items,
    customer,
    subtotal,
    deliveryFee,
    promoDiscount,
    total,
    appliedPromo,
    onOrderComplete
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📤 WhatsApp form submit with items:', items.length);
    
    if (!items || items.length === 0) {
      console.warn('⚠️ Cannot submit: no items');
      return;
    }
    
    await handleSubmit();
    onClose();
  };

  console.log('📊 OptimizedWhatsAppOrderForm render state:', {
    isOpen,
    itemsCount: items.length,
    isInitialized,
    isSubmitting,
    customerValid: !!(customer.firstName && customer.lastName && customer.phone),
    subtotal,
    total
  });

  // Don't render if not open or not initialized with items
  if (!isOpen || !isInitialized || items.length === 0) {
    return null;
  }

  return (
    <OrderFormContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Commander via WhatsApp"
      icon={<MessageSquare className="text-green-600" />}
      isSubmitting={isSubmitting}
      itemsCount={items.length}
      submitButtonText="Envoyer via WhatsApp"
      submitButtonColor="bg-green-600 hover:bg-green-700"
      onSubmit={handleFormSubmit}
    >
      <WhatsAppOrderFormContent
        items={items}
        customer={customer}
        cities={cities}
        promoCode={promoCode}
        appliedPromo={appliedPromo}
        subtotal={subtotal}
        promoDiscount={promoDiscount}
        deliveryFee={deliveryFee}
        total={total}
        onUpdateCustomerField={updateCustomerField}
        onQuantityChange={handleQuantityChange}
        onRemoveItem={handleRemoveItem}
        onPromoCodeChange={handlePromoCodeChange}
        onValidatePromo={validatePromoCode}
      />
    </OrderFormContainer>
  );
};

export default OptimizedWhatsAppOrderForm;
