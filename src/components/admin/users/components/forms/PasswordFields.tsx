
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordFieldsProps {
  formData: {
    password: string;
    confirmPassword: string;
  };
  errors: Record<string, string>;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onFieldChange: (field: string, value: string) => void;
  onTogglePasswordVisibility: (field: 'password' | 'confirmPassword') => void;
  onGeneratePassword: () => void;
  isDisabled?: boolean;
}

const PasswordFields: React.FC<PasswordFieldsProps> = ({
  formData,
  errors,
  showPassword,
  showConfirmPassword,
  onFieldChange,
  onTogglePasswordVisibility,
  onGeneratePassword,
  isDisabled
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
          Mot de passe <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) => onFieldChange('password', e.target.value)}
              disabled={isDisabled}
              placeholder="Mot de passe sécurisé"
              className={`w-full px-3 py-2 pr-10 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
            />
            <button 
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => onTogglePasswordVisibility('password')}
              disabled={isDisabled}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onGeneratePassword}
            disabled={isDisabled}
            className="px-3"
          >
            🎲
          </Button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block mb-1 font-medium text-gray-700">
          Confirmer le mot de passe <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => onFieldChange('confirmPassword', e.target.value)}
            disabled={isDisabled}
            placeholder="Répéter le mot de passe"
            className={`w-full px-3 py-2 pr-10 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
          />
          <button 
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => onTogglePasswordVisibility('confirmPassword')}
            disabled={isDisabled}
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
      </div>
    </div>
  );
};

export default PasswordFields;
