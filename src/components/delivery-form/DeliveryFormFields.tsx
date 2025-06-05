
import React from 'react';
import { DeliveryFormData } from './useDeliveryForm';
import { CityDeliveryFees } from '@/hooks/useDeliveryFees';

interface DeliveryFormFieldsProps {
  formData: DeliveryFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  cities: CityDeliveryFees[];
  neighborhoods: string[];
}

const DeliveryFormFields: React.FC<DeliveryFormFieldsProps> = ({
  formData,
  handleChange,
  cities,
  neighborhoods
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block mb-1 font-medium after:content-['*'] after:text-red-500 after:ml-0.5">
          Nom complet
        </label>
        <input 
          id="name" 
          name="name" 
          className="w-full p-2 border border-gray-300 rounded-md"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="block mb-1 font-medium after:content-['*'] after:text-red-500 after:ml-0.5">
          Téléphone
        </label>
        <input 
          id="phone" 
          name="phone" 
          type="tel" 
          className="w-full p-2 border border-gray-300 rounded-md"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block mb-1 font-medium">
          Email <span className="text-gray-500 font-normal">(facultatif)</span>
        </label>
        <input 
          id="email" 
          name="email" 
          type="email" 
          className="w-full p-2 border border-gray-300 rounded-md"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="city" className="block mb-1 font-medium after:content-['*'] after:text-red-500 after:ml-0.5">
          Ville
        </label>
        <select 
          id="city" 
          name="city" 
          className="w-full p-2 border border-gray-300 rounded-md"
          value={formData.city}
          onChange={handleChange}
          required
        >
          <option value="">Sélectionnez votre ville</option>
          {cities.map(city => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="neighborhood" className="block mb-1 font-medium after:content-['*'] after:text-red-500 after:ml-0.5">
          Arrondissement
        </label>
        <select 
          id="neighborhood" 
          name="neighborhood" 
          className="w-full p-2 border border-gray-300 rounded-md"
          value={formData.neighborhood}
          onChange={handleChange}
          required
          disabled={!formData.city}
        >
          <option value="">Sélectionnez votre arrondissement</option>
          {neighborhoods.map(neighborhood => (
            <option key={neighborhood} value={neighborhood}>
              {neighborhood}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="address" className="block mb-1 font-medium">
          Adresse détaillée <span className="text-gray-500 font-normal">(facultatif)</span>
        </label>
        <input 
          id="address" 
          name="address" 
          className="w-full p-2 border border-gray-300 rounded-md"
          value={formData.address}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="notes" className="block mb-1 font-medium">
          Notes supplémentaires <span className="text-gray-500 font-normal">(facultatif)</span>
        </label>
        <textarea 
          id="notes" 
          name="notes" 
          rows={3} 
          className="w-full p-2 border border-gray-300 rounded-md"
          value={formData.notes}
          onChange={handleChange}
        ></textarea>
      </div>
    </div>
  );
};

export default DeliveryFormFields;
