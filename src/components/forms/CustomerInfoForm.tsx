
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Phone, Mail, MapPin } from 'lucide-react';
import AddressSelector from './AddressSelector';

interface CustomerInfoFormProps {
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    neighborhood: string;
    notes: string;
  };
  cities: Array<{ name: string; neighborhoods: Array<{ name: string }> }>;
  onUpdateField: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({
  customer,
  cities,
  onUpdateField,
  errors = {}
}) => {

  const handleAddressChange = (address: { street: string; city: string; arrondissement: string }) => {
    onUpdateField('address', address.street);
    onUpdateField('city', address.city);
    onUpdateField('neighborhood', address.arrondissement);
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          Informations personnelles
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Veuillez remplir vos coordonnées pour la livraison
        </p>
      </div>

      {/* Nom et Prénom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
            Prénom *
          </Label>
          <div className="relative">
            <Input
              id="firstName"
              type="text"
              value={customer.firstName}
              onChange={(e) => onUpdateField('firstName', e.target.value)}
              placeholder="Votre prénom"
              className={`pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.firstName && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
              {errors.firstName}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
            Nom *
          </Label>
          <div className="relative">
            <Input
              id="lastName"
              type="text"
              value={customer.lastName}
              onChange={(e) => onUpdateField('lastName', e.target.value)}
              placeholder="Votre nom"
              className={`pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.lastName && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Téléphone *
          </Label>
          <div className="relative">
            <Input
              id="phone"
              type="tel"
              value={customer.phone}
              onChange={(e) => onUpdateField('phone', e.target.value)}
              placeholder="06 XX XX XX XX"
              className={`pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
            />
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.phone && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
              {errors.phone}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email (optionnel)
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={customer.email}
              onChange={(e) => onUpdateField('email', e.target.value)}
              placeholder="votre@email.com"
              className={`pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.email && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Adresse de livraison avec sélecteur intelligent */}
      <div className="border-t pt-4">
        <h4 className="text-md font-medium text-gray-900 flex items-center gap-2 mb-4">
          <MapPin className="h-4 w-4 text-green-600" />
          Adresse de livraison
        </h4>

        <AddressSelector
          selectedAddress={{
            street: customer.address,
            city: customer.city,
            arrondissement: customer.neighborhood
          }}
          onAddressChange={handleAddressChange}
          showSaveOption={true}
        />

        <div className="space-y-2 mt-4">
          <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
            Instructions de livraison (optionnel)
          </Label>
          <Textarea
            id="notes"
            value={customer.notes}
            onChange={(e) => onUpdateField('notes', e.target.value)}
            placeholder="Instructions spéciales, étage, code d'accès..."
            className="min-h-20 resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoForm;
