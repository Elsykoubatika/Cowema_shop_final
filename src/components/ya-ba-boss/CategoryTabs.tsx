
import React from 'react';
import { useIsMobile } from '../../hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet';
import { Button } from '../../components/ui/button';
import { Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  setActiveCategory,
}) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleCategoryChange = (category: string) => {
    try {
      setActiveCategory(category === 'Tous' ? 'all' : category);
    } catch (error) {
      console.error('Error changing category:', error);
      toast({
        title: "Erreur de filtrage",
        description: "Impossible de filtrer par cette catégorie. Veuillez réessayer.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const CategoryButtons = () => (
    <div role="tablist" aria-label="Catégories de produits">
      {categories.map(category => (
        <button
          key={category}
          className={`px-4 py-2 mx-1 whitespace-nowrap rounded-full text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
            activeCategory === (category === 'Tous' ? 'all' : category) 
              ? 'bg-primary text-white shadow-md' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          onClick={() => handleCategoryChange(category)}
          role="tab"
          aria-selected={activeCategory === (category === 'Tous' ? 'all' : category)}
          aria-controls={`panel-${category}`}
          id={`tab-${category}`}
        >
          {category}
        </button>
      ))}
    </div>
  );

  // Mobile version with Sheet
  if (isMobile) {
    const selectedCategory = categories.find(
      cat => activeCategory === (cat === 'Tous' ? 'all' : cat)
    ) || categories[0];
    
    return (
      <div className="mb-6 border-b pb-4">
        <h3 className="text-lg font-medium mb-3" id="category-heading">Catégories</h3>
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between"
              aria-label="Sélectionner une catégorie"
              aria-expanded="false"
              aria-haspopup="dialog"
            >
              {selectedCategory}
              <Filter className="h-4 w-4 ml-2" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[50vh] pt-6" aria-labelledby="category-sheet-heading">
            <h3 className="text-xl font-medium mb-6 text-center" id="category-sheet-heading">Sélectionner une catégorie</h3>
            <div className="grid grid-cols-2 gap-3" role="tablist" aria-label="Catégories de produits">
              {categories.map(category => (
                <button
                  key={category}
                  className={`px-4 py-3 rounded-md text-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                    activeCategory === (category === 'Tous' ? 'all' : category) 
                      ? 'bg-primary text-white shadow-md' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => {
                    handleCategoryChange(category);
                    try {
                      // Fix: Cast to HTMLElement which has the click() method
                      const sheetCloseButton = document.querySelector('[data-radix-collection-item]') as HTMLElement;
                      if (sheetCloseButton) {
                        sheetCloseButton.click(); // Close sheet
                      } else {
                        // If the button isn't found, show an error
                        console.warn("Close button not found for sheet");
                      }
                    } catch (error) {
                      console.error("Error closing category sheet:", error);
                      toast({
                        title: "Erreur technique",
                        description: "Impossible de fermer le menu des catégories. Veuillez réessayer.",
                        variant: "destructive",
                        duration: 3000,
                      });
                    }
                  }}
                  role="tab"
                  aria-selected={activeCategory === (category === 'Tous' ? 'all' : category)}
                  aria-controls={`panel-${category}`}
                  id={`tab-mobile-${category}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // Desktop version with horizontal scroll
  return (
    <div className="mb-6 border-b pb-4">
      <h3 className="text-lg font-medium mb-3" id="desktop-category-heading">Catégories</h3>
      <div className="flex overflow-x-auto pb-2 hide-scrollbar focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-50 rounded">
        <CategoryButtons />
      </div>
    </div>
  );
};

export default CategoryTabs;
