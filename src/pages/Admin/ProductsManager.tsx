
import React from 'react';
import { useAdminProductsLoader } from '@/hooks/admin/useAdminProductsLoader';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import ProductForm from '@/components/admin/products/ProductForm';
import ProductsStats from '@/components/admin/products/ProductsStats';
import ProductsSearchBar from '@/components/admin/products/ProductsSearchBar';
import ProductsSorting from '@/components/products/ProductsSorting';
import AdminLoadMoreButton from '@/components/admin/products/AdminLoadMoreButton';
import VideoInsert from '@/components/admin/yababosser/VideoInsert';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Star, Edit, Loader2, Check, XCircle, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { saveProductExtension } from '@/services/apiService';

const ProductsManager: React.FC = () => {
  const {
    products,
    isLoading,
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
  } = useAdminProductsLoader();

  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Lien copié",
        description: "Le lien du produit a été copié dans le presse-papiers.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (productId: string, newStatus: boolean) => {
    try {
      await handleToggleProductActive(productId, newStatus);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du changement d'état du produit.",
        variant: "destructive",
      });
      console.error('Error changing product status:', error);
    }
  };

  const handleYaBaBossChange = async (productId: string, newStatus: boolean) => {
    try {
      await handleToggleYaBaBoss(productId, newStatus);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du changement du statut Ya Ba Boss.",
        variant: "destructive",
      });
      console.error('Error changing YaBaBoss status:', error);
    }
  };

  const handleSaveVideoUrl = async (productId: number, url: string) => {
    try {
      console.log('🎬 Saving video URL:', { productId, url });
      
      await saveProductExtension(productId.toString(), { videoUrl: url });
      
      toast({
        title: "Vidéo sauvegardée",
        description: url ? 
          "Le lien YouTube a été sauvegardé avec succès. Il apparaîtra dans la section démonstrations de la page solaire si c'est un produit solaire." :
          "La vidéo a été supprimée avec succès.",
      });
      
      await refetchProducts();
      
      console.log('✅ Video URL saved successfully');
    } catch (error) {
      console.error('❌ Error saving video URL:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde de la vidéo.",
        variant: "destructive",
      });
    }
  };

  // Wrapper function to match ProductForm's expected onSubmit signature
  const handleProductFormSubmit = (product: any) => {
    if (selectedProduct) {
      handleSaveProductChanges(selectedProduct.id, product);
    }
  };

  const mapSortByValue = (value: string): 'date' | 'price' | 'title' => {
    switch (value) {
      case 'name':
        return 'title';
      case 'price':
        return 'price';
      case 'stock':
        return 'price';
      default:
        return 'title';
    }
  };

  const handleSortByChange = (value: 'date' | 'price' | 'title') => {
    switch (value) {
      case 'title':
        setSortBy('name');
        break;
      case 'price':
        setSortBy('price');
        break;
      case 'date':
        setSortBy('name');
        break;
      default:
        setSortBy('name');
    }
  };

  console.log('🎯 Admin ProductsManager - Products loaded:', {
    count: products.length,
    totalProducts,
    isLoading,
    searchQuery,
    yaBaBossCount,
    productsWithVideos: products.filter(p => p.videoUrl && p.videoUrl.trim() !== '').length
  });

  return (
    <AdminPageLayout>
      <AdminPageHeader title="Gestion des Produits" />

      <div className="container-cowema space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Gérez tous les produits importés de votre API et enrichissez-les avec des attributs supplémentaires.
            <br />
            <span className="text-sm text-orange-600">
              💡 Utilisez le switch "Statut" pour activer/désactiver l'affichage des produits sur le site
            </span>
            <br />
            <span className="text-sm text-blue-600">
              🔗 Utilisez la colonne "Lien" pour copier les liens produits à utiliser dans vos messages clients
            </span>
            <br />
            <span className="text-sm text-red-600">
              🎬 Ajoutez des vidéos YouTube pour qu'elles apparaissent dans la section "Démonstrations" de la page solaire
            </span>
          </p>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              {totalLoaded} produits chargés sur {totalProducts}
            </Badge>
            <Badge variant="secondary" className="bg-red-50 text-red-700">
              🎬 {products.filter(p => p.videoUrl && p.videoUrl.trim() !== '').length} avec vidéo
            </Badge>
          </div>
        </div>

        <ProductsStats 
          totalProducts={totalProducts} 
          selectedCount={selectedProducts.length} 
          yaBaBossCount={yaBaBossCount}
        />

        <div className="flex gap-4 mb-4 items-center">
          <div className="flex-1">
            <ProductsSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>

          {selectedProducts.length > 0 && (
            <div className="flex gap-2">
              <Badge variant="secondary">{selectedProducts.length} sélectionné(s)</Badge>
              <Button size="sm" variant="outline">Actions groupées</Button>
            </div>
          )}
        </div>

        <ProductsSorting
          sortBy={mapSortByValue(sortBy)}
          setSortBy={handleSortByChange}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          viewMode="list"
          setViewMode={() => {}}
        />

        {isLoading && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <span className="text-lg font-medium mb-2">Chargement des produits...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <span className="text-lg font-medium mb-2">Aucun produit trouvé</span>
            <span className="text-muted-foreground">
              {searchQuery ? 'Essayez de modifier votre recherche' : 'Les produits se chargent depuis l\'API...'}
            </span>
          </div>
        ) : (
          <>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={
                          products.length > 0 && 
                          products.every(product => selectedProducts.includes(product.id))
                        } 
                        onCheckedChange={handleSelectAllProducts}
                      />
                    </TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>YA BA BOSS</TableHead>
                    <TableHead>Vidéo Démo</TableHead>
                    <TableHead>Lien</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const productLink = `${window.location.origin}/product/${product.id}`;
                    const hasVideo = product.videoUrl && product.videoUrl.trim() !== '';
                    const isSolarProduct = product.category?.toLowerCase().includes('solaire') ||
                                          product.name?.toLowerCase().includes('solaire');
                    const isChanging = changingStatus.includes(product.id);
                    
                    return (
                      <TableRow key={product.id} className={product.isActive === false ? "opacity-60 bg-gray-50" : ""}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedProducts.includes(product.id)} 
                            onCheckedChange={() => handleSelectProduct(product.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="w-12 h-12 rounded overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <img 
                                src={product.images[0]} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                                No image
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium max-w-xs truncate" title={product.name}>
                          <div className="flex items-center gap-2">
                            {product.name}
                            {product.isActive === false && (
                              <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
                                Désactivé
                              </Badge>
                            )}
                            {hasVideo && isSolarProduct && (
                              <Badge className="bg-blue-500 text-white text-xs">
                                📱 DÉMO
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {product.promoPrice ? (
                            <>
                              <span className="text-red-500 font-medium">{product.promoPrice.toLocaleString()} FCFA</span>
                              <span className="text-gray-500 text-sm line-through ml-1">{product.price.toLocaleString()} FCFA</span>
                            </>
                          ) : (
                            <span>{product.price.toLocaleString()} FCFA</span>
                          )}
                        </TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={product.isYaBaBoss}
                              onCheckedChange={(checked) => handleYaBaBossChange(product.id, checked)}
                              disabled={isChanging}
                            />
                            {product.isYaBaBoss && (
                              <Badge className="bg-yellow-500">
                                <Star className="w-3 h-3 mr-1" /> YA BA BOSS
                              </Badge>
                            )}
                            {isChanging && (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <VideoInsert
                            productId={parseInt(product.id)}
                            currentUrl={product.videoUrl || ''}
                            onSave={handleSaveVideoUrl}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(productLink)}
                            className="flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Copier
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={product.isActive !== false}
                              onCheckedChange={(checked) => handleStatusChange(product.id, checked)}
                              disabled={isChanging}
                            />
                            <span className="text-sm">
                              {product.isActive !== false ? 'Actif' : 'Inactif'}
                            </span>
                            {isChanging && (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditProduct(product.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {hasMore && (
              <AdminLoadMoreButton 
                onLoadMore={loadMore}
                isLoading={isLoading}
                hasMore={hasMore}
                totalLoaded={totalLoaded}
                totalProducts={totalProducts}
              />
            )}
          </>
        )}

        {selectedProduct && (
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="max-w-2xl">
              <ProductForm
                product={selectedProduct}
                onSubmit={handleProductFormSubmit}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminPageLayout>
  );
};

export default ProductsManager;
