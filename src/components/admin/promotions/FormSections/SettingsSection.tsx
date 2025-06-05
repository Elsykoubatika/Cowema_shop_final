
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { PromoTarget } from "../../../../hooks/usePromotionStore";

interface SettingsSectionProps {
  formData: {
    target: PromoTarget;
    isActive: boolean;
  };
  onSelectChange: (value: string, field: string) => void;
  onSwitchChange: (checked: boolean) => void;
  onSetActiveTab: (tab: string) => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  formData,
  onSelectChange,
  onSwitchChange,
  onSetActiveTab
}) => {
  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="target" className="text-right">
            Applicable sur
          </Label>
          <div className="col-span-3">
            <Select
              value={formData.target}
              onValueChange={(value) => onSelectChange(value, 'target')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les produits</SelectItem>
                <SelectItem value="ya-ba-boss">Produits YA BA BOSS uniquement</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Détermine les produits auxquels cette promotion s'applique
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="active" className="text-right">
            Actif
          </Label>
          <div className="col-span-3 flex items-center gap-3">
            <Switch
              id="active"
              checked={formData.isActive}
              onCheckedChange={onSwitchChange}
            />
            <Label htmlFor="active" className="text-sm text-gray-700 cursor-pointer">
              {formData.isActive ? 'La promotion est active et visible' : 'La promotion est inactive et invisible'}
            </Label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onSetActiveTab("details")}>
          Précédent
        </Button>
      </div>
    </div>
  );
};

export default SettingsSection;
