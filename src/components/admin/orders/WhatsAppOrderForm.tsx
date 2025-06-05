
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateWhatsAppMessage, openWhatsApp, validatePhoneNumber } from '@/utils/whatsappUtils';
import { UnifiedOrderItem } from '@/types/unified';

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
}

interface WhatsAppOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    items: UnifiedOrderItem[];
    total: number;
  };
  onSubmit?: (formData: any) => Promise<void>;
}

const WhatsAppOrderForm: React.FC<WhatsAppOrderFormProps> = ({ 
  isOpen, 
  onClose, 
  initialData,
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.phone || !formData.address || !formData.city) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (!validatePhoneNumber(formData.phone)) {
      toast.error("Numéro de téléphone invalide");
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        // Utiliser la fonction onSubmit personnalisée si fournie
        await onSubmit(formData);
      } else {
        // Comportement par défaut - générer le lien WhatsApp
        const customerInfo: CustomerInfo = {
          firstName: formData.customerName.split(' ')[0] || formData.customerName,
          lastName: formData.customerName.split(' ').slice(1).join(' ') || '',
          email: formData.email || `${formData.customerName.toLowerCase().replace(/\s+/g, '')}@example.com`,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          notes: formData.notes
        };

        const orderData = {
          customerName: customerInfo.firstName + ' ' + customerInfo.lastName,
          phone: customerInfo.phone,
          address: customerInfo.address,
          city: customerInfo.city,
          items: initialData?.items || [],
          total: initialData?.total || 0,
          notes: customerInfo.notes
        };
        
        openWhatsApp(orderData);
      }
      
      // Réinitialiser le formulaire
      setFormData({
        customerName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        notes: '',
      });
      
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast.error("Erreur lors de la création de la commande");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une commande WhatsApp</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customerName">Nom du client *</Label>
            <Input
              id="customerName"
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              placeholder="Nom complet du client"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Téléphone *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Numéro de téléphone"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email (optionnel)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email du client"
            />
          </div>

          <div>
            <Label htmlFor="address">Adresse *</Label>
            <Input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Adresse de livraison"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="city">Ville *</Label>
            <Input
              id="city"
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="Ville"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notes supplémentaires"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Traitement..." : "Envoyer sur WhatsApp"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppOrderForm;
