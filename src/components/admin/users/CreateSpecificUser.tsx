import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUserManager } from '@/hooks/admin/useUserManager';
import { CreateUserData } from '@/types/userManager';
import { User, Shield, Star, Users, TrendingUp, UserPlus, Copy, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CreateSpecificUser: React.FC = () => {
  const [formData, setFormData] = useState<CreateUserData>({
    nom: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
    gender: 'male',
    city: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createdUser, setCreatedUser] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [credentialsGenerated, setCredentialsGenerated] = useState(false);
  
  const { createUser } = useUserManager();
  const { toast } = useToast();

  const roleConfigs = [
    {
      value: 'user',
      label: 'Client Standard',
      description: 'Accès aux fonctionnalités de base',
      icon: User,
      color: 'blue',
      permissions: ['Passer des commandes', 'Voir son historique', 'Gérer son profil']
    },
    {
      value: 'seller',
      label: 'Vendeur',
      description: 'Gestion des ventes et suivi clients',
      icon: TrendingUp,
      color: 'green',
      permissions: ['Gérer ses clients', 'Créer des commandes', 'Voir ses statistiques'],
      requiresCity: true
    },
    {
      value: 'team_lead',
      label: 'Chef d\'équipe',
      description: 'Supervision d\'équipe de vendeurs',
      icon: Users,
      color: 'purple',
      permissions: ['Gérer son équipe', 'Voir rapports équipe', 'Assigner des clients'],
      requiresCity: true
    },
    {
      value: 'sales_manager',
      label: 'Responsable Commercial',
      description: 'Gestion globale des ventes',
      icon: Shield,
      color: 'orange',
      permissions: ['Voir tous les vendeurs', 'Rapports globaux', 'Gérer les promotions']
    },
    {
      value: 'influencer',
      label: 'Influenceur',
      description: 'Programme d\'affiliation et parrainage',
      icon: Star,
      color: 'yellow',
      permissions: ['Code de parrainage', 'Suivi commissions', 'Statistiques performance'],
      requiresCity: true
    },
    {
      value: 'admin',
      label: 'Administrateur',
      description: 'Accès complet au système',
      icon: Shield,
      color: 'red',
      permissions: ['Gestion complète', 'Configuration système', 'Tous les rapports']
    }
  ];

  const selectedRoleConfig = roleConfigs.find(r => r.value === formData.role);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    }

    if (selectedRoleConfig?.requiresCity && !formData.city.trim()) {
      newErrors.city = `La ville est requise pour le rôle ${selectedRoleConfig.label}`;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateCredentials = () => {
    console.log('🔄 Génération des identifiants...');
    
    if (!formData.nom.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez d'abord saisir le nom de l'utilisateur",
      });
      return;
    }

    const baseEmail = formData.nom
      .toLowerCase()
      .replace(/\s+/g, '.')
      .replace(/[^a-z0-9.]/g, '');
    
    const email = `${baseEmail}@cowema.local`;
    const password = generateSecurePassword();
    
    setFormData(prev => ({ ...prev, email, password }));
    setCredentialsGenerated(true);
    
    console.log('✅ Identifiants générés:', { email });
    
    toast({
      title: "Identifiants générés",
      description: "Email et mot de passe ont été générés automatiquement",
      duration: 3000,
    });
  };

  const generateSecurePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    // S'assurer qu'on a au moins une majuscule, une minuscule, un chiffre et un caractère spécial
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(Math.floor(Math.random() * 26));
    password += 'abcdefghijklmnopqrstuvwxyz'.charAt(Math.floor(Math.random() * 26));
    password += '0123456789'.charAt(Math.floor(Math.random() * 10));
    password += '!@#$%^&*'.charAt(Math.floor(Math.random() * 8));
    
    // Compléter avec des caractères aléatoires
    for (let i = 4; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Mélanger les caractères
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié!",
      description: `${label} copié dans le presse-papiers`,
      duration: 2000,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Début de la soumission du formulaire');
    console.log('📋 Données du formulaire:', {
      nom: formData.nom,
      role: formData.role,
      phone: formData.phone,
      city: formData.city,
      email: formData.email,
      hasPassword: !!formData.password
    });
    
    // Générer automatiquement les identifiants s'ils n'existent pas
    if (!formData.email || !formData.password) {
      console.log('⚠️ Identifiants manquants, génération automatique...');
      generateCredentials();
      
      // Attendre un peu pour que l'état soit mis à jour
      setTimeout(() => {
        handleSubmit(e);
      }, 100);
      return;
    }
    
    if (!validateForm()) {
      console.log('❌ Validation échouée:', errors);
      toast({
        variant: "destructive",
        title: "Erreur de validation",
        description: "Veuillez corriger les erreurs dans le formulaire",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('📡 Appel de createUser...');
      const success = await createUser(formData);
      
      if (success) {
        console.log('✅ Utilisateur créé avec succès');
        setCreatedUser({
          ...formData,
          createdAt: new Date().toISOString()
        });
        
        toast({
          title: "✅ Utilisateur créé avec succès!",
          description: `${formData.nom} a été créé avec le rôle ${selectedRoleConfig?.label}`,
          duration: 5000,
        });
      } else {
        console.log('❌ Échec de la création utilisateur');
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de créer l'utilisateur. Veuillez réessayer.",
        });
      }
    } catch (error) {
      console.error('❌ Erreur lors de la création:', error);
      toast({
        variant: "destructive",
        title: "Erreur lors de la création",
        description: error instanceof Error ? error.message : "Une erreur inconnue s'est produite",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      role: 'user',
      gender: 'male',
      city: '',
    });
    setCreatedUser(null);
    setErrors({});
    setCredentialsGenerated(false);
  };

  if (createdUser) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mr-4">
              ✓
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900">Utilisateur créé avec succès!</h3>
              <p className="text-green-700">Le profil utilisateur a été créé avec les identifiants suivants</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded border mb-4">
            <h4 className="font-medium text-gray-900 mb-3">Informations de connexion</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <div className="font-mono text-sm font-medium">{createdUser.email}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(createdUser.email, 'Email')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <span className="text-sm text-gray-600">Mot de passe:</span>
                  <div className="font-mono text-sm font-medium">
                    {showPassword ? createdUser.password : '••••••••••••'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(createdUser.password, 'Mot de passe')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded border mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Informations utilisateur</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-600">Nom:</span> {createdUser.nom}</div>
              <div><span className="text-gray-600">Rôle:</span> {selectedRoleConfig?.label}</div>
              <div><span className="text-gray-600">Téléphone:</span> {createdUser.phone}</div>
              {createdUser.city && <div><span className="text-gray-600">Ville:</span> {createdUser.city}</div>}
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded p-3 mb-4">
            <p className="text-sm text-orange-800">
              <strong>Important:</strong> Sauvegardez ces identifiants maintenant. 
              Le mot de passe ne sera plus visible après avoir quitté cette page.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={resetForm} className="flex-1">
              Créer un autre utilisateur
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Sélection du rôle */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Type d'utilisateur</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roleConfigs.map((role) => {
              const IconComponent = role.icon;
              const isSelected = formData.role === role.value;
              return (
                <div
                  key={role.value}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected
                      ? `border-${role.color}-500 bg-${role.color}-50`
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, role: role.value as any }))}
                >
                  <div className="flex items-center mb-3">
                    <IconComponent className={`w-6 h-6 text-${role.color}-600 mr-3`} />
                    <h4 className="font-medium text-gray-900">{role.label}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                  <div className="space-y-1">
                    {role.permissions.map((permission, index) => (
                      <div key={index} className="text-xs text-gray-500 flex items-center">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                        {permission}
                      </div>
                    ))}
                  </div>
                  {role.requiresCity && (
                    <div className="mt-2 text-xs text-orange-600 font-medium">
                      ⚠️ Ville requise
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Informations personnelles */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, nom: e.target.value }));
                  if (errors.nom) setErrors(prev => ({ ...prev, nom: '' }));
                  // Reset credentials if name changes
                  if (credentialsGenerated) {
                    setCredentialsGenerated(false);
                    setFormData(prev => ({ ...prev, email: '', password: '' }));
                  }
                }}
                className={`w-full px-3 py-2 border ${errors.nom ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                placeholder="Nom complet de l'utilisateur"
                required
              />
              {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, phone: e.target.value }));
                  if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                }}
                className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                placeholder="+242 XX XXX XXXX"
                required
              />
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="male">Homme</option>
                <option value="female">Femme</option>
              </select>
            </div>

            {selectedRoleConfig?.requiresCity && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville d'affectation <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, city: e.target.value }));
                    if (errors.city) setErrors(prev => ({ ...prev, city: '' }));
                  }}
                  className={`w-full px-3 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  required
                >
                  <option value="">Sélectionner une ville</option>
                  <option value="brazzaville">Brazzaville</option>
                  <option value="pointe-noire">Pointe-Noire</option>
                  <option value="dolisie">Dolisie</option>
                  <option value="ouesso">Ouesso</option>
                  <option value="impfondo">Impfondo</option>
                </select>
                {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Identifiants de connexion */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Identifiants de connexion</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800 mb-3">
              Les identifiants de connexion seront générés automatiquement basés sur le nom de l'utilisateur.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={generateCredentials}
              disabled={!formData.nom || isLoading}
              className="mb-3"
            >
              Générer les identifiants
            </Button>
          </div>

          {(formData.email && formData.password) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email généré</label>
                <div className="flex">
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-600"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => copyToClipboard(formData.email, 'Email')}
                    className="rounded-l-none"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe généré</label>
                <div className="flex">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 bg-gray-50 text-gray-600 font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPassword(!showPassword)}
                    className="rounded-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => copyToClipboard(formData.password, 'Mot de passe')}
                    className="rounded-l-none"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Affichage des erreurs générales */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-red-800 font-medium mb-2">Erreurs de validation :</h4>
            <ul className="text-red-700 text-sm space-y-1">
              {Object.values(errors).map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !formData.nom || !formData.phone}
            className="min-w-[200px]"
          >
            {isLoading ? (
              <>
                <div className="animate-spin mr-2">⟳</div>
                Création en cours...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Créer l'utilisateur {selectedRoleConfig?.label}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateSpecificUser;
