
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface LanguageSelectorProps {
  selectedLanguage: string;
  onChange: (value: string) => void;
}

/**
 * Composant de sélection de langue pour l'interface
 * Permet de standardiser la langue utilisée dans l'interface
 */
const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <Label>Langue de l'interface</Label>
      <RadioGroup 
        value={selectedLanguage} 
        onValueChange={onChange}
        className="flex flex-col space-y-1"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="fr" id="lang-fr" />
          <Label htmlFor="lang-fr" className="font-normal">Français</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="en" id="lang-en" />
          <Label htmlFor="lang-en" className="font-normal">English</Label>
        </div>
      </RadioGroup>
      <p className="text-xs text-muted-foreground mt-1">
        La langue sélectionnée détermine l'affichage de l'interface administrative.
      </p>
    </div>
  );
};

export default LanguageSelector;
