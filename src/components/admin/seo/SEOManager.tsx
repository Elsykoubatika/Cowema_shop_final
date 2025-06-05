
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Download, Globe, Search, TrendingUp, FileText } from 'lucide-react';
import { useSitemap } from '@/hooks/useSitemap';
import { useHybridProducts } from '@/hooks/useHybridProducts';
import { useApiFilters } from '@/hooks/useApiFilters';

const SEOManager: React.FC = () => {
  const { sitemap, loading, generateFullSitemap, downloadSitemap } = useSitemap();
  const { products } = useHybridProducts({});
  const { categoriesData } = useApiFilters();
  const [seoSettings, setSeoSettings] = useState({
    siteTitle: 'Cowema - Marketplace Africaine',
    siteDescription: 'La marketplace africaine pour des achats en ligne sécurisés et des livraisons rapides dans toute l\'Afrique.',
    defaultKeywords: 'marketplace, afrique, congo, e-commerce, cowema',
    robotsTxt: `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /account/
Disallow: /api/

Sitemap: ${window.location.origin}/sitemap.xml`
  });

  const handleGenerateSitemap = async () => {
    const categories = categoriesData.map(cat => cat.name);
    await generateFullSitemap(products, categories);
  };

  const seoStats = {
    totalPages: 5 + products.length + categoriesData.length,
    productPages: products.length,
    categoryPages: categoriesData.length,
    staticPages: 5
  };

  return (
    <div className="space-y-6">
      {/* Stats SEO */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{seoStats.totalPages}</p>
                <p className="text-sm text-gray-500">Pages totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Search className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{seoStats.productPages}</p>
                <p className="text-sm text-gray-500">Pages produits</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{seoStats.categoryPages}</p>
                <p className="text-sm text-gray-500">Pages catégories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{seoStats.staticPages}</p>
                <p className="text-sm text-gray-500">Pages statiques</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Paramètres SEO globaux */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres SEO Globaux</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="site-title">Titre du site par défaut</Label>
            <Input
              id="site-title"
              value={seoSettings.siteTitle}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, siteTitle: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="site-description">Description par défaut</Label>
            <Textarea
              id="site-description"
              value={seoSettings.siteDescription}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="default-keywords">Mots-clés par défaut</Label>
            <Input
              id="default-keywords"
              value={seoSettings.defaultKeywords}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, defaultKeywords: e.target.value }))}
              placeholder="Séparez par des virgules"
            />
          </div>
        </CardContent>
      </Card>

      {/* Génération Sitemap */}
      <Card>
        <CardHeader>
          <CardTitle>Gestion du Sitemap</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sitemap XML</p>
              <p className="text-sm text-gray-500">
                Génère automatiquement le sitemap avec tous les produits et catégories
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleGenerateSitemap}
                disabled={loading}
                variant="outline"
              >
                {loading ? 'Génération...' : 'Générer Sitemap'}
              </Button>
              {sitemap && (
                <Button onClick={downloadSitemap} variant="default">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              )}
            </div>
          </div>

          {sitemap && (
            <div className="mt-4">
              <Badge variant="secondary" className="mb-2">
                Sitemap généré - {sitemap.split('<url>').length - 1} URLs
              </Badge>
              <div className="bg-gray-50 p-3 rounded text-xs font-mono max-h-40 overflow-y-auto">
                {sitemap.substring(0, 500)}...
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Robots.txt */}
      <Card>
        <CardHeader>
          <CardTitle>Fichier Robots.txt</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="robots-txt">Contenu du fichier robots.txt</Label>
          <Textarea
            id="robots-txt"
            value={seoSettings.robotsTxt}
            onChange={(e) => setSeoSettings(prev => ({ ...prev, robotsTxt: e.target.value }))}
            rows={8}
            className="font-mono text-sm mt-2"
          />
          <p className="text-xs text-gray-500 mt-2">
            Ce fichier indique aux moteurs de recherche quelles pages indexer
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEOManager;
