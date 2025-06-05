
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CategoriesSection from './CategoriesSection';
import ProductsSection from './ProductsSection';
import PromoSection from './PromoSection';
import YaBaBossProductsSection from '../YaBaBossProductsSection';
import StatisticsSection from './StatisticsSection';
import PersuasionBanner from '../marketing/PersuasionBanner';
import FlashSaleBanner from '../marketing/FlashSaleBanner';
import FeaturesSection from './FeaturesSection';
import TestimonialsSection from './TestimonialsSection';
import TelevisionSalesSection from './TelevisionSalesSection';
import BeautySection from './BeautySection';
import CuisineSection from './CuisineSection';
import HealthWellnessSection from './HealthWellnessSection';
import InterestingCombinationsSection from './InterestingCombinationsSection';
import AppDownloadSection from './AppDownloadSection';
import CartAbandonPopup from '../marketing/CartAbandonPopup';
import { useUserLocation } from '../../hooks/useUserLocation';

interface IndexPageContentProps {
  pageData: {
    activeCategory: string;
    setActiveCategory: (category: string) => void;
    products: any[];
    distributedProducts: any;
    finalFilteredProducts: any[];
    isLoading: boolean;
    isSyncing: boolean;
    error: string | null;
    handleAddToCart: (product: any) => void;
    refetch: () => void;
  };
}

