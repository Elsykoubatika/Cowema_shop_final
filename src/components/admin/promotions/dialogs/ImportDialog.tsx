
import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onImportFile: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const ImportDialog: React.FC<ImportDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onImportFile 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Importer des promotions</DialogTitle>
        <DialogDescription>
          Importez une liste de codes promo au format CSV.
          <br />
          Le fichier doit contenir les colonnes suivantes: code, discount, discountType (percentage ou fixed)
        </DialogDescription>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="csvFile">Fichier CSV</Label>
            <Input 
              id="csvFile" 
              type="file" 
              accept=".csv" 
              onChange={onImportFile}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDialog;
