
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useDeliveryZones } from '@/hooks/useDeliveryZones';
import { Loader2, Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const DynamicDeliveryFeesTab: React.FC = () => {
  const { zones, loading, createZone, updateZone, deleteZone } = useDeliveryZones();
  const [editingZone, setEditingZone] = useState<string | null>(null);
  const [newZone, setNewZone] = useState({
    zone_name: '',
    city: '',
    base_fee: 0,
    additional_fee: 0,
    is_active: true
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleCreateZone = async () => {
    if (!newZone.zone_name || !newZone.city) return;
    
    const success = await createZone(newZone);
    if (success) {
      setNewZone({
        zone_name: '',
        city: '',
        base_fee: 0,
        additional_fee: 0,
        is_active: true
      });
      setShowAddForm(false);
    }
  };

  const handleUpdateZone = async (id: string, updates: any) => {
    await updateZone(id, updates);
    setEditingZone(null);
  };

  const handleDeleteZone = async (id: string, zoneName: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la zone "${zoneName}" ?`)) {
      await deleteZone(id);
    }
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Zones de livraison
          </CardTitle>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une zone
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Formulaire d'ajout */}
          {showAddForm && (
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label>Nom de la zone</Label>
                    <Input
                      value={newZone.zone_name}
                      onChange={(e) => setNewZone(prev => ({ ...prev, zone_name: e.target.value }))}
                      placeholder="Ex: Centre-ville"
                    />
                  </div>
                  <div>
                    <Label>Ville</Label>
                    <Input
                      value={newZone.city}
                      onChange={(e) => setNewZone(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Ex: Brazzaville"
                    />
                  </div>
                  <div>
                    <Label>Frais de base (FCFA)</Label>
                    <Input
                      type="number"
                      value={newZone.base_fee}
                      onChange={(e) => setNewZone(prev => ({ ...prev, base_fee: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label>Frais supplémentaires</Label>
                    <Input
                      type="number"
                      value={newZone.additional_fee}
                      onChange={(e) => setNewZone(prev => ({ ...prev, additional_fee: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreateZone}>
                    Créer la zone
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Liste des zones */}
          <div className="space-y-3">
            {zones.map((zone) => (
              <Card key={zone.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-medium flex items-center gap-2">
                          {zone.zone_name}
                          <Badge variant={zone.is_active ? "default" : "secondary"}>
                            {zone.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </h3>
                        <p className="text-sm text-muted-foreground">{zone.city}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{zone.base_fee.toLocaleString()} FCFA</p>
                        {zone.additional_fee && zone.additional_fee > 0 && (
                          <p className="text-sm text-muted-foreground">
                            +{zone.additional_fee.toLocaleString()} FCFA
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={zone.is_active}
                        onCheckedChange={(checked) => handleUpdateZone(zone.id, { is_active: checked })}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingZone(zone.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteZone(zone.id, zone.zone_name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Formulaire d'édition */}
                  {editingZone === zone.id && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Nom de la zone</Label>
                          <Input
                            defaultValue={zone.zone_name}
                            onBlur={(e) => {
                              if (e.target.value !== zone.zone_name) {
                                handleUpdateZone(zone.id, { zone_name: e.target.value });
                              }
                            }}
                          />
                        </div>
                        <div>
                          <Label>Frais de base (FCFA)</Label>
                          <Input
                            type="number"
                            defaultValue={zone.base_fee}
                            onBlur={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              if (value !== zone.base_fee) {
                                handleUpdateZone(zone.id, { base_fee: value });
                              }
                            }}
                          />
                        </div>
                        <div>
                          <Label>Frais supplémentaires</Label>
                          <Input
                            type="number"
                            defaultValue={zone.additional_fee || 0}
                            onBlur={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              if (value !== zone.additional_fee) {
                                handleUpdateZone(zone.id, { additional_fee: value });
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingZone(null)}
                        >
                          Terminé
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {zones.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune zone de livraison configurée</p>
              <p className="text-sm">Cliquez sur "Ajouter une zone" pour commencer</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicDeliveryFeesTab;
