
import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // L'action de recherche se fait automatiquement via setSearchQuery
    }
  };

  const applySearch = () => {
    // L'action de recherche se fait automatiquement via setSearchQuery
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="relative flex w-full">
      <Input
        type="text"
        placeholder="Rechercher un produit..."
        className="pr-16"
        value={searchQuery}
        onChange={handleSearchChange}
        onKeyPress={handleKeyPress}
      />
      <div className="absolute right-0 top-0 h-full flex">
        {searchQuery && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-full"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-full"
          onClick={applySearch}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
