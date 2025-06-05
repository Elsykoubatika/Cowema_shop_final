
export interface OrderItem {
  id: string; // Changed to string for consistency
  title: string;
  price: number;
  promoPrice: number | null;
  quantity: number;
  image: string;
  category?: string;
  videoUrl?: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
  // Adding a computed 'name' getter
  name?: string;
  // Flag to identify WhatsApp orders
  isWhatsApp?: boolean;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'confirmed';

export type OrderSource = 'direct' | 'whatsapp' | 'influencer';

export interface Order {
  id: string;
  items: OrderItem[];
  customer: CustomerInfo;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  influencerCode?: string;
  reminderSent?: boolean;
  source?: OrderSource; // Added to easily identify order source
  notes?: string; // Pour stocker des informations supplémentaires
}
