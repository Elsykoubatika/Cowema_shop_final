
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X } from 'lucide-react';
import { useDeliveryForm, DeliveryFormData } from './useDeliveryForm';
import InfoBox from './InfoBox';
import DeliveryFeeDisplay from './DeliveryFeeDisplay';
import DeliveryFormFields from './DeliveryFormFields';

interface DeliveryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: DeliveryFormData) => void;
  onSkip: () => void;
}

const DeliveryFormModal: React.FC<DeliveryFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  onSkip 
}) => {
  const {
    formData,
    neighborhoods,
    deliveryFee,
    handleChange,
    cities
  } = useDeliveryForm();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add the delivery fee to the form data
    onSubmit({
      ...formData,
      deliveryFee
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Informations de livraison</DialogTitle>
        </DialogHeader>
        
        <InfoBox />
        
        <form onSubmit={handleSubmit}>
          <DeliveryFormFields
            formData={formData}
            handleChange={handleChange}
            cities={cities}
            neighborhoods={neighborhoods}
          />
          
          <DeliveryFeeDisplay
            city={formData.city}
            neighborhood={formData.neighborhood}
            deliveryFee={deliveryFee}
            show={Boolean(formData.city && formData.neighborhood)}
          />
          
          <div className="flex justify-between gap-4 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              className="flex items-center gap-2" 
              onClick={onSkip}
            >
              <X size={16} /> Passer à WhatsApp
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Check size={16} /> Confirmer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryFormModal;
