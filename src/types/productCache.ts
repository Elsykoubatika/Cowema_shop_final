
export interface ProductCache {
  id: string;
  externalApiId: string;
  name: string;
  description?: string;
  price: number;
  promoPrice?: number;
  images: string[];
  category?: string;
  subcategory?: string;
  stock: number;
  city?: string;
  location?: string;
  supplierName?: string;
  videoUrl?: string;
  keywords: string[];
  isYaBaBoss: boolean;
  isFlashOffer: boolean;
  isActive: boolean;
  lastSync: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
