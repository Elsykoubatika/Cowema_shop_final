import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import { useCart } from '../hooks/useCart';
import { useHybridProducts } from '../hooks/useHybridProducts';
import ProductCard from '../components/ProductCard';
import { Search as SearchIcon, Filter } from 'lucide-react';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [currentQuery, setCurrentQuery] = useState(query);
  const [sortBy, setSortBy] = useState('relevance');
  
  const { getCartItemsCount } = useCart();
  const { products, isLoading, searchProducts } = useHybridProducts();
  
  // Filter products based on search query
  const filteredProducts = React.useMemo(() => {
    if (!currentQuery.trim()) return [];
    
    let results = searchProducts(currentQuery);
    
    // Sort results
    switch (sortBy) {
      case 'price_asc':
        results = results.sort((a, b) => (a.promoPrice || a.price) - (b.promoPrice || b.price));
        break;
      case 'price_desc':
        results = results.sort((a, b) => (b.promoPrice || b.price) - (a.promoPrice || a.price));
        break;
      case 'name_asc':
        results = results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        results = results.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Keep relevance order (from searchProducts function)
        break;
    }
    
    return results;
  }, [currentQuery, products, sortBy, searchProducts]);

  useEffect(() => {
    setCurrentQuery(query);
  }, [query]);

  const handleSearchUpdate = (newQuery: string) => {
    setCurrentQuery(newQuery);
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery });
    } else {
      setSearchParams({});
    }
  };

  const handleCartClick = () => {
    const cartButton = document.querySelector('[data-cart-toggle]') as HTMLElement;
    if (cartButton) {
      cartButton.click();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemsCount={getCartItemsCount()} onCartClick={handleCartClick} />
      
      <main className="flex-grow container-cowema py-8">
        {/* Search Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">
            {currentQuery ? `Résultats pour "${currentQuery}"` : 'Recherche de produits'}
          </h1>
          
          {/* Search Input */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={currentQuery}
                onChange={(e) => handleSearchUpdate(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            
            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="relevance">Pertinence</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="name_asc">Nom A-Z</option>
              <option value="name_desc">Nom Z-A</option>
            </select>
          </div>
          
          {/* Results Count */}
          {currentQuery && (
            <p className="text-gray-600">
              {isLoading ? 'Recherche en cours...' : `${filteredProducts.length} produit(s) trouvé(s)`}
            </p>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
            ))}
          </div>
        ) : currentQuery && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : currentQuery ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-500 text-lg mb-4">
              Nous n'avons pas trouvé de produits pour "{currentQuery}"
            </p>
            <p className="text-gray-400">
              Essayez avec des mots-clés différents ou vérifiez l'orthographe
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Recherche de produits</h3>
            <p className="text-gray-500">
              Utilisez la barre de recherche ci-dessus pour trouver des produits
            </p>
          </div>
        )}
      </main>
      
      <Footer />
      <Cart />
    </div>
  );
};

export default Search;
