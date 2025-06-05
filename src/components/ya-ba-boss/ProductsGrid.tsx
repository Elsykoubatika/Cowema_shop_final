
import React from 'react';
import { Product } from '../../data/products';
import ProductCard from '../../components/ProductCard';
import { Button } from '../../components/ui/button';

interface ProductsGridProps {
  filteredProducts: Product[];
  handleAddToCart: (product: Product) => void;
  resetFilters: () => void;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({
  filteredProducts,
  handleAddToCart,
  resetFilters,
}) => {
  if (filteredProducts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-bold mb-2">Aucun résultat trouvé</h2>
        <p className="text-gray-600 mb-6">
          Nous n'avons pas trouvé de produits correspondant à vos critères. 
          Essayez de modifier vos filtres ou d'effectuer une autre recherche.
        </p>
        <Button onClick={resetFilters}>
          Réinitialiser les filtres
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredProducts.map(product => (
        <ProductCard 
          key={product.id} 
          product={product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductsGrid;
