
import React from 'react';
import { Button } from '@/components/ui/button';

interface PersonalInfoFieldsProps {
  formData: {
    nom: string;
    email: string;
    phone: string;
    gender: string;
  };
  errors: Record<string, string>;
  onFieldChange: (field: string, value: string) => void;
  onGenerateEmail: () => void;
  isDisabled?: boolean;
}

const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({
  formData,
  errors,
  onFieldChange,
  onGenerateEmail,
  isDisabled
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nom" className="block mb-1 font-medium text-gray-700">
            Nom complet <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={(e) => onFieldChange('nom', e.target.value)}
              disabled={isDisabled}
              placeholder="Nom complet de l'utilisateur"
              className={`flex-1 px-3 py-2 border ${errors.nom ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onGenerateEmail}
              disabled={isDisabled || !formData.nom}
              className="px-3"
            >
              📧
            </Button>
          </div>
          {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
            Email de connexion <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => onFieldChange('email', e.target.value)}
            disabled={isDisabled}
            placeholder="email@cowema.org"
            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block mb-1 font-medium text-gray-700">
            Téléphone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={(e) => onFieldChange('phone', e.target.value)}
            disabled={isDisabled}
            placeholder="+242 XX XXX XXXX"
            className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="gender" className="block mb-1 font-medium text-gray-700">
            Genre <span className="text-red-500">*</span>
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={(e) => onFieldChange('gender', e.target.value)}
            disabled={isDisabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="male">Homme</option>
            <option value="female">Femme</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default PersonalInfoFields;
