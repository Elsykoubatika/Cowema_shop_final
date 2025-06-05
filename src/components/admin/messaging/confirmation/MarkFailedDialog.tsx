
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSend } from '@/types/messageCampaigns';

interface MarkFailedDialogProps {
  isOpen: boolean;
  selectedSend: MessageSend | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const MarkFailedDialog: React.FC<MarkFailedDialogProps> = ({
  isOpen,
  selectedSend,
  onClose,
  onConfirm
}) => {
  const [failureReason, setFailureReason] = useState('');

  const handleConfirm = () => {
    if (failureReason.trim()) {
      onConfirm(failureReason);
      setFailureReason('');
    }
  };

  const handleClose = () => {
    setFailureReason('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Marquer le message comme échoué</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p>
            Marquer le message pour{' '}
            <strong>{selectedSend?.recipient_name || selectedSend?.recipient_phone}</strong>{' '}
            comme échoué.
          </p>
          
          <div>
            <Label htmlFor="failure-reason">Raison de l'échec</Label>
            <Textarea
              id="failure-reason"
              value={failureReason}
              onChange={(e) => setFailureReason(e.target.value)}
              placeholder="Ex: Numéro invalide, WhatsApp non installé..."
              className="mt-1"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={!failureReason.trim()}
          >
            Marquer comme échoué
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
