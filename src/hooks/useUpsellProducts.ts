
import { useState } from 'react';
import { usePromotionStore } from './usePromotionStore';
import { SelectedUpsell } from '../components/upsell/types';

interface UpsellProduct {
  name: string;
  discount: number;
  image: string;
  price?: number;
  description?: string;
}

export const useUpsellProducts = (
  initialDiscountPercentage: number,
  productCategory = ""
) => {
  const [selectedUpsells, setSelectedUpsells] = useState<Record<string, boolean>>({});
  const { promotions } = usePromotionStore();

  // Get active promotion with the highest discount for upsell
  const getUpsellDiscount = () => {
    const now = new Date();
    const activePromos = promotions.filter(p => 
      p.isActive && new Date(p.expiryDate) > now
    );
    
    // If there are active promos, use the highest discount
    if (activePromos.length > 0) {
      const highestDiscount = Math.max(...activePromos.map(p => p.discount));
      return highestDiscount;
    }
    
    // Default to provided discount percentage
    return initialDiscountPercentage;
  };

  // Generate complementary products based on category
  const getUpsellProducts = (category: string): UpsellProduct[] => {
    const defaultUpsells: Record<string, UpsellProduct[]> = {
      default: [
        { name: "ÉCOUTEURS BLUETOOTH", discount: 15, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=2729&auto=format&fit=crop", price: 30 },
        { name: "CHARGEUR RAPIDE", discount: 15, image: "https://images.unsplash.com/photo-1603539947678-cd3954ed515d?q=80&w=2000&auto=format&fit=crop", price: 25 }
      ],
      "electronics": [
        { name: "CÂBLE DE RECHARGE", discount: 20, image: "https://images.unsplash.com/photo-1612815452658-10e9d2244f24?q=80&w=2000&auto=format&fit=crop", price: 15 },
        { name: "ADAPTATEUR USB", discount: 25, image: "https://images.unsplash.com/photo-1588599336083-11dc9c74db6d?q=80&w=2000&auto=format&fit=crop", price: 20 }
      ],
      "phones": [
        { name: "COQUE DE PROTECTION", discount: 25, image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=2000&auto=format&fit=crop", price: 18 },
        { name: "ÉCOUTEURS SANS FIL", discount: 20, image: "https://images.unsplash.com/photo-1606400082777-ef05f3c5cde2?q=80&w=2000&auto=format&fit=crop", price: 35 }
      ],
      "computers": [
        { name: "SOURIS SANS FIL", discount: 15, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=2000&auto=format&fit=crop", price: 22 },
        { name: "CLAVIER RÉTROÉCLAIRÉ", discount: 20, image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=2000&auto=format&fit=crop", price: 40 }
      ],
      "accessories": [
        { name: "CHARGEUR RAPIDE", discount: 20, image: "https://images.unsplash.com/photo-1603539947678-cd3954ed515d?q=80&w=2000&auto=format&fit=crop", price: 25 },
        { name: "POWERBANK 10000MAH", discount: 15, image: "https://images.unsplash.com/photo-1609091839311-d687f67fa090?q=80&w=2000&auto=format&fit=crop", price: 32 }
      ],
      "fashion": [
        { name: "SOIN VISAGE", discount: 15, image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2000&auto=format&fit=crop", price: 28 },
        { name: "CRÈME HYDRATANTE", discount: 20, image: "https://images.unsplash.com/photo-1571781565036-d3f759314bab?q=80&w=2000&auto=format&fit=crop", price: 22 }
      ],
      "furniture": [
        { name: "COUSSIN DÉCORATIF", discount: 10, image: "https://images.unsplash.com/photo-1584635360827-8b38d6fc8839?q=80&w=2000&auto=format&fit=crop", price: 15 },
        { name: "LAMPE DE CHEVET", discount: 15, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=2000&auto=format&fit=crop", price: 35 }
      ],
      "home": [
        { name: "DIFFUSEUR D'HUILES", discount: 15, image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=2000&auto=format&fit=crop", price: 30 },
        { name: "PLANTE D'INTÉRIEUR", discount: 10, image: "https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=2000&auto=format&fit=crop", price: 25 }
      ],
      "beauty": [
        { name: "MASQUE VISAGE", discount: 20, image: "https://images.unsplash.com/photo-1556228852-6d35a585d566?q=80&w=2000&auto=format&fit=crop", price: 18 },
        { name: "SÉRUM ANTI-ÂGE", discount: 25, image: "https://images.unsplash.com/photo-1570194065650-d99fb4abbd90?q=80&w=2000&auto=format&fit=crop", price: 45 }
      ],
      "food": [
        { name: "ASSORTIMENT DE THÉ", discount: 15, image: "https://images.unsplash.com/photo-1563911892437-1feda0179e1b?q=80&w=2000&auto=format&fit=crop", price: 20 },
        { name: "COFFRET CHOCOLATS", discount: 10, image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=2000&auto=format&fit=crop", price: 22 }
      ],
    };

    return defaultUpsells[category as keyof typeof defaultUpsells] || defaultUpsells.default;
  };

  const handleCheckboxChange = (checked: boolean, productName: string) => {
    setSelectedUpsells(prev => ({
      ...prev,
      [productName]: checked
    }));
  };

  const getSelectedProducts = (upsellProducts: UpsellProduct[]): SelectedUpsell[] => {
    // Convert to array of selected products
    return upsellProducts
      .filter(product => selectedUpsells[product.name])
      .map(product => ({
        name: product.name,
        isAdded: true,
        discount: getUpsellDiscount(),
        price: product.price,
        image: product.image
      }));
  };

  return {
    selectedUpsells,
    getUpsellDiscount,
    getUpsellProducts,
    handleCheckboxChange,
    getSelectedProducts
  };
};
