
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { Edit2, Save, X, Loader2, User, Phone, Mail, MapPin, Calendar, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const EnhancedProfileEditForm: React.FC = () => {
  const { profile, updateProfile } = useUserProfile();
  const { user } = useUnifiedAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    first_name: '',
    last_name: '',
    phone: '',
    city: '',
    gender: 'male' as 'male' | 'female'
  });

  const startEditing = () => {
    if (profile) {
      setFormData({
        nom: profile.nom || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        city: profile.city || '',
        gender: profile.gender || 'male'
      });
    }
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setFormData({
      nom: '',
      first_name: '',
      last_name: '',
      phone: '',
      city: '',
      gender: 'male'
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await updateProfile(formData);
    if (success) {
      setIsEditing(false);
    }
    setSaving(false);
  };

  const cities = [
    'Brazzaville',
    'Pointe-Noire',
    'Dolisie',
    'Ouesso',
    'Impfondo',
    'Owando',
    'Madingou',
    'Gamboma'
  ];

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'sales_manager': return 'Responsable Vente';
      case 'team_lead': return 'Chef d\'équipe';
      case 'seller': return 'Vendeur';
      case 'influencer': return 'Influenceur';
      default: return 'Client';
    }
  };

  if (!profile || !user) return null;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User size={24} className="text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Mes informations personnelles</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Gérez vos informations de compte et préférences
              </p>
            </div>
          </div>
          {!isEditing && (
            <Button 
              variant="outline" 
              onClick={startEditing}
              className="bg-white hover:bg-gray-50 border-primary/20 hover:border-primary/40 transition-all duration-200"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {isEditing ? (
          <div className="space-y-6">
            {/* Section informations de base */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <User size={18} className="text-primary" />
                <h3 className="font-semibold text-gray-900">Informations de base</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nom" className="text-sm font-medium text-gray-700">
                    Nom complet *
                  </Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                    placeholder="Votre nom complet"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                    Genre
                  </Label>
                  <Select 
                    value={formData.gender} 
                    onValueChange={(value: 'male' | 'female') => setFormData(prev => ({ ...prev, gender: value }))}
                  >
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Homme</SelectItem>
                      <SelectItem value="female">Femme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">
                    Prénom
                  </Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                    placeholder="Votre prénom"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">
                    Nom de famille
                  </Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                    placeholder="Votre nom de famille"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Section contact */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Phone size={18} className="text-primary" />
                <h3 className="font-semibold text-gray-900">Contact et localisation</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Téléphone
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+242 XX XXX XXXX"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                    Ville
                  </Label>
                  <Select 
                    value={formData.city} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
                  >
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="Choisir une ville" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city} value={city.toLowerCase()}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={cancelEditing} 
                disabled={saving}
                className="hover:bg-gray-50 transition-all duration-200"
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="bg-primary hover:bg-primary/90 transition-all duration-200"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Section informations de base */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <User size={18} className="text-primary" />
                <h3 className="font-semibold text-gray-900">Informations de base</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User size={18} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Nom complet</p>
                      <p className="font-medium text-gray-900">{profile.nom}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <User size={18} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Genre</p>
                      <p className="font-medium text-gray-900">
                        {profile.gender === 'male' ? 'Homme' : 'Femme'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <User size={18} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Prénom</p>
                      <p className="font-medium text-gray-900">
                        {profile.first_name || 'Non renseigné'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <User size={18} className="text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Nom de famille</p>
                      <p className="font-medium text-gray-900">
                        {profile.last_name || 'Non renseigné'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section contact */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Phone size={18} className="text-primary" />
                <h3 className="font-semibold text-gray-900">Contact et localisation</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Mail size={18} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Check size={12} className="mr-1" />
                      Vérifié
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Phone size={18} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Téléphone</p>
                      <p className="font-medium text-gray-900">
                        {profile.phone || 'Non renseigné'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <MapPin size={18} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Ville</p>
                      <p className="font-medium text-gray-900">
                        {profile.city ? profile.city.charAt(0).toUpperCase() + profile.city.slice(1) : 'Non renseignée'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Calendar size={18} className="text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Membre depuis</p>
                      <p className="font-medium text-gray-900">
                        {new Date(profile.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section compte */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <User size={18} className="text-primary" />
                <h3 className="font-semibold text-gray-900">Informations du compte</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-primary/5 to-purple/5 rounded-lg border border-primary/20">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User size={18} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">Type de compte</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{getRoleLabel(profile.role)}</p>
                      <Badge variant="secondary" className="text-xs">
                        {profile.role}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Calendar size={18} className="text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">Points de fidélité</p>
                    <p className="font-bold text-lg text-yellow-600">
                      {profile.loyalty_points} points
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedProfileEditForm;
