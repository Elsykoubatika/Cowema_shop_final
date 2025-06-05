
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Building, Smartphone } from 'lucide-react';

interface PayoutRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableAmount: number;
  minPayoutAmount: number;
  onSubmit: (amount: number, paymentMethod: string, paymentDetails: any) => Promise<boolean>;
}

const PayoutRequestModal: React.FC<PayoutRequestModalProps> = ({
  isOpen,
  onClose,
  availableAmount,
  minPayoutAmount,
  onSubmit
}) => {
  const [amount, setAmount] = useState(availableAmount.toString());
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [paymentDetails, setPaymentDetails] = useState({
    bank_name: '',
    account_number: '',
    account_holder: '',
    mobile_number: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requestAmount = parseFloat(amount);

    if (requestAmount < minPayoutAmount) {
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmit(requestAmount, paymentMethod, paymentDetails);
    
    if (success) {
      onClose();
      setAmount(availableAmount.toString());
      setPaymentDetails({
        bank_name: '',
        account_number: '',
        account_holder: '',
        mobile_number: '',
        notes: ''
      });
    }
    setIsSubmitting(false);
  };

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Virement bancaire', icon: Building },
    { value: 'mobile_money', label: 'Mobile Money', icon: Smartphone },
    { value: 'cash', label: 'Espèces', icon: CreditCard }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            💰 Demande de paiement
          </DialogTitle>
          <DialogDescription>
            Vous pouvez demander le paiement de vos commissions disponibles
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Montant à retirer</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={minPayoutAmount}
                max={availableAmount}
                className="pr-16"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                FCFA
              </span>
            </div>
            <p className="text-xs text-gray-600">
              Disponible: {availableAmount.toLocaleString()} FCFA • Minimum: {minPayoutAmount.toLocaleString()} FCFA
            </p>
          </div>

          <div className="space-y-3">
            <Label>Méthode de paiement</Label>
            <div className="grid gap-2">
              {paymentMethods.map((method) => (
                <Card
                  key={method.value}
                  className={`cursor-pointer transition-colors ${
                    paymentMethod === method.value 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod(method.value)}
                >
                  <CardContent className="flex items-center gap-3 p-3">
                    <method.icon className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">{method.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {paymentMethod === 'bank_transfer' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bank_name">Nom de la banque</Label>
                <Input
                  id="bank_name"
                  value={paymentDetails.bank_name}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, bank_name: e.target.value }))}
                  placeholder="Ex: Ecobank, BGFI Bank..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account_number">Numéro de compte</Label>
                <Input
                  id="account_number"
                  value={paymentDetails.account_number}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, account_number: e.target.value }))}
                  placeholder="Votre numéro de compte"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account_holder">Titulaire du compte</Label>
                <Input
                  id="account_holder"
                  value={paymentDetails.account_holder}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, account_holder: e.target.value }))}
                  placeholder="Nom complet du titulaire"
                  required
                />
              </div>
            </div>
          )}

          {paymentMethod === 'mobile_money' && (
            <div className="space-y-2">
              <Label htmlFor="mobile_number">Numéro de téléphone</Label>
              <Input
                id="mobile_number"
                value={paymentDetails.mobile_number}
                onChange={(e) => setPaymentDetails(prev => ({ ...prev, mobile_number: e.target.value }))}
                placeholder="Ex: +243 XXX XXX XXX"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes additionnelles (optionnel)</Label>
            <Textarea
              id="notes"
              value={paymentDetails.notes}
              onChange={(e) => setPaymentDetails(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Informations supplémentaires..."
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting || parseFloat(amount) < minPayoutAmount}
            >
              {isSubmitting ? 'Envoi...' : 'Demander le paiement'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PayoutRequestModal;
