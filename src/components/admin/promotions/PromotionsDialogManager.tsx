
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Promotion } from "@/hooks/usePromotionStore";
import PromotionForm from './PromotionForm';
import DeletePromotionDialog from './DeletePromotionDialog';
import CreateButtonWithDropdown from './dialogs/CreateButtonWithDropdown';

interface PromotionsDialogManagerProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  currentPromo: Promotion | null;
  formData: any;
  onOpenDialog: (promo?: Promotion) => void;
  onDialogClose: () => void;
  onSavePromotion: () => void;
  onConfirmDelete: () => void;
  onUpdateFormData?: (updates: any) => void;
}

const PromotionsDialogManager: React.FC<PromotionsDialogManagerProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  currentPromo,
  formData,
  onOpenDialog,
  onDialogClose,
  onSavePromotion,
  onConfirmDelete,
  onUpdateFormData,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Promotions actives</h2>
      
      <CreateButtonWithDropdown 
        onOpenCreateDialog={() => onOpenDialog()} 
        onOpenGenerateDialog={() => {}} 
        onOpenImportDialog={() => {}}
        onExportPromotions={() => {}}
      />
      
      {/* Dialogue de création/édition de promotion */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentPromo ? 'Modifier' : 'Créer'} une promotion</DialogTitle>
          </DialogHeader>
          <PromotionForm 
            formData={formData} 
            isEditing={!!currentPromo}
            onCancel={onDialogClose}
            onSave={onSavePromotion}
            onUpdateFormData={onUpdateFormData || (() => {})}
          />
        </DialogContent>
      </Dialog>
      
      {/* Dialogue de suppression */}
      <DeletePromotionDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
};

export default PromotionsDialogManager;
