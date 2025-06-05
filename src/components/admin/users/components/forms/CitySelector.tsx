
import React from 'react';

interface CitySelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
}

const CitySelector: React.FC<CitySelectorProps> = ({
  value,
  onChange,
  error,
  isRequired,
  isDisabled
}) => {
  return (
    <div>
      <label htmlFor="city" className="block mb-1 font-medium text-gray-700">
        Ville d'affectation {isRequired && <span className="text-red-500">*</span>}
      </label>
      <select
        id="city"
        name="city"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isDisabled}
        className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
      >
        <option value="">Sélectionner une ville</option>
        <option value="brazzaville">Brazzaville</option>
        <option value="pointe-noire">Pointe-Noire</option>
        <option value="dolisie">Dolisie</option>
        <option value="ouesso">Ouesso</option>
        <option value="impfondo">Impfondo</option>
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default CitySelector;
