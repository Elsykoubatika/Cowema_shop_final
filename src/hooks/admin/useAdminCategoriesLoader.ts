
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CategoryData } from '@/types/api';
import { useApiFilters } from '@/hooks/useApiFilters';
import { 
  getAllCategories, 
  saveCategory, 
  deleteCategory, 
  addSubcategory,
  deleteSubcategory 
} from '@/services/apiService';

interface AdminCategoriesState {
  selectedCategory: CategoryData | null;
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteDialogOpen: boolean;
  isSubcategoryModalOpen: boolean;
}

export const useAdminCategoriesLoader = () => {
  const [adminState, setAdminState] = useState<AdminCategoriesState>({
    selectedCategory: null,
    isAddModalOpen: false,
    isEditModalOpen: false,
    isDeleteDialogOpen: false,
    isSubcategoryModalOpen: false
  });

  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(20);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const { toast } = useToast();
  const { categoriesData } = useApiFilters();

  // Transform API categories to CategoryData format
  const transformCategories = useCallback((apiCategories: any[]): CategoryData[] => {
    return apiCategories.map(cat => ({
      id: cat.id?.toString() || Math.random().toString(),
      name: cat.name || '',
      subcategories: cat.subcategories || [],
      productCount: cat.products_count || cat.productCount || 0,
      description: cat.description,
      image: cat.image
    }));
  }, []);

  // Load categories from API
  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use the existing API filter hook data if available
      if (categoriesData && categoriesData.length > 0) {
        const transformedCategories = transformCategories(categoriesData);
        setCategories(transformedCategories);
        setFilteredCategories(transformedCategories);
        setLastRefresh(new Date());
        console.log('✅ Categories loaded from API filters:', transformedCategories.length);
      } else {
        // Fallback to direct API call
        const data = await getAllCategories();
        const transformedCategories = transformCategories(data);
        setCategories(transformedCategories);
        setFilteredCategories(transformedCategories);
        setLastRefresh(new Date());
        console.log('✅ Categories loaded from direct API:', transformedCategories.length);
      }
    } catch (error) {
      console.error('❌ Error loading categories:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories",
        variant: "destructive"
      });
      setCategories([]);
      setFilteredCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [categoriesData, transformCategories, toast]);

  // Initial load and when categoriesData changes
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Filter categories based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCategories(categories);
      setTotalPages(Math.ceil(categories.length / itemsPerPage));
    } else {
      const filtered = categories.filter(category => 
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        category.subcategories.some(subcat => 
          subcat.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredCategories(filtered);
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
      setCurrentPage(1);
    }
  }, [searchQuery, categories, itemsPerPage]);

  // Get current page categories
  const getCurrentPageCategories = useCallback(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCategories.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage, filteredCategories]);

  // Admin actions
  const handleAddCategory = useCallback(async (newCategory: CategoryData) => {
    try {
      saveCategory(newCategory);
      await loadCategories();
      toast({
        title: "Succès",
        description: "Catégorie ajoutée avec succès"
      });
      setAdminState(prev => ({ ...prev, isAddModalOpen: false }));
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la catégorie:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la catégorie",
        variant: "destructive"
      });
    }
  }, [loadCategories, toast]);

  const handleEditCategory = useCallback(async (updatedCategory: CategoryData) => {
    try {
      saveCategory(updatedCategory);
      await loadCategories();
      toast({
        title: "Succès",
        description: "Catégorie mise à jour avec succès"
      });
      setAdminState(prev => ({ 
        ...prev, 
        isEditModalOpen: false, 
        selectedCategory: null 
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la catégorie",
        variant: "destructive"
      });
    }
  }, [loadCategories, toast]);

  const handleDeleteCategory = useCallback(async (categoryId: string) => {
    try {
      deleteCategory(categoryId);
      await loadCategories();
      toast({
        title: "Succès",
        description: "Catégorie supprimée avec succès"
      });
      setAdminState(prev => ({ 
        ...prev, 
        isDeleteDialogOpen: false, 
        selectedCategory: null 
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la catégorie",
        variant: "destructive"
      });
    }
  }, [loadCategories, toast]);

  const handleAddSubcategory = useCallback(async (categoryId: string, subcategoryName: string) => {
    try {
      const success = addSubcategory(categoryId, subcategoryName);
      if (success) {
        await loadCategories();
        toast({
          title: "Succès",
          description: "Sous-catégorie ajoutée avec succès"
        });
        setAdminState(prev => ({ ...prev, isSubcategoryModalOpen: false }));
      } else {
        throw new Error("Catégorie non trouvée");
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la sous-catégorie:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la sous-catégorie",
        variant: "destructive"
      });
    }
  }, [loadCategories, toast]);

  const handleDeleteSubcategory = useCallback(async (categoryId: string, subcategoryName: string) => {
    try {
      const success = deleteSubcategory(categoryId, subcategoryName);
      if (success) {
        await loadCategories();
        toast({
          title: "Succès",
          description: "Sous-catégorie supprimée avec succès"
        });
      } else {
        throw new Error("Catégorie non trouvée");
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la sous-catégorie:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la sous-catégorie",
        variant: "destructive"
      });
    }
  }, [loadCategories, toast]);

  // Modal state setters
  const setSelectedCategory = useCallback((category: CategoryData | null) => {
    setAdminState(prev => ({ ...prev, selectedCategory: category }));
  }, []);

  const setIsAddModalOpen = useCallback((open: boolean) => {
    setAdminState(prev => ({ ...prev, isAddModalOpen: open }));
  }, []);

  const setIsEditModalOpen = useCallback((open: boolean) => {
    setAdminState(prev => ({ ...prev, isEditModalOpen: open }));
  }, []);

  const setIsDeleteDialogOpen = useCallback((open: boolean) => {
    setAdminState(prev => ({ ...prev, isDeleteDialogOpen: open }));
  }, []);

  const setIsSubcategoryModalOpen = useCallback((open: boolean) => {
    setAdminState(prev => ({ ...prev, isSubcategoryModalOpen: open }));
  }, []);

  // Calculate stats
  const totalCategories = categories.length;
  const totalSubcategories = categories.reduce((sum, cat) => sum + cat.subcategories.length, 0);
  const totalProducts = categories.reduce((sum, cat) => sum + cat.productCount, 0);

  return {
    // Categories data
    categories: getCurrentPageCategories(),
    allCategories: categories,
    isLoading,
    lastRefresh,
    
    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    totalCategories: filteredCategories.length,
    
    // Search
    searchQuery,
    setSearchQuery,
    
    // Admin state
    ...adminState,
    setSelectedCategory,
    setIsAddModalOpen,
    setIsEditModalOpen,
    setIsDeleteDialogOpen,
    setIsSubcategoryModalOpen,
    
    // Actions
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleAddSubcategory,
    handleDeleteSubcategory,
    refreshCategories: loadCategories,
    
    // Stats
    totalCategoriesCount: totalCategories,
    totalSubcategories,
    totalProducts
  };
};
