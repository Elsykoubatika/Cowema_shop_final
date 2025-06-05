
import React, { useState } from 'react';
import SEOHead from '@/components/seo/SEOHead';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useHybridProducts } from '@/hooks/useHybridProducts';
import ProductsGrid from '@/components/products/ProductsGrid';
import HeroBanner from '@/components/deals/HeroBanner';
import StatsCards from '@/components/deals/StatsCards';
import ControlsSection from '@/components/deals/ControlsSection';
import { Product } from '@/types/product';

const AllDeals: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Récupérer tous les produits disponibles
  const { products, isLoading } = useHybridProducts();

  console.log('🎯 AllDeals page - Products loaded:', products.length);
  console.log('🎯 First few products:', products.slice(0, 3));

  // Simplifier la sélection des deals
  const getDealsProducts = (): Product[] => {
    if (!products || products.length === 0) {
      console.log('❌ No products available');
      return [];
    }

    console.log('🔍 Selecting deals from', products.length, 'products');

    // Filtrer avec des critères plus souples
    const validProducts = products.filter(product => {
      const hasValidPrice = product.price > 0;
      const hasValidName = product.name && product.name.trim() !== '';
      const isActive = product.isActive !== false;
      
      console.log('Product validation:', {
        name: product.name?.substring(0, 30),
        hasValidPrice,
        hasValidName,
        isActive,
        price: product.price
      });
      
      return hasValidPrice && hasValidName && isActive;
    });

    console.log('✅ Valid products after filtering:', validProducts.length);

    // Prendre les premiers 50 produits valides comme deals
    const selectedDeals = validProducts.slice(0, 50);

    console.log('📊 Selected deals:', selectedDeals.length);
    console.log('📊 Sample deals:', selectedDeals.slice(0, 3).map(p => ({
      name: p.name?.substring(0, 30),
      price: p.price,
      promoPrice: p.promoPrice,
      category: p.category,
      isYaBaBoss: p.isYaBaBoss
    })));

    return selectedDeals;
  };

  const selectedDeals = getDealsProducts();

  // Pagination logique
  const itemsPerPage = 12;
  const totalItems = selectedDeals.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDeals = selectedDeals.slice(startIndex, endIndex);

  console.log('📄 Pagination info:', {
    totalItems,
    totalPages,
    currentPage,
    currentDealsCount: currentDeals.length
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setCurrentPage(1);
  };

  const loadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPage = (page: number) => {
    handlePageChange(page);
  };

  return (
    <>
      <SEOHead
        title="NOS TOP DEALS CHARISMATIQUES 242 - COWEMA"
        description="Découvrez nos deals exceptionnels sélectionnés exclusivement pour vous ! Des opportunités uniques à ne pas rater au Congo."
        keywords={['deals', 'promotions', 'cowema', 'congo', 'charismatiques', 'top deals', 'opportunités']}
      />

      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20">
        {/* Hero Banner Section */}
        <HeroBanner />

        {/* Stats Cards Section */}
        <div className="container-cowema relative z-10 -mt-8">
          <StatsCards selectedDeals={selectedDeals} />
        </div>

        {/* Products Section */}
        <div className="bg-gray-50 min-h-screen">
          <div className="container-cowema py-8">
            {/* Affichage conditionnel du contenu */}
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-xl">Chargement des deals en cours...</p>
              </div>
            ) : selectedDeals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xl text-red-600">Aucun deal disponible pour le moment</p>
                <p className="text-gray-600">Vérifiez votre connexion ou revenez plus tard</p>
              </div>
            ) : (
              <>
                {/* Controls */}
                <ControlsSection
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />

                {/* Products Grid */}
                <ProductsGrid
                  products={currentDeals}
                  isLoading={isLoading}
                  hasMore={currentPage < totalPages}
                  loadMore={loadMore}
                  goToPage={goToPage}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalLoaded={endIndex}
                  totalProducts={totalItems}
                  viewMode={viewMode}
                  onClearFilters={handleClearFilters}
                />
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default AllDeals;
