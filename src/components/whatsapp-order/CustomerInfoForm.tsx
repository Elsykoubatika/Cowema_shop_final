
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CityDeliveryFees } from '@/hooks/useDeliveryFees';
import { FormData } from './useOrderFormState';

interface CustomerInfoFormProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  cities: CityDeliveryFees[];
  availableNeighborhoods: string[];
}

const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({
  formData,
  handleChange,
  cities,
  availableNeighborhoods
}) => {
  return (
    <>
      <div>
        <label htmlFor="clientName" className="block text-sm font-medium mb-1">
          Nom <span className="text-red-500">*</span>
        </label>
        <Input
          id="clientName"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="clientPhone" className="block text-sm font-medium mb-1">
          Téléphone <span className="text-red-500">*</span>
        </label>
        <Input
          id="clientPhone"
          name="phone"
          type="tel"
          required
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="clientEmail" className="block text-sm font-medium mb-1">
          Email <span className="text-gray-500 text-xs">(facultatif)</span>
        </label>
        <Input
          id="clientEmail"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="clientCity" className="block text-sm font-medium mb-1">
            Ville <span className="text-red-500">*</span>
          </label>
          <select
            id="clientCity"
            name="city"
            required
            value={formData.city}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {cities.map(city => (
              <option key={city.name} value={city.name}>{city.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="clientNeighborhood" className="block text-sm font-medium mb-1">
            Arrondissement <span className="text-red-500">*</span>
          </label>
          <select
            id="clientNeighborhood"
            name="neighborhood"
            required
            value={formData.neighborhood}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {availableNeighborhoods.map(hood => (
              <option key={hood} value={hood}>{hood}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="clientAddress" className="block text-sm font-medium mb-1">
          Quartier/Adresse détaillée <span className="text-red-500">*</span>
        </label>
        <Input
          id="clientAddress"
          name="address"
          type="text"
          required
          value={formData.address}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="clientNotes" className="block text-sm font-medium mb-1">
          Notes supplémentaires <span className="text-gray-500 text-xs">(facultatif)</span>
        </label>
        <Textarea
          id="clientNotes"
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
        />
      </div>
    </>
  );
};

export default CustomerInfoForm;
