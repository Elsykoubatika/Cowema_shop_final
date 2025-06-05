
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface LoadMoreButtonProps {
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
  totalLoaded: number;
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  onLoadMore,
  isLoading,
  hasMore,
  totalLoaded,
  totalProducts,
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (!hasMore && totalLoaded > 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-2">
          ✨ Vous avez vu tous les produits disponibles
        </div>
        <div className="text-sm text-gray-400 mb-4">
          {totalLoaded} produits sur {totalProducts} affichés
        </div>
        
        {/* Page Navigation */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Première
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className="w-10 h-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              Dernière
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (!hasMore) {
    return null;
  }

  return (
    <div className="text-center py-8">
      <Button
        onClick={onLoadMore}
        disabled={isLoading}
        size="lg"
        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Chargement...
          </>
        ) : (
          <>
            <ChevronDown className="w-5 h-5 mr-2" />
            Afficher plus de produits
          </>
        )}
      </Button>
      
      {totalLoaded > 0 && (
        <div className="mt-3 text-sm text-gray-500">
          {totalLoaded} produits affichés sur {totalProducts} au total
        </div>
      )}
      
      {/* Page Navigation */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="text-sm text-gray-600 mr-2">
            Page {currentPage} sur {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 3) {
                pageNum = i + 1;
              } else if (currentPage <= 2) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 1) {
                pageNum = totalPages - 2 + i;
              } else {
                pageNum = currentPage - 1 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  className="w-8 h-8 text-xs"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default LoadMoreButton;
