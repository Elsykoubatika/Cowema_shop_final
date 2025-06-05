
import React from 'react';
import { useParams } from 'react-router-dom';
import { useProductDetail } from '../hooks/useProductDetail';
import { useSEOMetadata } from '../hooks/useSEOMetadata';
import Header from '../components/Header';
import ProductNotFound from '../components/product-detail/ProductNotFound';
import SEOHead from '../components/seo/SEOHead';
import LoadingState from '../components/product-detail/LoadingState';
import ErrorState from '../components/product-detail/ErrorState';
import ProductDetailPage from '../components/product-detail/ProductDetailPage';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  console.log('ProductDetail component rendering with ID:', id);
  
  // Ensure we have a valid ID
  if (!id) {
    console.error('No product ID in URL params');
    return (
      <>
        <SEOHead
          title="Produit non trouvé | Cowema"
          description="Le produit que vous recherchez n'existe pas ou n'est plus disponible"
          noIndex={true}
        />
        <Header cartItemsCount={0} onCartClick={() => {}} />
        <ProductNotFound totalCartItems={0} onCartClick={() => {}} />
      </>
    );
  }
  
  const productDetailData = useProductDetail(id);
  
  const {
    product,
    isLoading,
    error,
    totalCartItems,
    handleCartClick
  } = productDetailData;

  // SEO metadata
  const seoData = useSEOMetadata({ product: product || undefined });

  console.log('ProductDetail state:', {
    hasProduct: !!product,
    isLoading,
    error,
    productId: id
  });

  // États de chargement
  if (isLoading) {
    console.log('Showing loading state');
    return <LoadingState totalCartItems={totalCartItems} onCartClick={handleCartClick} />;
  }

  // États d'erreur
  if (error) {
    console.log('Showing error state:', error);
    return (
      <ErrorState 
        error={error}
        totalCartItems={totalCartItems}
        onCartClick={handleCartClick}
      />
    );
  }

  // Produit non trouvé
  if (!product) {
    console.log('Product not found, showing not found page');
    return (
      <>
        <SEOHead
          title="Produit non trouvé | Cowema"
          description="Le produit que vous recherchez n'existe pas ou n'est plus disponible"
          noIndex={true}
        />
        <Header cartItemsCount={totalCartItems} onCartClick={handleCartClick} />
        <ProductNotFound totalCartItems={totalCartItems} onCartClick={handleCartClick} />
      </>
    );
  }

  console.log('Rendering product detail page for:', product.name || product.title);

  // Format seoData for ProductDetailPage
  const formattedSeoData = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    canonicalUrl: seoData.canonicalUrl,
    type: seoData.type as "product" | "website" | "article",
    image: seoData.image,
    structuredData: seoData.structuredData
  };

  return (
    <ProductDetailPage 
      product={product}
      seoData={formattedSeoData}
      productDetailData={productDetailData}
    />
  );
};

export default ProductDetail;
