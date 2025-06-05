
import React, { useState, useMemo } from 'react';
import SEOHead from '@/components/seo/SEOHead';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/useCart';
import { useLoadMoreProducts } from '@/hooks/useLoadMoreProducts';
import PromotionsHero from '@/components/promotions/PromotionsHero';
import PromotionsFilters from '@/components/promotions/PromotionsFilters';
import PromotionsContent from '@/components/promotions/PromotionsContent';

const Promotions: React.FC = () => {
  const { getCartItemsCount } = useCart();
  
  // États pour les filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('discount');
  const [showFilters, setShowFilters] = useState(false);

  // Utiliser le hook de chargement avec pagination
  const {
    products: allProducts,
    isLoading,
    error,
    hasMore,
    loadMore,
    goToPage,
    currentPage,
    totalPages,
    totalLoaded,
    totalProducts
  } = useLoadMoreProducts({
    search: searchQuery.trim() || undefined,
    sort: sortBy === 'price_asc' ? 'price' : sortBy === 'price_desc' ? 'price' : 'date',
    direction: sortBy === 'price_desc' ? 'desc' : 'asc'
  });

  // Filtrer les produits en promotion (tous les produits avec promoPrice)
  const promoProducts = useMemo(() => {
    return allProducts.filter(product => 
      product.promoPrice && 
      product.promoPrice < product.price &&
      product.stock > 0
    );
  }, [allProducts]);

  // Appliquer les filtres locaux
  const filteredProducts = useMemo(() => {
    let filtered = [...promoProducts];

    // Filtrage par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filtrage par ville
    if (selectedCity !== 'all') {
      filtered = filtered.filter(product => product.city === selectedCity);
    }

    // Filtrage par prix
    if (priceRange.min) {
      filtered = filtered.filter(product => 
        (product.promoPrice || product.price) >= parseFloat(priceRange.min)
      );
    }
    if (priceRange.max) {
      filtered = filtered.filter(product => 
        (product.promoPrice || product.price) <= parseFloat(priceRange.max)
      );
    }

    // Tri local pour les promotions
    if (sortBy === 'discount') {
      filtered.sort((a, b) => {
        const discountA = ((a.price - (a.promoPrice || a.price)) / a.price) * 100;
        const discountB = ((b.price - (b.promoPrice || b.price)) / b.price) * 100;
        return discountB - discountA;
      });
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [promoProducts, selectedCategory, selectedCity, priceRange, sortBy]);

  // Extraire les catégories et villes uniques
  const categories = useMemo(() => {
    const cats = [...new Set(promoProducts.map(p => p.category).filter(Boolean))];
    return cats.sort();
  }, [promoProducts]);

  const cities = useMemo(() => {
    const citiesList = [...new Set(promoProducts.map(p => p.city).filter(Boolean))];
    return citiesList.sort();
  }, [promoProducts]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCity('all');
    setPriceRange({ min: '', max: '' });
    setSortBy('discount');
  };

  const handleCartClick = () => {
    const cartButton = document.querySelector('[data-cart-toggle]') as HTMLElement;
    if (cartButton) {
      cartButton.click();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Promotions & Offres Spéciales - COWEMA"
        description="Découvrez toutes nos promotions et offres spéciales ! Profitez de prix réduits sur une large sélection de produits de qualité."
        keywords={['promotions', 'offres', 'réductions', 'prix bas', 'cowema', 'congo']}
      />

      <Header cartItemsCount={getCartItemsCount()} onCartClick={handleCartClick} />
      
      <main className="flex-grow">
        <PromotionsHero filteredProductsCount={filteredProducts.length} />
        
        <PromotionsFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          categories={categories}
          cities={cities}
          filteredProductsCount={filteredProducts.length}
          clearFilters={clearFilters}
        />
        
        <PromotionsContent
          filteredProducts={filteredProducts}
          isLoading={isLoading}
          error={error}
          hasMore={hasMore}
          loadMore={loadMore}
          goToPage={goToPage}
          currentPage={currentPage}
          totalPages={totalPages}
          totalLoaded={totalLoaded}
          totalProducts={totalProducts}
          clearFilters={clearFilters}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Promotions;
