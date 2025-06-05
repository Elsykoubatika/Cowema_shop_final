
import { useState } from 'react';
import { CreateUserData } from '@/types/userManager';

interface FormData extends CreateUserData {
  confirmPassword: string;
}

export const useUserCreateForm = () => {
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: 'male',
    role: 'user',
    city: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error if it exists
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // If changing role and city is no longer required, clear it
    if (field === 'role') {
      const roleDefinitions = [
        { value: 'user', requiresCity: false },
        { value: 'seller', requiresCity: true },
        { value: 'team_lead', requiresCity: true },
        { value: 'sales_manager', requiresCity: false },
        { value: 'influencer', requiresCity: true },
        { value: 'admin', requiresCity: false }
      ];
      
      const newRole = roleDefinitions.find(r => r.value === value);
      if (newRole && !newRole.requiresCity) {
        setFormData(prev => ({ ...prev, city: '' }));
      }
    }
  };

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({
      ...prev,
      password,
      confirmPassword: password
    }));
  };

  const generateEmail = () => {
    if (!formData.nom) return;
    
    const nomFormatted = formData.nom
      .toLowerCase()
      .replace(/\s+/g, '.')
      .replace(/[^a-z0-9.]/g, '');
    
    const email = `${nomFormatted}@cowema.org`;
    setFormData(prev => ({ ...prev, email }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    }

    // Check if city is required based on role
    const roleDefinitions = [
      { value: 'user', requiresCity: false },
      { value: 'seller', requiresCity: true },
      { value: 'team_lead', requiresCity: true },
      { value: 'sales_manager', requiresCity: false },
      { value: 'influencer', requiresCity: true },
      { value: 'admin', requiresCity: false }
    ];
    
    const selectedRole = roleDefinitions.find(r => r.value === formData.role);
    if (selectedRole?.requiresCity && !formData.city.trim()) {
      newErrors.city = `La ville est requise pour le rôle ${formData.role}`;
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    console.log('🔄 Réinitialisation du formulaire de création d\'utilisateur');
    setFormData({
      nom: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      gender: 'male',
      role: 'user',
      city: '',
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return {
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
  };
};
