
import React from 'react';
import { OrderFormItem } from '@/types/orderForm';
import OptimizedWhatsAppOrderForm from '../forms/OptimizedWhatsAppOrderForm';
import OptimizedDirectOrderForm from '../forms/OptimizedDirectOrderForm';

interface UnifiedOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderFormItem[];
  orderType: 'whatsapp' | 'direct' | 'whatsapp_bundle' | 'direct_bundle';
  bundleDiscount?: number;
  onOrderComplete?: (orderId: string) => void;
}

const UnifiedOrderForm: React.FC<UnifiedOrderFormProps> = ({
  isOpen,
  onClose,
  items,
  orderType,
  bundleDiscount,
  onOrderComplete
}) => {
  console.log('🎯 UnifiedOrderForm - Rendering with:', {
    orderType,
    itemsCount: items?.length || 0,
    bundleDiscount,
    isOpen,
    firstItem: items?.[0] ? {
      id: items[0].id,
      title: items[0].title,
      quantity: items[0].quantity
    } : null
  });

  // Format items for the form components with bundle discount
  const formatItems = () => {
    if (!items || items.length === 0) {
      console.warn('⚠️ UnifiedOrderForm - No items provided');
      return [];
    }
    
    const formatted = items.map(item => ({
      id: String(item.id),
      title: item.title,
      price: item.price,
      promoPrice: item.promoPrice,
      quantity: item.quantity || 1,
      image: item.image,
      category: item.category,
      discountApplied: bundleDiscount || item.discountApplied
    }));

    console.log('✅ UnifiedOrderForm - Formatted items:', formatted.length, formatted);
    return formatted;
  };

  const formattedItems = formatItems();

  // Don't render anything if no items
  if (!formattedItems || formattedItems.length === 0) {
    console.warn('⚠️ UnifiedOrderForm - No formatted items, not rendering');
    return null;
  }

  // WhatsApp order types
  if (orderType === 'whatsapp' || orderType === 'whatsapp_bundle') {
    return (
      <OptimizedWhatsAppOrderForm
        isOpen={isOpen}
        onClose={onClose}
        items={formattedItems}
        onOrderComplete={onOrderComplete}
      />
    );
  }

  // Direct order types
  if (orderType === 'direct' || orderType === 'direct_bundle') {
    return (
      <OptimizedDirectOrderForm
        isOpen={isOpen}
        onClose={onClose}
        items={formattedItems}
        onOrderComplete={onOrderComplete}
      />
    );
  }

  console.warn('⚠️ UnifiedOrderForm - Unknown order type:', orderType);
  return null;
};

export default UnifiedOrderForm;
