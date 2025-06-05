
import React from 'react';
import { Dialog } from "@/components/ui/dialog";
import { Promotion } from '@/hooks/usePromotionStore';
import PromotionsList from '../PromotionsList';
import PromotionForm from '../PromotionForm';
import DeletePromotionDialog from '../DeletePromotionDialog';
import CreateButtonWithDropdown from '../dialogs/CreateButtonWithDropdown';

interface OverviewTabProps {
  promotions: Promotion[];
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
  onEdit: (promo: Promotion) => void;
  onDelete: (id: string) => void;
  onActivate: (promo: Promotion) => void;
  onUpdateFormData?: (updates: any) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  promotions,
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
  onEdit,
  onDelete,
  onActivate,
  onUpdateFormData
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Gestion des promotions</h3>
          <p className="text-muted-foreground">
            Créez et gérez vos codes promo avec ciblage avancé et combinaisons
          </p>
        </div>
        <CreateButtonWithDropdown onOpenCreateDialog={() => onOpenDialog()} />
      </div>

      <PromotionsList
        promotions={promotions}
        onEdit={onEdit}
        onDelete={onDelete}
        onActivate={onActivate}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <PromotionForm
          formData={formData}
          isEditing={!!currentPromo}
          onSave={onSavePromotion}
          onCancel={onDialogClose}
          onUpdateFormData={onUpdateFormData || (() => {})}
        />
      </Dialog>

      <DeletePromotionDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
};

export default OverviewTab;
