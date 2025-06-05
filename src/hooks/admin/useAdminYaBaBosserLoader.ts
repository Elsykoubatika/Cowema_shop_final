
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useHybridProducts } from '@/hooks/useHybridProducts';
import { saveProductExtension, getProductExtension } from '@/services/apiService';
import { toast } from 'sonner';

interface YaBaBosserFilters {
  category: string;
  yaBaBossOnly: boolean;
  withVideoOnly: boolean;
  withoutVideoOnly: boolean;
}

export const useAdminYaBaBosserLoader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'price'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState<'active' | 'inactive' | 'all'>('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [changingStatus, setChangingStatus] = useState<string[]>([]);
  const [isUploadingVideo, setIsUploadingVideo] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productExtensions, setProductExtensions] = useState<Record<string, any>>({});
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<YaBaBosserFilters>({
    category: '',
    yaBaBossOnly: false,
    withVideoOnly: false,
    withoutVideoOnly: false
  });

  const apiFilters = useMemo(() => ({
    search: searchQuery,
    sort: sortBy,
    direction: sortOrder,
    page: currentPage,
    per_page: 100
  }), [searchQuery, sortBy, sortOrder, currentPage]);

  const {
    products: allProducts,
    isLoading,
    pagination,
    triggerSync,
    refetch
  } = useHybridProducts(apiFilters);

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
    if (allProducts.length > 0) {
      loadExtensions(allProducts);
    }
  }, [allProducts, loadExtensions]);

  // Enrichir les produits avec les extensions
  const enrichedProducts = useMemo(() => {
    return allProducts.map(product => {
      const extension = productExtensions[product.id] || {};
      return {
        ...product,
        isYaBaBoss: extension.isYaBaBoss || false,
        isActive: extension.isActive !== undefined ? extension.isActive : true,
        isFlashOffer: extension.isFlashOffer || false,
        videoUrl: extension.videoUrl || product.videoUrl || '',
        keywords: extension.keywords || product.keywords || []
      };
    });
  }, [allProducts, productExtensions]);

  // Filter products based on current filters and tab
  const filteredProducts = useMemo(() => {
    let filtered = [...enrichedProducts];

    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(product => 
        product.category?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    // Apply Ya Ba Boss filter
    if (filters.yaBaBossOnly) {
      filtered = filtered.filter(product => product.isYaBaBoss);
    }

    // Apply video filters
    if (filters.withVideoOnly) {
      filtered = filtered.filter(product => product.videoUrl && product.videoUrl.trim() !== '');
    }
    
    if (filters.withoutVideoOnly) {
      filtered = filtered.filter(product => !product.videoUrl || product.videoUrl.trim() === '');
    }

    // Apply active tab filter
    if (activeTab === 'active') {
      filtered = filtered.filter(product => product.isActive !== false);
    } else if (activeTab === 'inactive') {
      filtered = filtered.filter(product => product.isActive === false);
    }

    return filtered;
  }, [enrichedProducts, filters, activeTab]);

  // Get available categories
  const availableCategories = useMemo(() => {
    const categories = enrichedProducts
      .map(product => product.category)
      .filter((category, index, array) => category && array.indexOf(category) === index)
      .sort();
    return categories as string[];
  }, [enrichedProducts]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalProducts = enrichedProducts.length;
    const yaBaBossCount = enrichedProducts.filter(p => p.isYaBaBoss).length;
    const withVideoCount = enrichedProducts.filter(p => p.videoUrl && p.videoUrl.trim() !== '').length;
    const activeCount = enrichedProducts.filter(p => p.isActive !== false).length;
    
    return {
      totalProducts,
      yaBaBossCount,
      withVideoCount,
      activeCount,
      selectedCount: selectedProducts.length
    };
  }, [enrichedProducts, selectedProducts.length]);

  const handleYaBaBossToggle = useCallback(async (productId: string, isYaBaBoss: boolean) => {
    setChangingStatus(prev => [...prev, productId]);
    try {
      await saveProductExtension(productId, { isYaBaBoss });
      
      // Mettre à jour l'état local immédiatement
      setProductExtensions(prev => ({
        ...prev,
        [productId]: { ...prev[productId], isYaBaBoss }
      }));
      
      toast.success(`Produit ${isYaBaBoss ? 'ajouté à' : 'retiré de'} Ya Ba Boss`);
    } catch (error) {
      console.error('Error toggling Ya Ba Boss:', error);
      toast.error('Erreur lors de la modification du statut Ya Ba Boss');
    } finally {
      setChangingStatus(prev => prev.filter(id => id !== productId));
    }
  }, []);

  const handleToggleProductActive = useCallback(async (productId: string, isActive: boolean) => {
    setChangingStatus(prev => [...prev, productId]);
    try {
      await saveProductExtension(productId, { isActive });
      
      // Mettre à jour l'état local immédiatement
      setProductExtensions(prev => ({
        ...prev,
        [productId]: { ...prev[productId], isActive }
      }));
      
      toast.success(`Produit ${isActive ? 'activé' : 'désactivé'}`);
    } catch (error) {
      console.error('Error toggling product active status:', error);
      toast.error('Erreur lors de la modification du statut du produit');
    } finally {
      setChangingStatus(prev => prev.filter(id => id !== productId));
    }
  }, []);

  const handleVideoUpload = useCallback(async (productId: string, videoUrl: string) => {
    setIsUploadingVideo(prev => [...prev, productId]);
    try {
      await saveProductExtension(productId, { videoUrl });
      
      // Mettre à jour l'état local immédiatement
      setProductExtensions(prev => ({
        ...prev,
        [productId]: { ...prev[productId], videoUrl }
      }));
      
      toast.success('Vidéo ajoutée avec succès');
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Erreur lors de l\'ajout de la vidéo');
    } finally {
      setIsUploadingVideo(prev => prev.filter(id => id !== productId));
    }
  }, []);

  const handleSelectProduct = useCallback((productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const handleSelectAllProducts = useCallback((checked: boolean) => {
    setSelectedProducts(checked ? filteredProducts.map(p => p.id) : []);
  }, [filteredProducts]);

  const handleSelectAllYaBaBoss = useCallback(() => {
    const yaBaBossProducts = filteredProducts.filter(p => p.isYaBaBoss);
    setSelectedProducts(yaBaBossProducts.map(p => p.id));
    toast.info(`${yaBaBossProducts.length} produits Ya Ba Boss sélectionnés`);
  }, [filteredProducts]);

  const handleBulkRemoveYaBaBoss = useCallback(async () => {
    if (selectedProducts.length === 0) {
      toast.error('Aucun produit sélectionné');
      return;
    }

    const yaBaBossSelected = selectedProducts.filter(productId => {
      const product = enrichedProducts.find(p => p.id === productId);
      return product?.isYaBaBoss;
    });

    if (yaBaBossSelected.length === 0) {
      toast.error('Aucun produit Ya Ba Boss sélectionné');
      return;
    }

    setChangingStatus(prev => [...prev, ...yaBaBossSelected]);
    
    try {
      let successCount = 0;
      let errorCount = 0;

      for (const productId of yaBaBossSelected) {
        try {
          await saveProductExtension(productId, { isYaBaBoss: false });
          
          // Mettre à jour l'état local
          setProductExtensions(prev => ({
            ...prev,
            [productId]: { ...prev[productId], isYaBaBoss: false }
          }));
          
          successCount++;
        } catch (error) {
          console.error(`Error removing Ya Ba Boss for product ${productId}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} produit(s) retiré(s) de Ya Ba Boss`);
      }
      if (errorCount > 0) {
        toast.error(`Erreur pour ${errorCount} produit(s)`);
      }

      setSelectedProducts([]);
    } catch (error) {
      console.error('Error in bulk Ya Ba Boss removal:', error);
      toast.error('Erreur lors de la désactivation en masse');
    } finally {
      setChangingStatus(prev => prev.filter(id => !yaBaBossSelected.includes(id)));
    }
  }, [selectedProducts, enrichedProducts]);

  const handleEditProduct = useCallback((productId: string) => {
    console.log('Edit product:', productId);
    toast.info('Fonctionnalité d\'édition en cours de développement');
  }, []);

  const loadMore = useCallback(async () => {
    setCurrentPage(prev => prev + 1);
  }, []);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const refreshData = useCallback(async () => {
    setRefreshing(true);
    try {
      await triggerSync(apiFilters);
      await loadExtensions(allProducts);
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Erreur lors de l\'actualisation des données');
    } finally {
      setRefreshing(false);
    }
  }, [triggerSync, apiFilters, loadExtensions, allProducts]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, sortOrder, filters, activeTab]);

  return {
    products: filteredProducts,
    allProducts: enrichedProducts,
    isLoading: isLoading || refreshing,
    hasMore: pagination.hasNext,
    loadMore,
    goToPage,
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    totalLoaded: enrichedProducts.length,
    totalProducts: pagination.total,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    activeTab,
    setActiveTab,
    selectedProducts,
    changingStatus,
    isUploadingVideo,
    handleEditProduct,
    handleYaBaBossToggle,
    handleToggleProductActive,
    handleVideoUpload,
    handleSelectProduct,
    handleSelectAllProducts,
    handleSelectAllYaBaBoss,
    handleBulkRemoveYaBaBoss,
    yaBaBossCount: stats.yaBaBossCount,
    withVideoCount: stats.withVideoCount,
    activeCount: stats.activeCount,
    selectedCount: stats.selectedCount,
    totalProductsCount: stats.totalProducts,
    filters,
    setFilters,
    availableCategories,
    refreshData
  };
};
