
import React from 'react';
import { useUnifiedCart } from './CartProvider';
import { useDeliveryFees } from '../../hooks/useDeliveryFees';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Truck, MapPin } from 'lucide-react';

const DeliverySelector: React.FC = () => {
  const { deliveryInfo, setDeliveryInfo, deliveryFee } = useUnifiedCart();
  const { cities } = useDeliveryFees();

  const selectedCity = cities.find(city => city.name === deliveryInfo?.city);
  const neighborhoods = selectedCity?.neighborhoods || [];

  const handleCityChange = (cityName: string) => {
    const city = cities.find(c => c.name === cityName);
    if (city && city.neighborhoods.length > 0) {
      setDeliveryInfo(cityName, city.neighborhoods[0].name);
    }
  };

  const handleNeighborhoodChange = (neighborhoodName: string) => {
    if (deliveryInfo?.city) {
      setDeliveryInfo(deliveryInfo.city, neighborhoodName);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border">
      <div className="flex items-center gap-2 text-blue-700 font-medium">
        <Truck size={18} />
        <span>Informations de livraison</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* City Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">Ville</label>
          <Select 
            value={deliveryInfo?.city || ''} 
            onValueChange={handleCityChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez votre ville" />
            </SelectTrigger>
            <SelectContent>
              {cities.map(city => (
                <SelectItem key={city.name} value={city.name}>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    {city.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Neighborhood Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">Arrondissement</label>
          <Select 
            value={deliveryInfo?.neighborhood || ''} 
            onValueChange={handleNeighborhoodChange}
            disabled={!deliveryInfo?.city}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez l'arrondissement" />
            </SelectTrigger>
            <SelectContent>
              {neighborhoods.map(neighborhood => (
                <SelectItem key={neighborhood.name} value={neighborhood.name}>
                  <div className="flex items-center justify-between w-full">
                    <span>{neighborhood.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {neighborhood.fee.toLocaleString()} FCFA
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Delivery Fee Display */}
      {deliveryInfo && deliveryFee > 0 && (
        <div className="bg-white p-3 rounded border border-blue-200">
          <div className="flex justify-between items-center">
            <span className="text-sm">
              Frais de livraison pour {deliveryInfo.neighborhood}, {deliveryInfo.city}:
            </span>
            <span className="font-bold text-primary">
              {deliveryFee.toLocaleString()} FCFA
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliverySelector;
