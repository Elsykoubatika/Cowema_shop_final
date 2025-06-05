
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Cart from '../../components/Cart';
import ProductsHeader from '../../components/products/ProductsHeader';
import ProductsFilters from '../../components/products/ProductsFilters';
import ProductsSorting from '../../components/products/ProductsSorting';
import ProductsGrid from '../../components/products/ProductsGrid';
import { useCart } from '../../hooks/useCart';
import { useLoadMoreProducts } from '../../hooks/useLoadMoreProducts';
import { useApiFilters } from '../../hooks/useApiFilters';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getCartItemsCount } = useCart();

  const { cities, categories, categoriesData, citiesData, isLoading: isLoadingFilters } = useApiFilters();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'all');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const apiFilters = useMemo(() => {
    const filters: any = {
      per_page: 30,
      page: 1,
    };

    if (searchQuery.trim()) {
      filters.search = searchQuery.trim();
    }

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

    return filters;
  }, [searchQuery, selectedCategory, selectedCity, sortBy, sortOrder, categoriesData, citiesData]);

  const {
    products,
    isLoading,
    loadMore,
    hasMore,
    goToPage,
    currentPage,
    totalPages,
    totalProducts,
    stats
  } = useLoadMoreProducts(apiFilters);

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const newParams = new URLSearchParams();

    if (searchQuery.trim()) newParams.set('search', searchQuery.trim());
    if (selectedCategory !== 'all') newParams.set('category', selectedCategory);
    if (selectedCity !== 'all') newParams.set('city', selectedCity);

    setSearchParams(newParams, { replace: true });
  }, [searchQuery, selectedCategory, selectedCity, setSearchParams]);

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handleCartClick = () => {
    const cartButton = document.querySelector('[data-cart-toggle]') as HTMLElement;
    if (cartButton) {
      cartButton.click();
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCity('all');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemsCount={getCartItemsCount()} onCartClick={handleCartClick} />

      <main className="flex-grow container-cowema py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Tous nos Produits</h1>
        </div>

        <ProductsHeader
          totalProducts={totalProducts}
          totalLoaded={products.length}
          currentPage={currentPage}
          totalPages={totalPages}
        />

        <ProductsFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          categories={categories}
          cities={cities}
          isLoadingFilters={isLoadingFilters}
          onClearFilters={handleClearFilters}
        />

        <ProductsSorting
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <ProductsGrid
          products={products}
          isLoading={isLoading}
          hasMore={hasMore}
          loadMore={loadMore}
          goToPage={goToPage}
          currentPage={currentPage}
          totalPages={totalPages}
          totalLoaded={products.length}
          totalProducts={totalProducts}
          viewMode={viewMode}
          onClearFilters={handleClearFilters}
        />

        {totalPages > 1 && (
          <div className="text-center py-6">
            <div className="text-sm text-gray-600 mb-4">
              Page {currentPage} sur {totalPages} - Affichage de 30 produits par page
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {generatePageNumbers().map((page, index) => (
                <div key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-gray-500">...</span>
                  ) : (
                    <button
                      onClick={() => goToPage(page as number)}
                      className={`px-3 py-2 rounded-md border transition-colors ${
                        currentPage === page
                          ? 'bg-green-600 text-white border-green-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <Cart />
    </div>
  );
};

export default ProductsPage;
