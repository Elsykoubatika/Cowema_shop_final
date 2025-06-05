
import React from 'react';
import { X } from 'lucide-react';

interface FilterTagsProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  selectedCity: string;
  handleCityChange: (city: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  maxPrice: number;
  pointsRange: number[];
  setPointsRange: (range: number[]) => void;
  maxPoints: number;
}

const FilterTags: React.FC<FilterTagsProps> = ({
  activeCategory,
  setActiveCategory,
  selectedCity,
  handleCityChange,
  priceRange,
  setPriceRange,
  maxPrice,
  pointsRange,
  setPointsRange,
  maxPoints,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {activeCategory !== 'all' && (
        <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1">
          Catégorie: {activeCategory}
          <button onClick={() => setActiveCategory('all')}>
            <X size={14} />
          </button>
        </div>
      )}
      
      {selectedCity !== 'all' && (
        <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1">
          Ville: {selectedCity}
          <button onClick={() => handleCityChange('all')}>
            <X size={14} />
          </button>
        </div>
      )}
      
      {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
        <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1">
          Prix: {priceRange[0]} - {priceRange[1]} FCFA
          <button onClick={() => setPriceRange([0, maxPrice])}>
            <X size={14} />
          </button>
        </div>
      )}
      
      {(pointsRange[0] > 0 || pointsRange[1] < maxPoints) && (
        <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1">
          Points: {pointsRange[0]} - {pointsRange[1]}
          <button onClick={() => setPointsRange([0, maxPoints])}>
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterTags;
