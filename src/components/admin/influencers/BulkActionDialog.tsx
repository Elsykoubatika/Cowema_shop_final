
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BulkActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bulkAction: 'approve' | 'reject' | null;
  selectedCount: number;
  onConfirm: () => void;
}

const BulkActionDialog: React.FC<BulkActionDialogProps> = ({
  open,
  onOpenChange,
  bulkAction,
  selectedCount,
  onConfirm
}) => {
  const getActionText = () => {
    if (bulkAction === 'approve') {
      return {
        title: 'Approuver les candidatures',
        description: `Êtes-vous sûr de vouloir approuver ${selectedCount} candidature${selectedCount > 1 ? 's' : ''} ?`,
        confirmText: 'Approuver',
        variant: 'default' as const
      };
    } else {
      return {
        title: 'Rejeter les candidatures',
        description: `Êtes-vous sûr de vouloir rejeter ${selectedCount} candidature${selectedCount > 1 ? 's' : ''} ?`,
        confirmText: 'Rejeter',
        variant: 'destructive' as const
      };
    }
  };

  const actionConfig = getActionText();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{actionConfig.title}</DialogTitle>
          <DialogDescription>
            {actionConfig.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant={actionConfig.variant} onClick={onConfirm}>
            {actionConfig.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkActionDialog;
