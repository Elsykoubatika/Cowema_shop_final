
import React from 'react';
import CategoryFilter from '../CategoryFilter';
import { useIsMobile } from '../../hooks/use-mobile';

interface CategoriesSectionProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ activeCategory, setActiveCategory }) => {
  const isMobile = useIsMobile();
  
  return (
    <section 
      className={`py-6 bg-gray-50 border-b border-gray-200 ${isMobile ? 'px-2' : ''}`}
      aria-labelledby="categories-heading"
    >
      <div className="container-cowema">
        {!isMobile && (
          <h2 id="categories-heading" className="text-lg font-medium text-center mb-4">
            Top 8 des catégories les plus populaires
          </h2>
        )}
        <div className={`overflow-x-auto pb-2 hide-scrollbar ${isMobile ? '' : 'py-2'}`}>
          <div className={`flex justify-center min-w-full ${isMobile ? '' : 'py-2'}`}>
            <CategoryFilter 
              activeCategory={activeCategory} 
              setActiveCategory={setActiveCategory}
              isHomePage={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
