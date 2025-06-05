
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { MessageSend } from '@/types/messageCampaigns';

interface ConfirmSentDialogProps {
  isOpen: boolean;
  selectedSend: MessageSend | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmSentDialog: React.FC<ConfirmSentDialogProps> = ({
  isOpen,
  selectedSend,
  onClose,
  onConfirm
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer l'envoi du message</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p>
            Voulez-vous confirmer que le message a été envoyé à{' '}
            <strong>{selectedSend?.recipient_name || selectedSend?.recipient_phone}</strong> ?
          </p>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Contenu du message :</p>
            <p className="text-sm">{selectedSend?.message_content}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={onConfirm}>
            Confirmer l'envoi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
