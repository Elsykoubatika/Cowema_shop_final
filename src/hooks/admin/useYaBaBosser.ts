import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  getAllEnrichedProducts,
  saveProductExtension,
  refreshProductsCache,
  EnrichedProduct
} from '@/services/apiService';

export interface VideoData {
  url: string;
  thumbnail?: string;
}

export const useYaBaBosser = () => {
  const [products, setProducts] = useState<EnrichedProduct[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const enrichedProducts = await getAllEnrichedProducts();
      setProducts(enrichedProducts);
      console.log('🔄 Products loaded:', enrichedProducts.length);
    } catch (error) {
      console.error('❌ Error loading products:', error);
      toast.error("Erreur lors du chargement des produits");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleYaBaBossToggle = async (productId: string, isYaBaBoss: boolean) => {
    try {
      await saveProductExtension(String(productId), { isYaBaBoss: isYaBaBoss });
      
      toast.success(`Produit ${isYaBaBoss ? 'ajouté' : 'retiré'} des Ya Ba Boss avec succès`);

      // Refresh products immediately
      await loadProducts();
    } catch (error) {
      console.error('❌ Error updating YaBaBoss status:', error);
      toast.error("Erreur lors de la mise à jour du produit");
    }
  };

  const handleFlashOfferToggle = async (productId: string, isFlashOffer: boolean) => {
    try {
      await saveProductExtension(String(productId), { isFlashOffer: isFlashOffer });
      
      toast.success(`Produit ${isFlashOffer ? 'ajouté' : 'retiré'} des offres flash avec succès`);

      await loadProducts();
    } catch (error) {
      console.error('❌ Error updating flash offer status:', error);
      toast.error("Erreur lors de la mise à jour du produit");
    }
  };

  const handleActiveToggle = async (productId: string, isActive: boolean) => {
    try {
      await saveProductExtension(String(productId), { isActive: isActive });
      
      toast.success(`Produit ${isActive ? 'activé' : 'désactivé'} avec succès`);

      await loadProducts();
    } catch (error) {
      console.error('❌ Error updating active status:', error);
      toast.error("Erreur lors de la mise à jour du produit");
    }
  };

  const handleVideoUpload = async (productId: number, url: string) => {
    console.log('🎬 handleVideoUpload called:', { productId, url });
    
    try {
      // Save video URL to product extension
      await saveProductExtension(String(productId), {
        videoUrl: url.trim()
      });
      
      console.log('✅ Video saved successfully:', { productId, url });
      
      // Refresh products to get updated data
      await loadProducts();
      
    } catch (error) {
      console.error('❌ Error saving video:', error);
      throw error;
    }
  };

  const handleClearVideo = async (productId: string) => {
    try {
      await saveProductExtension(String(productId), { videoUrl: '' });
      
      toast.success("Vidéo supprimée avec succès");

      await loadProducts();
      
      // Update local state immediately
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId || product.externalApiId === productId
            ? { ...product, videoUrl: '' }
            : product
        )
      );
    } catch (error) {
      console.error('❌ Error clearing video:', error);
      toast.error("Erreur lors de la suppression de la vidéo");
    }
  };

  const handleRefreshProducts = async () => {
    setIsLoading(true);
    try {
      await refreshProductsCache();
      await loadProducts();
      toast.success("Cache des produits rafraîchi avec succès");
    } catch (error) {
      console.error('❌ Error refreshing cache:', error);
      toast.error("Erreur lors du rafraîchissement du cache des produits");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    products,
    isLoading,
    isUploading,
    uploadProgress,
    handleYaBaBossToggle,
    handleFlashOfferToggle,
    handleActiveToggle,
    handleVideoUpload,
    handleClearVideo,
    handleRefreshProducts
  };
};
