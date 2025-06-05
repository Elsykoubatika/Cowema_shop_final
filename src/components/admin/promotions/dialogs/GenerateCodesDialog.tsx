
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tag, Zap } from 'lucide-react';
import { useGenerateCodesForm } from '../../../../hooks/admin/promotions/useGenerateCodesForm';

interface GenerateCodesDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerateCodes: (options: any) => void;
}

const GenerateCodesDialog: React.FC<GenerateCodesDialogProps> = ({
  isOpen,
  onOpenChange,
  onGenerateCodes
}) => {
  const [activeTab, setActiveTab] = useState("basic");
  
  const {
    batchGeneration,
    handleFormChange,
    handleSelectChange,
    handleUsageLimitChange,
    getExampleCode,
    handleGenerateCodes
  } = useGenerateCodesForm(options => {
    onGenerateCodes(options);
    onOpenChange(false);
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogTitle className="flex items-center gap-2">
          <Tag size={16} className="text-primary" />
          Générer des codes promo en série
        </DialogTitle>
        <DialogDescription>
          Créez plusieurs codes promo avec un préfixe commun et des paramètres identiques.
        </DialogDescription>
        
        <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="basic">Paramètres de base</TabsTrigger>
            <TabsTrigger value="advanced">Options avancées</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="prefix">Préfixe</Label>
                <Input 
                  id="prefix"
                  name="prefix"
                  value={batchGeneration.prefix}
                  onChange={handleFormChange}
                  maxLength={10}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="count">Nombre de codes</Label>
                <Input 
                  id="count"
                  name="count"
                  type="number"
                  min={1}
                  max={100}
                  value={batchGeneration.count}
                  onChange={handleFormChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="discount">Remise</Label>
                <Input 
                  id="discount"
                  name="discount"
                  type="number"
                  min={1}
                  value={batchGeneration.discount}
                  onChange={handleFormChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="discountType">Type de remise</Label>
                <Select 
                  value={batchGeneration.discountType}
                  onValueChange={(value) => handleSelectChange(value, 'discountType')}
                >
                  <SelectTrigger id="discountType">
                    <SelectValue placeholder="Type de remise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                    <SelectItem value="fixed">Montant fixe (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="expiryDays">Expiration (jours)</Label>
              <Input 
                id="expiryDays"
                name="expiryDays"
                type="number"
                min={1}
                value={batchGeneration.expiryDays}
                onChange={handleFormChange}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="minPurchaseAmount">Montant minimum d'achat</Label>
                <Input 
                  id="minPurchaseAmount"
                  name="minPurchaseAmount"
                  type="number"
                  min={0}
                  value={batchGeneration.minPurchaseAmount}
                  onChange={handleFormChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="usageLimit">Limite d'utilisations (laisser vide si illimité)</Label>
                <Input 
                  id="usageLimit"
                  name="usageLimit"
                  type="number"
                  min={1}
                  value={batchGeneration.usageLimit === null ? '' : batchGeneration.usageLimit}
                  onChange={handleUsageLimitChange}
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="target">Cible</Label>
              <Select 
                value={batchGeneration.target}
                onValueChange={(value) => handleSelectChange(value, 'target')}
              >
                <SelectTrigger id="target">
                  <SelectValue placeholder="Cible" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les clients</SelectItem>
                  <SelectItem value="ya-ba-boss">Clients YA BA BOSS uniquement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex items-center mt-2">
          <span className="text-sm mr-2">Exemple de code généré:</span>
          <span className="bg-muted px-2 py-1 rounded text-sm font-mono">
            {getExampleCode()}
          </span>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleGenerateCodes} className="gap-2">
            <Zap size={16} />
            Générer {batchGeneration.count} codes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateCodesDialog;
