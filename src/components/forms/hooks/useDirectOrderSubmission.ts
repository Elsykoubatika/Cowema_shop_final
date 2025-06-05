
import { useState } from 'react';
import { useSupabaseOrders } from '@/hooks/useSupabaseOrders';
import { useOrderStore } from '@/hooks/useOrderStore';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { toast } from 'sonner';
import { OrderFormItem, OrderFormCustomer } from '@/types/orderForm';
import { downloadOrderReceipt } from '@/utils/pdfGenerator';

interface UseDirectOrderSubmissionProps {
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

interface ConfirmedOrderData {
  orderId: string;
  customer: OrderFormCustomer;
  items: OrderFormItem[];
  subtotal: number;
  promoDiscount: number;
  deliveryFee: number;
  total: number;
  appliedPromo?: any;
}

export const useDirectOrderSubmission = ({
  validateForm,
  items,
  customer,
  subtotal,
  deliveryFee,
  promoDiscount,
  total,
  appliedPromo,
  onOrderComplete
}: UseDirectOrderSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedOrderData, setConfirmedOrderData] = useState<ConfirmedOrderData | null>(null);
  
  const { createOrder } = useSupabaseOrders();
  const { addOrder: addLocalOrder } = useOrderStore();
  const { isAuthenticated, user } = useUnifiedAuth();

  const handleSubmit = async () => {
    console.log('🚀 handleSubmit called - Starting submission process');
    
    if (isSubmitting) {
      console.log('⏳ Submission already in progress');
      return;
    }

    console.log('🔍 Validating form before submission...');
    if (!validateForm()) {
      console.log('❌ Form validation failed - stopping submission');
      return;
    }

    if (!items || items.length === 0) {
      console.log('❌ No items to order - stopping submission');
      toast.error('Aucun article à commander');
      return;
    }

    console.log('✅ Form validation passed, proceeding with submission');
    setIsSubmitting(true);
    console.log('🔄 Setting isSubmitting to true, starting order creation');

    try {
      console.log('🚀 Creating direct order with data:', {
        items: items.length,
        customer: customer.firstName,
        total,
        subtotal,
        deliveryFee,
        isAuthenticated
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

      console.log('📦 Creating local order first...');
      const localOrder = await createLocalOrder();
      const orderId = localOrder.id;
      console.log('✅ Local order created successfully with ID:', orderId);

      const confirmationData: ConfirmedOrderData = {
        orderId,
        customer: { ...customer },
        items: [...validatedItems],
        subtotal,
        promoDiscount,
        deliveryFee,
        total,
        appliedPromo: appliedPromo ? { ...appliedPromo } : undefined
      };

      console.log('📝 Preparing confirmation data:', {
        orderId: confirmationData.orderId,
        itemsCount: confirmationData.items.length,
        customerName: confirmationData.customer.firstName
      });
      
      console.log('🎯 Setting confirmation display - setting states...');
      setConfirmedOrderData(confirmationData);
      setShowConfirmation(true);
      console.log('✅ Confirmation dialog state set to TRUE');

      // Traitement Supabase en arrière-plan
      if (isAuthenticated && user) {
        try {
          console.log('🔄 Attempting background Supabase order creation...');
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
              isWhatsApp: false
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

          const supabaseOrder = await createOrder(orderData);
          
          if (supabaseOrder && supabaseOrder.id) {
            console.log('✅ Background Supabase order created:', supabaseOrder.id);
          }
        } catch (supabaseError) {
          console.warn('⚠️ Background Supabase order creation failed (non-blocking):', supabaseError);
        }
      }
      
      // Ne plus appeler onOrderComplete automatiquement ici
      // L'utilisateur devra fermer manuellement la confirmation
      
      toast.success('Commande créée avec succès!');
      console.log('🎉 Order submission completed successfully - confirmation should be visible');
      
    } catch (error) {
      console.error('❌ Error creating direct order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(`Erreur lors de la création de la commande: ${errorMessage}`);
      
      setShowConfirmation(false);
      setConfirmedOrderData(null);
    } finally {
      setIsSubmitting(false);
      console.log('🔄 Setting isSubmitting to false');
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
      email: customer.email || `${customer.firstName.toLowerCase()}@direct.com`,
      address: customer.address,
      city: customer.city,
      notes: customer.notes,
      isWhatsApp: false
    };

    return addLocalOrder(localOrderItems, localCustomerInfo);
  };

  const handleDownloadPDF = () => {
    if (!confirmedOrderData) {
      console.error('❌ No confirmed order data for PDF generation');
      toast.error('Erreur: Données de commande manquantes');
      return;
    }
    
    try {
      console.log('📄 Generating PDF for order:', confirmedOrderData.orderId);
      
      const orderFormData = {
        items: confirmedOrderData.items,
        customer: confirmedOrderData.customer,
        promoCode: appliedPromo?.code || '',
        appliedDiscount: appliedPromo?.discount || 0,
        promoDiscount: confirmedOrderData.promoDiscount,
        deliveryFee: confirmedOrderData.deliveryFee,
        subtotal: confirmedOrderData.subtotal,
        total: confirmedOrderData.total,
        orderType: 'direct' as const,
        bundleDiscount: 0
      };

      downloadOrderReceipt(orderFormData, confirmedOrderData.orderId);
      toast.success('Reçu PDF téléchargé avec succès!');
    } catch (error) {
      console.error('❌ Error downloading PDF:', error);
      toast.error('Erreur lors du téléchargement du PDF');
    }
  };

  const handleCloseConfirmation = () => {
    console.log('🔄 Closing confirmation dialog');
    setShowConfirmation(false);
    setConfirmedOrderData(null);
    
    // Appeler onOrderComplete seulement quand l'utilisateur ferme manuellement
    if (onOrderComplete && confirmedOrderData) {
      onOrderComplete(confirmedOrderData.orderId);
    }
  };

  console.log('📊 useDirectOrderSubmission state:', {
    isSubmitting,
    showConfirmation,
    hasConfirmedData: !!confirmedOrderData,
    itemsCount: items.length
  });

  return {
    isSubmitting,
    showConfirmation,
    confirmedOrderData,
    handleSubmit,
    handleDownloadPDF,
    handleCloseConfirmation
  };
};
