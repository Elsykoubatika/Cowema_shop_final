
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Product } from '@/types/product';

interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  structuredData?: any;
  type: 'website' | 'article' | 'product';
  image?: string;
}

export const useSEOMetadata = (data?: {
  product?: Product;
  category?: string;
  query?: string;
  page?: number;
}): SEOMetadata => {
  const location = useLocation();
  const currentUrl = `${window.location.origin}${location.pathname}`;

  return useMemo(() => {
    const { product, category, query, page = 1 } = data || {};

    // Page d'accueil
    if (location.pathname === '/') {
      return {
        title: 'Cowema - Marketplace Africaine | Achats en ligne sécurisés',
        description: 'Découvrez la première marketplace africaine avec livraison rapide au Congo, RDC et dans toute l\'Afrique centrale. Électronique, mode, maison et plus.',
        keywords: ['marketplace afrique', 'e-commerce congo', 'achats en ligne afrique', 'livraison rapide congo', 'cowema'],
        canonicalUrl: currentUrl,
        type: 'website',
        structuredData: {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Cowema",
          "url": "https://cowema.com",
          "logo": "https://lovable.dev/opengraph-image-p98pqg.png",
          "description": "La marketplace africaine pour des achats en ligne sécurisés",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "CG",
            "addressRegion": "Brazzaville"
          },
          "sameAs": [
            "https://facebook.com/cowema",
            "https://instagram.com/cowema"
          ]
        }
      };
    }

    // Page produit
    if (product && location.pathname.includes('/product/')) {
      const price = product.promoPrice || product.price || 0;
      return {
        title: `${product.title || product.name} - Achat en ligne | Cowema`,
        description: `Achetez ${product.title || product.name} sur Cowema. ${product.description?.slice(0, 120) || 'Livraison rapide en Afrique centrale. Prix compétitifs garantis.'} FCFA`,
        keywords: [
          product.title?.toLowerCase() || '',
          product.category || '',
          'achat en ligne',
          'livraison congo',
          'cowema'
        ].filter(Boolean),
        canonicalUrl: currentUrl,
        type: 'product',
        image: product.images?.[0],
        structuredData: {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.title || product.name,
          "description": product.description,
          "image": product.images || [],
          "brand": {
            "@type": "Brand",
            "name": "Cowema"
          },
          "offers": {
            "@type": "Offer",
            "price": price,
            "priceCurrency": "XAF",
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
              "@type": "Organization",
              "name": "Cowema"
            }
          },
          "aggregateRating": product.rating ? {
            "@type": "AggregateRating",
            "ratingValue": product.rating,
            "bestRating": 5,
            "worstRating": 1,
            "ratingCount": product.sold || 1
          } : undefined
        }
      };
    }

    // Page produits/recherche
    if (location.pathname === '/products' || location.pathname === '/search') {
      const pageTitle = query 
        ? `Recherche: "${query}"${page > 1 ? ` - Page ${page}` : ''} | Cowema`
        : category 
        ? `${category}${page > 1 ? ` - Page ${page}` : ''} | Cowema`
        : `Tous nos produits${page > 1 ? ` - Page ${page}` : ''} | Cowema`;

      const pageDescription = query
        ? `Résultats de recherche pour "${query}" sur Cowema. Découvrez notre sélection de produits avec livraison rapide en Afrique.`
        : category
        ? `Découvrez notre collection ${category} sur Cowema. Livraison rapide au Congo et dans toute l'Afrique centrale.`
        : 'Explorez tous nos produits sur Cowema, la marketplace africaine de référence. Électronique, mode, maison et plus.';

      return {
        title: pageTitle,
        description: pageDescription,
        keywords: [
          query || category || 'produits',
          'cowema',
          'marketplace afrique',
          'achats en ligne congo'
        ].filter(Boolean),
        canonicalUrl: page > 1 ? currentUrl : currentUrl.split('?')[0],
        type: 'website'
      };
    }

    // Page Ya Ba Boss
    if (location.pathname.includes('/ya-ba-boss')) {
      return {
        title: 'Ya Ba Boss - Programme VIP Cowema | Avantages Exclusifs',
        description: 'Rejoignez Ya Ba Boss, le programme VIP de Cowema. Bénéficiez de remises exclusives, livraison prioritaire et produits en avant-première.',
        keywords: ['ya ba boss', 'programme vip', 'avantages exclusifs', 'cowema premium'],
        canonicalUrl: currentUrl,
        type: 'website'
      };
    }

    // Page influenceur
    if (location.pathname.includes('/influencer')) {
      return {
        title: 'Programme Influenceurs Cowema | Gagnez avec nous',
        description: 'Devenez partenaire influenceur Cowema. Commissions attractives, outils marketing et support dédié pour développer vos revenus.',
        keywords: ['programme influenceur', 'partenariat cowema', 'commission affiliation', 'influenceur afrique'],
        canonicalUrl: currentUrl,
        type: 'website'
      };
    }

    // Page par défaut
    return {
      title: 'Cowema - Marketplace Africaine',
      description: 'La marketplace africaine pour des achats en ligne sécurisés et des livraisons rapides dans toute l\'Afrique.',
      keywords: ['marketplace', 'afrique', 'congo', 'e-commerce', 'cowema'],
      canonicalUrl: currentUrl,
      type: 'website'
    };
  }, [location.pathname, data]);
};
