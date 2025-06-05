
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Search, 
  Filter, 
  Package,
  Star,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLoadMoreProducts } from '@/hooks/useLoadMoreProducts';
import { Product } from '@/types/product';
import { Alert, AlertDescription } from "@/components/ui/alert";
import CatalogStats from './catalog/CatalogStats';
import ProductCatalogCard from './catalog/ProductCatalogCard';

interface ProductCatalogProps {
  referralCode: string;
  baseReferralLink: string;
  copyToClipboard: (text: string, label: string) => void;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({
  referralCode,
  baseReferralLink,
  copyToClipboard
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTab, setSelectedTab] = useState('all');

  // Configuration des filtres pour l'API
  const apiFilters = useMemo(() => {
    const filters: any = {
      per_page: 12, // 12 produits par page
    };

    if (searchTerm.trim()) {
      filters.search = searchTerm.trim();
    }

    // Mapping des catégories si nécessaire
    if (selectedCategory !== 'all') {
      filters.category = selectedCategory;
    }

    // Tri selon l'onglet sélectionné
    switch (selectedTab) {
      case 'price_asc':
        filters.sort = 'price';
        filters.direction = 'asc';
        break;
      case 'price_desc':
        filters.sort = 'price';
        filters.direction = 'desc';
        break;
      case 'recent':
        filters.sort = 'date';
        filters.direction = 'desc';
        break;
      default:
        filters.sort = 'date';
        filters.direction = 'desc';
        break;
    }

    return filters;
  }, [searchTerm, selectedCategory, selectedTab]);

  // Utilisation du hook de pagination
  const {
    products,
    isLoading,
    error,
    hasMore,
    loadMore,
    goToPage,
    currentPage,
    totalPages,
    totalLoaded,
    totalProducts,
    stats
  } = useLoadMoreProducts(apiFilters);

  // Filtrage local pour les onglets spéciaux
  const filteredProducts = useMemo(() => {
    let filtered = products;

    switch (selectedTab) {
      case 'yababoss':
        filtered = products.filter(product => product.isYaBaBoss);
        break;
      case 'flash':
        filtered = products.filter(product => product.isFlashOffer);
        break;
      case 'promo':
        filtered = products.filter(product => 
          product.promoPrice && product.promoPrice < product.price
        );
        break;
      case 'available':
        filtered = products.filter(product => (product.stock || 0) > 0);
        break;
      case 'low_stock':
        filtered = products.filter(product => 
          (product.stock || 0) <= 5 && (product.stock || 0) > 0
        );
        break;
      default:
        // 'all' et autres onglets - pas de filtre local
        break;
    }

    return filtered;
  }, [products, selectedTab]);

  // Extraire les catégories uniques des produits chargés
  const categories = useMemo(() => {
    const uniqueCategories = ['all', ...new Set(
      products
        .map(p => p.category)
        .filter(Boolean)
    )];
    return uniqueCategories;
  }, [products]);

  // Conversion des produits Product vers ProductCache pour compatibilité
  const convertedProducts = useMemo(() => {
    return filteredProducts.map(product => ({
      id: product.id,
      name: product.name || '',
      price: product.price || 0,
      promoPrice: product.promoPrice || undefined,
      stock: product.stock || 0,
      category: product.category || '',
      images: product.images || [],
      isYaBaBoss: product.isYaBaBoss || false,
      isFlashOffer: product.isFlashOffer || false,
      city: product.city || '',
      description: product.description || '',
      keywords: product.keywords || [],
      supplierName: product.supplierName || '',
      createdAt: new Date().toISOString(),
      externalApiId: product.externalApiId || '',
      lastSync: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: product.isActive || true,
      metadata: {}
    }));
  }, [filteredProducts]);

  const generateProductLink = (productId: string) => {
    const url = new URL(baseReferralLink);
    url.searchParams.set('product', productId);
    url.searchParams.set('ref', referralCode);
    return url.toString();
  };

  const handleCopyProductLink = (product: any) => {
    const link = generateProductLink(product.id);
    copyToClipboard(link, `Lien de parrainage pour ${product.name}`);
    
    toast({
      title: "Lien copié !",
      description: `Le lien de parrainage pour "${product.name}" a été copié dans le presse-papiers.`,
    });
  };

  const handleShareProduct = (product: any) => {
    const link = generateProductLink(product.id);
    const finalPrice = product.promoPrice || product.price;
    const shareText = `🔥 Découvrez ${product.name} à ${finalPrice.toLocaleString()} FCFA ! 
    
✨ Commandez maintenant via mon lien personnalisé et bénéficiez de mon accompagnement personnalisé !
    
👉 ${link}

#Promo #${product.category || 'Shopping'} #${referralCode}`;
    
    if (navigator.share && navigator.canShare) {
      navigator.share({
        title: `🔥 ${product.name}`,
        text: shareText,
        url: link,
      }).then(() => {
        toast({
          title: "Partagé avec succès !",
          description: `Le produit "${product.name}" a été partagé.`,
        });
      }).catch(() => {
        // Fallback si le partage échoue
        copyToClipboard(shareText, 'Message de partage');
        toast({
          title: "Message copié !",
          description: "Le message de partage a été copié. Vous pouvez le coller dans vos réseaux sociaux.",
        });
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas Web Share API
      copyToClipboard(shareText, 'Message de partage');
      toast({
        title: "Message de partage copié !",
        description: "Collez ce message sur vos réseaux sociaux pour promouvoir ce produit.",
      });
    }
  };

  const handleRefresh = () => {
    // Déclencher un rechargement des données
    loadMore();
    toast({
      title: "Actualisation",
      description: "Synchronisation des produits en cours...",
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedTab('all');
  };

  // Pagination avec ellipsis
  const renderPaginationItems = () => {
    const items = [];
    const showEllipsis = totalPages > 7;
    
    if (!showEllipsis) {
      // Afficher toutes les pages si moins de 7
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => goToPage(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Logique d'ellipsis pour beaucoup de pages
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      if (startPage > 1) {
        items.push(
          <PaginationItem key={1}>
            <PaginationLink onClick={() => goToPage(1)} className="cursor-pointer">
              1
            </PaginationLink>
          </PaginationItem>
        );
        if (startPage > 2) {
          items.push(
            <PaginationItem key="ellipsis1">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => goToPage(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          items.push(
            <PaginationItem key="ellipsis2">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink onClick={() => goToPage(totalPages)} className="cursor-pointer">
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  if (isLoading && products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Catalogue de Produits
          </CardTitle>
          <CardDescription>
            Chargement des produits disponibles...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">
              Synchronisation avec la base de données...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Catalogue de Produits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Erreur lors du chargement des produits. 
              <Button 
                variant="link" 
                onClick={handleRefresh}
                className="p-0 h-auto ml-1"
              >
                Réessayer
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Catalogue de Produits
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </CardTitle>
        <CardDescription>
          Sélectionnez des produits à promouvoir et générez vos liens personnalisés
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Statistiques du catalogue */}
        {convertedProducts.length > 0 && (
          <CatalogStats products={convertedProducts} />
        )}

        {/* Filtres et recherche */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Toutes catégories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Compteur de résultats */}
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span>
              <strong>{filteredProducts.length}</strong> produit(s) affiché(s)
              {totalProducts > 0 && ` sur ${totalProducts.toLocaleString()} total`}
            </span>
            <span className="text-muted-foreground">
              Page {currentPage} sur {totalPages}
            </span>
          </div>
          {stats.coveragePercentage < 100 && (
            <div className="mt-2">
              <div className="text-xs text-muted-foreground mb-1">
                Progression du chargement: {stats.coveragePercentage.toFixed(1)}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-blue-600 h-1 rounded-full transition-all" 
                  style={{ width: `${stats.coveragePercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Onglets de filtrage */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="mb-6 grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="yababoss" className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              YaBaBoss
            </TabsTrigger>
            <TabsTrigger value="flash">Flash</TabsTrigger>
            <TabsTrigger value="promo">Promo</TabsTrigger>
            <TabsTrigger value="available">Disponibles</TabsTrigger>
            <TabsTrigger value="low_stock">Stock limité</TabsTrigger>
            <TabsTrigger value="price_asc">Prix ↑</TabsTrigger>
            <TabsTrigger value="price_desc">Prix ↓</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab}>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">
                  Aucun produit trouvé avec ces critères
                </p>
                {(searchTerm || selectedCategory !== 'all') && (
                  <Button variant="outline" onClick={resetFilters}>
                    Réinitialiser les filtres
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                  {convertedProducts.map(product => (
                    <ProductCatalogCard
                      key={product.id}
                      product={product}
                      onCopyLink={handleCopyProductLink}
                      onShare={handleShareProduct}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
                            className={`cursor-pointer ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                          />
                        </PaginationItem>
                        
                        {renderPaginationItems()}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
                            className={`cursor-pointer ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}

                {/* Bouton Charger plus (si nécessaire) */}
                {hasMore && filteredProducts.length < totalProducts && (
                  <div className="text-center mt-6">
                    <Button 
                      onClick={loadMore} 
                      disabled={isLoading}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Chargement...
                        </>
                      ) : (
                        <>
                          <Package className="h-4 w-4" />
                          Charger plus de produits
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProductCatalog;
