
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Package, 
  Star, 
  Gift, 
  Settings, 
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ShoppingBag,
  Heart,
  Award
} from 'lucide-react';
import { useUnifiedAuth } from '../hooks/useUnifiedAuth';
import { getUserLevel, getPointsForNextLevel } from '../utils/loyaltyUtils';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useUnifiedAuth();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const loyaltyPoints = user.loyaltyPoints || 0;
  const userLevel = getUserLevel(loyaltyPoints);
  const nextLevel = getPointsForNextLevel(loyaltyPoints);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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

  const quickActions = [
    {
      title: 'Parcourir les produits',
      description: 'Découvrez nos derniers articles',
      icon: ShoppingBag,
      action: () => navigate('/products'),
      color: 'bg-blue-500'
    },
    {
      title: 'Mes favoris',
      description: 'Retrouvez vos produits préférés',
      icon: Heart,
      action: () => navigate('/favorites'),
      color: 'bg-red-500'
    },
    {
      title: 'Programme de fidélité',
      description: 'Gérez vos points et récompenses',
      icon: Award,
      action: () => {},
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container-cowema">
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-primary to-primary-hover rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
                    {user.nom.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Bienvenue, {user.nom}!</h1>
                    <p className="opacity-90">Votre espace personnel COWEMA</p>
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  onClick={handleLogout}
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {quickActions.map((action, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={action.action}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white`}>
                      <action.icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Aperçu</TabsTrigger>
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="orders">Commandes</TabsTrigger>
              <TabsTrigger value="loyalty">Fidélité</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Account Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User size={20} />
                        Statut du compte
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge variant="secondary" className="mb-2">
                            {getRoleLabel(user.role)}
                          </Badge>
                          <p className="text-sm text-gray-600">Membre depuis {new Date(user.createdAt).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Settings size={16} className="mr-2" />
                          Paramètres
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Activité récente</CardTitle>
                      <CardDescription>Vos dernières actions sur COWEMA</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <User size={16} className="text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Compte créé</p>
                            <p className="text-sm text-gray-500">Votre compte a été créé avec succès</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Loyalty Points */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star size={20} />
                        Points de fidélité
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${userLevel.color} ${userLevel.textColor} mb-2`}>
                          {userLevel.name}
                        </div>
                        <p className="text-2xl font-bold text-primary">{loyaltyPoints} points</p>
                      </div>

                      {nextLevel.pointsNeeded > 0 && (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Vers {nextLevel.nextLevel}</span>
                            <span>{Math.round(nextLevel.progress)}%</span>
                          </div>
                          <Progress value={nextLevel.progress} className="mb-2" />
                          <p className="text-xs text-gray-500">
                            Plus que {nextLevel.pointsNeeded} points
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Statistiques</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Commandes</span>
                        <span className="font-semibold">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Favoris</span>
                        <span className="font-semibold">0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total dépensé</span>
                        <span className="font-semibold">0 FCFA</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>Gérez vos informations de compte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <User size={20} className="text-gray-400" />
                        <div>
                          <p className="font-medium">{user.nom}</p>
                          <p className="text-sm text-gray-500">Nom complet</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Mail size={20} className="text-gray-400" />
                        <div>
                          <p className="font-medium">{user.email}</p>
                          <p className="text-sm text-gray-500">Adresse email</p>
                        </div>
                      </div>

                      {user.phone && (
                        <div className="flex items-center space-x-3">
                          <Phone size={20} className="text-gray-400" />
                          <div>
                            <p className="font-medium">{user.phone}</p>
                            <p className="text-sm text-gray-500">Téléphone</p>
                          </div>
                        </div>
                      )}

                      {user.city && (
                        <div className="flex items-center space-x-3">
                          <MapPin size={20} className="text-gray-400" />
                          <div>
                            <p className="font-medium">{user.city}</p>
                            <p className="text-sm text-gray-500">Ville</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Calendar size={20} className="text-gray-400" />
                        <div>
                          <p className="font-medium">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</p>
                          <p className="text-sm text-gray-500">Membre depuis</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Award size={20} className="text-gray-400" />
                        <div>
                          <p className="font-medium">{getRoleLabel(user.role)}</p>
                          <p className="text-sm text-gray-500">Type de compte</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <Button>
                      <Settings size={16} className="mr-2" />
                      Modifier le profil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package size={20} />
                    Mes commandes
                  </CardTitle>
                  <CardDescription>Suivez l'état de vos commandes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucune commande</h3>
                    <p className="text-gray-500 mb-6">Vous n'avez pas encore passé de commande</p>
                    <Button onClick={() => navigate('/products')}>
                      <ShoppingBag size={16} className="mr-2" />
                      Commencer mes achats
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Loyalty Tab */}
            <TabsContent value="loyalty">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star size={20} />
                      Programme de fidélité
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className={`inline-flex px-4 py-2 rounded-full text-lg font-medium ${userLevel.color} ${userLevel.textColor} mb-4`}>
                        {userLevel.name}
                      </div>
                      <p className="text-3xl font-bold text-primary mb-2">{loyaltyPoints} points</p>
                      <p className="text-gray-600">Vos points de fidélité</p>
                    </div>

                    {nextLevel.pointsNeeded > 0 && (
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progression vers {nextLevel.nextLevel}</span>
                          <span className="font-medium">{Math.round(nextLevel.progress)}%</span>
                        </div>
                        <Progress value={nextLevel.progress} className="mb-3" />
                        <p className="text-sm text-gray-600">
                          Plus que <span className="font-medium">{nextLevel.pointsNeeded} points</span> pour atteindre le niveau {nextLevel.nextLevel}
                        </p>
                      </div>
                    )}

                    {userLevel.discount > 0 && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-green-800">
                          <Gift size={20} />
                          <span className="font-medium">Avantage actuel</span>
                        </div>
                        <p className="text-green-700 mt-1">
                          Remise de {(userLevel.discount * 100).toFixed(0)}% sur toutes vos commandes
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Comment gagner des points</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <ShoppingBag size={20} className="text-blue-600" />
                      <div>
                        <p className="font-medium">Achats</p>
                        <p className="text-sm text-gray-600">1 point pour chaque 1000 FCFA dépensés</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <Star size={20} className="text-yellow-600" />
                      <div>
                        <p className="font-medium">Avis produits</p>
                        <p className="text-sm text-gray-600">50 points par avis laissé</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <Gift size={20} className="text-green-600" />
                      <div>
                        <p className="font-medium">Parrainage</p>
                        <p className="text-sm text-gray-600">100 points par ami parrainé</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserDashboard;
