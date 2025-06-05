
import { useState, useEffect } from 'react';
import { Product } from '@/data/products';
import { products as staticProducts } from '@/data/products';

export const useDynamicProducts = () => {
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Utilisation des données statiques pour les produits');
      setProducts(staticProducts);
      
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Erreur lors du chargement des produits');
      setProducts(staticProducts); // Fallback to static products
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const refreshProducts = () => {
    loadProducts();
  };

  return {
    products,
    isLoading,
    error,
    refreshProducts
  };
};
