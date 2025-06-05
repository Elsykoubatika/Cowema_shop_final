
import { useState, useCallback } from 'react';
import { usePageReset } from '../../../hooks/usePageReset';

export const useIndexState = () => {
  const [activeCategory, setActiveCategory] = useState('');
  
  const resetPageState = useCallback(() => {
    console.log('🔄 Resetting Index page state...');
    setActiveCategory('');
  }, []);

  usePageReset(resetPageState);
  
  return {
    activeCategory,
    setActiveCategory
  };
};
