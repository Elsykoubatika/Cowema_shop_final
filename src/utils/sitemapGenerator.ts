
export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (entries: SitemapEntry[]): string => {
  const baseUrl = window.location.origin;
  
  const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  const footer = `</urlset>`;

  const urls = entries.map(entry => {
    const url = entry.url.startsWith('http') ? entry.url : `${baseUrl}${entry.url}`;
    return `  <url>
    <loc>${url}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    ${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ''}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
  </url>`;
  }).join('\n');

  return `${header}\n${urls}\n${footer}`;
};

export const getStaticPages = (): SitemapEntry[] => {
  const now = new Date().toISOString().split('T')[0];
  
  return [
    {
      url: '/',
      lastmod: now,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      url: '/products',
      lastmod: now,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: '/ya-ba-boss',
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: '/influencer',
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      url: '/all-deals',
      lastmod: now,
      changefreq: 'daily',
      priority: 0.8
    }
  ];
};

export const getProductPages = (products: any[]): SitemapEntry[] => {
  return products.map(product => ({
    url: `/product/${product.id}`,
    lastmod: product.updated_at || new Date().toISOString().split('T')[0],
    changefreq: 'weekly' as const,
    priority: 0.6
  }));
};

export const getCategoryPages = (categories: string[]): SitemapEntry[] => {
  return categories.map(category => ({
    url: `/products?category=${encodeURIComponent(category)}`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily' as const,
    priority: 0.7
  }));
};
