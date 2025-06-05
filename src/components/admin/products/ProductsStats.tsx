
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, ShoppingCart, Star, Eye } from 'lucide-react';

interface ProductsStatsProps {
  totalProducts: number;
  selectedCount: number;
  yaBaBossCount: number;
  viewCount?: number;
}

const ProductsStats: React.FC<ProductsStatsProps> = ({
  totalProducts,
  selectedCount,
  yaBaBossCount,
  viewCount = 0
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="flex items-center p-4">
          <Package className="h-8 w-8 text-primary mr-4" />
          <div>
            <p className="text-sm text-muted-foreground">Total produits</p>
            <h3 className="text-2xl font-bold">{totalProducts}</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-4">
          <ShoppingCart className="h-8 w-8 text-blue-500 mr-4" />
          <div>
            <p className="text-sm text-muted-foreground">Sélectionnés</p>
            <h3 className="text-2xl font-bold">{selectedCount}</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-4">
          <Star className="h-8 w-8 text-yellow-500 mr-4" />
          <div>
            <p className="text-sm text-muted-foreground">YA BA BOSS</p>
            <h3 className="text-2xl font-bold">{yaBaBossCount}</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-4">
          <Eye className="h-8 w-8 text-green-500 mr-4" />
          <div>
            <p className="text-sm text-muted-foreground">Vues</p>
            <h3 className="text-2xl font-bold">{viewCount}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsStats;
