
import { useState, useEffect } from 'react';

interface CategoryData {
  id: number;
  name: string;
  products_count: number;
}

interface CityData {
  id: number;
  name: string;
}

export const useApiFilters = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [categoriesData, setCategoriesData] = useState<CategoryData[]>([]);
  const [citiesData, setCitiesData] = useState<CityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFilters = async () => {
      setIsLoading(true);
      
      try {
        // Fetch categories avec timeout
        const categoriesController = new AbortController();
        const categoriesTimeout = setTimeout(() => categoriesController.abort(), 5000); // 5 secondes timeout
        
        const categoriesResponse = await fetch('https://eu.cowema.org/api/public/categories', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          signal: categoriesController.signal
        });
        
        clearTimeout(categoriesTimeout);
        
        if (categoriesResponse.ok) {
          const categoriesResult: CategoryData[] = await categoriesResponse.json();
          
          // Filtrer les catégories qui ont au moins 1 produit
          const categoriesWithProducts = categoriesResult.filter(cat => cat.products_count > 0);
          
          console.log('📊 Categories loaded:', {
            total: categoriesResult.length,
            withProducts: categoriesWithProducts.length,
            filtered: categoriesResult.filter(cat => cat.products_count === 0).map(cat => cat.name)
          });
          
          setCategoriesData(categoriesWithProducts);
          setCategories(categoriesWithProducts.map(cat => cat.name));
        } else {
          throw new Error('Categories API failed');
        }

        // Fetch cities avec timeout
        const citiesController = new AbortController();
        const citiesTimeout = setTimeout(() => citiesController.abort(), 5000);
        
        const citiesResponse = await fetch('https://eu.cowema.org/api/public/cities', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          signal: citiesController.signal
        });
        
        clearTimeout(citiesTimeout);
        
        if (citiesResponse.ok) {
          const citiesResult: CityData[] = await citiesResponse.json();
          setCitiesData(citiesResult);
          setCities(citiesResult.map(city => city.name));
        }

      } catch (error) {
        console.error('Error fetching filters:', error);
        
        // Fallback avec catégories par défaut qui ont généralement des produits
        const fallbackCategories = [
          { id: 1, name: 'Electronics', products_count: 50 },
          { id: 2, name: 'Electroménager', products_count: 30 },
          { id: 3, name: 'Habillement', products_count: 25 },
          { id: 4, name: 'Beauté', products_count: 20 },
          { id: 5, name: 'Cuisine', products_count: 15 }
        ];
        
        setCategoriesData(fallbackCategories);
        setCategories(fallbackCategories.map(cat => cat.name));
        setCities(['Brazzaville', 'Pointe-Noire']);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilters();
  }, []);

  return {
    categories,
    cities,
    categoriesData,
    citiesData,
    isLoading
  };
};
