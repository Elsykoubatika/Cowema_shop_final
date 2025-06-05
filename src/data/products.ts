
// Temporary export for backward compatibility - will be removed later
export interface LegacyProduct {
  id: number;
  title: string;
  price: number;
  promoPrice?: number;
  images: string[];
  category?: string;
  city?: string;
  stock: number;
  rating: number;
  loyaltyPoints: number;
  isYaBaBoss?: boolean;
  description?: string;
  videoUrl?: string;
  keywords?: string[];
}

// Export the unified Product type from types/product.ts
export type { Product } from '@/types/product';

// Mock data using the new Product type
import type { Product } from '@/types/product';

// Add the missing locations export
export const locations = ["Brazzaville", "Pointe-Noire"];

export const products: Product[] = [
  {
    id: "1",
    name: "Générateur Solar 1000W",
    title: "Générateur Solar 1000W", // For backward compatibility
    description: "Générateur solaire portable de 1000W avec batterie intégrée",
    price: 450000,
    promoPrice: 350000,
    images: ["https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&h=500&fit=crop"],
    category: "Générateurs",
    subcategory: "Solaire",
    stock: 10,
    city: "Brazzaville",
    location: "Brazzaville",
    supplierName: "SolarTech Congo",
    videoUrl: "",
    keywords: ["générateur", "solaire", "1000W", "portable"],
    isYaBaBoss: true,
    isFlashOffer: false,
    isActive: true,
    rating: 4.5,
    loyaltyPoints: 350,
    sold: 15
  },
  {
    id: "2", 
    name: "Panneau Solaire 200W",
    title: "Panneau Solaire 200W",
    description: "Panneau solaire monocristallin de 200W haute efficacité",
    price: 120000,
    images: ["https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=500&h=500&fit=crop"],
    category: "Panneaux Solaires",
    subcategory: "Monocristallin",
    stock: 25,
    city: "Pointe-Noire",
    location: "Pointe-Noire",
    supplierName: "EnergiePlus",
    videoUrl: "",
    keywords: ["panneau", "solaire", "200W", "monocristallin"],
    isYaBaBoss: false,
    isFlashOffer: true,
    isActive: true,
    rating: 4.2,
    loyaltyPoints: 120,
    sold: 8
  }
];

// Add the yaBaBossProducts export
export const yaBaBossProducts = products.filter(product => product.isYaBaBoss);

export const getProducts = (): Product[] => products;
export const getProductById = (id: string): Product | undefined => 
  products.find(p => p.id === id);
