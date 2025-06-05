import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { ShoppingCart, Users, Clock, Check, ArrowRight, Star, Plus, Sparkles, TrendingUp, MessageCircle, Zap, Package, ChevronRight, Heart } from 'lucide-react';
import { useAuthStore } from '../hooks/useAuthStore';
import { useToast } from '../hooks/use-toast';
import { useUnifiedCart } from '../cart/components/CartProvider';
import { useHybridProducts } from '../hooks/useHybridProducts';
import { useOptimizedRecommendations } from '../hooks/useOptimizedRecommendations';
import UnifiedOrderForm from './order-forms/UnifiedOrderForm';
import { OrderFormItem } from '@/types/orderForm';

interface ProductPageUpsellProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductPageUpsell: React.FC<ProductPageUpsellProps> = React.memo(({ product, onAddToCart }) => {
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});
  const [bundleDiscount] = useState(15);
  const [bundleLoading, setBundleLoading] = useState({
    whatsapp: false,
    direct: false
  });
  
  // Order form states
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false);
  const [showDirectForm, setShowDirectForm] = useState(false);
  const [showWhatsAppBundleForm, setShowWhatsAppBundleForm] = useState(false);
  const [showDirectBundleForm, setShowDirectBundleForm] = useState(false);
  
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { addItem: addToUnifiedCart, isInCart } = useUnifiedCart();
  const { products } = useHybridProducts();
  
  // Use optimized recommendations - memoized to prevent re-execution
  const { recommendations, hasRecommendations } = useOptimizedRecommendations({
    currentProduct: product,
    allProducts: products,
    maxRecommendations: 3
  });
  
  // Only log once when recommendations change
  const loggedRecommendations = useMemo(() => {
    if (hasRecommendations) {
      console.log('🎯 ProductPageUpsell Smart Recommendations:', {
        productId: product.id,
        productName: product.name,
        recommendationCount: recommendations.length,
        recommendations: recommendations.map(p => ({ id: p.id, name: p.name, category: p.category }))
      });
    }
    return recommendations;
  }, [product.id, recommendations.length, hasRecommendations]);
  
  // Generate dynamic stats based on product - memoized
  const dynamicStats = useMemo(() => {
    const productSeed = parseInt(product.id.replace(/\D/g, '')) || 1;
    return {
      weeklyBuyers: Math.floor((productSeed % 50) + 80), // 80-129
      percentage: Math.floor((productSeed % 10) + 90), // 90-99%
      countdownMinutes: Math.floor((productSeed % 15) + 5), // 5-19 minutes
      countdownSeconds: Math.floor((productSeed % 60)) // 0-59 seconds
    };
  }, [product.id]);
  
  // Enhanced add to cart function - memoized
  const handleAddComplementary = useCallback(async (complementaryProduct: Product) => {
    setLoadingItems(prev => ({ ...prev, [complementaryProduct.id]: true }));
    
    try {
      const productToAdd = {
        id: String(complementaryProduct.id),
        title: complementaryProduct.name,
        name: complementaryProduct.name,
        price: complementaryProduct.price,
        promoPrice: complementaryProduct.promoPrice,
        image: Array.isArray(complementaryProduct.images) ? complementaryProduct.images[0] : complementaryProduct.images[0],
        images: complementaryProduct.images,
        category: complementaryProduct.category,
        stock: complementaryProduct.stock || 100,
        isYaBaBoss: complementaryProduct.isYaBaBoss,
        isFlashOffer: complementaryProduct.isFlashOffer,
        supplier: complementaryProduct.supplierName,
        location: complementaryProduct.location
      };

      addToUnifiedCart(productToAdd);
      setAddedItems(prev => ({ ...prev, [complementaryProduct.id]: true }));
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      toast({
        title: "Produit ajouté",
        description: `${complementaryProduct.name} a été ajouté à votre panier.`,
        duration: 2000,
      });
      
    } catch (error) {
      console.error('Error adding complementary product:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le produit au panier.",
      });
    } finally {
      setTimeout(() => {
        setLoadingItems(prev => ({ ...prev, [complementaryProduct.id]: false }));
      }, 600);
    }
  }, [addToUnifiedCart, toast]);
  
  // Memoized calculations
  const calculations = useMemo(() => {
    const calculateDiscount = (originalPrice: number, promoPrice: number) => {
      return Math.round(((originalPrice - promoPrice) / originalPrice) * 100);
    };
    
    const calculateBundlePrice = () => {
      const mainPrice = product.promoPrice || product.price;
      const complementaryPrices = loggedRecommendations.reduce((sum, p) => sum + (p.promoPrice || p.price), 0);
      const totalPrice = mainPrice + complementaryPrices;
      return Math.round(totalPrice * (1 - bundleDiscount / 100));
    };
    
    const getBundleSavings = () => {
      const mainPrice = product.promoPrice || product.price;
      const complementaryPrices = loggedRecommendations.reduce((sum, p) => sum + (p.promoPrice || p.price), 0);
      const totalPrice = mainPrice + complementaryPrices;
      return totalPrice - calculateBundlePrice();
    };

    return {
      calculateDiscount,
      calculateBundlePrice,
      getBundleSavings
    };
  }, [product.price, product.promoPrice, loggedRecommendations, bundleDiscount]);

  // Convert products to OrderFormItem format - memoized
  const orderFormItems = useMemo(() => {
    const convertToOrderFormItem = (prod: Product): OrderFormItem => ({
      id: String(prod.id),
      title: prod.name,
      price: prod.price,
      promoPrice: prod.promoPrice || null,
      quantity: 1,
      image: Array.isArray(prod.images) ? prod.images[0] : prod.images[0] || '',
      category: prod.category
    });

    const convertToOrderFormItemWithDiscount = (prod: Product): OrderFormItem => {
      const originalPrice = prod.promoPrice || prod.price;
      const discountedPrice = Math.round(originalPrice * (1 - bundleDiscount / 100));
      
      return {
        id: String(prod.id),
        title: prod.name,
        price: prod.price,
        promoPrice: discountedPrice,
        quantity: 1,
        image: Array.isArray(prod.images) ? prod.images[0] : prod.images[0] || '',
        category: prod.category,
        discountApplied: bundleDiscount
      };
    };

    return {
      getSingleItems: () => [convertToOrderFormItem(product)],
      getBundleItems: () => [
        convertToOrderFormItemWithDiscount(product),
        ...loggedRecommendations.map(convertToOrderFormItemWithDiscount)
      ]
    };
  }, [product, loggedRecommendations, bundleDiscount]);

  // Bundle action handlers - memoized
  const bundleHandlers = useMemo(() => ({
    handleBundleWhatsApp: () => {
      setBundleLoading(prev => ({ ...prev, whatsapp: true }));
      setTimeout(() => {
        setBundleLoading(prev => ({ ...prev, whatsapp: false }));
        setShowWhatsAppBundleForm(true);
      }, 600);
    },
    handleBundleDirect: () => {
      setBundleLoading(prev => ({ ...prev, direct: true }));
      setTimeout(() => {
        setBundleLoading(prev => ({ ...prev, direct: false }));
        setShowDirectBundleForm(true);
      }, 600);
    }
  }), []);

  // Update cart state
  useEffect(() => {
    const newAddedItems: Record<string, boolean> = {};
    loggedRecommendations.forEach(prod => {
      newAddedItems[prod.id] = isInCart(String(prod.id));
    });
    setAddedItems(newAddedItems);
  }, [loggedRecommendations, isInCart]);
  
  // Track time for urgency countdown
  const [countdownMinutes, setCountdownMinutes] = useState(dynamicStats.countdownMinutes);
  const [countdownSeconds, setCountdownSeconds] = useState(dynamicStats.countdownSeconds);
  
  useEffect(() => {
    const timer = setInterval(() => {
      if (countdownSeconds > 0) {
        setCountdownSeconds(countdownSeconds - 1);
      } else if (countdownMinutes > 0) {
        setCountdownMinutes(countdownMinutes - 1);
        setCountdownSeconds(59);
      } else {
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [countdownMinutes, countdownSeconds]);
  
  const formatTime = useCallback((value: number) => {
    return value < 10 ? `0${value}` : value.toString();
  }, []);
  
  // Don't render if no recommendations
  if (!hasRecommendations) {
    return null;
  }
  
  return (
    <>
      {/* ... keep existing code (main UI structure) */}
      <div className="space-y-6">
        {/* Single unified card with all recommendations */}
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl border-2 border-emerald-200 p-6 shadow-xl relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-400 rounded-full translate-y-12 -translate-x-12"></div>
          </div>
          
          <div className="relative z-10">
            {/* Enhanced header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-emerald-300 shadow-lg">
                <div className="bg-emerald-500 p-2 rounded-full">
                  <Package size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-800">
                    Ajoutez ces produits complémentaires incontournables
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Sparkles size={16} className="text-yellow-500 animate-pulse" />
                    <p className="text-sm text-emerald-600 font-medium">Sélection premium personnalisée</p>
                    <Sparkles size={16} className="text-yellow-500 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats and countdown */}
            <div className="flex items-center justify-between bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-emerald-200 mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-full">
                  <Users size={20} className="text-emerald-600" />
                </div>
                <span className="text-emerald-800 font-semibold">
                  <span className="text-2xl font-bold">{dynamicStats.weeklyBuyers}+</span> clients ont adopté ces combinaisons
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full border border-green-300">
                  <div className="flex items-center gap-2 text-green-700">
                    <TrendingUp size={16} />
                    <span className="text-sm font-bold">{dynamicStats.percentage}% satisfaits</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-full border border-orange-200">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-orange-700 font-mono font-bold text-sm">
                    {formatTime(countdownMinutes)}:{formatTime(countdownSeconds)}
                  </span>
                </div>
              </div>
            </div>

            {/* Products list in unified design */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-emerald-100 shadow-lg p-6 mb-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Heart size={20} className="text-red-500" />
                Produits complémentaires recommandés
              </h4>
              
              <div className="space-y-4">
                {loggedRecommendations.map((recommendedProduct, index) => {
                  const discount = recommendedProduct.promoPrice 
                    ? calculations.calculateDiscount(recommendedProduct.price, recommendedProduct.promoPrice)
                    : 0;
                  const isAdded = addedItems[recommendedProduct.id];
                  const isLoading = loadingItems[recommendedProduct.id];
                    
                  return (
                    <div 
                      key={recommendedProduct.id}
                      className={`
                        flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 transform
                        ${isAdded 
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-lg' 
                          : 'bg-white border-gray-200 hover:border-emerald-300 hover:shadow-md hover:scale-[1.01]'
                        }
                      `}
                    >
                      {/* Product image */}
                      <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                          <img 
                            src={Array.isArray(recommendedProduct.images) ? recommendedProduct.images[0] : recommendedProduct.images[0]}
                            alt={recommendedProduct.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-image.jpg';
                            }}
                          />
                        </div>
                        
                        {/* Badges */}
                        {discount > 0 && (
                          <div className="absolute -top-2 -right-2">
                            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                              -{discount}%
                            </div>
                          </div>
                        )}
                        
                        {isAdded && (
                          <div className="absolute -top-1 -left-1">
                            <div className="bg-green-500 text-white p-1 rounded-full shadow-lg">
                              <Check size={12} strokeWidth={3} />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Product info */}
                      <div className="flex-grow min-w-0">
                        <h5 className="font-semibold text-gray-900 line-clamp-1 mb-1">
                          {recommendedProduct.name}
                        </h5>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold text-emerald-600">
                            {(recommendedProduct.promoPrice || recommendedProduct.price).toLocaleString()} FCFA
                          </span>
                          {recommendedProduct.promoPrice && (
                            <span className="text-gray-400 line-through text-sm">
                              {recommendedProduct.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        
                        {/* Features badges */}
                        <div className="flex gap-2">
                          {recommendedProduct.isYaBaBoss && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                              ⭐ YBB
                            </span>
                          )}
                          {recommendedProduct.isFlashOffer && (
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full animate-pulse">
                              ⚡ Flash
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Action button */}
                      <div className="flex-shrink-0">
                        {isAdded ? (
                          <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg border border-green-300">
                            <Check size={16} strokeWidth={2.5} />
                            <span className="text-sm font-medium">Ajouté</span>
                          </div>
                        ) : (
                          <Button 
                            onClick={() => handleAddComplementary(recommendedProduct)}
                            disabled={isLoading}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 h-auto"
                            size="sm"
                          >
                            {isLoading ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <Plus size={14} strokeWidth={2.5} />
                                <span className="ml-1">Ajouter</span>
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                      
                      {/* Arrow indicator */}
                      <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Enhanced bundle offer */}
            <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border-2 border-purple-300 rounded-xl p-6 shadow-xl">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-purple-300 shadow-lg">
                  <Sparkles className="h-6 w-6 text-purple-600 animate-pulse" />
                  <h4 className="text-xl font-bold text-purple-800">
                    Lot Complet Exclusif - {bundleDiscount}% de remise
                  </h4>
                  <Sparkles className="h-6 w-6 text-purple-600 animate-pulse" />
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-200 shadow-lg">
                  <div className="flex items-center justify-center gap-4 text-lg mb-3">
                    <span className="text-gray-500 line-through">
                      {(product.price + loggedRecommendations.reduce((sum, p) => sum + p.price, 0)).toLocaleString()} FCFA
                    </span>
                    <ArrowRight className="text-purple-600" size={20} />
                    <span className="text-2xl font-bold text-purple-700">
                      {calculations.calculateBundlePrice().toLocaleString()} FCFA
                    </span>
                  </div>
                  
                  <div className="bg-green-100 px-4 py-2 rounded-lg border border-green-300">
                    <p className="text-green-700 font-bold">
                      💰 Vous économisez {calculations.getBundleSavings().toLocaleString()} FCFA !
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    onClick={bundleHandlers.handleBundleWhatsApp}
                    disabled={bundleLoading.whatsapp}
                    className="h-12 bg-green-600 hover:bg-green-700 shadow-lg"
                    size="lg"
                  >
                    {bundleLoading.whatsapp ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <MessageCircle size={18} />
                        Commander le LOT sur WhatsApp
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={bundleHandlers.handleBundleDirect}
                    disabled={bundleLoading.direct}
                    className="h-12 bg-red-600 hover:bg-red-700 shadow-lg"
                    size="lg"
                  >
                    {bundleLoading.direct ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Zap size={18} />
                        Commander le LOT Direct
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Forms */}
      <UnifiedOrderForm
        isOpen={showWhatsAppForm}
        onClose={() => setShowWhatsAppForm(false)}
        items={orderFormItems.getSingleItems()}
        orderType="whatsapp"
      />

      <UnifiedOrderForm
        isOpen={showDirectForm}
        onClose={() => setShowDirectForm(false)}
        items={orderFormItems.getSingleItems()}
        orderType="direct"
        onOrderComplete={() => setShowDirectForm(false)}
      />

      <UnifiedOrderForm
        isOpen={showWhatsAppBundleForm}
        onClose={() => setShowWhatsAppBundleForm(false)}
        items={orderFormItems.getBundleItems()}
        orderType="whatsapp_bundle"
        bundleDiscount={bundleDiscount}
      />

      <UnifiedOrderForm
        isOpen={showDirectBundleForm}
        onClose={() => setShowDirectBundleForm(false)}
        items={orderFormItems.getBundleItems()}
        orderType="direct_bundle"
        bundleDiscount={bundleDiscount}
        onOrderComplete={() => setShowDirectBundleForm(false)}
      />
    </>
  );
});

ProductPageUpsell.displayName = 'ProductPageUpsell';

export default ProductPageUpsell;
