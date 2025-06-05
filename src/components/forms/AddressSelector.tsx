
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Check, Edit2 } from 'lucide-react';
import { useAddressManagement, UserAddress } from '@/hooks/useAddressManagement';
import { getCitiesNames, getArrondissementsByCity } from '@/data/congoGeography';

interface AddressSelectorProps {
  selectedAddress: {
    street: string;
    city: string;
    arrondissement: string;
  };
  onAddressChange: (address: { street: string; city: string; arrondissement: string }) => void;
  showSaveOption?: boolean;
  onAddressSaved?: (address: UserAddress) => void;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  selectedAddress,
  onAddressChange,
  showSaveOption = true,
  onAddressSaved
}) => {
  const { 
    addresses, 
    addAddress, 
    isLoggedIn, 
    formatAddressForDisplay 
  } = useAddressManagement();
  
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [saveCurrentAddress, setSaveCurrentAddress] = useState(false);
  const cities = getCitiesNames();

  const handleSelectSavedAddress = (address: UserAddress) => {
    onAddressChange({
      street: address.street,
      city: address.city,
      arrondissement: address.arrondissement || ''
    });
    setShowNewAddressForm(false);
  };

  const handleSaveCurrentAddress = async () => {
    if (!selectedAddress.street || !selectedAddress.city || !selectedAddress.arrondissement) {
      return;
    }

    const savedAddress = await addAddress({
      street: selectedAddress.street,
      city: selectedAddress.city,
      arrondissement: selectedAddress.arrondissement
    });

    if (savedAddress) {
      setSaveCurrentAddress(false);
      onAddressSaved?.(savedAddress);
    }
  };

  const availableArrondissements = selectedAddress.city 
    ? getArrondissementsByCity(selectedAddress.city).map(arr => arr.name) 
    : [];

  return (
    <div className="space-y-4">
      {/* Adresses sauvegardées pour utilisateurs connectés */}
      {isLoggedIn && addresses.length > 0 && !showNewAddressForm && (
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Choisir une adresse sauvegardée
          </Label>
          <div className="space-y-2 mb-4">
            {addresses.map((address) => (
              <Card 
                key={address.id} 
                className={`cursor-pointer transition-all duration-200 ${
                  selectedAddress.street === address.street && 
                  selectedAddress.city === address.city && 
                  selectedAddress.arrondissement === address.arrondissement
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:shadow-md hover:bg-gray-50'
                }`}
                onClick={() => handleSelectSavedAddress(address)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="font-medium text-sm">
                        {formatAddressForDisplay(address)}
                      </span>
                      {address.is_default && (
                        <Badge variant="secondary" className="text-xs">Par défaut</Badge>
                      )}
                    </div>
                    {selectedAddress.street === address.street && 
                     selectedAddress.city === address.city && 
                     selectedAddress.arrondissement === address.arrondissement && (
                      <Check size={16} className="text-blue-600" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Bouton pour nouvelle adresse */}
      {isLoggedIn && addresses.length > 0 && !showNewAddressForm && (
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowNewAddressForm(true)}
          className="w-full"
        >
          <Plus size={16} className="mr-2" />
          Utiliser une nouvelle adresse
        </Button>
      )}

      {/* Formulaire d'adresse (nouveau ou existant) */}
      {(showNewAddressForm || addresses.length === 0 || !isLoggedIn) && (
        <div className="space-y-4">
          {isLoggedIn && addresses.length > 0 && (
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">
                Nouvelle adresse
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowNewAddressForm(false)}
              >
                Annuler
              </Button>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="street" className="text-sm font-medium text-gray-700">
                Adresse complète *
              </Label>
              <Input
                id="street"
                value={selectedAddress.street}
                onChange={(e) => onAddressChange({
                  ...selectedAddress,
                  street: e.target.value
                })}
                placeholder="Numéro, rue, quartier..."
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Ville *</Label>
                <Select 
                  value={selectedAddress.city} 
                  onValueChange={(value) => onAddressChange({
                    ...selectedAddress,
                    city: value,
                    arrondissement: ''
                  })}
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
                <Label className="text-sm font-medium text-gray-700">Arrondissement *</Label>
                <Select 
                  value={selectedAddress.arrondissement} 
                  onValueChange={(value) => onAddressChange({
                    ...selectedAddress,
                    arrondissement: value
                  })}
                  disabled={!selectedAddress.city}
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

            {/* Option de sauvegarde pour utilisateurs connectés */}
            {isLoggedIn && showSaveOption && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="save-address"
                    checked={saveCurrentAddress}
                    onChange={(e) => setSaveCurrentAddress(e.target.checked)}
                    className="rounded border-blue-300"
                  />
                  <Label htmlFor="save-address" className="text-sm text-blue-800">
                    Sauvegarder cette adresse pour mes prochaines commandes
                  </Label>
                </div>
                {saveCurrentAddress && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSaveCurrentAddress}
                    disabled={!selectedAddress.street || !selectedAddress.city || !selectedAddress.arrondissement}
                  >
                    Sauvegarder
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSelector;
