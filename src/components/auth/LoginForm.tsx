
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedAuth } from '../../hooks/useUnifiedAuth';

interface LoginFormProps {
  onSuccess: () => void;
  expectedRoleType?: 'admin' | 'influencer' | 'client';
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, expectedRoleType = 'client' }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useUnifiedAuth();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
      isValid = false;
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
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
        console.log('Attempting login with role type:', expectedRoleType);
        
        const success = await login(formData.email, formData.password, expectedRoleType);
        
        if (success) {
          onSuccess();
        }
      } catch (error: any) {
        console.error('Login error:', error);
        
        let errorMessage = "Une erreur s'est produite lors de la connexion.";
        
        // Messages d'erreur plus spécifiques
        if (error.message?.includes('Profil utilisateur introuvable')) {
          errorMessage = "Votre compte existe mais le profil est incomplet. Veuillez contacter l'assistance ou réessayer dans quelques instants.";
        } else if (error.message?.includes('Email ou mot de passe incorrect')) {
          errorMessage = "Email ou mot de passe incorrect. Vérifiez vos informations.";
        } else if (error.message?.includes('role mismatch') || error.message?.includes('privilèges spéciaux')) {
          if (expectedRoleType === 'client') {
            errorMessage = "Ce compte a des privilèges spéciaux. Utilisez la page de connexion admin ou influenceur.";
          } else if (expectedRoleType === 'admin') {
            errorMessage = "Ce compte n'a pas les droits d'administration. Utilisez la page de connexion client ou influenceur.";
          } else if (expectedRoleType === 'influencer') {
            errorMessage = "Ce compte n'est pas un compte influenceur. Utilisez la page de connexion appropriée.";
          }
        }
        
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
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
          className={`w-full px-3 py-2 border ${errors.email ? 'border-danger' : 'border-gray-300'} rounded-md`}
          disabled={isLoading}
          placeholder="votre@email.com"
        />
        {errors.email && <p className="mt-1 text-sm text-danger">{errors.email}</p>}
      </div>
      
      <div className="mb-6">
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
            className={`w-full px-3 py-2 border ${errors.password ? 'border-danger' : 'border-gray-300'} rounded-md`}
            disabled={isLoading}
            placeholder="Votre mot de passe"
          />
          <button 
            type="button" 
            onClick={togglePasswordVisibility} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-danger">{errors.password}</p>}
        <div className="text-right mt-1">
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            Mot de passe oublié?
          </Link>
        </div>
      </div>
      
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="animate-spin">⟳</span> Connexion en cours...
          </>
        ) : (
          <>
            <LogIn size={18} />
            Se connecter
          </>
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
