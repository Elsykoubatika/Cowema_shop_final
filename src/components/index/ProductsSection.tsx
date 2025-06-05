
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../ProductCard';
import { Product } from '../../data/products';

interface ProductsSectionProps {
  activeCategory: string;
  filteredProducts: Product[];
  visibleProducts: number;
  onShowMoreProducts: () => void;
  onAddToCart: (product: Product) => void;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({
  activeCategory,
  filteredProducts,
  visibleProducts,
  onShowMoreProducts,
  onAddToCart
}) => {
  const navigate = useNavigate();
  
  // Afficher BEAUCOUP plus d'articles selon la catégorie
  const getDisplayCount = () => {
    if (activeCategory && activeCategory !== '') {
      // Pour une catégorie spécifique, afficher jusqu'à 120 articles
      return Math.min(120, filteredProducts.length);
    } else {
      // Pour "Tous", afficher 100 articles
      return Math.min(100, filteredProducts.length);
    }
  };
  
  const displayCount = getDisplayCount();
  const productsToShow = filteredProducts.slice(0, displayCount);
  
  const handleViewMoreClick = () => {
    console.log('Navigating to products page with category:', activeCategory);
    if (activeCategory && activeCategory !== '' && activeCategory !== 'Tous') {
      navigate(`/products?category=${encodeURIComponent(activeCategory)}`);
    } else {
      navigate('/products');
    }
  };

  const handleViewDealsClick = () => {
    navigate('/deals');
  };

  const getSectionTitle = () => {
    if (activeCategory && activeCategory !== '' && activeCategory !== 'Tous') {
      return `${activeCategory} - Large Sélection`;
    }
    return 'Tous nos Produits - Distribution Intelligente';
  };

  const getSectionDescription = () => {
    if (activeCategory && activeCategory !== '' && activeCategory !== 'Tous') {
      return `${productsToShow.length} articles disponibles dans ${activeCategory} • Algorithme de tri avancé`;
    }
    return `${productsToShow.length} articles • Distribution équitable par catégorie • Algorithme intelligent`;
  };
  
  return (
    <section className="py-8">
      <div className="container-cowema">
        <div className="section-title flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">{getSectionTitle()}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {getSectionDescription()}
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleViewMoreClick}
              className="text-primary hover:underline flex items-center gap-1 cursor-pointer hover:text-primary/80 transition-colors"
            >
              Voir plus
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        
        {productsToShow.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              {activeCategory ? 
                `Aucun produit trouvé dans la catégorie "${activeCategory}".` :
                'Aucun produit disponible pour le moment.'
              }
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={handleViewMoreClick}
                className="btn btn-primary"
              >
                Voir tous les produits
              </button>
              <button 
                onClick={handleViewDealsClick}
                className="btn bg-red-500 hover:bg-red-600 text-white"
              >
                Voir les deals
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Grille avec BEAUCOUP plus de produits */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {productsToShow.map((product, index) => (
                <div 
                  key={product.id}
                  className="animate-fade-in" 
                  style={{ animationDelay: `${Math.min(index * 0.05, 2)}s` }} // Optimisé pour beaucoup de produits
                >
                  <ProductCard 
                    product={product} 
                    onAddToCart={onAddToCart}
                  />
                </div>
              ))}
            </div>
            
            {/* Statistiques d'affichage */}
            <div className="mt-6 text-center bg-gray-50 py-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                <strong>{productsToShow.length}</strong> articles affichés
                {activeCategory && ` • Catégorie: ${activeCategory}`}
                {filteredProducts.length > displayCount && (
                  <span className="text-primary"> • {filteredProducts.length - displayCount} autres disponibles</span>
                )}
              </p>
            </div>
          </>
        )}
        
        <div className="mt-6 text-center">
          <div className="flex gap-4 justify-center">
            <button 
              onClick={handleViewMoreClick}
              className="btn btn-primary py-2 px-6 flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              Voir tous les produits <ChevronRight size={16} />
            </button>
            <button 
              onClick={handleViewDealsClick}
              className="btn bg-red-500 hover:bg-red-600 text-white py-2 px-6 flex items-center gap-2 transition-colors"
            >
              Voir les deals <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
