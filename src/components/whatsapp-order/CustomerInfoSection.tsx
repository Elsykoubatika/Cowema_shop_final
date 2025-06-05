
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Phone, Mail, MapPin, Home, FileText } from 'lucide-react';

interface CustomerInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  neighborhood: string;
  notes: string;
  promoCode: string;
}

interface CustomerInfoSectionProps {
  customerInfo: CustomerInfo;
  cities: any[];
  neighborhoods: { [key: string]: string[] };
  onInputChange: (field: string, value: string) => void;
}

const CustomerInfoSection: React.FC<CustomerInfoSectionProps> = ({
  customerInfo,
  cities,
  neighborhoods,
  onInputChange
}) => {
  const availableNeighborhoods = neighborhoods[customerInfo.city] || [];

  console.log('CustomerInfoSection render - customerInfo:', customerInfo);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold flex items-center gap-2">
        <User size={18} />
        Informations de Livraison
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="flex items-center gap-2">
            <User size={14} />
            Prénom *
          </Label>
          <Input
            id="firstName"
            value={customerInfo.firstName}
            onChange={(e) => {
              console.log('CustomerInfoSection - firstName change:', e.target.value);
              onInputChange('firstName', e.target.value);
            }}
            required
            placeholder="Votre prénom"
          />
        </div>
        
        <div>
          <Label htmlFor="lastName" className="flex items-center gap-2">
            <User size={14} />
            Nom *
          </Label>
          <Input
            id="lastName"
            value={customerInfo.lastName}
            onChange={(e) => {
              console.log('CustomerInfoSection - lastName change:', e.target.value);
              onInputChange('lastName', e.target.value);
            }}
            required
            placeholder="Votre nom"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone size={14} />
            Téléphone *
          </Label>
          <Input
            id="phone"
            type="tel"
            value={customerInfo.phone}
            onChange={(e) => {
              console.log('CustomerInfoSection - phone change:', e.target.value);
              onInputChange('phone', e.target.value);
            }}
            required
            placeholder="+242 06 123 45 67"
          />
        </div>
        
        <div>
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail size={14} />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={customerInfo.email}
            onChange={(e) => {
              console.log('CustomerInfoSection - email change:', e.target.value);
              onInputChange('email', e.target.value);
            }}
            placeholder="votre@email.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city" className="flex items-center gap-2">
            <MapPin size={14} />
            Ville *
          </Label>
          <Select 
            value={customerInfo.city} 
            onValueChange={(value) => {
              console.log('CustomerInfoSection - city change:', value);
              onInputChange('city', value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une ville" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(neighborhoods).map(city => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="neighborhood" className="flex items-center gap-2">
            <MapPin size={14} />
            Arrondissement *
          </Label>
          <Select 
            value={customerInfo.neighborhood} 
            onValueChange={(value) => {
              console.log('CustomerInfoSection - neighborhood change:', value);
              onInputChange('neighborhood', value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un arrondissement" />
            </SelectTrigger>
            <SelectContent>
              {availableNeighborhoods.map(neighborhood => (
                <SelectItem key={neighborhood} value={neighborhood}>
                  {neighborhood}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="address" className="flex items-center gap-2">
          <Home size={14} />
          Adresse *
        </Label>
        <Textarea
          id="address"
          value={customerInfo.address}
          onChange={(e) => {
            console.log('CustomerInfoSection - address change:', e.target.value);
            onInputChange('address', e.target.value);
          }}
          required
          placeholder="Détails de votre adresse (rue, numéro, points de repère)"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="notes" className="flex items-center gap-2">
          <FileText size={14} />
          Notes (optionnel)
        </Label>
        <Textarea
          id="notes"
          value={customerInfo.notes}
          onChange={(e) => {
            console.log('CustomerInfoSection - notes change:', e.target.value);
            onInputChange('notes', e.target.value);
          }}
          placeholder="Instructions spéciales pour la livraison..."
          rows={2}
        />
      </div>
    </div>
  );
};

export default CustomerInfoSection;
