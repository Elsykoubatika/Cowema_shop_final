
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CategoryData } from '@/types/api';
import { 
  getAllCategories, 
  saveCategory, 
  deleteCategory, 
  addSubcategory,
  deleteSubcategory 
} from '@/services/apiService';

export const useCategoriesManager = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<CategoryData[]>([]);
  const { toast } = useToast();

  // Chargement initial des catégories
  useEffect(() => {
    loadCategories();
  }, []);

  // Filtrer les catégories en fonction de la recherche
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category => 
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        category.subcategories.some(subcat => 
          subcat.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories]);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await getAllCategories();
      // Convert Category[] to CategoryData[]
      const categoryData: CategoryData[] = data.map(cat => ({
        id: cat.id,
        name: cat.name,
        subcategories: cat.subcategories || [],
        productCount: 0, // Default value since Category doesn't have this
        description: undefined,
        image: undefined
      }));
      setCategories(categoryData);
      setFilteredCategories(categoryData);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (newCategory: CategoryData) => {
    try {
      saveCategory(newCategory);
      await loadCategories();
      toast({
        title: "Succès",
        description: "Catégorie ajoutée avec succès"
      });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la catégorie:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la catégorie",
        variant: "destructive"
      });
    }
  };

  const handleEditCategory = async (updatedCategory: CategoryData) => {
    try {
      saveCategory(updatedCategory);
      await loadCategories();
      toast({
        title: "Succès",
        description: "Catégorie mise à jour avec succès"
      });
      setIsEditModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la catégorie",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      deleteCategory(categoryId);
      await loadCategories();
      toast({
        title: "Succès",
        description: "Catégorie supprimée avec succès"
      });
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la catégorie",
        variant: "destructive"
      });
    }
  };

  const handleAddSubcategory = async (categoryId: string, subcategoryName: string) => {
    try {
      const success = addSubcategory(categoryId, subcategoryName);
      if (success) {
        await loadCategories();
        toast({
          title: "Succès",
          description: "Sous-catégorie ajoutée avec succès"
        });
        setIsSubcategoryModalOpen(false);
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
  };

  const handleDeleteSubcategory = async (categoryId: string, subcategoryName: string) => {
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
  };

  return {
    categories: filteredCategories,
    selectedCategory,
    isLoading,
    isAddModalOpen,
    isEditModalOpen,
    isDeleteDialogOpen,
    isSubcategoryModalOpen,
    searchQuery,
    setSelectedCategory,
    setIsAddModalOpen,
    setIsEditModalOpen,
    setIsDeleteDialogOpen,
    setIsSubcategoryModalOpen,
    setSearchQuery,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleAddSubcategory,
    handleDeleteSubcategory,
    refreshCategories: loadCategories
  };
};
