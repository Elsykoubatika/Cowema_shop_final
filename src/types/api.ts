
export interface CategoryData {
  id: string;
  name: string;
  subcategories: string[];
  productCount: number;
  description?: string;
  image?: string;
}

export interface ExtendedProductData {
  isYaBaBoss?: boolean;
  videoUrl?: string;
  keywords?: string[];
  city?: string;
  sold?: number;
  isActive?: boolean;
  isFlashOffer?: boolean;
}
