
// Type definitions for the sync-products function
export interface CowemaProduct {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  regular_price: number;
  on_sales: boolean;
  etat?: string;
  brand?: string;
  sub_category: string;
  category?: string;
  supplier: string;
  supplier_city: string;
  available_stock: number;
  published_at: string;
}

export interface CowemaApiResponse {
  data: CowemaProduct[];
  page: number;
  last_page: number;
  total: number;
  per_page: number;
}

export interface ProductCache {
  external_api_id: string;
  name: string;
  description?: string;
  price: number;
  promo_price?: number;
  images: string[];
  category?: string;
  subcategory?: string;
  stock: number;
  city?: string;
  location?: string;
  supplier_name?: string;
  video_url?: string;
  keywords: string[];
  is_ya_ba_boss: boolean;
  is_flash_offer: boolean;
  is_active: boolean;
  metadata: Record<string, any>;
  last_sync: string;
}

export interface SyncResult {
  success: boolean;
  message: string;
  stats: {
    total_fetched: number;
    processed: number;
    errors: number;
    pages_fetched: number;
    timestamp: string;
  };
}
