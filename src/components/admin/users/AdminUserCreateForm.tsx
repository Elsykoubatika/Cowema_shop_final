
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUserManager } from '@/hooks/admin/useUserManager';
import { UserPlus } from 'lucide-react';
import RoleSelector from './components/forms/RoleSelector';
import PersonalInfoFields from './components/forms/PersonalInfoFields';
import CitySelector from './components/forms/CitySelector';
import PasswordFields from './components/forms/PasswordFields';
import { useUserCreateForm } from './components/forms/useUserCreateForm';

interface AdminUserCreateFormProps {
  onSuccess?: () => void;
}

const AdminUserCreateForm: React.FC<AdminUserCreateFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createUser, loading } = useUserManager();

  const {
    formData,
    errors,
    showPassword,
    showConfirmPassword,
    handleFieldChange,
    generatePassword,
    generateEmail,
    validateForm,
    resetForm,
    togglePasswordVisibility
  } = useUserCreateForm();

  // Check if city is required based on role
  const roleDefinitions = [
    { value: 'user', requiresCity: false },
    { value: 'seller', requiresCity: true },
    { value: 'team_lead', requiresCity: true },
    { value: 'sales_manager', requiresCity: false },
    { value: 'influencer', requiresCity: true },
    { value: 'admin', requiresCity: false }
  ];

  const selectedRole = roleDefinitions.find(role => role.value === formData.role);
  const isCityRequired = selectedRole?.requiresCity || false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 Form submission started');
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { confirmPassword, ...userData } = formData;
      console.log('🚀 Submitting user data:', { ...userData, password: '[HIDDEN]' });
      
      const success = await createUser(userData);
      
      if (success) {
        console.log('✅ User created successfully, resetting form');
        resetForm(); // Vider le formulaire après création réussie
        onSuccess?.();
      } else {
        console.log('❌ User creation failed');
      }
    } catch (error: any) {
      console.error('❌ Error during form submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <RoleSelector
        selectedRole={formData.role}
        onRoleChange={(role) => handleFieldChange('role', role)}
        isDisabled={isLoading}
      />

      <PersonalInfoFields
        formData={{
          nom: formData.nom,
          email: formData.email,
          phone: formData.phone,
          gender: formData.gender
        }}
        errors={errors}
        onFieldChange={handleFieldChange}
        onGenerateEmail={generateEmail}
        isDisabled={isLoading}
      />

      {isCityRequired && (
        <CitySelector
          value={formData.city}
          onChange={(value) => handleFieldChange('city', value)}
          error={errors.city}
          isRequired={true}
          isDisabled={isLoading}
        />
      )}

      <PasswordFields
        formData={{
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }}
        errors={errors}
        showPassword={showPassword}
        showConfirmPassword={showConfirmPassword}
        onFieldChange={handleFieldChange}
        onTogglePasswordVisibility={togglePasswordVisibility}
        onGeneratePassword={generatePassword}
        isDisabled={isLoading}
      />
      
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="animate-spin">⟳</span> Création en cours...
          </>
        ) : (
          <>
            <UserPlus size={18} />
            Créer l'utilisateur {selectedRole?.value || 'utilisateur'}
          </>
        )}
      </Button>
    </form>
  );
};

export default AdminUserCreateForm;
