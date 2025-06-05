
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
  Home,
  Star,
  Check,
  Navigation,
  Building
} from 'lucide-react';
import { useAddressManagement } from '@/hooks/useAddressManagement';
import { getCitiesNames, getArrondissementsByCity } from '@/data/congoGeography';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const EnhancedAddressesSection: React.FC = () => {
  const { 
    addresses, 
    loading, 
    addAddress, 
    updateAddress, 
    deleteAddress, 
    setDefaultAddress,
    formatAddressForDisplay 
  } = useAddressManagement();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const startEditing = (address: any) => {
    setFormData({
      street: address.street,
      city: address.city,
      arrondissement: address.arrondissement || '',
      is_default: address.is_default
    });
    setEditingId(address.id);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (editingId) {
      const success = await updateAddress(editingId, formData);
      if (success) {
        setIsDialogOpen(false);
        setEditingId(null);
      }
    } else {
      const success = await addAddress(formData);
      if (success) {
        setIsDialogOpen(false);
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
      <Card className="overflow-hidden">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-500">Chargement de vos adresses...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin size={24} className="text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Mes adresses de livraison</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Gérez vos adresses pour une livraison rapide
                </p>
              </div>
            </div>
            <Button 
              onClick={startAdding}
              className="bg-primary hover:bg-primary/90 text-white transition-all duration-200 hover:scale-105"
            >
              <Plus size={16} className="mr-2" />
              Nouvelle adresse
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {addresses.length === 0 ? (
            <div className="text-center py-12">
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                  <Home size={48} className="text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Aucune adresse enregistrée
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Ajoutez votre première adresse de livraison pour commander plus rapidement
                  </p>
                  <Button 
                    onClick={startAdding}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg transition-all duration-200 hover:scale-105"
                  >
                    <Plus size={18} className="mr-2" />
                    Ajouter ma première adresse
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <Card key={address.id} className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border hover:border-primary/30">
                  {address.is_default && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-500 text-white flex items-center gap-1">
                        <Star size={12} fill="currentColor" />
                        Par défaut
                      </Badge>
                    </div>
                  )}
                  
                  <CardContent className="p-5">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Navigation size={20} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {address.city.charAt(0).toUpperCase() + address.city.slice(1)}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed break-words">
                            {address.street}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Building size={14} className="text-gray-400" />
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {address.arrondissement}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-2">
                          {!address.is_default && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSetDefault(address.id)}
                              className="text-xs hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                            >
                              <Check size={14} className="mr-1" />
                              Définir par défaut
                            </Button>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditing(address)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-200"
                          >
                            <Edit2 size={14} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(address.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog pour ajouter/modifier une adresse */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin size={20} className="text-primary" />
              {editingId ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="street" className="text-sm font-medium">
                Adresse complète *
              </Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                placeholder="Rue, numéro, quartier..."
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">
                  Ville *
                </Label>
                <Select 
                  value={formData.city} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, city: value, arrondissement: '' }))}
                >
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Ville" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="arrondissement" className="text-sm font-medium">
                  Arrondissement *
                </Label>
                <Select 
                  value={formData.arrondissement} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, arrondissement: value }))}
                  disabled={!formData.city}
                >
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableArrondissements.map(arr => (
                      <SelectItem key={arr} value={arr}>{arr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="hover:bg-gray-50"
              >
                <X size={16} className="mr-2" />
                Annuler
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!formData.street || !formData.city || !formData.arrondissement}
                className="bg-primary hover:bg-primary/90"
              >
                <Save size={16} className="mr-2" />
                {editingId ? 'Modifier' : 'Ajouter'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedAddressesSection;
