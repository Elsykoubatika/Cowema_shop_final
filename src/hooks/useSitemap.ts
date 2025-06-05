
import { useState, useEffect } from 'react';
import { generateSitemap, getStaticPages, getProductPages, getCategoryPages, SitemapEntry } from '@/utils/sitemapGenerator';

export const useSitemap = () => {
  const [sitemap, setSitemap] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateFullSitemap = async (products: any[], categories: string[]) => {
    setLoading(true);
    try {
      const staticPages = getStaticPages();
      const productPages = getProductPages(products);
      const categoryPages = getCategoryPages(categories);
      
      const allEntries: SitemapEntry[] = [
        ...staticPages,
        ...productPages,
        ...categoryPages
      ];

      const sitemapXml = generateSitemap(allEntries);
      setSitemap(sitemapXml);
      
      // Optionnel : sauvegarder en localStorage pour debug
      localStorage.setItem('cowema_sitemap', sitemapXml);
      
      return sitemapXml;
    } catch (error) {
      console.error('Erreur génération sitemap:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadSitemap = () => {
    if (!sitemap) return;
    
    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    sitemap,
    loading,
    generateFullSitemap,
    downloadSitemap
  };
};
