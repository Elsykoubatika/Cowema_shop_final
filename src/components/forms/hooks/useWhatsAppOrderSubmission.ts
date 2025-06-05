
import { useState } from 'react';
import { useSupabaseOrders } from '@/hooks/useSupabaseOrders';
import { useOrderStore } from '@/hooks/useOrderStore';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { toast } from 'sonner';
import { OrderFormItem, OrderFormCustomer } from '@/types/orderForm';

interface UseWhatsAppOrderSubmissionProps {
  validateForm: () => boolean;
  items: OrderFormItem[];
  customer: OrderFormCustomer;
  subtotal: number;
  deliveryFee: number;
  promoDiscount: number;
  total: number;
  appliedPromo: any;
  onOrderComplete?: (orderId: string) => void;
}

const getWhatsAppNumberByCity = (city: string): string => {
  const cityNumbers = {
    'Pointe-Noire': '+242069596812',
    'Dolisie': '+242069596812',
  };

  return cityNumbers[city as keyof typeof cityNumbers] || '+242068196522';
};

export const useWhatsAppOrderSubmission = ({
  validateForm,
  items,
  customer,
  subtotal,
  deliveryFee,
  promoDiscount,
  total,
  appliedPromo,
  onOrderComplete
}: UseWhatsAppOrderSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createOrder } = useSupabaseOrders();
  const { addWhatsAppOrder } = useOrderStore();
  const { isAuthenticated, user } = useUnifiedAuth();

  const handleSubmit = async () => {
    if (isSubmitting) {
      console.log('⏳ Submission already in progress');
      return;
    }

    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    if (!items || items.length === 0) {
      toast.error('Aucun article à commander');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('🚀 Creating WhatsApp order with data:', {
        items: items.length,
        customer: customer.firstName,
        total,
        subtotal,
        deliveryFee,
        isAuthenticated,
        city: customer.city
      });

      const validatedItems = items.filter(item => {
        const isValid = item.id && item.title && item.quantity > 0;
        if (!isValid) {
          console.warn('Invalid item filtered out:', item);
        }
        return isValid;
      });

      if (validatedItems.length === 0) {
        throw new Error('Aucun article valide à commander');
      }

      let orderId: string;

      const localOrder = await createLocalOrder();
      orderId = localOrder.id;

      if (isAuthenticated && user) {
        try {
          const orderData = {
            total_amount: Math.max(0, total),
            delivery_fee: Math.max(0, deliveryFee),
            payment_method: 'cash_on_delivery' as const,
            customer_info: {
              firstName: customer.firstName.trim(),
              lastName: customer.lastName.trim(),
              phone: customer.phone.trim(),
              email: customer.email.trim(),
              address: customer.address.trim(),
              city: customer.city.trim(),
              neighborhood: customer.neighborhood.trim(),
              notes: customer.notes.trim(),
              isWhatsApp: true
            },
            delivery_address: {
              address: customer.address.trim(),
              city: customer.city.trim(),
              neighborhood: customer.neighborhood.trim(),
              notes: customer.notes.trim()
            },
            referral_code: appliedPromo?.code || null,
            user_id: user.id
          };

          console.log('🔄 Attempting Supabase order creation...');
          const supabaseOrder = await createOrder(orderData);
          
          if (supabaseOrder && supabaseOrder.id) {
            console.log('✅ WhatsApp order also created in Supabase:', supabaseOrder.id);
          }
        } catch (supabaseError) {
          console.warn('⚠️ Supabase order creation failed, but local order was successful:', supabaseError);
        }
      } else {
        console.log('👤 User not authenticated, using local order only');
      }

      const message = generateWhatsAppMessage({
        orderId: orderId.substring(0, 8),
        customer,
        items: validatedItems,
        total,
        deliveryFee,
        appliedPromo
      });

      const whatsappNumber = getWhatsAppNumberByCity(customer.city);
      console.log(`📱 Using WhatsApp number ${whatsappNumber} for city: ${customer.city}`);

      const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      if (onOrderComplete) {
        onOrderComplete(orderId);
      }

      toast.success(`Commande envoyée via WhatsApp vers ${whatsappNumber}!`);
    } catch (error) {
      console.error('❌ Error creating WhatsApp order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(`Erreur lors de la création de la commande: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const createLocalOrder = async () => {
    const localOrderItems = items.map(item => ({
      id: String(item.id),
      title: item.title,
      price: item.promoPrice !== null ? item.promoPrice : item.price,
      promoPrice: item.promoPrice,
      quantity: item.quantity,
      image: item.image || '',
      category: item.category || ''
    }));

    const localCustomerInfo = {
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone,
      email: customer.email || `${customer.firstName.toLowerCase()}@whatsapp.com`,
      address: customer.address,
      city: customer.city,
      notes: customer.notes,
      isWhatsApp: true
    };

    return addWhatsAppOrder(localOrderItems, localCustomerInfo);
  };

  const generateWhatsAppMessage = ({
    orderId,
    customer,
    items,
    total,
    deliveryFee,
    appliedPromo
  }: {
    orderId: string;
    customer: OrderFormCustomer;
    items: OrderFormItem[];
    total: number;
    deliveryFee: number;
    appliedPromo: any;
  }) => {
    try {
      let message = `🛒 *NOUVELLE COMMANDE #${orderId}*\n\n`;
      message += `👤 *Client:* ${customer.firstName} ${customer.lastName}\n`;
      message += `📱 *Téléphone:* ${customer.phone}\n`;
      message += `📧 *Email:* ${customer.email}\n`;
      message += `📍 *Adresse:* ${customer.address}, ${customer.neighborhood}, ${customer.city}\n\n`;
      
      message += `🛍️ *Articles commandés:*\n`;
      items.forEach((item, index) => {
        const price = item.promoPrice !== null ? item.promoPrice : item.price;
        message += `${index + 1}. ${item.title}\n`;
        message += `   Quantité: ${item.quantity}\n`;
        message += `   Prix unitaire: ${price.toLocaleString()} FCFA\n`;
        message += `   Sous-total: ${(price * item.quantity).toLocaleString()} FCFA\n\n`;
      });
      
      const subtotal = items.reduce((sum, item) => {
        const price = item.promoPrice !== null ? item.promoPrice : item.price;
        return sum + (price * item.quantity);
      }, 0);
      
      message += `💰 *Récapitulatif:*\n`;
      message += `Sous-total: ${subtotal.toLocaleString()} FCFA\n`;
      if (appliedPromo) {
        message += `Remise (${appliedPromo.code}): -${appliedPromo.discount}%\n`;
      }
      message += `Frais de livraison: ${deliveryFee.toLocaleString()} FCFA\n`;
      message += `*TOTAL: ${total.toLocaleString()} FCFA*\n\n`;
      
      if (customer.notes && customer.notes.trim()) {
        message += `📝 *Notes:* ${customer.notes}\n\n`;
      }
      
      message += `✅ Merci de confirmer cette commande.\n`;
      message += `💳 Paiement: À la livraison`;
      
      return message;
    } catch (error) {
      console.error('Error generating WhatsApp message:', error);
      return `Nouvelle commande #${orderId} - Erreur lors de la génération du message`;
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
};
