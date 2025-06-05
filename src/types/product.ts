
// Unified Product type for the entire application
export interface Product {
  id: string; // Always string for consistency
  externalApiId?: string;
  name: string;
  title?: string; // For backward compatibility
  description?: string;
  price: number;
  promoPrice?: number;
  images: string[]; // Always an array to support multiple images
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
  rating?: number; // For backward compatibility
  loyaltyPoints?: number; // For backward compatibility
  sold?: number; // For backward compatibility
}
