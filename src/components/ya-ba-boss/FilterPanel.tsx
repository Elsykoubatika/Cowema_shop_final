
import React from 'react';
import { Slider } from '../../components/ui/slider';
import { Button } from '../../components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { FilterOptions } from '../../hooks/useProductFiltering';

interface FilterPanelProps {
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  pointsRange: number[];
  setPointsRange: (value: number[]) => void;
  maxPrice: number;
  maxPoints: number;
  applyRangeFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  priceRange,
  setPriceRange,
  pointsRange,
  setPointsRange,
  maxPrice,
  maxPoints,
  applyRangeFilters,
}) => {
  return (
    <div className="mt-4 p-4 border rounded-md bg-gray-50">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger className="py-2">
            Prix
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-2 py-4">
              <div className="flex justify-between text-sm mb-2">
                <span>{priceRange[0]} FCFA</span>
                <span>{priceRange[1]} FCFA</span>
              </div>
              <Slider
                defaultValue={[0, maxPrice]}
                min={0}
                max={maxPrice}
                step={100}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mb-2"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="points">
          <AccordionTrigger className="py-2">
            Points fidélité
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-2 py-4">
              <div className="flex justify-between text-sm mb-2">
                <span>{pointsRange[0]} points</span>
                <span>{pointsRange[1]} points</span>
              </div>
              <Slider
                defaultValue={[0, maxPoints]}
                min={0}
                max={maxPoints}
                step={1}
                value={pointsRange}
                onValueChange={setPointsRange}
                className="mb-2"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="flex justify-end mt-4">
        <Button onClick={applyRangeFilters}>
          Appliquer les filtres
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;
