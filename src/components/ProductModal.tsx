
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Product } from "../data/products";
import WhatsAppOrderFormWrapper from './WhatsAppOrderFormWrapper';
import UpsellBanner from './UpsellBanner';
import { SelectedUpsell } from './upsell/types';
import YaBaBossIcon from './icons/YaBaBossIcon';

// Import refactored components
import ImageGallery from './product-modal/ImageGallery';
import PricingInfo from './product-modal/PricingInfo';
import LoyaltyInfo from './product-modal/LoyaltyInfo';
import ProductDetails from './product-modal/ProductDetails';
import ActionButtons from './product-modal/ActionButtons';
import { useProductModal } from './product-modal/useProductModal';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  const {
    isOrderFormOpen,
    isAddedToCart,
    selectedUpsells,
    getUpsellMessage,
    getIntelligentUpsellProduct,
    getActivePromoDiscount,
    handleAddToCart,
    handleWhatsAppBuy,
    handleUpsellSelection,
    handleViewDetails,
    setIsOrderFormOpen
  } = useProductModal(product, onAddToCart, onClose);

  if (!product) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              {product.title}
              {product.isYaBaBoss && (
                <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <YaBaBossIcon size={12} className="text-white" />
                  YA BA BOSS
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Image Gallery Component */}
            <ImageGallery 
              images={product.images} 
              title={product.title}
              isYaBaBoss={product.isYaBaBoss || false}
              videoUrl={product.videoUrl}
            />
            
            <div>
              {/* Pricing Information Component */}
              <PricingInfo 
                price={product.price} 
                promoPrice={product.promoPrice} 
                isYaBaBoss={product.isYaBaBoss || false} 
              />
              
              {/* Loyalty Information Component */}
              <LoyaltyInfo 
                price={product.price}
                promoPrice={product.promoPrice}
              />
              
              {/* Product Details Component */}
              <ProductDetails
                city={product.city || ''}
                location={product.location}
                stock={product.stock}
                sold={product.sold || 0}
                description={product.description}
              />
              
              {/* Added to cart confirmation */}
              {isAddedToCart && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-800">
                  <p className="font-medium">✅ Ce produit a été ajouté à votre panier.</p>
                </div>
              )}
              
              {/* Action Buttons Component */}
              <div className="flex flex-col gap-3 mt-6">
                <ActionButtons
                  onAddToCart={handleAddToCart}
                  onWhatsAppBuy={handleWhatsAppBuy}
                />
                
                <button 
                  onClick={handleViewDetails}
                  className="text-primary hover:underline text-center mt-2"
                >
                  Voir la page détaillée du produit
                </button>
              </div>
            </div>
          </div>
          
          {/* Upsell Banner */}
          <div className="p-4 border-t">
            <UpsellBanner 
              productName={getIntelligentUpsellProduct(product.category)}
              discountPercentage={getActivePromoDiscount()}
              whatsappLink={getUpsellMessage(product)}
              productCategory={product.category}
              onAddUpsell={handleUpsellSelection}
            />
          </div>
        </DialogContent>
      </Dialog>

      <WhatsAppOrderFormWrapper 
        isOpen={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
        product={product}
        upsellProducts={selectedUpsells}
      />
    </>
  );
};

export default ProductModal;
