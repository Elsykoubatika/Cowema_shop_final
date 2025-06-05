
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useOptimizedOrderForm } from '@/hooks/useOptimizedOrderForm';
import { useDirectOrderSubmission } from './hooks/useDirectOrderSubmission';
import OrderFormContainer from './OrderFormContainer';
import DirectOrderFormContent from './DirectOrderFormContent';
import OrderConfirmationDialog from './OrderConfirmationDialog';

interface OptimizedDirectOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  items: any[];
  onOrderComplete?: (orderId: string) => void;
}

const OptimizedDirectOrderForm: React.FC<OptimizedDirectOrderFormProps> = ({
  isOpen,
  onClose,
  items: initialItems,
  onOrderComplete
}) => {
  console.log('🎯 OptimizedDirectOrderForm - Rendering with:', {
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
    showConfirmation,
    confirmedOrderData,
    handleSubmit,
    handleDownloadPDF,
    handleCloseConfirmation
  } = useDirectOrderSubmission({
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
    console.log('📤 Direct form submit triggered with items:', items.length);
    
    if (!items || items.length === 0) {
      console.warn('⚠️ Cannot submit: no items');
      return;
    }
    
    console.log('🚀 Calling handleSubmit from form...');
    await handleSubmit();
  };

  const handleConfirmationClose = () => {
    console.log('🔄 Handling confirmation close from form');
    handleCloseConfirmation();
    // Fermer le formulaire principal seulement après fermeture manuelle de la confirmation
    onClose();
  };

  console.log('📊 OptimizedDirectOrderForm render state:', {
    isOpen,
    itemsCount: items.length,
    isInitialized,
    isSubmitting,
    showConfirmation,
    hasConfirmedData: !!confirmedOrderData,
    customerValid: !!(customer.firstName && customer.lastName && customer.phone),
    subtotal,
    total
  });

  // Don't render if not open or not initialized with items
  if (!isOpen || !isInitialized || items.length === 0) {
    console.log('🚫 Not rendering form - conditions not met');
    return null;
  }

  return (
    <>
      {/* Formulaire principal - se cache quand la confirmation s'affiche */}
      {!showConfirmation && (
        <OrderFormContainer
          isOpen={isOpen}
          onClose={onClose}
          title="Finaliser votre commande"
          icon={<ShoppingCart className="text-blue-600" />}
          isSubmitting={isSubmitting}
          itemsCount={items.length}
          submitButtonText="Confirmer"
          submitButtonColor="bg-green-600 hover:bg-green-700"
          onSubmit={handleFormSubmit}
        >
          <DirectOrderFormContent
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
      )}

      {/* Confirmation Dialog - S'affiche quand showConfirmation est true et reste ouvert */}
      {showConfirmation && confirmedOrderData && (
        <OrderConfirmationDialog
          isOpen={showConfirmation}
          onClose={handleConfirmationClose}
          orderId={confirmedOrderData.orderId}
          customer={confirmedOrderData.customer}
          items={confirmedOrderData.items}
          subtotal={confirmedOrderData.subtotal}
          promoDiscount={confirmedOrderData.promoDiscount}
          deliveryFee={confirmedOrderData.deliveryFee}
          total={confirmedOrderData.total}
          appliedPromo={confirmedOrderData.appliedPromo}
          onDownloadPDF={handleDownloadPDF}
        />
      )}
    </>
  );
};

export default OptimizedDirectOrderForm;
