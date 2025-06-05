
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Settings, Save, RefreshCw, Eye, EyeOff } from 'lucide-react';

interface DashboardConfig {
  widgets: {
    revenue: boolean;
    orders: boolean;
    customers: boolean;
    conversion: boolean;
    traffic: boolean;
    behavioral: boolean;
    facebook: boolean;
  };
  dateRangeDefault: string;
  refreshInterval: number;
  chartTypes: {
    revenue: 'bar' | 'line' | 'area';
    orders: 'bar' | 'line' | 'area';
    traffic: 'bar' | 'line' | 'area';
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface DashboardCustomizerProps {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
  onSave: () => void;
}

const DashboardCustomizer: React.FC<DashboardCustomizerProps> = ({
  config,
  onConfigChange,
  onSave
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateWidgetVisibility = (widget: string, visible: boolean) => {
    onConfigChange({
      ...config,
      widgets: {
        ...config.widgets,
        [widget]: visible
      }
    });
  };

  const updateChartType = (chart: string, type: 'bar' | 'line' | 'area') => {
    onConfigChange({
      ...config,
      chartTypes: {
        ...config.chartTypes,
        [chart]: type
      }
    });
  };

  const updateColor = (colorType: string, value: string) => {
    onConfigChange({
      ...config,
      colors: {
        ...config.colors,
        [colorType]: value
      }
    });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed top-20 right-4 z-50"
      >
        <Settings className="h-4 w-4 mr-2" />
        Personnaliser
      </Button>
    );
  }

  return (
    <div className="fixed top-16 right-4 w-80 z-50">
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Personnalisation Dashboard</CardTitle>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="widgets" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="widgets">Widgets</TabsTrigger>
              <TabsTrigger value="display">Affichage</TabsTrigger>
              <TabsTrigger value="colors">Couleurs</TabsTrigger>
            </TabsList>

            <TabsContent value="widgets" className="space-y-3 mt-4">
              <div className="space-y-3">
                <h4 className="font-medium">Widgets visibles</h4>
                {Object.entries(config.widgets).map(([widget, visible]) => (
                  <div key={widget} className="flex items-center justify-between">
                    <Label className="text-sm capitalize">
                      {widget.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <Switch
                      checked={visible}
                      onCheckedChange={(checked) => updateWidgetVisibility(widget, checked)}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="display" className="space-y-3 mt-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm">Période par défaut</Label>
                  <Select
                    value={config.dateRangeDefault}
                    onValueChange={(value) => onConfigChange({...config, dateRangeDefault: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">7 jours</SelectItem>
                      <SelectItem value="30days">30 jours</SelectItem>
                      <SelectItem value="90days">90 jours</SelectItem>
                      <SelectItem value="year">1 an</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm">Auto-refresh (minutes)</Label>
                  <Input
                    type="number"
                    value={config.refreshInterval}
                    onChange={(e) => onConfigChange({...config, refreshInterval: parseInt(e.target.value)})}
                    min="1"
                    max="60"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Types de graphiques</Label>
                  {Object.entries(config.chartTypes).map(([chart, type]) => (
                    <div key={chart} className="flex items-center justify-between">
                      <span className="text-xs capitalize">{chart}</span>
                      <Select
                        value={type}
                        onValueChange={(value) => updateChartType(chart, value as any)}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bar">Barres</SelectItem>
                          <SelectItem value="line">Lignes</SelectItem>
                          <SelectItem value="area">Aires</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="colors" className="space-y-3 mt-4">
              <div className="space-y-3">
                <h4 className="font-medium">Couleurs du thème</h4>
                {Object.entries(config.colors).map(([colorType, value]) => (
                  <div key={colorType} className="flex items-center justify-between">
                    <Label className="text-sm capitalize">{colorType}</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={value}
                        onChange={(e) => updateColor(colorType, e.target.value)}
                        className="w-12 h-8 p-1 border rounded"
                      />
                      <span className="text-xs font-mono">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex space-x-2 pt-4 border-t">
            <Button onClick={onSave} size="sm" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              size="sm"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCustomizer;
