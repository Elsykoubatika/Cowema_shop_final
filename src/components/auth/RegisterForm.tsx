import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedAuth } from '../../hooks/useUnifiedAuth';
import { useReferralCode } from '../../hooks/useReferralCode';
import { useLoyaltyPoints } from '../../hooks/useLoyaltyPoints';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nom: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    gender: 'male' as 'male' | 'female',
    referralCode: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const { register } = useUnifiedAuth();
  const navigate = useNavigate();
  const { getCurrentReferralCode, clearReferralCode } = useReferralCode();
  const { useReferralCode: applyReferralCode } = useLoyaltyPoints();

  // Pré-remplir le code de parrainage depuis l'URL
  useEffect(() => {
    const referralCode = getCurrentReferralCode();
    if (referralCode) {
      setFormData(prev => ({
        ...prev,
        referralCode: referralCode
      }));
    }
  }, [getCurrentReferralCode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: Record<string, string> = {};
    
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
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        console.log('Attempting registration with:', formData.email);
        
        const success = await register({
          nom: formData.nom,
          firstName: formData.firstName || formData.nom,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          city: formData.city,
          gender: formData.gender,
          role: 'user'
        });
        
        if (success) {
          // Si inscription réussie et qu'il y a un code de parrainage
          if (formData.referralCode && formData.referralCode.startsWith('YBB')) {
            try {
              await applyReferralCode(formData.referralCode);
              clearReferralCode(); // Supprimer le code du localStorage
            } catch (referralError) {
              console.warn('Erreur lors de l\'application du code de parrainage:', referralError);
              // Ne pas bloquer l'inscription si le code de parrainage échoue
            }
          }

          toast({
            title: "Inscription réussie!",
            description: formData.referralCode ? 
              "Votre compte a été créé avec succès et le code de parrainage a été appliqué!" :
              "Votre compte a été créé avec succès.",
          });
          navigate('/login');
        }
      } catch (error: any) {
        console.error('Registration error:', error);
        toast({
          variant: "destructive",
          title: "Erreur d'inscription",
          description: "Une erreur s'est produite lors de l'inscription.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <UserPlus size={24} />
        Créer un compte
      </h1>
      
      <form onSubmit={handleSubmit}>
        {/* Code de parrainage en premier pour être visible */}
        {formData.referralCode && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 font-medium">
              🎉 Code de parrainage détecté : {formData.referralCode}
            </p>
            <p className="text-xs text-green-600">
              Le parrain gagnera des points Ya Ba Boss grâce à vous !
            </p>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="referralCode" className="block mb-1 font-medium">
            Code de parrainage (optionnel)
          </label>
          <input
            type="text"
            id="referralCode"
            name="referralCode"
            value={formData.referralCode}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={isLoading}
            placeholder="YBB12345678"
          />
          <p className="text-xs text-gray-500 mt-1">
            Entrez le code d'un ami pour qu'il gagne des points Ya Ba Boss
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="nom" className="block mb-1 font-medium">
              Nom complet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.nom ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              disabled={isLoading}
              placeholder="Votre nom"
            />
            {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
          </div>
          
          <div>
            <label htmlFor="firstName" className="block mb-1 font-medium">
              Prénom
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={isLoading}
              placeholder="Votre prénom"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            disabled={isLoading}
            placeholder="votre@email.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Mot de passe <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                disabled={isLoading}
                placeholder="Minimum 6 caractères"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block mb-1 font-medium">
              Confirmer le mot de passe <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                disabled={isLoading}
                placeholder="Répétez le mot de passe"
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="phone" className="block mb-1 font-medium">
              Téléphone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={isLoading}
              placeholder="+225 XX XX XX XX"
            />
          </div>
          
          <div>
            <label htmlFor="city" className="block mb-1 font-medium">
              Ville
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={isLoading}
              placeholder="Votre ville"
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="gender" className="block mb-1 font-medium">
            Genre <span className="text-red-500">*</span>
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={isLoading}
          >
            <option value="male">Homme</option>
            <option value="female">Femme</option>
          </select>
        </div>
        
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
              Créer mon compte
            </>
          )}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p>
          Vous avez déjà un compte?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
