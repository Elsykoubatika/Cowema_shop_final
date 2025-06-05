
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit2, Save, X, User, Phone, Mail, MapPin } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';

interface ProfileSectionProps {
  profile: any;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ profile }) => {
  const { updateProfile } = useUserProfile();
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

  const cities = [
    'Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi', 'Owando', 
    'Ouesso', 'Impfondo', 'Madingou', 'Kinkala', 'Sibiti'
  ];

  const startEditing = () => {
    setFormData({
      nom: profile.nom || '',
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      phone: profile.phone || '',
      city: profile.city || '',
      gender: profile.gender || 'male'
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await updateProfile(formData);
    if (success) {
      setIsEditing(false);
    }
    setSaving(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <User size={20} />
          Mes informations personnelles
        </CardTitle>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={startEditing}>
            <Edit2 size={16} className="mr-2" />
            Modifier
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nom">Nom complet *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="first_name">Prénom</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="last_name">Nom de famille</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="gender">Genre</Label>
                <Select value={formData.gender} onValueChange={(value: 'male' | 'female') => setFormData(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Homme</SelectItem>
                    <SelectItem value="female">Femme</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="city">Ville</Label>
                <Select value={formData.city} onValueChange={(value) => setFormData(prev => ({ ...prev, city: value }))}>
                  <SelectTrigger className="mt-1">
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

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={cancelEditing} disabled={saving}>
                <X size={16} className="mr-2" />
                Annuler
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User size={20} className="text-gray-400" />
                <div>
                  <p className="font-medium">{profile.nom}</p>
                  <p className="text-sm text-gray-500">Nom complet</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone size={20} className="text-gray-400" />
                <div>
                  <p className="font-medium">{profile.phone || 'Non renseigné'}</p>
                  <p className="text-sm text-gray-500">Téléphone</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-gray-400" />
                <div>
                  <p className="font-medium">{profile.email}</p>
                  <p className="text-sm text-gray-500">Email</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin size={20} className="text-gray-400" />
                <div>
                  <p className="font-medium">{profile.city ? profile.city.charAt(0).toUpperCase() + profile.city.slice(1) : 'Non renseignée'}</p>
                  <p className="text-sm text-gray-500">Ville</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Prénom</p>
                <p className="font-medium">{profile.first_name || 'Non renseigné'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Nom de famille</p>
                <p className="font-medium">{profile.last_name || 'Non renseigné'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Genre</p>
                <p className="font-medium">{profile.gender === 'male' ? 'Homme' : 'Femme'}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
