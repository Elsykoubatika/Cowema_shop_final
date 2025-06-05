
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Filter, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import ProductsGrid from '../components/products/ProductsGrid';
import ProductsSorting from '../components/products/ProductsSorting';
import { useCart } from '../hooks/useCart';
import { useLoadMoreProducts } from '../hooks/useLoadMoreProducts';
import { useApiFilters } from '../hooks/useApiFilters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

const YaBaBossProducts = () => {
  const { getCartItemsCount } = useCart();
  const { cities, categories, categoriesData, citiesData, isLoading: isLoadingFilters } = useApiFilters();
  
  // State for filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000000 });
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Enhanced API filters - ALWAYS include Ya Ba Boss filter with higher per_page
  const apiFilters = useMemo(() => {
    const filters: any = {
      // Force Ya Ba Boss filter to be always true
      isYaBaBoss: true,
      // Significantly increased per_page for faster bulk loading
      per_page: 200 // Increased from 24 to 200 for much faster loading
    };
    
    if (selectedCategory !== 'all') {
      const categoryData = categoriesData.find(cat => cat.name === selectedCategory);
      if (categoryData) {
        filters.category = categoryData.id;
      }
    }
    
    if (selectedCity !== 'all') {
      const cityData = citiesData.find(city => city.name === selectedCity);
      if (cityData) {
        filters.city = cityData.id;
      }
    }
    
    if (sortBy) {
      filters.sort = sortBy;
      filters.direction = sortOrder;
    }
    
    console.log('🎯 Enhanced YaBaBoss API Filters:', filters);
    return filters;
  }, [selectedCategory, selectedCity, sortBy, sortOrder, categoriesData, citiesData]);

  const { 
    products, 
    isLoading, 
    hasMore, 
    loadMore, 
    loadAllProducts,
    goToPage, 
    currentPage, 
    totalPages, 
    totalLoaded, 
    totalProducts,
    autoLoadMore,
    stats 
  } = useLoadMoreProducts(apiFilters);

  // Client-side filtering: Apply price filter AND ensure Ya Ba Boss status
  const filteredProducts = useMemo(() => {
    console.log(`🔍 Filtering ${products.length} YaBaBoss products from API`);
    
    const filtered = products.filter(product => {
      // Double-check Ya Ba Boss status (safety net)
      if (!product.isYaBaBoss) {
        console.warn(`⚠️ Product ${product.id} (${product.name}) is not Ya Ba Boss but was returned by API`);
        return false;
      }
      
      // Apply price filter
      const price = product.promoPrice || product.price;
      const passesPriceFilter = price >= priceRange.min && price <= priceRange.max;
      
      return passesPriceFilter;
    });
    
    console.log(`✅ Filtered to ${filtered.length} Ya Ba Boss products`);
    return filtered;
  }, [products, priceRange]);

  // Enhanced auto-load more products when reaching the end - more aggressive for Ya Ba Boss
  useEffect(() => {
    if (filteredProducts.length < totalProducts && hasMore && !isLoading) {
      // Auto-load when we have less than 200 products displayed
      if (filteredProducts.length < 200) {
        const timer = setTimeout(() => {
          console.log('🔄 Auto-loading more YaBaBoss products...', {
            currentLoaded: filteredProducts.length,
            totalAvailable: totalProducts,
            hasMore
          });
          autoLoadMore();
        }, 1500); // Reduced delay for faster loading
        return () => clearTimeout(timer);
      }
    }
  }, [filteredProducts.length, totalProducts, hasMore, isLoading, autoLoadMore]);

  const handleCartClick = () => {
    const cartButton = document.querySelector('[data-cart-toggle]') as HTMLElement;
    if (cartButton) {
      cartButton.click();
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedCity('all');
    setPriceRange({ min: 0, max: 1000000 });
  };

  // Group products by category for stats display
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, typeof filteredProducts> = {};
    
    filteredProducts.forEach(product => {
      const category = product.category || 'Non catégorisé';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(product);
    });
    
    return grouped;
  }, [filteredProducts]);

  // Get unique categories from filtered products
  const availableCategories = useMemo(() => {
    const categoriesSet = new Set<string>();
    filteredProducts.forEach(product => {
      if (product.category) {
        categoriesSet.add(product.category);
      }
    });
    return Array.from(categoriesSet).sort();
  }, [filteredProducts]);

  // Calculate progress percentage
  const progressPercentage = totalProducts > 0 ? (filteredProducts.length / totalProducts) * 100 : 0;

  console.log('🎯 Enhanced YaBaBoss Products Page Stats:', {
    totalFromAPI: products.length,
    filteredCount: filteredProducts.length,
    totalProducts,
    currentFilters: apiFilters,
    categoriesFound: availableCategories.length,
    loadingStats: stats
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <Header cartItemsCount={getCartItemsCount()} onCartClick={handleCartClick} />
      
      <main className="flex-grow container-cowema py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/ya-ba-boss" className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors">
              <ArrowLeft size={20} />
              <span>Retour à YaBaBoss</span>
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-3xl font-bold text-primary">Tous nos Produits YaBaBoss</h1>
          </div>

          {/* Enhanced Loading Progress Dashboard - HIDDEN */}
          {/* 
          <div className="mb-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-1">
                  ⭐ Chargement Optimisé YaBaBoss
                </h3>
                <p className="text-sm text-yellow-700">
                  {filteredProducts.length.toLocaleString()} sur {totalProducts.toLocaleString()} produits Ya Ba Boss chargés
                </p>
              </div>
              
              {hasMore && filteredProducts.length < totalProducts && (
                <div className="flex gap-2">
                  <Button 
                    onClick={loadAllProducts}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    disabled={isLoading}
                    size="sm"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Chargement...
                      </>
                    ) : (
                      'Charger TOUT'
                    )}
                  </Button>
                  <Button 
                    onClick={() => loadMore()}
                    variant="outline"
                    disabled={isLoading}
                    size="sm"
                  >
                    Charger plus
                  </Button>
                </div>
              )}
            </div>
            
            <div className="mb-3">
              <Progress 
                value={progressPercentage} 
                className="h-3 bg-yellow-100"
              />
            </div>
            
            <div className="flex justify-between items-center text-sm text-yellow-700">
              <span>{progressPercentage.toFixed(1)}% chargés</span>
              <span>Efficacité: {Math.round(filteredProducts.length / Math.max(currentPage, 1))}/page</span>
            </div>
          </div>
          */}

          {/* Stats Badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300 px-4 py-2">
              ⭐ {filteredProducts.length} produits Ya Ba Boss
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              {totalLoaded} produits chargés sur {totalProducts}
            </Badge>
            {totalPages > 1 && (
              <Badge variant="outline" className="px-4 py-2">
                Page {currentPage} sur {totalPages}
              </Badge>
            )}
            <Badge variant="outline" className="px-4 py-2">
              {availableCategories.length} catégories disponibles
            </Badge>
          </div>

          {/* Categories Summary - HIDDEN */}
          {/*
          {Object.keys(productsByCategory).length > 1 && (
            <div className="mb-6 p-6 bg-white rounded-lg shadow-sm border">
              <h3 className="font-semibold mb-4 text-lg">Répartition par catégorie :</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(productsByCategory)
                  .sort(([,a], [,b]) => b.length - a.length)
                  .map(([category, products]) => (
                  <div key={category} className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="font-medium text-sm text-gray-800 truncate" title={category}>
                      {category}
                    </div>
                    <div className="text-lg font-bold text-primary">
                      {products.length}
                    </div>
                    <div className="text-xs text-gray-500">
                      {products.length === 1 ? 'produit' : 'produits'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          */}

          <Separator className="my-6" />
        </div>

        {/* Mobile Filters Toggle */}
        <Button 
          variant="outline" 
          className="md:hidden flex items-center gap-2 mb-4"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <Filter size={16} />
          Filtrer ({selectedCategory !== 'all' || selectedCity !== 'all' ? 'actif' : 'aucun'})
        </Button>

        {/* Sorting Controls */}
        <ProductsSorting
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Enhanced Filters Panel */}
        <div className={`md:flex gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm border ${showMobileFilters ? '' : 'hidden md:block'}`}>
          {/* Category Filter */}
          <div className="mb-4 md:mb-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie :</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Toutes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {availableCategories.map(category => {
                  const count = productsByCategory[category]?.length || 0;
                  return (
                    <SelectItem key={category} value={category}>
                      {category} ({count})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* City Filter */}
          <div className="mb-4 md:mb-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">Ville :</label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Toutes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les villes</SelectItem>
                {isLoadingFilters ? (
                  <SelectItem value="loading" disabled>Chargement...</SelectItem>
                ) : (
                  cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Enhanced Price Range Filter */}
          <div className="mb-4 md:mb-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">Prix (FCFA) :</label>
            <div className="flex items-center gap-2">
              <Input 
                type="number" 
                placeholder="Min" 
                className="w-28"
                value={priceRange.min}
                onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
              />
              <span className="text-gray-500">-</span>
              <Input 
                type="number" 
                placeholder="Max" 
                className="w-28"
                value={priceRange.max}
                onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-end">
            <Button variant="outline" onClick={handleClearFilters}>
              Réinitialiser
            </Button>
          </div>
        </div>

        {/* Enhanced Products Grid with Better Pagination */}
        <ProductsGrid
          products={filteredProducts}
          isLoading={isLoading}
          hasMore={hasMore}
          loadMore={loadMore}
          goToPage={goToPage}
          currentPage={currentPage}
          totalPages={totalPages}
          totalLoaded={totalLoaded}
          totalProducts={totalProducts}
          viewMode={viewMode}
          onClearFilters={handleClearFilters}
        />

        {/* Enhanced Loading indicator for auto-loading */}
        {isLoading && filteredProducts.length > 0 && (
          <div className="text-center py-6">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-full px-6 py-3 shadow-md">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
              <span className="text-sm text-yellow-800 font-medium">
                Chargement optimisé des produits YaBaBoss... ({filteredProducts.length.toLocaleString()} / {totalProducts.toLocaleString()})
              </span>
            </div>
          </div>
        )}

        {/* No products message */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Aucun produit YaBaBoss trouvé</h3>
            <p className="text-gray-600 mb-6">
              Aucun produit YaBaBoss ne correspond à vos critères de recherche.
            </p>
            <Button onClick={handleClearFilters}>
              Voir tous les produits YaBaBoss
            </Button>
          </div>
        )}

        {/* Enhanced completion status */}
        {filteredProducts.length >= totalProducts && totalProducts > 0 && (
          <div className="mt-8 text-center">
            <div className="bg-green-50 border-green-200 rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-2 text-green-800">
                ✅ Chargement Complet - Tous les Produits YaBaBoss
              </h3>
              <p className="mb-4 text-green-700">
                Tous les {totalProducts.toLocaleString()} produits YaBaBoss sont maintenant accessibles.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white rounded-lg p-4 border">
                  <div className="font-medium text-gray-800">Produits YaBaBoss</div>
                  <div className="text-2xl font-bold text-yellow-600">{filteredProducts.length.toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                  <div className="font-medium text-gray-800">Catégories</div>
                  <div className="text-2xl font-bold text-yellow-600">{availableCategories.length}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                  <div className="font-medium text-gray-800">Efficacité</div>
                  <div className="text-2xl font-bold text-yellow-600">{Math.round(filteredProducts.length / Math.max(currentPage, 1))}/page</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
      <Cart />
    </div>
  );
};

export default YaBaBossProducts;
