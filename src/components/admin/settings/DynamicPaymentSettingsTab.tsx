
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { Loader2, CreditCard, Smartphone, Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const DynamicPaymentSettingsTab: React.FC = () => {
  const { methods, loading, updateMethod } = usePaymentMethods();

  const getMethodIcon = (provider: string) => {
    switch (provider) {
      case 'cash_on_delivery': return CreditCard;
      case 'mobile_money': return Smartphone;
      case 'bank_transfer': return Building;
      default: return CreditCard;
    }
  };

  const handleToggleMethod = async (id: string, isActive: boolean) => {
    await updateMethod(id, { is_active: isActive });
  };

  const handleUpdateConfig = async (id: string, configKey: string, value: any) => {
    const method = methods.find(m => m.id === id);
    if (!method) return;

    const updatedConfig = { ...method.config, [configKey]: value };
    await updateMethod(id, { config: updatedConfig });
  };

  const handleUpdateFees = async (id: string, feeKey: string, value: number) => {
    const method = methods.find(m => m.id === id);
    if (!method) return;

    const updatedFees = { ...method.fees, [feeKey]: value };
    await updateMethod(id, { fees: updatedFees });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuration des paiements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {methods.map((method) => {
            const IconComponent = getMethodIcon(method.provider || '');
            
            return (
              <Card key={method.id} className="border-l-4 border-l-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-medium">{method.method_name}</h3>
                        <p className="text-sm text-muted-foreground">{method.provider}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={method.is_active ? "default" : "secondary"}>
                        {method.is_active ? "Actif" : "Inactif"}
                      </Badge>
                      <Switch
                        checked={method.is_active}
                        onCheckedChange={(checked) => handleToggleMethod(method.id, checked)}
                      />
                    </div>
                  </div>

                  {method.is_active && (
                    <div className="space-y-4 pt-4 border-t">
                      {/* Configuration spécifique selon le type */}
                      {method.provider === 'mobile_money' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Providers supportés</Label>
                            <Textarea
                              value={method.config?.providers?.join(', ') || ''}
                              onChange={(e) => {
                                const providers = e.target.value.split(',').map(p => p.trim());
                                handleUpdateConfig(method.id, 'providers', providers);
                              }}
                              placeholder="Airtel Money, MTN MoMo"
                              rows={2}
                            />
                          </div>
                          <div>
                            <Label>Instructions</Label>
                            <Textarea
                              value={method.config?.instructions || ''}
                              onChange={(e) => handleUpdateConfig(method.id, 'instructions', e.target.value)}
                              placeholder="Instructions pour le paiement"
                              rows={2}
                            />
                          </div>
                        </div>
                      )}

                      {method.provider === 'cash_on_delivery' && (
                        <div>
                          <Label>Instructions pour le paiement à la livraison</Label>
                          <Textarea
                            value={method.config?.instructions || 'Le paiement se fait en espèces au moment de la livraison. Veuillez préparer le montant exact si possible.'}
                            onChange={(e) => handleUpdateConfig(method.id, 'instructions', e.target.value)}
                            rows={3}
                          />
                        </div>
                      )}

                      {method.provider === 'bank_transfer' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Nom de la banque</Label>
                            <Input
                              value={method.config?.bank_name || ''}
                              onChange={(e) => handleUpdateConfig(method.id, 'bank_name', e.target.value)}
                              placeholder="Nom de la banque"
                            />
                          </div>
                          <div>
                            <Label>Numéro de compte</Label>
                            <Input
                              value={method.config?.account_number || ''}
                              onChange={(e) => handleUpdateConfig(method.id, 'account_number', e.target.value)}
                              placeholder="Numéro de compte"
                            />
                          </div>
                        </div>
                      )}

                      {/* Frais */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <Label>Frais fixes (FCFA)</Label>
                          <Input
                            type="number"
                            value={method.fees?.fixed || 0}
                            onChange={(e) => handleUpdateFees(method.id, 'fixed', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label>Pourcentage (%)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={method.fees?.percentage || 0}
                            onChange={(e) => handleUpdateFees(method.id, 'percentage', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicPaymentSettingsTab;
