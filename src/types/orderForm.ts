
export interface OrderFormItem {
  id: string;
  title: string;
  price: number;
  promoPrice: number | null;
  quantity: number;
  image: string;
  category?: string;
  discountApplied?: number; // For bundle items
}

export interface OrderFormCustomer {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  neighborhood: string;
  notes: string;
}

export interface OrderFormData {
  items: OrderFormItem[];
  customer: OrderFormCustomer;
  promoCode: string;
  appliedDiscount: number;
  promoDiscount: number; // Added this missing property
  deliveryFee: number;
  subtotal: number;
  total: number;
  orderType: 'whatsapp' | 'direct' | 'whatsapp_bundle' | 'direct_bundle';
  bundleDiscount?: number;
}

export interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderFormItem[];
  orderType: 'whatsapp' | 'direct' | 'whatsapp_bundle' | 'direct_bundle';
  bundleDiscount?: number;
  onOrderComplete?: (orderId: string) => void;
}
