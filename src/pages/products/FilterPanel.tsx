
import React, { useState, useEffect } from 'react';
import { products } from '../../data/products';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { Slider } from '../../components/ui/slider';
import { Button } from '../../components/ui/button';
import { CollapsibleContent } from "../../components/ui/collapsible";

interface FilterPanelProps {
  showFilterPanel: boolean;
  applyFilters: (options: any) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  showFilterPanel, 
  applyFilters 
}) => {
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [pointsRange, setPointsRange] = useState<number[]>([0, 100]);
  
  // Determine min/max values for price and points from products
  const maxPrice = Math.max(...products.map(p => p.price));
  const maxPoints = Math.max(...products.map(p => p.loyaltyPoints));

  useEffect(() => {
    // Initialize price and points ranges
    setPriceRange([0, maxPrice]);
    setPointsRange([0, maxPoints]);
  }, [maxPrice, maxPoints]);

  // Apply price and points filters
  const applyRangeFilters = () => {
    applyFilters({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minPoints: pointsRange[0],
      maxPoints: pointsRange[1]
    });
  };

  return (
    <CollapsibleContent className="mt-4 p-4 border rounded-md bg-gray-50">
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
    </CollapsibleContent>
  );
};

export default FilterPanel;
