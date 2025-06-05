
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import AdminLoadMoreButton from '@/components/admin/products/AdminLoadMoreButton';
import YaBaBosserStats from '@/components/admin/yababosser/YaBaBosserStats';
import YaBaBosserPagination from '@/components/admin/yababosser/YaBaBosserPagination';
import VideoInsert from '@/components/admin/yababosser/VideoInsert';
import { useAdminYaBaBosserLoader } from '@/hooks/admin/useAdminYaBaBosserLoader';
import { useToast } from '@/hooks/use-toast';
import { saveProductExtension } from '@/services/apiService';
import { 
  Pencil, 
  Video, 
  Eye, 
  EyeOff, 
  Star, 
  Search,
  ArrowUpDown,
  Loader2,
  Filter,
  RefreshCw,
  ExternalLink,
  Trash2,
  CheckSquare,
  Square
} from 'lucide-react';

const YaBaBosser = () => {
  const {
    products,
    allProducts,
    isLoading,
    hasMore,
    loadMore,
    goToPage,
    currentPage,
    totalPages,
    totalLoaded,
    totalProducts,
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
    yaBaBossCount,
    withVideoCount,
    activeCount,
    selectedCount,
    totalProductsCount,
    filters,
    setFilters,
    availableCategories,
    refreshData
  } = useAdminYaBaBosserLoader();

  const { toast } = useToast();

  const handleSaveVideoUrl = async (productId: number, url: string) => {
    try {
      await saveProductExtension(productId.toString(), { videoUrl: url });
      await refreshData();
    } catch (error) {
      console.error('Error saving video URL:', error);
      throw error;
    }
  };

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

  const handleBulkYaBaBossToggle = async (isYaBaBoss: boolean) => {
    if (selectedProducts.length === 0) return;
    
    console.log(`🔄 Starting bulk Ya Ba Boss toggle for ${selectedProducts.length} products to ${isYaBaBoss}`);
    
    try {
      for (const productId of selectedProducts) {
        try {
          await handleYaBaBossToggle(productId, isYaBaBoss);
          console.log(`✅ Successfully toggled Ya Ba Boss for product ${productId}`);
        } catch (error) {
          console.error(`❌ Error toggling Ya Ba Boss for product ${productId}:`, error);
        }
      }
      
      console.log('✅ Bulk Ya Ba Boss toggle completed');
      await refreshData();
      
    } catch (error) {
      console.error('❌ Error in bulk Ya Ba Boss toggle:', error);
    }
  };

  const handleBulkActiveToggle = async (isActive: boolean) => {
    if (selectedProducts.length === 0) return;
    
    console.log(`🔄 Starting bulk active toggle for ${selectedProducts.length} products to ${isActive}`);
    
    try {
      for (const productId of selectedProducts) {
        try {
          await handleToggleProductActive(productId, isActive);
          console.log(`✅ Successfully toggled active status for product ${productId}`);
        } catch (error) {
          console.error(`❌ Error toggling active status for product ${productId}:`, error);
        }
      }
      
      console.log('✅ Bulk active toggle completed');
      await refreshData();
      
    } catch (error) {
      console.error('❌ Error in bulk active toggle:', error);
    }
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value as 'date' | 'title' | 'price');
  };

  const handleActiveTabChange = (value: string) => {
    setActiveTab(value as 'active' | 'inactive' | 'all');
  };

  const handleRefreshData = async () => {
    try {
      await refreshData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  // Calculer le nombre de produits YaBaBoss sélectionnés
  const selectedYaBaBossCount = selectedProducts.filter(productId => {
    const product = allProducts.find(p => p.id === productId);
    return product?.isYaBaBoss;
  }).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestionnaire Ya Ba Boss</h1>
          <p className="text-muted-foreground">
            Gérez les produits Ya Ba Boss et ajoutez des vidéos pour améliorer les ventes
          </p>
        </div>
        <Button 
          onClick={handleRefreshData}
          variant="outline"
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Stats - Utilise le total correct de tous les produits */}
      <YaBaBosserStats
        total={totalProductsCount}
        yaBaBoss={yaBaBossCount}
        withVideo={withVideoCount}
        active={activeCount}
        selected={selectedCount}
      />

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Recherche et Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* Search and Sort Row */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher des produits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={sortBy} onValueChange={handleSortByChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="title">Nom</SelectItem>
                  <SelectItem value="price">Prix</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="h-4 w-4" />
                {sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
              </Button>
            </div>

            {/* Advanced Filters Row */}
            <div className="flex flex-wrap items-center gap-4 bg-muted/40 p-3 rounded-md">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium">Filtres:</span>
              </div>

              {/* Category Filter */}
              <div className="flex-1 min-w-[200px]">
                <Select
                  value={filters.category}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, category: value === 'all' ? '' : value }))}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ya Ba Boss Filter */}
              <div className="flex items-center gap-2">
                <Switch
                  id="yababoss-filter"
                  checked={filters.yaBaBossOnly}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, yaBaBossOnly: checked }))}
                />
                <label htmlFor="yababoss-filter" className="text-sm flex items-center cursor-pointer">
                  <Star size={14} fill={filters.yaBaBossOnly ? "currentColor" : "none"} className="mr-1 text-yellow-500" />
                  Ya Ba Boss
                </label>
              </div>

              {/* Video Filter */}
              <div className="flex items-center gap-2">
                <Switch
                  id="video-filter"
                  checked={filters.withVideoOnly}
                  onCheckedChange={(checked) => setFilters(prev => ({ 
                    ...prev, 
                    withVideoOnly: checked,
                    withoutVideoOnly: checked ? false : prev.withoutVideoOnly
                  }))}
                />
                <label htmlFor="video-filter" className="text-sm flex items-center cursor-pointer">
                  <Video size={14} className="mr-1 text-blue-500" />
                  Avec vidéo
                </label>
              </div>

              {/* No Video Filter */}
              <div className="flex items-center gap-2">
                <Switch
                  id="no-video-filter"
                  checked={filters.withoutVideoOnly}
                  onCheckedChange={(checked) => setFilters(prev => ({ 
                    ...prev, 
                    withoutVideoOnly: checked,
                    withVideoOnly: checked ? false : prev.withVideoOnly
                  }))}
                />
                <label htmlFor="no-video-filter" className="text-sm flex items-center cursor-pointer">
                  <Video size={14} className="mr-1 text-gray-500" />
                  Sans vidéo
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Bulk Actions */}
      {selectedCount > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10">
                  {selectedCount} sélectionné(s)
                </Badge>
                {selectedYaBaBossCount > 0 && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {selectedYaBaBossCount} Ya Ba Boss
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  onClick={handleSelectAllYaBaBoss}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <CheckSquare size={16} className="text-yellow-500" />
                  Sélectionner tous Ya Ba Boss
                </Button>
                
                <Button 
                  size="sm" 
                  onClick={() => handleBulkYaBaBossToggle(true)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  disabled={changingStatus.length > 0}
                >
                  <Star size={16} fill="currentColor" className="mr-1" /> 
                  Ajouter Ya Ba Boss
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleBulkRemoveYaBaBoss}
                  disabled={changingStatus.length > 0 || selectedYaBaBossCount === 0}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} className="mr-1" /> 
                  Retirer Ya Ba Boss ({selectedYaBaBossCount})
                </Button>
                
                <Button 
                  size="sm" 
                  variant="default" 
                  onClick={() => handleBulkActiveToggle(true)}
                  disabled={changingStatus.length > 0}
                >
                  <Eye size={16} className="mr-1" /> 
                  Activer
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleBulkActiveToggle(false)}
                  disabled={changingStatus.length > 0}
                >
                  <EyeOff size={16} className="mr-1" /> 
                  Désactiver
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Table */}
      <Tabs value={activeTab} onValueChange={handleActiveTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="active">Actifs ({activeCount})</TabsTrigger>
          <TabsTrigger value="inactive">Inactifs ({totalProductsCount - activeCount})</TabsTrigger>
          <TabsTrigger value="all">Tous ({totalProductsCount})</TabsTrigger>
        </TabsList>

        {['active', 'inactive', 'all'].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <Card>
              <CardContent className="p-0">
                {isLoading && products.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                    <span className="text-lg font-medium mb-2">Chargement des produits...</span>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={products.length > 0 && products.every(p => selectedProducts.includes(p.id))}
                            onCheckedChange={handleSelectAllProducts}
                          />
                        </TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Ya Ba Boss</TableHead>
                        <TableHead>Vidéo</TableHead>
                        <TableHead>Lien</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => {
                        const productLink = `${window.location.origin}/product/${product.id}`;
                        
                        return (
                          <TableRow key={product.id} className={product.isActive === false ? "opacity-60 bg-gray-50" : ""}>
                            <TableCell>
                              <Checkbox
                                checked={selectedProducts.includes(product.id)}
                                onCheckedChange={() => handleSelectProduct(product.id)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="w-16 h-16 rounded overflow-hidden">
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
                            <TableCell>
                              <div>
                                <div className="font-medium max-w-xs truncate" title={product.name}>
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-500">{product.category}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                {product.promoPrice ? (
                                  <>
                                    <div className="font-medium text-red-500">{product.promoPrice.toLocaleString()} FCFA</div>
                                    <div className="text-sm text-gray-500 line-through">{product.price.toLocaleString()} FCFA</div>
                                  </>
                                ) : (
                                  <div className="font-medium">{product.price.toLocaleString()} FCFA</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                                {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant={product.isYaBaBoss ? "default" : "outline"}
                                size="sm"
                                onClick={async () => {
                                  try {
                                    await handleYaBaBossToggle(product.id, !product.isYaBaBoss);
                                  } catch (error) {
                                    console.error('Error toggling Ya Ba Boss:', error);
                                  }
                                }}
                                disabled={changingStatus.includes(product.id)}
                                className={`flex items-center gap-1 ${product.isYaBaBoss ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : ''}`}
                              >
                                {changingStatus.includes(product.id) ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Star className={`h-3 w-3 ${product.isYaBaBoss ? 'fill-current' : ''}`} />
                                )}
                                {product.isYaBaBoss ? 'Ya Ba Boss' : 'Standard'}
                              </Button>
                            </TableCell>
                            <TableCell>
                              <VideoInsert
                                productId={parseInt(product.externalApiId || product.id)}
                                currentUrl={product.videoUrl || ''}
                                onSave={handleSaveVideoUrl}
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(productLink)}
                                className="flex items-center gap-1 text-xs"
                                title="Copier le lien du produit"
                              >
                                <ExternalLink size={12} />
                                Copier
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Badge variant={product.isActive !== false ? "default" : "secondary"}>
                                {product.isActive !== false ? 'Actif' : 'Inactif'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditProduct(product.id)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Switch 
                                  checked={product.isActive !== false}
                                  disabled={changingStatus.includes(product.id)}
                                  onCheckedChange={(checked) => handleToggleProductActive(product.id, checked)}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Load More or Pagination */}
            {totalPages > 1 ? (
              <YaBaBosserPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                totalItems={totalProducts}
                itemsPerPage={20}
              />
            ) : hasMore && (
              <AdminLoadMoreButton
                onLoadMore={loadMore}
                isLoading={isLoading}
                hasMore={hasMore}
                totalLoaded={totalLoaded}
                totalProducts={totalProducts}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default YaBaBosser;
