
import React from 'react';
import { Filter, ChevronDown, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../components/ui/collapsible";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import { Alert, AlertTitle, AlertDescription } from '../../components/ui/alert';
import CitySelector from './CitySelector';
import FilterPanel from './FilterPanel';
import { useIsMobile } from '../../hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

interface FilterControlsProps {
  showFilterPanel: boolean;
  setShowFilterPanel: (show: boolean) => void;
  selectedCity: string;
  handleCityChange: (value: string) => void;
  cities: string[];
  isAnyFilterActive: boolean;
  handleResetFilters: () => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  pointsRange: number[];
  setPointsRange: (value: number[]) => void;
  maxPrice: number;
  maxPoints: number;
  applyRangeFilters: () => void;
  activeCategory?: string;
  setActiveCategory?: (category: string) => void;
  categories?: string[];
}

const FilterControls: React.FC<FilterControlsProps> = ({
  showFilterPanel,
  setShowFilterPanel,
  selectedCity,
  handleCityChange,
  cities,
  isAnyFilterActive,
  handleResetFilters,
  priceRange,
  setPriceRange,
  pointsRange,
  setPointsRange,
  maxPrice,
  maxPoints,
  applyRangeFilters,
  activeCategory,
  setActiveCategory,
  categories,
}) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [filterError, setFilterError] = React.useState<string | null>(null);

  const handleApplyFilters = () => {
    try {
      applyRangeFilters();
      setFilterError(null);
    } catch (error) {
      console.error("Error applying filters:", error);
      setFilterError("Impossible d'appliquer les filtres. Veuillez vérifier vos sélections.");
      toast({
        title: "Erreur de filtrage",
        description: "Impossible d'appliquer les filtres. Veuillez réessayer.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleReset = () => {
    try {
      handleResetFilters();
      setFilterError(null);
    } catch (error) {
      console.error("Error resetting filters:", error);
      toast({
        title: "Erreur technique",
        description: "Impossible de réinitialiser les filtres. Veuillez réessayer.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Mobile version with Sheet instead of Collapsible
  if (isMobile) {
    return (
      <div className="flex flex-col space-y-4" role="region" aria-label="Filtres de recherche">
        {/* Mobile City Selector */}
        <CitySelector 
          selectedCity={selectedCity}
          handleCityChange={handleCityChange}
          cities={cities}
        />
        
        {/* Show error message if exists */}
        {filterError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur de filtrage</AlertTitle>
            <AlertDescription>{filterError}</AlertDescription>
          </Alert>
        )}
        
        {/* Mobile Filter Sheet */}
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 flex-1"
                aria-label="Ouvrir les filtres avancés"
                aria-expanded="false"
                aria-haspopup="dialog"
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                Filtres avancés
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] pt-6" aria-labelledby="filter-sheet-heading">
              <h2 id="filter-sheet-heading" className="sr-only">Filtres avancés</h2>
              <div className="h-full overflow-y-auto pb-16">
                <FilterPanel 
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  pointsRange={pointsRange}
                  setPointsRange={setPointsRange}
                  maxPrice={maxPrice}
                  maxPoints={maxPoints}
                  applyRangeFilters={handleApplyFilters}
                />
              </div>
            </SheetContent>
          </Sheet>
          
          {isAnyFilterActive && (
            <Button 
              variant="ghost" 
              onClick={handleReset} 
              className="whitespace-nowrap"
              aria-label="Réinitialiser tous les filtres"
            >
              Réinitialiser
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  // Desktop version with Collapsible
  return (
    <div className="flex flex-wrap justify-between items-center gap-2" role="region" aria-label="Filtres de recherche">
      <CitySelector 
        selectedCity={selectedCity}
        handleCityChange={handleCityChange}
        cities={cities}
      />
      
      {/* Show error message if exists */}
      {filterError && (
        <Alert variant="destructive" className="w-full">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur de filtrage</AlertTitle>
          <AlertDescription>{filterError}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center gap-2">
        <Collapsible
          open={showFilterPanel}
          onOpenChange={setShowFilterPanel}
          className="w-full"
        >
          <div className="flex gap-2">
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                aria-label="Filtres avancés"
                aria-expanded={showFilterPanel}
              >
                <Filter className="h-4 w-4" aria-hidden="true" />
                Filtres avancés
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </Button>
            </CollapsibleTrigger>
            
            {isAnyFilterActive && (
              <Button 
                variant="ghost" 
                onClick={handleReset}
                aria-label="Réinitialiser tous les filtres"
              >
                Réinitialiser
              </Button>
            )}
          </div>
          
          <CollapsibleContent>
            <FilterPanel 
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              pointsRange={pointsRange}
              setPointsRange={setPointsRange}
              maxPrice={maxPrice}
              maxPoints={maxPoints}
              applyRangeFilters={handleApplyFilters}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default FilterControls;
