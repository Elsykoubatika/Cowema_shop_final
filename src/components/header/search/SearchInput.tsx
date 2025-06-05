
import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  searchQuery: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: (e: React.FormEvent) => void;
  onClearSearch: () => void;
  onFocus: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  inputRef,
  onSearchInputChange,
  onSearch,
  onClearSearch,
  onFocus
}) => {
  return (
    <form onSubmit={onSearch} className="w-full">
      <div className="relative w-full">
        <input 
          ref={inputRef}
          type="text" 
          placeholder="Rechercher un produit..." 
          className="w-full py-2 px-4 pr-16 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm shadow-sm"
          value={searchQuery}
          onChange={onSearchInputChange}
          onFocus={onFocus}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchQuery && (
            <button 
              type="button"
              onClick={onClearSearch}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title="Effacer la recherche"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          )}
          <button 
            type="submit"
            className="p-1 text-primary hover:text-primary-hover transition-colors"
            title="Rechercher"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchInput;
