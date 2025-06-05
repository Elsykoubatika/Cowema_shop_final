
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  category: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export const useSystemSettings = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setSettings(data || []);
    } catch (err: any) {
      console.error('Erreur lors du chargement des paramètres:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (settingKey: string, value: any) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({ 
          setting_value: JSON.stringify(value),
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', settingKey);

      if (error) throw error;

      // Mettre à jour localement
      setSettings(prev => prev.map(setting => 
        setting.setting_key === settingKey 
          ? { ...setting, setting_value: value, updated_at: new Date().toISOString() }
          : setting
      ));

      toast({
        title: "Paramètre mis à jour",
        description: "La modification a été enregistrée avec succès.",
      });

      return true;
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le paramètre.",
      });
      return false;
    }
  };

  const getSetting = (key: string) => {
    const setting = settings.find(s => s.setting_key === key);
    return setting ? setting.setting_value : null;
  };

  const getSettingsByCategory = (category: string) => {
    return settings.filter(s => s.category === category);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSetting,
    getSetting,
    getSettingsByCategory
  };
};
