
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useHybridProducts } from '@/hooks/useHybridProducts';
import { saveProductExtension, getProductExtension } from '@/services/apiService';
import { ApiFilters } from '@/hooks/hybrid-products/types';

export const useAdminProductsLoader = () => {
  const apiFilters: ApiFilters = { 
    page: 1,
    per_page: 100
  };
  
  const { products: hybridProducts, isLoading: hybridLoading, pagination, refetch } = useHybridProducts(apiFilters);
  
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [changingStatus, setChangingStatus] = useState<string[]>([]);
  const [productExtensions, setProductExtensions] = useState<Record<string, any>>({});
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  // Charger les extensions des produits
  const loadExtensions = useCallback(async (productList: any[]) => {
    const extensions: Record<string, any> = {};
    for (const product of productList) {
      try {
        const extension = await getProductExtension(product.id);
        if (extension) {
          extensions[product.id] = extension;
        }
      } catch (error) {
        console.error(`Error loading extension for product ${product.id}:`, error);
      }
    }
    setProductExtensions(extensions);
  }, []);

  // Charger les extensions quand les produits changent
  useEffect(() => {
    if (hybridProducts.length > 0) {
      loadExtensions(hybridProducts);
    }
  }, [hybridProducts, loadExtensions]);

  // Convertir les produits hybrides au format enrichi avec les extensions
  const products = hybridProducts.map(product => {
    const extension = productExtensions[product.id] || {};
    return {
      id: product.id,
      externalApiId: product.externalApiId || product.id,
      name: product.name || product.title,
      description: product.description || '',
      price: product.price,
      promoPrice: product.promoPrice,
      images: product.images || [],
      category: product.category,
      subcategory: product.subcategory,
      stock: product.stock || 0,
      isYaBaBoss: extension.isYaBaBoss || false,
      videoUrl: extension.videoUrl || product.videoUrl || '',
      keywords: extension.keywords || product.keywords || [],
      city: product.city,
      location: product.location,
      supplierName: product.supplierName,
      isActive: extension.isActive !== undefined ? extension.isActive : true,
      isFlashOffer: extension.isFlashOffer || false,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };
  });

  const handleEditProduct = useCallback((productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setIsEditModalOpen(true);
    }
  }, [products]);

  const handleSaveProductChanges = useCallback(async (productId: string, formData: any) => {
    try {
      await saveProductExtension(productId, formData);
      
      // Mettre à jour les extensions localement
      setProductExtensions(prev => ({
        ...prev,
        [productId]: { ...prev[productId], ...formData }
      }));
      
      setIsEditModalOpen(false);
      toast({
        title: "Succès",
        description: "Produit modifié avec succès",
      });
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleToggleProductActive = useCallback(async (productId: string, isActive: boolean) => {
    setChangingStatus(prev => [...prev, productId]);
    try {
      // Sauvegarder l'extension avec le nouveau statut
      await saveProductExtension(productId, { isActive });
      
      // Mettre à jour l'état local immédiatement
      setProductExtensions(prev => ({
        ...prev,
        [productId]: { ...prev[productId], isActive }
      }));
      
      toast({
        title: `Produit ${isActive ? 'activé' : 'désactivé'}`,
        description: `Le produit a été ${isActive ? 'activé' : 'désactivé'} avec succès.`,
      });
    } catch (error) {
      console.error('Error toggling product status:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du changement d'état du produit.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setChangingStatus(prev => prev.filter(id => id !== productId));
    }
  }, [toast]);

  const handleToggleYaBaBoss = useCallback(async (productId: string, isYaBaBoss: boolean) => {
    setChangingStatus(prev => [...prev, productId]);
    try {
      // Sauvegarder l'extension avec le nouveau statut YaBaBoss
      await saveProductExtension(productId, { isYaBaBoss });
      
      // Mettre à jour l'état local immédiatement
      setProductExtensions(prev => ({
        ...prev,
        [productId]: { ...prev[productId], isYaBaBoss }
      }));
      
      toast({
        title: `Produit ${isYaBaBoss ? 'ajouté à' : 'retiré de'} Ya Ba Boss`,
        description: `Le produit a été ${isYaBaBoss ? 'ajouté à' : 'retiré de'} Ya Ba Boss avec succès.`,
      });
    } catch (error) {
      console.error('Error toggling YaBaBoss status:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du changement du statut Ya Ba Boss.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setChangingStatus(prev => prev.filter(id => id !== productId));
    }
  }, [toast]);

  const handleSelectProduct = useCallback((productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const handleSelectAllProducts = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredAndSortedProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  }, []);

  const loadMore = useCallback(async () => {
    console.log('📄 Load more requested');
  }, []);

  // Filtrer et trier les produits
  const filteredAndSortedProducts = products
    .filter(product => 
      searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let aValue = '';
      let bValue = '';
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'price':
          return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
        case 'stock':
          return sortOrder === 'asc' ? (a.stock || 0) - (b.stock || 0) : (b.stock || 0) - (a.stock || 0);
        default:
          aValue = a.name;
          bValue = b.name;
      }
      
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

  const yaBaBossCount = products.filter(p => p.isYaBaBoss).length;
  const totalLoaded = products.length;
  const totalProducts = pagination.total || products.length;
  const hasMore = pagination.currentPage < pagination.totalPages;

  const refetchProducts = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
      // Recharger les extensions après le refetch
      await loadExtensions(hybridProducts);
    } catch (error) {
      console.error('Error refetching products:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch, loadExtensions, hybridProducts]);

  return {
    products: filteredAndSortedProducts,
    isLoading: hybridLoading || refreshing,
    hasMore,
    loadMore,
    totalLoaded,
    totalProducts,
    selectedProduct,
    isEditModalOpen,
    setIsEditModalOpen,
    handleEditProduct,
    handleSaveProductChanges,
    handleToggleProductActive,
    handleToggleYaBaBoss,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedProducts,
    handleSelectProduct,
    handleSelectAllProducts,
    changingStatus,
    yaBaBossCount,
    refetchProducts
  };
};