const IndexPageContent: React.FC<IndexPageContentProps> = ({ pageData }) => {
  const navigate = useNavigate();
  const { city } = useUserLocation();
  const {
    activeCategory,
    setActiveCategory,
    products,
    distributedProducts,
    finalFilteredProducts,
    isLoading,
    isSyncing,
    error,
    handleAddToCart,
    refetch
  } = pageData;

  const handleRetry = () => {
    console.log('🔄 Retrying product fetch...');
    refetch();
  };

  const handleOpenModal = (product: any) => {
    navigate(`/product/${product.id}`);
  };

  const getLoadingMessage = () => {
    return isSyncing ? 'Synchronisation des produits en cours...' : 'Chargement des produits...';
  };

  // Déterminer les produits YaBaBoss filtrés par catégorie
  const getFilteredYaBaBossProducts = () => {
    if (!activeCategory || activeCategory === '') {
      return distributedProducts.yaBaBossProducts || [];
    }
    
    const filtered = (distributedProducts.yaBaBossProducts || []).filter(product => {
      if (!product.category) return false;
      const normalizedCategory = activeCategory.toLowerCase().trim();
      const productCategory = product.category.toLowerCase().trim();
      return productCategory.includes(normalizedCategory) || 
             normalizedCategory.includes(productCategory);
    });
    
    return filtered;
  };

  // Déterminer les produits généraux filtrés par catégorie
  const getFilteredGeneralProducts = () => {
    if (!activeCategory || activeCategory === '') {
      return distributedProducts.generalProducts || [];
    }
    
    return finalFilteredProducts || [];
  };

  // Obtenir des produits spécifiques par catégorie pour les sections spécialisées
  const getCategoryProducts = (categoryName: string, limit: number = 12) => {
    const allProducts = products || [];
    return allProducts
      .filter(product => 
        product.category && 
        product.category.toLowerCase().includes(categoryName.toLowerCase())
      )
      .slice(0, limit);
  };

  // Créer des produits en promo si aucun n'existe (pour la démonstration)
  const getPromoProducts = () => {
    const promoProducts = products.filter(product => 
      product.promoPrice && 
      product.promoPrice < product.price &&
      product.stock > 0
    );
    
    // Si aucun produit promo n'existe, créer quelques exemples en appliquant des réductions
    if (promoProducts.length === 0 && products.length > 0) {
      return products.slice(0, 8).map(product => ({
        ...product,
        promoPrice: Math.round(product.price * 0.8) // 20% de réduction
      }));
    }
    
    return promoProducts;
  };

  const filteredYaBaBossProducts = getFilteredYaBaBossProducts();
  const filteredGeneralProducts = getFilteredGeneralProducts();
  const promoProducts = getPromoProducts();

  // Produits pour sections spécialisées
  const beautyProducts = getCategoryProducts('beauté', 8);
  const cuisineProducts = getCategoryProducts('cuisine', 8);
  const healthProducts = getCategoryProducts('santé', 8);

  console.log('📊 IndexPageContent rendering - Enhanced with specialized sections:', {
    activeCategory: activeCategory || 'Tous',
    totalProducts: products.length,
    yaBaBossFiltered: filteredYaBaBossProducts.length,
    generalFiltered: filteredGeneralProducts.length,
    promoProducts: promoProducts.length,
    beautyProducts: beautyProducts.length,
    cuisineProducts: cuisineProducts.length,
    healthProducts: healthProducts.length,
    isLoading,
    isSyncing
  });

  return (
    <main className="flex-grow">
      {/* Flash Sale Banner - Tout en haut */}
      <FlashSaleBanner city={city} />
      
      <StatisticsSection />
      <PersuasionBanner />
      
      <CategoriesSection 
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      
      {/* Gestion des états d'erreur et de chargement */}
      {error && !isLoading ? (
        <div className="py-8">
          <div className="container-cowema">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold mb-2">Erreur de chargement</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={handleRetry}
                className="btn btn-primary py-2 px-6"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      ) : (isLoading || isSyncing) && products.length === 0 ? (
        <div className="py-8">
          <div className="container-cowema">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 mb-2">{getLoadingMessage()}</p>
              <p className="text-xs text-gray-500 mt-2">
                Si le chargement persiste, essayez de rafraîchir la page
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Section YaBaBoss - Liée à la catégorie sélectionnée */}
          {filteredYaBaBossProducts.length > 0 && (
            <YaBaBossProductsSection
              yaBaBossProducts={filteredYaBaBossProducts}
              onAddToCart={handleAddToCart}
              onOpenModal={handleOpenModal}
              activeCategory={activeCategory}
            />
          )}

          {/* Section Promotions du Mois - Affichée seulement si on est sur "Tous" ou si aucune catégorie */}
          {(!activeCategory || activeCategory === '') && promoProducts.length > 0 && (
            <PromoSection 
              products={promoProducts}
              onAddToCart={handleAddToCart}
            />
          )}

          {/* Sections spécialisées - Affichées seulement si on est sur "Tous" ou catégorie correspondante */}
          {(!activeCategory || activeCategory === '' || activeCategory.toLowerCase().includes('beauté')) && beautyProducts.length > 0 && (
            <BeautySection 
              distributedProducts={beautyProducts}
              onAddToCart={handleAddToCart}
            />
          )}

          {(!activeCategory || activeCategory === '' || activeCategory.toLowerCase().includes('cuisine')) && cuisineProducts.length > 0 && (
            <CuisineSection 
              distributedProducts={cuisineProducts}
              onAddToCart={handleAddToCart}
            />
          )}

          {(!activeCategory || activeCategory === '' || activeCategory.toLowerCase().includes('santé')) && healthProducts.length > 0 && (
            <HealthWellnessSection 
              distributedProducts={healthProducts}
              onAddToCart={handleAddToCart}
            />
          )}

          {/* Section Combinaisons Intéressantes - Seulement si on a assez de produits */}
          {(!activeCategory || activeCategory === '') && products.length > 12 && (
            <InterestingCombinationsSection 
              products={products}
              onAddToCart={handleAddToCart}
            />
          )}
          
          {/* Section Tous nos Produits - Liée à la catégorie sélectionnée */}
          <ProductsSection 
            activeCategory={activeCategory}
            filteredProducts={filteredGeneralProducts}
            visibleProducts={100}
            onShowMoreProducts={() => {
              if (activeCategory && activeCategory !== '') {
                navigate(`/products?category=${encodeURIComponent(activeCategory)}`);
              } else {
                navigate('/products');
              }
            }}
            onAddToCart={handleAddToCart}
          />

          {/* Section Témoignages - Seulement sur "Tous" */}
          {(!activeCategory || activeCategory === '') && (
            <TestimonialsSection />
          )}

          {/* Section Téléventes - Seulement sur "Tous" */}
          {(!activeCategory || activeCategory === '') && (
            <TelevisionSalesSection />
          )}

          {/* Section Features - Repositionnée en bas de page */}
          <FeaturesSection />

          {/* Section App Download - Seulement sur "Tous" */}
          {(!activeCategory || activeCategory === '') && (
            <AppDownloadSection />
          )}
          
          {/* Indicateur de synchronisation en cours */}
          {isSyncing && products.length > 0 && (
            <div className="py-4 bg-gray-50">
              <div className="container-cowema">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Synchronisation en cours: {filteredYaBaBossProducts.length} YaBaBoss, {filteredGeneralProducts.length} articles, {promoProducts.length} promotions affichés
                    {activeCategory && ` • Catégorie: ${activeCategory}`}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Cart Abandon Popup - Added at the end */}
          <CartAbandonPopup />
        </>
      )}
    </main>
  );
};

export default IndexPageContent;
