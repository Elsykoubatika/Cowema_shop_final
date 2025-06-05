
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  siteName?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  structuredData?: any;
  alternateLanguages?: { lang: string; url: string }[];
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Cowema - Best Sellers',
  description = 'La marketplace africaine pour des achats en ligne sécurisés et des livraisons rapides dans toute l\'Afrique.',
  keywords = ['marketplace', 'afrique', 'congo', 'e-commerce', 'cowema'],
  image = 'https://lovable.dev/opengraph-image-p98pqg.png',
  url = window.location.href,
  type = 'website',
  siteName = 'Cowema',
  canonicalUrl,
  noIndex = false,
  structuredData,
  alternateLanguages = []
}) => {
  const fullTitle = title === 'Cowema - Best Sellers' ? title : `${title} | Cowema`;
  const cleanUrl = canonicalUrl || url.split('?')[0].split('#')[0];

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content="Cowema" />
      
      {/* Robots Meta */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={cleanUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={cleanUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="fr_FR" />
      
      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@cowema" />
      <meta name="twitter:creator" content="@cowema" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="fr" />
      <meta name="geo.region" content="CG" />
      <meta name="geo.placename" content="République du Congo" />
      <meta name="geo.position" content="-4.2634;15.2429" />
      <meta name="ICBM" content="-4.2634, 15.2429" />
      
      {/* E-commerce specific meta */}
      {type === 'product' && (
        <>
          <meta property="product:brand" content="Cowema" />
          <meta property="product:availability" content="in stock" />
          <meta property="product:condition" content="new" />
          <meta property="product:price:currency" content="XAF" />
        </>
      )}
      
      {/* Alternate languages */}
      {alternateLanguages.map(alt => (
        <link key={alt.lang} rel="alternate" hrefLang={alt.lang} href={alt.url} />
      ))}
      
      {/* Performance hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://cdn.jsdelivr.net" />
      <link rel="dns-prefetch" href="https://lovable.dev" />
      <link rel="dns-prefetch" href="https://supabase.co" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
