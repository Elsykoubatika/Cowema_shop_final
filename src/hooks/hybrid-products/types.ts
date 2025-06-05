
export interface ApiFilters {
  search?: string;
  category?: number;
  city?: number;
  sort?: 'date' | 'price' | 'title';
  direction?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
  isYaBaBoss?: boolean;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CowemaApiResponse {
  data?: any[];
  current_page?: number;
  last_page?: number;
  total?: number;
  per_page?: number;
  error?: string;
  status?: number;
}

export interface CowemaApiProduct {
  id: number;
  title: string;
  description?: string;
  thumbnail?: string;
  main_image?: string;
  cover_image?: string;
  featured_image?: string;
  product_image?: string;
  image_url?: string;
  images?: string[];
  gallery?: string[];
  additional_images?: string[];
  image_urls?: string[];
  product_images?: string[];
  media?: string[];
  attachments?: string[];
  price: number;
  regular_price?: number;
  on_sales?: boolean;
  etat?: string;
  brand?: string;
  sub_category?: string;
  category?: string;
  supplier?: string;
  supplier_city?: string;
  available_stock?: number;
  published_at?: string;
  video_url?: string;
  tags?: string[];
}
