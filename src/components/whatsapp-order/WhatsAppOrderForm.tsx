
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useOrderStore } from '@/hooks/useOrderStore';
import { OrderItem } from '@/types/order';
import { Product } from '@/data/products';
import { openWhatsApp, WhatsAppOrderData } from '@/utils/whatsappUtils';
import { useWhatsAppOrderForm } from '@/hooks/useWhatsAppOrderForm';
import OrderItemsList from './OrderItemsList';
import CustomerInfoSection from './CustomerInfoSection';
import PromoCodeInput from './PromoCodeInput';
import OrderSummarySection from './OrderSummarySection';

interface WhatsAppOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  cartItems?: any[];
  upsellProducts?: any[];
  onSubmit?: (formData: any) => Promise<void>;
}

const WhatsAppOrderForm: React.FC<WhatsAppOrderFormProps> = ({ 
  isOpen,
  onClose,
  cartItems = [],
  product,
  onSubmit
}) => {
  const { toast: showToast } = useToast();
  const { addWhatsAppOrder } = useOrderStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    items,
    customerInfo,
    appliedPromo,
    cities,
    neighborhoods,
    calculateSubtotal,
    calculateDeliveryFee,
    calculateDiscount,
    calculateTotal,
    validatePromoCode,
    handleQuantityChange,
    handleRemoveItem,
    handleInputChange
  } = useWhatsAppOrderForm(isOpen, cartItems, product);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      showToast({
        title: "Erreur",
        description: "Votre panier est vide",
        variant: "destructive"
      });
      return;
    }

    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.phone || !customerInfo.address) {
      showToast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate totals
      const subtotal = calculateSubtotal();
      const discount = calculateDiscount(subtotal);
      const deliveryFee = calculateDeliveryFee();
      const totalAmount = subtotal - discount + deliveryFee;

      // Convert items to OrderItem format
      const orderItems: OrderItem[] = items.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        promoPrice: item.promoPrice,
        quantity: item.quantity,
        image: item.image,
        category: item.category
      }));

      console.log('WhatsApp Form - Submitting order with items:', orderItems);

      if (onSubmit) {
        const formData = {
          customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
          phone: customerInfo.phone,
          email: customerInfo.email,
          address: customerInfo.address,
          city: customerInfo.city,
          notes: customerInfo.notes,
          items: orderItems
        };
        await onSubmit(formData);
      } else {
        // Create order locally
        addWhatsAppOrder(orderItems, {
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email || `${customerInfo.firstName.toLowerCase()}@whatsapp.com`,
          phone: customerInfo.phone,
          address: customerInfo.address,
          city: customerInfo.city,
          notes: customerInfo.notes,
          isWhatsApp: true
        });

        // Prepare data for WhatsApp with predefined message
        const orderData: WhatsAppOrderData = {
          customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
          phone: customerInfo.phone,
          address: customerInfo.address,
          city: customerInfo.city,
          items: orderItems,
          total: totalAmount,
          notes: customerInfo.notes,
          deliveryFee: deliveryFee,
          discount: discount,
          promoCode: appliedPromo?.code
        };

        console.log('WhatsApp Form - Opening WhatsApp with complete data:', orderData);
        
        // Redirect to WhatsApp with predefined message
        openWhatsApp(orderData);

        showToast({
          title: "Commande créée",
          description: "Redirection vers WhatsApp avec votre commande..."
        });
      }

      // Close modal after short delay to allow redirection
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      showToast({
        title: "Erreur",
        description: "Impossible de créer la commande. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const subtotal = calculateSubtotal();
  const discount = calculateDiscount(subtotal);
  const deliveryFee = calculateDeliveryFee();
  const total = calculateTotal();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Finaliser votre commande WhatsApp</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">📱 Instructions WhatsApp</h3>
            <p className="text-sm text-blue-800">
              En confirmant cette commande, vous serez redirigé vers WhatsApp pour finaliser votre achat 
              avec notre équipe COWEMA. Un message pré-rempli avec vos informations sera généré automatiquement.
            </p>
          </div>

          {/* Order items */}
          <div>
            <h3 className="font-medium mb-3">Articles commandés ({items.length})</h3>
            <OrderItemsList
              items={items}
              onQuantityChange={handleQuantityChange}
              onRemoveItem={handleRemoveItem}
            />
          </div>

          {/* Customer information form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <CustomerInfoSection
              customerInfo={customerInfo}
              cities={cities}
              neighborhoods={neighborhoods}
              onInputChange={handleInputChange}
            />

            {/* Promo code */}
            <PromoCodeInput
              promoCode={customerInfo.promoCode}
              appliedPromo={appliedPromo}
              onPromoCodeChange={(value) => handleInputChange('promoCode', value)}
              onValidatePromo={validatePromoCode}
            />

            {/* Order summary */}
            <OrderSummarySection
              subtotal={subtotal}
              appliedPromo={appliedPromo}
              discount={discount}
              deliveryFee={deliveryFee}
              total={total}
            />

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting || items.length === 0} className="flex-1">
                {isSubmitting ? "Traitement..." : "Confirmer et aller sur WhatsApp"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppOrderForm;
