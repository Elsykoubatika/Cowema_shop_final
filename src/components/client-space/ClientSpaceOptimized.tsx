
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Package, Star, Loader2, Crown, Sparkles } from 'lucide-react';
import ProfileSection from './ProfileSection';
import EnhancedAddressesSection from './EnhancedAddressesSection';
import OrdersSection from './OrdersSection';
import EnhancedLoyaltySection from './EnhancedLoyaltySection';
import { useSearchParams } from 'react-router-dom';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useDynamicLoyalty } from '@/hooks/useDynamicLoyalty';

const ClientSpaceOptimized = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { profile, loading: profileLoading } = useUserProfile();
  const { currentLevel } = useDynamicLoyalty(profile?.loyalty_points || 0);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container-cowema py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <Loader2 className="animate-spin h-12 w-12 mx-auto text-primary" />
                <p className="text-gray-600">Chargement de votre espace client...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container-cowema py-8">
          <div className="max-w-7xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">Impossible de charger les informations du profil.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container-cowema py-8">
        <div className="max-w-7xl mx-auto">
          {/* En-tête amélioré avec informations utilisateur */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {profile.nom.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">
                      Bonjour {profile.nom} !
                    </h1>
                    <p className="text-gray-600">
                      Bienvenue dans votre espace client Ya Ba Boss
                    </p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">
                  Gérez votre profil, vos adresses et suivez vos commandes
                </p>
              </div>
              
              {/* Informations Ya Ba Boss */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Points Ya Ba Boss */}
                <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Sparkles size={20} className="text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Points Ya Ba Boss</p>
                        <p className="text-xl font-bold text-yellow-600">
                          {profile.loyalty_points.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Niveau Ya Ba Boss */}
                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Crown size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Niveau Ya Ba Boss</p>
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={`${currentLevel?.color || 'bg-gray-100'} ${currentLevel?.textColor || 'text-gray-800'} font-semibold`}
                          >
                            {currentLevel?.name || 'Bronze'}
                          </Badge>
                          {currentLevel?.discount > 0 && (
                            <span className="text-xs text-green-600 font-medium">
                              -{(currentLevel.discount * 100).toFixed(0)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Navigation par onglets */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-14 p-1 mb-8">
              <TabsTrigger 
                value="profile" 
                className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <User size={18} />
                Profil
              </TabsTrigger>
              <TabsTrigger 
                value="addresses" 
                className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <MapPin size={18} />
                Adresses
              </TabsTrigger>
              <TabsTrigger 
                value="orders" 
                className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <Package size={18} />
                Commandes
              </TabsTrigger>
              <TabsTrigger 
                value="loyalty" 
                className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <Star size={18} />
                Ya Ba Boss
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <ProfileSection profile={profile} />
            </TabsContent>

            <TabsContent value="addresses" className="mt-6">
              <EnhancedAddressesSection />
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <OrdersSection />
            </TabsContent>

            <TabsContent value="loyalty" className="mt-6">
              <EnhancedLoyaltySection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ClientSpaceOptimized;
