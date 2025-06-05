import React, { useState, useMemo } from 'react';
import { Product } from '../../data/products';
import ProductGallery from './ProductGallery';
import ProductPageUpsell from '../ProductPageUpsell';
import SimilarProducts from './SimilarProducts';
import YouMightLike from './YouMightLike';
import UnifiedOrderForm from '../order-forms/UnifiedOrderForm';
import { OrderFormItem } from '@/types/orderForm';
import { Button } from '@/components/ui/button';
import { ShoppingCart, MessageSquare, Zap, Star, MapPin, Shield, Truck, Heart, Share2, Plus, Minus } from 'lucide-react';
import YaBaBossIcon from '../icons/YaBaBossIcon';

interface ProductContentProps {
  product: Product;
  addedToCart: boolean;
  onWhatsAppBuy: () => void;
  onDirectOrder: () => void;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
}

const ProductContent: React.FC<ProductContentProps> = ({
  product,
  addedToCart,
  onWhatsAppBuy,
  onDirectOrder,
  onAddToCart,
  onRemoveFromCart
}) => {
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false);
  const [showDirectForm, setShowDirectForm] = useState(false);

  // Debug logs pour tracer les données vidéo
  console.log('🎬 ProductContent Video Debug:', {
    productId: product.id,
    productName: product.name?.substring(0, 50),
    videoUrl: product.videoUrl,
    hasVideoUrl: !!product.videoUrl,
    videoUrlLength: product.videoUrl?.length || 0,
    videoUrlTrimmed: product.videoUrl?.trim(),
    isYouTubeUrl: product.videoUrl?.includes('youtube.com') || product.videoUrl?.includes('youtu.be')
  });

  // Generate a stable "sold" count based on product ID to avoid constant changes
  const stableSoldCount = useMemo(() => {
    if (product.sold) return product.sold;
    
    // Create a stable pseudo-random number based on product ID
    const hash = product.id.toString().split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    return (hash % 50) + 10; // Results in a number between 10-59
  }, [product.id, product.sold]);

  // Convert product to OrderFormItem
  const convertToOrderFormItem = (prod: Product): OrderFormItem => ({
    id: String(prod.id),
    title: prod.title || prod.name,
    price: prod.price,
    promoPrice: prod.promoPrice || null,
    quantity: 1,
    image: Array.isArray(prod.images) ? prod.images[0] : prod.images || '',
    category: prod.category
  });

  const handleWhatsAppOrder = () => {
    setShowWhatsAppForm(true);
  };

  const handleDirectOrder = () => {
    setShowDirectForm(true);
  };

  const getSingleProductItems = (): OrderFormItem[] => [
    convertToOrderFormItem(product)
  ];

  const discount = product.promoPrice 
    ? Math.round(((product.price - product.promoPrice) / product.price) * 100)
    : 0;

  const savings = product.promoPrice ? product.price - product.promoPrice : 0;

  // Calculate YaBaBoss points - 1 point for every 1000 FCFA
  const finalPrice = product.promoPrice || product.price;
  const yaBaBossPoints = (finalPrice / 1000).toFixed(1);

  // Ensure images is always an array for ProductGallery
  const productImages = Array.isArray(product.images) ? product.images : (product.images ? [product.images] : []);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Gallery */}
        <div className="space-y-4">
          <ProductGallery 
            images={productImages}
            productName={product.title || product.name}
            videoUrl={product.videoUrl}
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title and badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {product.isYaBaBoss && (
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  ⭐ YA BA BOSS
                </span>
              )}
              {product.isFlashOffer && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  🔥 OFFRE FLASH
                </span>
              )}
              {discount > 0 && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{discount}%
                </span>
              )}
              {/* Badge vidéo si URL présente */}
              {product.videoUrl?.trim() && (
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  🎬 VIDÉO
                </span>
              )}
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {product.title || product.name}
            </h1>

            {/* Rating and reviews */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={`${i < Math.floor(product.rating || 4) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="text-sm text-gray-600 ml-1">
                  ({product.rating?.toFixed(1) || '4.0'})
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {stableSoldCount} vendus
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-blue-600">
                {(product.promoPrice || product.price).toLocaleString()} FCFA
              </span>
              {product.promoPrice && (
                <span className="text-xl text-gray-400 line-through">
                  {product.price.toLocaleString()} FCFA
                </span>
              )}
            </div>
            {savings > 0 && (
              <p className="text-green-600 font-semibold">
                Vous économisez {savings.toLocaleString()} FCFA !
              </p>
            )}
          </div>

          {/* YaBaBoss Points */}
          <div className="flex items-center gap-2 bg-yellow-50 p-3 rounded-md border border-yellow-200">
            <YaBaBossIcon size={18} className="text-yellow-600" />
            <span className="text-sm font-medium text-gray-700">
              Gagnez <span className="font-bold text-yellow-600">{yaBaBossPoints}</span> point{parseFloat(yaBaBossPoints) !== 1 ? 's' : ''} YA BA BOSS avec cet achat
            </span>
          </div>

          {/* Location and availability */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} />
              <span>{product.location || product.city || 'Brazzaville'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `En stock (${product.stock} disponibles)` : 'Rupture de stock'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description || 'Description non disponible pour ce produit.'}
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-t border-b">
            <div className="flex items-center gap-2 text-sm">
              <Shield size={16} className="text-green-600" />
              <span>Garantie qualité</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Truck size={16} className="text-blue-600" />
              <span>Livraison rapide</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Heart size={16} className="text-red-600" />
              <span>Service client</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Cart Action */}
            <div className="flex items-center gap-3">
              {addedToCart ? (
                <div className="flex items-center gap-2 flex-1">
                  <Button
                    onClick={() => onRemoveFromCart(String(product.id))}
                    variant="outline"
                    size="sm"
                    className="px-3"
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="flex-1 text-center bg-green-50 border border-green-200 rounded-lg py-2 px-4 text-green-800 font-medium">
                    ✅ Dans le panier
                  </span>
                  <Button
                    onClick={() => onAddToCart(product)}
                    variant="outline"
                    size="sm"
                    className="px-3"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => onAddToCart(product)}
                  disabled={product.stock <= 0}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  Ajouter au panier
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                className="px-3"
              >
                <Heart size={16} />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="px-3"
              >
                <Share2 size={16} />
              </Button>
            </div>

            {/* Order Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={handleWhatsAppOrder}
                disabled={product.stock <= 0}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <MessageSquare size={18} />
                Commander via WhatsApp
              </Button>

              <Button
                onClick={handleDirectOrder}
                disabled={product.stock <= 0}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Zap size={18} />
                Commander Directement
              </Button>
            </div>
          </div>

          {/* Payment info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">💳 Modalités de paiement</h4>
            <p className="text-sm text-gray-600">
              Paiement à la livraison en espèces ou par mobile money. 
              Livraison sécurisée dans toute la ville.
            </p>
          </div>
        </div>
      </div>

      {/* Upsell Section */}
      <ProductPageUpsell 
        product={product} 
        onAddToCart={onAddToCart}
      />

      {/* Articles similaires Section */}
      <SimilarProducts 
        currentProduct={product}
        onAddToCart={onAddToCart}
      />

      {/* Vous aimeriez ceci Section */}
      <YouMightLike 
        currentProduct={product}
        onAddToCart={onAddToCart}
      />

      {/* Order Forms */}
      <UnifiedOrderForm
        isOpen={showWhatsAppForm}
        onClose={() => setShowWhatsAppForm(false)}
        items={getSingleProductItems()}
        orderType="whatsapp"
      />

      <UnifiedOrderForm
        isOpen={showDirectForm}
        onClose={() => setShowDirectForm(false)}
        items={getSingleProductItems()}
        orderType="direct"
        onOrderComplete={() => setShowDirectForm(false)}
      />
    </>
  );
};

export default ProductContent;
