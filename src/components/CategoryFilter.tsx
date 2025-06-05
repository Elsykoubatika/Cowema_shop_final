
import React from 'react';

interface CategoryFilterProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  isHomePage?: boolean;
}

// Catégories prédéfinies dans l'ordre souhaité
const PREDEFINED_CATEGORIES = [
  { id: 'all', name: 'Tous', productCount: 0 },
  { id: 'Electronics', name: 'Electronics', productCount: 282 },
  { id: 'Electroménager', name: 'Electroménager', productCount: 77 },
  { id: 'Solaire', name: 'Solaire', productCount: 0 },
  { id: 'Cuisine', name: 'Cuisine', productCount: 28 },
  { id: 'Santé & Bien-être', name: 'Santé & Bien-être', productCount: 408 },
  { id: 'Beauté', name: 'Beauté', productCount: 175 },
  { id: 'Habillements', name: 'Habillements', productCount: 335 },
  { id: 'Jouets', name: 'Jouets', productCount: 85 }
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  activeCategory, 
  setActiveCategory,
  isHomePage = false
}) => {
  // Pour la page d'accueil, montrer seulement les 8 premières catégories (Tous + 7 autres)
  const categoriesToShow = isHomePage 
    ? PREDEFINED_CATEGORIES.slice(0, 8)
    : PREDEFINED_CATEGORIES;

  console.log('🏷️ CategoryFilter rendering:', {
    isHomePage,
    activeCategory,
    categoriesShown: categoriesToShow.length,
    categories: categoriesToShow.map(cat => `${cat.name} (${cat.productCount})`)
  });

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
      {categoriesToShow.map((category) => (
        <button
          key={category.id}
          onClick={() => setActiveCategory(category.id === 'all' ? '' : category.name)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
            (activeCategory === '' && category.id === 'all') ||
            (activeCategory === category.name)
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {category.name}
          {category.id !== 'all' && (
            <span className="ml-1 text-xs opacity-75">
              ({category.productCount})
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
