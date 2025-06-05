
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Home 
} from 'lucide-react';
import { useAddressManagement } from '@/hooks/useAddressManagement';
import { getCitiesNames, getArrondissementsByCity } from '@/data/congoGeography';

const AddressesSection: React.FC = () => {
  const { 
    addresses, 
    loading, 
    addAddress, 
    updateAddress, 
    deleteAddress, 
    setDefaultAddress,
    formatAddressForDisplay 
  } = useAddressManagement();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    arrondissement: '',
    is_default: false
  });

  const cities = getCitiesNames();

  const startAdding = () => {
    setFormData({
      street: '',
      city: '',
      arrondissement: '',
      is_default: addresses.length === 0
    });
    setIsAdding(true);
  };

  const startEditing = (address: any) => {
    setFormData({
      street: address.street,
      city: address.city,
      arrondissement: address.arrondissement || '',
      is_default: address.is_default
    });
    setEditingId(address.id);
  };

  const cancelForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      street: '',
      city: '',
      arrondissement: '',
      is_default: false
    });
  };

  const handleSave = async () => {
    if (isAdding) {
      const success = await addAddress(formData);
      if (success) {
        cancelForm();
      }
    } else if (editingId) {
      const success = await updateAddress(editingId, formData);
      if (success) {
        cancelForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      await deleteAddress(id);
    }
  };

  const handleSetDefault = async (id: string) => {
    await setDefaultAddress(id);
  };

  const availableArrondissements = formData.city ? getArrondissementsByCity(formData.city).map(arr => arr.name) : [];

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin size={20} />
            Mes adresses de livraison
          </CardTitle>
          {!isAdding && (
            <Button onClick={startAdding}>
              <Plus size={16} className="mr-2" />
              Ajouter une adresse
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {/* Formulaire d'ajout/modification */}
          {(isAdding || editingId) && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium mb-4">
                {isAdding ? 'Nouvelle adresse' : 'Modifier l\'adresse'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="street">Adresse complète *</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                    placeholder="Rue, numéro, quartier..."
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="city">Ville *</Label>
                  <Select 
                    value={formData.city} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, city: value, arrondissement: '' }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionner une ville" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="arrondissement">Arrondissement *</Label>
                  <Select 
                    value={formData.arrondissement} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, arrondissement: value }))}
                    disabled={!formData.city}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionner un arrondissement" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableArrondissements.map(arr => (
                        <SelectItem key={arr} value={arr}>{arr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={cancelForm}>
                  <X size={16} className="mr-2" />
                  Annuler
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={!formData.street || !formData.city || !formData.arrondissement}
                >
                  <Save size={16} className="mr-2" />
                  Enregistrer
                </Button>
              </div>
            </div>
          )}

          {/* Liste des adresses */}
          {addresses.length === 0 ? (
            <div className="text-center py-8">
              <Home size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune adresse enregistrée</h3>
              <p className="text-gray-500 mb-4">Ajoutez votre première adresse de livraison</p>
              {!isAdding && (
                <Button onClick={startAdding}>
                  <Plus size={16} className="mr-2" />
                  Ajouter une adresse
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div key={address.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={16} className="text-gray-400" />
                        {address.is_default && (
                          <Badge variant="secondary">Adresse par défaut</Badge>
                        )}
                      </div>
                      <p className="font-medium">{formatAddressForDisplay(address)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!address.is_default && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                        >
                          Définir par défaut
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditing(address)}
                        disabled={editingId === address.id}
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(address.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddressesSection;
