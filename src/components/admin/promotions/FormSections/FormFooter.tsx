
import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";

interface FormFooterProps {
  isEditing: boolean;
  onCancel: () => void;
  onSave: () => void;
}

const FormFooter: React.FC<FormFooterProps> = ({
  isEditing,
  onCancel,
  onSave
}) => {
  return (
    <div className="flex space-x-2 w-full justify-between pt-4 border-t">
      <DialogClose asChild>
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      </DialogClose>
      <Button onClick={onSave}>
        {isEditing ? 'Mettre à jour' : 'Créer la promotion'}
      </Button>
    </div>
  );
};

export default FormFooter;
