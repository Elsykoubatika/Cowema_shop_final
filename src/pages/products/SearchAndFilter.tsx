
import React, { useState } from 'react';
import { Search, Filter, ChevronDown, X } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../components/ui/collapsible";
import CategoryTabs from '../../components/ya-ba-boss/CategoryTabs';
import CitySelector from '../../components/ya-ba-boss/CitySelector';
import FilterPanel from './FilterPanel';

interface SearchAndFilterProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categories: string[];
  selectedCity: string;
  applyFilters: (options: any) => void;
  cities: string[];
  resetFilters: () => void;
  isAnyFilterActive: boolean;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  activeCategory,
  setActiveCategory,
  categories,
  selectedCity,
  applyFilters,
  cities,
  resetFilters,
  isAnyFilterActive
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Clear search results if input is empty
    if (e.target.value === '') {
      applyFilters({ searchQuery: '' });
    }
  };

  // Apply search on enter or button click
  const applySearch = () => {
    applyFilters({ searchQuery });
  };

  // Clear search field and reset search results
  const clearSearch = () => {
    setSearchQuery('');
    applyFilters({ searchQuery: '' });
  };

  // Handle search on enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      applySearch();
    }
  };

  // Handle city selection
  const handleCityChange = (value: string) => {
    applyFilters({ city: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      {/* Category Navigation */}
      <CategoryTabs 
        categories={categories} 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory}
      />
      
      {/* Search & Filter Controls */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Search Bar */}
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
        
        {/* Filter Controls */}
        <div className="flex flex-wrap justify-between items-center gap-2">
          <CitySelector 
            selectedCity={selectedCity} 
            handleCityChange={handleCityChange} 
            cities={cities} 
          />
          
          <div className="flex items-center gap-2">
            <Collapsible
              open={showFilterPanel}
              onOpenChange={setShowFilterPanel}
              className="w-full"
            >
              <div className="flex gap-2">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtres avancés
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                
                {isAnyFilterActive && (
                  <Button variant="ghost" onClick={resetFilters}>
                    Réinitialiser
                  </Button>
                )}
              </div>
              
              <FilterPanel 
                showFilterPanel={showFilterPanel} 
                applyFilters={applyFilters} 
              />
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;
