
import React from 'react';
import '../components/ui/animations.css';
import { useUpsellProducts } from '../hooks/useUpsellProducts';
import UpsellHeader from './upsell/UpsellHeader';
import UpsellCallToAction from './upsell/UpsellCallToAction';
import UpsellProductGrid from './upsell/UpsellProductGrid';
import { SelectedUpsell } from './upsell/types';

interface UpsellBannerProps {
  productName: string;
  discountPercentage: number;
  whatsappLink: string;
  className?: string;
  productCategory?: string;
  onAddUpsell?: (selectedUpsells: SelectedUpsell[]) => void;
}

const UpsellBanner: React.FC<UpsellBannerProps> = ({ 
  productName, 
  discountPercentage,
  className = "",
  productCategory = "",
  onAddUpsell
}) => {
  const {
    selectedUpsells,
    getUpsellDiscount,
    getUpsellProducts,
    handleCheckboxChange,
    getSelectedProducts
  } = useUpsellProducts(discountPercentage, productCategory);
  
  const upsellProducts = getUpsellProducts(productCategory);
  const finalDiscount = getUpsellDiscount();
  
  // Handler for checkbox changes that also calls the onAddUpsell callback
  const handleUpsellSelection = (checked: boolean, productName: string) => {
    handleCheckboxChange(checked, productName);
    
    if (onAddUpsell) {
      // Get updated selected products after state change
      const newSelectedUpsells = {
        ...selectedUpsells,
        [productName]: checked
      };
      
      const selectedProducts = upsellProducts
        .filter(product => newSelectedUpsells[product.name])
        .map(product => ({
          name: product.name,
          isAdded: true,
          discount: finalDiscount,
          price: product.price,
          image: product.image
        }));
      
      onAddUpsell(selectedProducts);
    }
  };
  
  return (
    <div className={`bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-300 rounded-lg p-4 ${className}`}>
      <UpsellHeader title="Articles complémentaires recommandés" />
      <UpsellCallToAction discount={finalDiscount} />
      <UpsellProductGrid 
        products={upsellProducts} 
        discount={finalDiscount}
        selectedProducts={selectedUpsells}
        onCheckboxChange={handleUpsellSelection}
      />
    </div>
  );
};

export default UpsellBanner;
