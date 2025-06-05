
// Types unifiés pour maintenir la compatibilité pendant la migration
import { Product as OriginalProduct } from '../data/products';
import { Product as TypesProduct } from './product';
import { Customer as AuthCustomer } from './auth';

// Re-export Customer from the hook to fix the export issue
export type { Customer } from '../hooks/useCustomerStore';

// Type unifié pour les produits
export interface UnifiedProduct extends Omit<TypesProduct, 'id'> {
  id: string;
  // Backward compatibility fields
  title?: string;
  rating?: number;
  loyaltyPoints?: number;
  sold?: number;
  reviewCount?: number;
}

// Type unifié pour les clients avec tous les champs optionnels requis
export interface UnifiedCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city: string;
  totalSpent: number;
  orderCount: number;
  lastOrderDate?: string;
  primaryVendor?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
  preferredCategories?: Record<string, number>;
  ordersByVendor?: Record<string, {
    totalSpent: number;
    orderCount: number;
  }>;
}

// Type unifié pour les OrderItems
export interface UnifiedOrderItem {
  id: string;
  title: string;
  price: number;
  promoPrice: number | null;
  quantity: number;
  image: string;
  category?: string;
  videoUrl?: string;
}

// Fonctions de conversion pour maintenir la compatibilité
export const convertToUnifiedProduct = (product: any): UnifiedProduct => {
  return {
    id: String(product.id),
    name: product.name || product.title || '',
    title: product.title || product.name,
    description: product.description || '',
    price: Number(product.price),
    promoPrice: product.promoPrice ? Number(product.promoPrice) : undefined,
    images: product.images || [],
    category: product.category,
    subcategory: product.subcategory,
    stock: Number(product.stock || 0),
    city: product.city,
    location: product.location,
    supplierName: product.supplierName,
    videoUrl: product.videoUrl,
    keywords: product.keywords || [],
    isYaBaBoss: Boolean(product.isYaBaBoss),
    isFlashOffer: Boolean(product.isFlashOffer),
    isActive: product.isActive !== false,
    rating: product.rating,
    loyaltyPoints: product.loyaltyPoints,
    sold: product.sold,
    reviewCount: product.reviewCount
  };
};

export const convertToUnifiedCustomer = (customer: any): UnifiedCustomer => {
  return {
    id: String(customer.id),
    firstName: customer.firstName || customer.first_name || '',
    lastName: customer.lastName || customer.last_name || '',
    email: customer.email || '',
    phone: customer.phone || '',
    address: customer.address || '',
    city: customer.city || '',
    notes: customer.notes || '',
    orderCount: Number(customer.orderCount || customer.order_count || 0),
    totalSpent: Number(customer.totalSpent || customer.total_spent || 0),
    lastOrderDate: customer.lastOrderDate || customer.last_order_date,
    primaryVendor: customer.primaryVendor || customer.primary_vendor,
    createdAt: customer.createdAt || customer.created_at || new Date().toISOString(),
    updatedAt: customer.updatedAt || customer.updated_at || new Date().toISOString(),
    lastActivity: customer.lastActivity || new Date().toISOString(),
    preferredCategories: customer.preferredCategories || customer.preferred_categories || {},
    ordersByVendor: customer.ordersByVendor || {}
  };
};

export const convertToUnifiedOrderItem = (item: any): UnifiedOrderItem => {
  return {
    id: String(item.id),
    title: item.title || item.name || '',
    price: Number(item.price),
    promoPrice: item.promoPrice ? Number(item.promoPrice) : null,
    quantity: Number(item.quantity || 1),
    image: item.image || item.images?.[0] || '',
    category: item.category,
    videoUrl: item.videoUrl
  };
};
