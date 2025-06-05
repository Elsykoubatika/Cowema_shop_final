
import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Download, Upload, ChevronDown, Zap } from 'lucide-react';

interface CreateButtonWithDropdownProps {
  onOpenCreateDialog?: () => void;
  onOpenGenerateDialog?: () => void;
  onOpenImportDialog?: () => void;
  onExportPromotions?: () => void;
}

const CreateButtonWithDropdown: React.FC<CreateButtonWithDropdownProps> = ({
  onOpenCreateDialog,
  onOpenGenerateDialog,
  onOpenImportDialog,
  onExportPromotions
}) => {
  return (
    <div className="flex gap-2">
      <Button onClick={onOpenCreateDialog} className="gap-2">
        <Plus size={16} />
        Créer une promotion
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onOpenGenerateDialog} className="gap-2">
            <Zap size={16} />
            Générer des codes en série
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onOpenImportDialog} className="gap-2">
            <Upload size={16} />
            Importer des promotions
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportPromotions} className="gap-2">
            <Download size={16} />
            Exporter les promotions
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CreateButtonWithDropdown;
