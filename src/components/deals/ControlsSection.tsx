
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Grid, List } from 'lucide-react';

interface ControlsSectionProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const ControlsSection: React.FC<ControlsSectionProps> = ({
  currentPage,
  totalPages,
  totalItems,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white rounded-lg p-6 shadow-lg">
      <div className="flex items-center gap-4">
        <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
          <Zap size={12} className="mr-1" />
          Algorithme Intelligent
        </Badge>
        <span className="text-sm text-gray-600 font-medium">
          Page {currentPage} sur {totalPages} • {totalItems} deals exceptionnels
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('grid')}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
        >
          <Grid size={16} />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('list')}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
        >
          <List size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ControlsSection;
