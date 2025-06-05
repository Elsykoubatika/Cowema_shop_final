
import React from 'react';
import { Product } from '../../../types/product';

interface SearchResultsProps {
  isDropdownOpen: boolean;
  isSearching: boolean;
  searchResults: Product[];
  searchQuery: string;
  onResultClick: (productId: string) => void;
  onViewAllResults: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  isDropdownOpen,
  isSearching,
  searchResults,
  searchQuery,
  onResultClick,
  onViewAllResults
}) => {
  if (!isDropdownOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-50">
      {isSearching ? (
        <div className="p-4 text-center text-gray-500 text-sm">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto mb-2"></div>
          Recherche en cours...
        </div>
      ) : searchResults.length > 0 ? (
        <div>
          <div className="p-2 border-b border-gray-100">
            <p className="text-xs text-gray-500 px-2">
              {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
            </p>
          </div>
          {searchResults.map(result => (
            <button 
              key={result.id}
              onClick={() => onResultClick(result.id)}
              className="w-full px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                {result.images?.[0] && (
                  <img 
                    src={result.images[0]} 
                    alt={result.name}
                    className="w-10 h-10 object-cover rounded-md bg-gray-100"
                    loading="lazy"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900 truncate">
                    {result.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {result.category}
                  </div>
                  <div className="text-sm font-semibold text-primary">
                    {result.promoPrice ? (
                      <span>
                        <span className="text-red-600">{result.promoPrice.toLocaleString()} FCFA</span>
                        <span className="ml-2 text-gray-400 line-through text-xs">
                          {result.price.toLocaleString()} FCFA
                        </span>
                      </span>
                    ) : (
                      `${result.price.toLocaleString()} FCFA`
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <button
              onClick={onViewAllResults}
              className="w-full text-sm text-primary hover:text-primary-hover font-medium"
            >
              Voir tous les résultats pour "{searchQuery}"
            </button>
          </div>
        </div>
      ) : searchQuery.length >= 2 ? (
        <div className="p-4 text-center text-gray-500 text-sm">
          <div className="text-2xl mb-2">🔍</div>
          Aucun produit trouvé pour "{searchQuery}"
          <div className="mt-2">
            <button
              onClick={onViewAllResults}
              className="text-primary hover:text-primary-hover font-medium"
            >
              Rechercher quand même
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SearchResults;
