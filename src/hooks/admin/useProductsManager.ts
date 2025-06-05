import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';
import { ExtendedProductData } from '@/types/api';
import { useHybridProducts } from '@/hooks/useHybridProducts';
import { 
  getEnrichedProductById, 
  saveProductExtension
} from '@/services/apiService';

export const useProductsManager = () => {
  // Use hybrid products without pagination limits
  const { 
    products: hybridProducts, 
    isLoading: hybridLoading, 
    pagination, 
    triggerSync 
  } = useHybridProducts({ page: 1 }); // Start with page 1 but load all

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState<string>('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [itemsPerPage] = useState(20); // Keep pagination for UI display only
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [allProductsLoaded, setAllProductsLoaded] = useState(false);
  const { toast } = useToast();

  // Load all products by fetching multiple pages
  const loadAllProducts = async () => {
    setIsLoading(true);
    setLoadingProgress('Chargement de tous les produits...');
    
    try {
      let allProducts: Product[] = [];
      let currentPageNum = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        console.log(`🔄 Loading page ${currentPageNum}...`);
        setLoadingProgress(`Chargement de la page ${currentPageNum}...`);
        
        const result = await triggerSync({ page: currentPageNum });
        
        if (result.success && hybridProducts.length > 0) {
          allProducts = [...allProducts, ...hybridProducts];
          currentPageNum++;
          
          // Check if we have more pages based on pagination info
          if (pagination.currentPage >= pagination.totalPages) {
            hasMorePages = false;
          }
        } else {
          hasMorePages = false;
        }
        
        // Safety break to avoid infinite loops
        if (currentPageNum > 50) {
          console.log('⚠️ Breaking loop after 50 pages for safety');
          break;
        }
      }

      // Remove duplicates based on product id
      const uniqueProducts = allProducts.filter((product, index, self) => 
        index === self.findIndex(p => p.id === product.id)
      );

      setProducts(uniqueProducts);
      setTotalProducts(uniqueProducts.length);
      setFilteredProducts(uniqueProducts);
      setAllProductsLoaded(true);
      setLastRefresh(new Date());
      
      console.log(`✅ All products loaded: ${uniqueProducts.length} total`);
      setLoadingProgress('');
      
    } catch (error) {
      console.error('❌ Error loading all products:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger tous les produits",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update products when hybrid products change (for initial load)
  useEffect(() => {
    if (!allProductsLoaded && !hybridLoading && hybridProducts.length > 0) {
      // Only use hybrid products for the first load, then load all
      setProducts(hybridProducts);
      setTotalProducts(hybridProducts.length);
      setFilteredProducts(hybridProducts);
      setIsLoading(false);
      setLastRefresh(new Date());
      
      // Trigger loading of all products after initial load
      setTimeout(() => {
        loadAllProducts();
      }, 1000);
    }
  }, [hybridProducts, hybridLoading, allProductsLoaded]);

  // Set loading progress based on hybrid loading state
  useEffect(() => {
    if (hybridLoading && !allProductsLoaded) {
      setLoadingProgress('Récupération des produits en cours...');
    } else if (!isLoading) {
      setLoadingProgress('');
    }
  }, [hybridLoading, allProductsLoaded, isLoading]);

  // Fonction pour rafraîchir manuellement les données
  const refreshProducts = async () => {
    setAllProductsLoaded(false);
    await loadAllProducts();
  };

  // Filtrer les produits en fonction de la recherche
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
      setTotalPages(Math.ceil(products.length / itemsPerPage));
      setTotalProducts(products.length);
    } else {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.subcategory && product.subcategory.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredProducts(filtered);
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
      setTotalProducts(filtered.length);
      setCurrentPage(1); // Revenir à la première page lors d'une recherche
    }
  }, [searchQuery, products, itemsPerPage]);

  // Obtenir les produits pour la page actuelle (UI pagination only)
  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  // Ouvrir le modal d'édition avec un produit sélectionné
  const handleEditProduct = async (productId: string) => {
    try {
      const enrichedProduct = await getEnrichedProductById(productId);
      if (enrichedProduct) {
        // Convert EnrichedProduct to Product
        const product: Product = {
          id: enrichedProduct.id,
          name: enrichedProduct.name,
          description: enrichedProduct.description || '',
          price: enrichedProduct.price,
          promoPrice: enrichedProduct.promoPrice,
          images: enrichedProduct.images || [], // Ensure images is always an array
          category: enrichedProduct.category,
          subcategory: enrichedProduct.subcategory,
          stock: enrichedProduct.stock || 0,
          city: enrichedProduct.city,
          location: enrichedProduct.location,
          supplierName: enrichedProduct.supplierName,
          videoUrl: enrichedProduct.videoUrl || '',
          keywords: enrichedProduct.keywords || [],
          isYaBaBoss: enrichedProduct.isYaBaBoss || false,
          isFlashOffer: enrichedProduct.isFlashOffer || false,
          isActive: enrichedProduct.isActive !== false
        };
        setSelectedProduct(product);
        setIsEditModalOpen(true);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les détails du produit",
        variant: "destructive"
      });
    }
  };

  // Sauvegarder les modifications d'un produit
  const handleSaveProductChanges = (productId: string, data: Partial<ExtendedProductData>) => {
    // Récupérer le produit existant
    const existingProduct = products.find(p => p.id === productId);
    if (!existingProduct) {
      toast({
        title: "Erreur",
        description: "Produit introuvable",
        variant: "destructive"
      });
      return;
    }

    // Créer les données étendues à sauvegarder
    const extendedData: ExtendedProductData = {
      isYaBaBoss: data.isYaBaBoss ?? existingProduct.isYaBaBoss ?? false,
      videoUrl: data.videoUrl ?? existingProduct.videoUrl,
      keywords: data.keywords ?? existingProduct.keywords,
      city: data.city ?? existingProduct.city,
      sold: data.sold ?? existingProduct.sold,
      isActive: data.isActive ?? existingProduct.isActive
    };

    // Sauvegarder les extensions
    saveProductExtension(productId, extendedData);

    // Mettre à jour l'état local
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === productId 
          ? { ...p, ...data }
          : p
      )
    );

    toast({
      title: "Succès",
      description: "Produit modifié avec succès"
    });

    // Fermer le modal
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  // Gérer l'activation/désactivation d'un produit
  const handleToggleProductActive = async (productId: string, isActive: boolean) => {
    // Récupérer le produit existant
    const existingProduct = products.find(p => p.id === productId);
    if (!existingProduct) {
      throw new Error("Produit introuvable");
    }

    // Créer les données étendues à sauvegarder avec l'état actif mis à jour
    const extendedData: ExtendedProductData = {
      isYaBaBoss: existingProduct.isYaBaBoss ?? false,
      videoUrl: existingProduct.videoUrl,
      keywords: existingProduct.keywords,
      city: existingProduct.city,
      sold: existingProduct.sold,
      isActive: isActive
    };

    // Sauvegarder les extensions
    await saveProductExtension(productId, extendedData);

    // Mettre à jour l'état local
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === productId 
          ? { ...p, isActive }
          : p
      )
    );

    return true;
  };

  // Gérer la sélection d'un produit
  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prevSelected => {
      if (prevSelected.includes(productId)) {
        return prevSelected.filter(id => id !== productId);
      } else {
        return [...prevSelected, productId];
      }
    });
  };

  // Sélectionner ou désélectionner tous les produits de la page
  const handleSelectAllProducts = () => {
    const currentPageProductIds = getCurrentPageProducts().map(p => p.id);
    
    if (currentPageProductIds.every(id => selectedProducts.includes(id))) {
      // Désélectionner tous les produits de la page actuelle
      setSelectedProducts(prevSelected => 
        prevSelected.filter(id => !currentPageProductIds.includes(id))
      );
    } else {
      // Sélectionner tous les produits de la page actuelle
      setSelectedProducts(prevSelected => {
        const newSelection = [...prevSelected];
        currentPageProductIds.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
  };

  return {
    products: getCurrentPageProducts(),
    allProducts: products,
    selectedProduct,
    isLoading,
    loadingProgress,
    isEditModalOpen,
    setIsEditModalOpen,
    handleEditProduct,
    handleSaveProductChanges,
    handleToggleProductActive,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    totalProducts,
    selectedProducts,
    handleSelectProduct,
    handleSelectAllProducts,
    refreshProducts,
    lastRefresh,
    allProductsLoaded
  };
};
