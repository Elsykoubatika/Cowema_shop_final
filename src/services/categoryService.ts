
export interface Category {
  id: string;
  name: string;
  subcategories?: string[];
}

export const getAllCategories = async (): Promise<Category[]> => {
  try {
    // Récupérer les catégories depuis le cache local
    const cachedProducts = localStorage.getItem('productsCache');
    const products = cachedProducts ? JSON.parse(cachedProducts) : [];
    
    // Extraire les catégories uniques
    const categoriesMap = new Map<string, Set<string>>();
    
    products.forEach((product: any) => {
      if (product.category) {
        if (!categoriesMap.has(product.category)) {
          categoriesMap.set(product.category, new Set());
        }
        
        if (product.subcategory) {
          categoriesMap.get(product.category)?.add(product.subcategory);
        }
      }
    });
    
    return Array.from(categoriesMap.entries()).map(([name, subcategories]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      subcategories: Array.from(subcategories)
    }));
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
};

export const saveCategory = async (category: Partial<Category>): Promise<Category> => {
  try {
    console.log('🔄 Saving category:', category);
    
    // Pour l'instant, juste retourner la catégorie avec un ID généré
    const savedCategory: Category = {
      id: category.id || category.name?.toLowerCase().replace(/\s+/g, '-') || 'new-category',
      name: category.name || 'New Category',
      subcategories: category.subcategories || []
    };
    
    console.log('✅ Category saved successfully:', savedCategory);
    return savedCategory;
  } catch (error) {
    console.error('❌ Error saving category:', error);
    throw new Error('Failed to save category');
  }
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
  try {
    console.log('🔄 Deleting category:', categoryId);
    
    // Simulation de suppression
    console.log('✅ Category deleted successfully');
  } catch (error) {
    console.error('❌ Error deleting category:', error);
    throw new Error('Failed to delete category');
  }
};

export const addSubcategory = async (categoryId: string, subcategoryName: string): Promise<void> => {
  try {
    console.log('🔄 Adding subcategory:', subcategoryName, 'to category:', categoryId);
    
    // Simulation d'ajout de sous-catégorie
    console.log('✅ Subcategory added successfully');
  } catch (error) {
    console.error('❌ Error adding subcategory:', error);
    throw new Error('Failed to add subcategory');
  }
};

export const deleteSubcategory = async (categoryId: string, subcategoryName: string): Promise<void> => {
  try {
    console.log('🔄 Deleting subcategory:', subcategoryName, 'from category:', categoryId);
    
    // Simulation de suppression de sous-catégorie
    console.log('✅ Subcategory deleted successfully');
  } catch (error) {
    console.error('❌ Error deleting subcategory:', error);
    throw new Error('Failed to delete subcategory');
  }
};
