
import React from 'react';

interface ProductsHeaderProps {
  selectedCategory?: string;
  filteredProductsCount: number;
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({ 
  filteredProductsCount,
  selectedCategory 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h1 className="text-2xl font-bold mb-2">Tous nos produits</h1>
      <p className="text-gray-500 text-sm">
        {filteredProductsCount} produit{filteredProductsCount !== 1 ? 's' : ''} disponible{filteredProductsCount !== 1 ? 's' : ''}
      </p>
    </div>
  );
};

export default ProductsHeader;
