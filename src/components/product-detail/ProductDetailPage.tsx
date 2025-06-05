
import React, { useMemo } from 'react';
import { Product } from '../../types/product';
import Header from '../Header';
import ProductDetailHeader from './ProductDetailHeader';
import ProductContent from './ProductContent';
import ProductModals from './ProductModals';
import Cart from '../Cart';
import SEOHead from '../seo/SEOHead';
import SEOBreadcrumb from '../seo/SEOBreadcrumb';
import ProductPageUpsell from '../ProductPageUpsell';

interface ProductDetailPageProps {
  product: Product;
  seoData: {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl: string;
    type: "product" | "website" | "article";
    image?: string;
    structuredData: any;
  };
  productDetailData: {
    addedToCart: boolean;
    isOrderFormOpen: boolean;
    isDirectOrderOpen: boolean;
    isCheckoutUpsellOpen: boolean;
    orderAction: 'whatsapp' | 'direct' | null;
    totalCartItems: number;
    handleAddToCart: () => void;
    handleRemoveFromCart: () => void;
    handleWhatsAppBuy: () => void;
    handleDirectOrder: () => void;
    handleCartClick: () => void;
    handleAcceptUpsell: () => void;
    handleDeclineUpsell: () => void;
    closeCheckoutUpsell: () => void;
    setIsOrderFormOpen: (open: boolean) => void;
    setIsDirectOrderOpen: (open: boolean) => void;
    setShowTimedPopup: (show: boolean) => void;
    getAllOrderItems: () => any[];
  };
}

const ProductDetailPage = React.memo<ProductDetailPageProps>(({ 
  product, 
  seoData, 
  productDetailData 
}) => {
  const {
    addedToCart,
    isOrderFormOpen,
    isDirectOrderOpen,
    isCheckoutUpsellOpen,
    orderAction,
    totalCartItems,
    handleAddToCart,
    handleRemoveFromCart,
    handleWhatsAppBuy,
    handleDirectOrder,
    handleCartClick,
    handleAcceptUpsell,
    handleDeclineUpsell,
    closeCheckoutUpsell,
    setIsOrderFormOpen,
    setIsDirectOrderOpen,
    setShowTimedPopup,
    getAllOrderItems
  } = productDetailData;

  // Memoized breadcrumbs
  const breadcrumbItems = useMemo(() => {
    return [
      { name: 'Accueil', url: '/' },
      { name: 'Produits', url: '/products' },
      { 
        name: product.category || 'Produit', 
        url: `/products${product.category ? `?category=${encodeURIComponent(product.category)}` : ''}` 
      },
      { name: product.title || product.name, url: '', current: true }
    ];
  }, [product.category, product.title, product.name]);

  // Stable order complete handler
  const handleOrderComplete = useMemo(() => {
    return () => {
      setIsOrderFormOpen(false);
      setIsDirectOrderOpen(false);
    };
  }, [setIsOrderFormOpen, setIsDirectOrderOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={seoData.canonicalUrl}
        type={seoData.type}
        image={seoData.image || ''}
        structuredData={seoData.structuredData}
      />
      
      <Header cartItemsCount={totalCartItems} onCartClick={handleCartClick} />
      
      <ProductDetailHeader
        productId={String(product.id)}
        productTitle={product.title || product.name}
        addedToCart={addedToCart}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onWhatsAppBuy={handleWhatsAppBuy}
        onCartClick={handleCartClick}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <SEOBreadcrumb items={breadcrumbItems} />
        
        <ProductContent
          product={product}
          addedToCart={addedToCart}
          onWhatsAppBuy={handleWhatsAppBuy}
          onDirectOrder={handleDirectOrder}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
        />

        {/* Section Upsell - Maintenant correctement intégrée */}
        <div className="mt-12">
          <ProductPageUpsell 
            product={product} 
            onAddToCart={handleAddToCart}
          />
        </div>
      </main>

      <ProductModals
        product={product}
        isOrderFormOpen={isOrderFormOpen}
        isDirectOrderOpen={isDirectOrderOpen}
        showTimedPopup={false}
        isCheckoutUpsellOpen={isCheckoutUpsellOpen}
        orderAction={orderAction}
        setIsOrderFormOpen={setIsOrderFormOpen}
        setIsDirectOrderOpen={setIsDirectOrderOpen}
        setShowTimedPopup={setShowTimedPopup}
        closeCheckoutUpsell={closeCheckoutUpsell}
        handleAcceptUpsell={handleAcceptUpsell}
        handleDeclineUpsell={handleDeclineUpsell}
        handleAddToCart={handleAddToCart}
        handleOrderComplete={handleOrderComplete}
        getAllOrderItems={getAllOrderItems}
      />

      <Cart />
    </div>
  );
});

ProductDetailPage.displayName = 'ProductDetailPage';

export default ProductDetailPage;
