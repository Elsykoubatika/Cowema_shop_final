
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Edit2, Save, X, Loader2 } from 'lucide-react';

const ProfileEditForm: React.FC = () => {
  const { profile, updateProfile } = useUserProfile();
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

  if (!profile) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Informations personnelles</CardTitle>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={startEditing}>
            <Edit2 className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nom">Nom complet</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="first_name">Prénom</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="last_name">Nom de famille</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="gender">Genre</Label>
                <Select value={formData.gender} onValueChange={(value: 'male' | 'female') => setFormData(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
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
                  <SelectTrigger>
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
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button onClick={handleSave} disabled={saving}>
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
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Nom complet</Label>
              <p className="mt-1">{profile.nom}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-500">Téléphone</Label>
              <p className="mt-1">{profile.phone || 'Non renseigné'}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">Prénom</Label>
              <p className="mt-1">{profile.first_name || 'Non renseigné'}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">Nom de famille</Label>
              <p className="mt-1">{profile.last_name || 'Non renseigné'}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">Genre</Label>
              <p className="mt-1">{profile.gender === 'male' ? 'Homme' : 'Femme'}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-500">Ville</Label>
              <p className="mt-1">{profile.city ? profile.city.charAt(0).toUpperCase() + profile.city.slice(1) : 'Non renseignée'}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileEditForm;
