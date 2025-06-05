
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbStructuredData } from './StructuredData';

interface BreadcrumbItem {
  name: string;
  url: string;
  current?: boolean;
}

interface SEOBreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const SEOBreadcrumb: React.FC<SEOBreadcrumbProps> = ({ items, className = '' }) => {
  const location = useLocation();

  // Génération automatique des breadcrumbs si non fournis
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Accueil', url: '/' }
    ];

    let currentPath = '';
    pathnames.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathnames.length - 1;
      
      let name = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Personnalisation des noms
      switch (segment) {
        case 'products':
          name = 'Produits';
          break;
        case 'product':
          name = 'Produit';
          break;
        case 'ya-ba-boss':
          name = 'Ya Ba Boss';
          break;
        case 'influencer':
          name = 'Influenceurs';
          break;
        case 'account':
          name = 'Mon Compte';
          break;
        case 'search':
          name = 'Recherche';
          break;
        case 'admin':
          name = 'Administration';
          break;
      }

      breadcrumbs.push({
        name,
        url: currentPath,
        current: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <nav className={`flex items-center space-x-1 text-sm text-gray-500 mb-4 ${className}`} aria-label="Breadcrumb">
        <ol className="flex items-center space-x-1">
          {breadcrumbItems.map((item, index) => (
            <li key={item.url} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
              )}
              {item.current ? (
                <span className="text-gray-900 font-medium" aria-current="page">
                  {index === 0 && <Home className="h-4 w-4 inline mr-1" />}
                  {item.name}
                </span>
              ) : (
                <Link 
                  to={item.url} 
                  className="hover:text-primary transition-colors"
                  title={`Aller à ${item.name}`}
                >
                  {index === 0 && <Home className="h-4 w-4 inline mr-1" />}
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default SEOBreadcrumb;
