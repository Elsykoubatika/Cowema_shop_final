
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Target, History, Layers } from 'lucide-react';
import AdvancedPromotionForm from '../AdvancedPromotionForm';

interface AdvancedSettingsSectionProps {
  formData: any;
  onUpdateFormData: (updates: any) => void;
}

const AdvancedSettingsSection: React.FC<AdvancedSettingsSectionProps> = ({
  formData,
  onUpdateFormData
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Paramètres avancés
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AdvancedPromotionForm
          formData={formData}
          onUpdateFormData={onUpdateFormData}
        />
      </CardContent>
    </Card>
  );
};

export default AdvancedSettingsSection;
