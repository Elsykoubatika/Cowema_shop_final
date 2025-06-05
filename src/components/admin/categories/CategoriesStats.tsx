
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tag, FolderTree, Box } from 'lucide-react';

interface CategoriesStatsProps {
  totalCategories: number;
  totalSubcategories: number;
  totalProducts: number;
}

const CategoriesStats: React.FC<CategoriesStatsProps> = ({
  totalCategories,
  totalSubcategories,
  totalProducts
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="flex items-center p-4">
          <Tag className="h-8 w-8 text-primary mr-4" />
          <div>
            <p className="text-sm text-muted-foreground">Catégories</p>
            <h3 className="text-2xl font-bold">{totalCategories}</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-4">
          <FolderTree className="h-8 w-8 text-blue-500 mr-4" />
          <div>
            <p className="text-sm text-muted-foreground">Sous-catégories</p>
            <h3 className="text-2xl font-bold">{totalSubcategories}</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center p-4">
          <Box className="h-8 w-8 text-green-500 mr-4" />
          <div>
            <p className="text-sm text-muted-foreground">Produits</p>
            <h3 className="text-2xl font-bold">{totalProducts}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesStats;
