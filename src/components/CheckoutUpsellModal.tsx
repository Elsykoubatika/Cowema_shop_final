import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { UnifiedCartItem } from '../cart/types/cart.types';
import { Product, products } from '../data/products';
import { usePromotionStore } from '../hooks/usePromotionStore';
import { Flame, AlertCircle } from 'lucide-react';
import { useUpsellStrategy } from '../hooks/useUpsellStrategy';
import { Alert } from './ui/alert';

interface CheckoutUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (product: Product) => void;
  onDecline: () => void;
  mainProduct: Product | UnifiedCartItem | null;
}

const CheckoutUpsellModal: React.FC<CheckoutUpsellModalProps> = ({
  isOpen,
  onClose,
  onAccept,
  onDecline,
  mainProduct
}) => {
  const { promotions } = usePromotionStore();
  const [upsellProduct, setUpsellProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { getCheckoutUpsellProducts } = useUpsellStrategy();
  
  // Stable conversion function
  const convertToProduct = useCallback((item: Product | UnifiedCartItem): Product => {
    if ('images' in item) {
      // It's already a Product
      return item as Product;
    }
    
    // Convert UnifiedCartItem to Product
    return {
      id: item.id,
      name: item.name || item.title,
      title: item.title,
      description: '',
      price: item.price,
      promoPrice: item.promoPrice,
      images: item.image ? [item.image] : [],
      category: item.category,
      stock: item.stock,
      keywords: [],
      isYaBaBoss: item.metadata?.isYaBaBoss || false,
      isFlashOffer: item.metadata?.isFlashOffer || false,
      isActive: true,
      city: item.metadata?.location,
      location: item.metadata?.location,
      supplierName: item.metadata?.supplier
    };
  }, []);
  
  // Stable product conversion with proper dependency
  const productForRecommendation = useMemo(() => {
    if (!mainProduct) return null;
    return convertToProduct(mainProduct);
  }, [mainProduct?.id, convertToProduct]); // Only depend on product ID
  
  // Optimize useEffect to prevent infinite loops
  useEffect(() => {
    // Early exit if modal is not open or no product
    if (!isOpen || !productForRecommendation) {
      return;
    }
    
    // Don't reload if we already have a product and it's for the same main product
    if (upsellProduct && productForRecommendation.id === productForRecommendation.id) {
      return;
    }
    
    setIsLoading(true);
    setHasError(false);
    setUpsellProduct(null);
    
    try {
      // Call with proper arguments - product and products list
      const recommendedProducts = getCheckoutUpsellProducts(productForRecommendation, products);
      if (recommendedProducts.length > 0) {
        // Convert the first recommended product to proper Product type
        const firstRecommended = recommendedProducts[0];
        const convertedProduct: Product = {
          id: firstRecommended.id || '1',
          name: firstRecommended.name || firstRecommended.title || 'Produit recommandé',
          title: firstRecommended.title || firstRecommended.name || 'Produit recommandé',
          description: firstRecommended.description || '',
          price: firstRecommended.price || 0,
          promoPrice: firstRecommended.promoPrice,
          images: firstRecommended.images || ['https://placehold.co/300x300/EFEAE0/8A7D6B?text=Produit'],
          category: firstRecommended.category || 'Accessoires',
          stock: firstRecommended.stock || 10,
          keywords: firstRecommended.keywords || [],
          isYaBaBoss: firstRecommended.isYaBaBoss || false,
          isFlashOffer: firstRecommended.isFlashOffer || false,
          isActive: firstRecommended.isActive !== false,
          city: firstRecommended.city,
          location: firstRecommended.location,
          supplierName: firstRecommended.supplierName
        };
        setUpsellProduct(convertedProduct);
        console.log('Upsell product found:', convertedProduct.title);
      } else {
        console.log('No upsell product found for', productForRecommendation.title);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des produits d\'upsell:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [isOpen, productForRecommendation?.id, getCheckoutUpsellProducts]); // Minimal dependencies
  
  // Stable handlers
  const handleAccept = useCallback(() => {
    if (upsellProduct) {
      console.log("Accepting upsell in modal, product:", upsellProduct);
      onAccept(upsellProduct);
    }
  }, [upsellProduct?.id, onAccept]); // Only depend on upsell product ID
  
  const handleDecline = useCallback(() => {
    onDecline();
  }, [onDecline]);
  
  // Calculate pricing only when needed
  const pricingInfo = useMemo(() => {
    if (!upsellProduct) return null;
    
    const discount = Math.round(((upsellProduct.price - (upsellProduct.promoPrice || upsellProduct.price * 0.8)) / upsellProduct.price) * 100);
    const discountedPrice = upsellProduct.promoPrice || Math.round(upsellProduct.price * 0.8);
    const savings = upsellProduct.price - discountedPrice;
    
    return { discount, discountedPrice, savings };
  }, [upsellProduct?.id, upsellProduct?.price, upsellProduct?.promoPrice]);
  
  // Si on est en train de charger, montrer un indicateur
  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogTitle className="text-xl font-bold">Chargement...</DialogTitle>
          <div className="flex justify-center p-8">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  // En cas d'erreur ou si aucun produit n'est trouvé
  if (hasError || !upsellProduct || !pricingInfo) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
            <AlertCircle /> Un problème est survenu
          </DialogTitle>
          <Alert variant="destructive">
            Impossible de charger des recommandations pour ce produit. Veuillez continuer votre commande.
          </Alert>
          <div className="flex justify-end mt-4">
            <Button onClick={handleDecline}>Continuer</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogTitle className="text-xl font-bold flex items-center gap-2 text-red-600">
          <Flame className="animate-pulse" /> NE PARTEZ PAS SANS CECI !
        </DialogTitle>
        
        <div className="mt-4 bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-300">
          <div className="flex gap-4 mb-4">
            <img 
              src={upsellProduct.images[0]} 
              alt={upsellProduct.title} 
              className="w-24 h-24 object-cover rounded-md"
              onError={(e) => {
                // En cas d'erreur de chargement d'image, afficher une image de remplacement
                e.currentTarget.src = 'https://placehold.co/100x100/EFEAE0/8A7D6B?text=Image';
              }}
            />
            <div>
              <h3 className="font-bold">{upsellProduct.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{upsellProduct.description}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-primary font-bold">{pricingInfo.discountedPrice.toLocaleString()} FCFA</span>
                <span className="text-gray-400 text-sm line-through">{upsellProduct.price.toLocaleString()} FCFA</span>
                <span className="text-xs bg-red-100 text-red-800 px-1 rounded">-{pricingInfo.discount}%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-100 p-3 rounded-md border border-yellow-300 mb-4">
            <p className="text-yellow-800 font-semibold text-center">
              Vous économisez {pricingInfo.savings.toLocaleString()} FCFA aujourd'hui seulement !
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold"
              onClick={handleAccept}
            >
              OUI, JE VEUX ÉCONOMISER !
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleDecline}
            >
              Non, merci
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(CheckoutUpsellModal);
