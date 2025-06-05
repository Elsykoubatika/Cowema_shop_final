
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronDown } from 'lucide-react';

interface AdminLoadMoreButtonProps {
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
  totalLoaded: number;
  totalProducts: number;
}

const AdminLoadMoreButton: React.FC<AdminLoadMoreButtonProps> = ({
  onLoadMore,
  isLoading,
  hasMore,
  totalLoaded,
  totalProducts
}) => {
  if (!hasMore && totalLoaded > 0) {
    return (
      <div className="text-center py-6">
        <div className="text-gray-500 mb-2">
          ✨ Tous les produits ont été chargés
        </div>
        <div className="text-sm text-gray-400">
          {totalLoaded} produits sur {totalProducts} affichés
        </div>
      </div>
    );
  }

  if (!hasMore) {
    return null;
  }

  return (
    <div className="text-center py-6">
      <Button
        onClick={onLoadMore}
        disabled={isLoading}
        size="lg"
        className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Chargement...
          </>
        ) : (
          <>
            <ChevronDown className="w-5 h-5 mr-2" />
            Charger plus de produits
          </>
        )}
      </Button>
      
      {totalLoaded > 0 && (
        <div className="mt-3 text-sm text-gray-500">
          {totalLoaded} produits affichés sur {totalProducts} au total
        </div>
      )}
    </div>
  );
};

export default AdminLoadMoreButton;
