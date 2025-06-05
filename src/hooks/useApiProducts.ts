
import { useState, useEffect } from 'react';
import { Product } from '@/data/products';
import { CategoryData } from '@/types/api';
import { products as staticProducts } from '@/data/products';

// Données statiques de catégories pour remplacer les appels API
const staticCategories: CategoryData[] = [
  {
    id: 'electroniques',
    name: 'Électroniques',
    subcategories: ['Smartphones', 'Ordinateurs', 'Accessoires'],
    productCount: 10
  },
  {
    id: 'vetements',
    name: 'Vêtements',
    subcategories: ['Hommes', 'Femmes', 'Enfants'],
    productCount: 5
  },
  {
    id: 'solaire',
    name: 'Solaire',
    subcategories: ['Panneaux', 'Batteries', 'Accessoires'],
    productCount: 7
  }
];

export const useApiProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Utiliser les données statiques au lieu des appels API
      setProducts(staticProducts);
      setCategories(staticCategories);
      
      console.log('Données statiques chargées avec succès');
      
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Impossible de charger les données');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    products,
    categories,
    isLoading,
    error,
    refreshData: () => {
      setIsLoading(true);
      loadData();
    }
  };
};
