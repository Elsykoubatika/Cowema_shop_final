
import React, { useState } from 'react';
import { Sun, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';

interface AllSolarProductsProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

const AllSolarProducts: React.FC<AllSolarProductsProps> = ({ products, isLoading, error }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'newest'>('name');
  const [visibleCount, setVisibleCount] = useState(12);

  // Trier les produits
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return (a.promoPrice || a.price) - (b.promoPrice || b.price);
      case 'newest':
        // Utiliser un timestamp par défaut si created_at n'existe pas
        const aDate = new Date(0).getTime(); // Date par défaut
        const bDate = new Date(0).getTime(); // Date par défaut
        return bDate - aDate;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const visibleProducts = sortedProducts.slice(0, visibleCount);
  const hasMore = visibleCount < sortedProducts.length;

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 12, sortedProducts.length));
  };

  // Fonction pour normaliser les produits avec l'ID correct pour la navigation
  const normalizeProductForNavigation = (product: Product): Product => {
    // Utiliser l'externalApiId en priorité, sinon l'id
    const navigationId = product.externalApiId || product.id;
    
    console.log('🔄 Product navigation ID normalization:', {
      productName: product.name,
      originalId: product.id,
      externalId: product.externalApiId,
      navigationId
    });
    
    return {
      ...product,
      id: navigationId
    };
  };

  if (error) {
    return (
      <section id="all-products" className="py-16 bg-white">
        <div className="container-cowema">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold mb-2">Erreur de chargement</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="all-products" className="py-16 bg-white">
      <div className="container-cowema">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-medium mb-4">
            <Sun size={16} />
            <span>CATALOGUE COMPLET</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tous Nos Articles Solaires
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Explorez notre gamme complète de {products.length} produits solaires pour tous vos besoins énergétiques
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{products.length}</div>
              <div className="text-sm text-gray-600">Produits disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {products.filter(p => p.promoPrice).length}
              </div>
              <div className="text-sm text-gray-600">En promotion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {products.filter(p => p.isYaBaBoss).length}
              </div>
              <div className="text-sm text-gray-600">YA BA BOSS</div>
            </div>
          </div>
        </div>

        {/* Filters and View Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant={sortBy === 'name' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('name')}
            >
              Nom
            </Button>
            <Button
              variant={sortBy === 'price' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('price')}
            >
              Prix
            </Button>
            <Button
              variant={sortBy === 'newest' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('newest')}
            >
              Nouveauté
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </Button>
          </div>
        </div>

        {/* Products Grid/List */}
        {isLoading && visibleProducts.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
            ))}
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {visibleProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={normalizeProductForNavigation(product)} 
                />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-8">
                <Button 
                  onClick={loadMore}
                  disabled={isLoading}
                  variant="outline"
                  size="lg"
                >
                  {isLoading ? 'Chargement...' : `Charger plus (${sortedProducts.length - visibleCount} restants)`}
                </Button>
              </div>
            )}

            {/* No products message */}
            {visibleProducts.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Sun className="mx-auto text-gray-400 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Aucun produit solaire trouvé
                </h3>
                <p className="text-gray-500">
                  Nos produits solaires arrivent bientôt. Revenez plus tard !
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default AllSolarProducts;
