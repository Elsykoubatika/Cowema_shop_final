
export interface SupabaseOrder {
  id: string;
  user_id?: string; // Ajout de cette propriété optionnelle
  customer_info: {
    firstName?: string;
    first_name?: string;
    lastName?: string;
    last_name?: string;
    email?: string;
    phone: string;
    city?: string;
    address?: string;
    isWhatsApp?: boolean; // Marqueur pour les commandes WhatsApp
  };
  delivery_address?: {
    city?: string;
    address?: string;
  };
  delivery_fee?: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  notes?: string; // Pour stocker des informations supplémentaires sur la source
  source?: 'whatsapp' | 'direct' | 'influencer'; // Source de la commande
  order_items?: Array<{
    id: string;
    title: string;
    quantity: number;
    price_at_time: number;
    promo_price?: number;
    image?: string;
    product_id?: string;
  }>;
}

export interface OrderStats {
  total: number;
  pending: number;
  confirmed: number;
  delivered: number;
  totalAmount: number;
}
