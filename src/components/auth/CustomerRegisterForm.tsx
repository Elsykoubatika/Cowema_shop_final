
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '../../hooks/useAuthStore';
import { useToast } from '../../hooks/use-toast';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

const CustomerRegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nom: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: 'male' as 'male' | 'female',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({
    nom: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
      isValid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
      isValid = false;
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis';
      isValid = false;
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      isValid = false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      isValid = false;
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Vous devez accepter les conditions d\'utilisation';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        const success = await register({
          nom: formData.nom,
          firstName: formData.firstName || formData.nom,
          lastName: formData.lastName || '',
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          gender: formData.gender,
          role: 'user', // Toujours 'user' pour les clients
          city: undefined,
        });
        
        if (success) {
          toast({
            title: "Inscription réussie",
            description: "Votre compte client a été créé avec succès.",
            duration: 5000,
          });
          
          navigate('/account');
        } else {
          toast({
            variant: "destructive",
            title: "Erreur d'inscription",
            description: "Impossible de créer le compte. L'email est peut-être déjà utilisé.",
            duration: 5000,
          });
        }
      } catch (error: any) {
        console.error('Registration error:', error);
        toast({
          variant: "destructive",
          title: "Erreur d'inscription",
          description: error.message || "Une erreur s'est produite. Veuillez réessayer.",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="nom" className="block mb-1 font-medium">
          Nom complet <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          id="nom"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          disabled={isLoading}
          className={`w-full px-3 py-2 border ${errors.nom ? 'border-danger' : 'border-gray-300'} rounded-md`}
        />
        {errors.nom && <p className="mt-1 text-sm text-danger">{errors.nom}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="firstName" className="block mb-1 font-medium">
            Prénom (optionnel)
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="lastName" className="block mb-1 font-medium">
            Nom de famille (optionnel)
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="email" className="block mb-1 font-medium">
          Email <span className="text-danger">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          className={`w-full px-3 py-2 border ${errors.email ? 'border-danger' : 'border-gray-300'} rounded-md`}
        />
        {errors.email && <p className="mt-1 text-sm text-danger">{errors.email}</p>}
      </div>
      
      <div className="mb-4">
        <label htmlFor="phone" className="block mb-1 font-medium">
          Téléphone <span className="text-danger">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          disabled={isLoading}
          className={`w-full px-3 py-2 border ${errors.phone ? 'border-danger' : 'border-gray-300'} rounded-md`}
        />
        {errors.phone && <p className="mt-1 text-sm text-danger">{errors.phone}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="gender" className="block mb-1 font-medium">
          Genre <span className="text-danger">*</span>
        </label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="male">Homme</option>
          <option value="female">Femme</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label htmlFor="password" className="block mb-1 font-medium">
          Mot de passe <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            className={`w-full px-3 py-2 border ${errors.password ? 'border-danger' : 'border-gray-300'} rounded-md`}
          />
          <button 
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-danger">{errors.password}</p>}
      </div>
      
      <div className="mb-6">
        <label htmlFor="confirmPassword" className="block mb-1 font-medium">
          Confirmer le mot de passe <span className="text-danger">*</span>
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
            className={`w-full px-3 py-2 border ${errors.confirmPassword ? 'border-danger' : 'border-gray-300'} rounded-md`}
          />
          <button 
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.confirmPassword && <p className="mt-1 text-sm text-danger">{errors.confirmPassword}</p>}
      </div>
      
      <div className="mb-6">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="acceptTerms"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1"
          />
          <label htmlFor="acceptTerms" className="ml-2">
            J'accepte les <a href="#" className="text-primary hover:underline">conditions d'utilisation</a> et la <a href="#" className="text-primary hover:underline">politique de confidentialité</a>
          </label>
        </div>
        {errors.acceptTerms && <p className="mt-1 text-sm text-danger">{errors.acceptTerms}</p>}
      </div>
      
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="animate-spin">⟳</span> Inscription en cours...
          </>
        ) : (
          <>
            <UserPlus size={18} />
            Créer mon compte client
          </>
        )}
      </Button>
    </form>
  );
};

export default CustomerRegisterForm;
