
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Mail, Star, Package, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '../hooks/useAuthStore';
import { getUserLevel, getPointsForNextLevel } from '../utils/loyaltyUtils';
import { useSupabaseOrders } from '../hooks/useSupabaseOrders';
import { useUserProfile } from '@/hooks/useUserProfile';
import EnhancedProfileEditForm from '@/components/account/EnhancedProfileEditForm';
import { Loader2 } from 'lucide-react';

const Account = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { orders, isLoading: ordersLoading, getOrderStats } = useSupabaseOrders();
  const { profile, loading: profileLoading } = useUserProfile();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return null;
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="animate-spin h-8 w-8" />
        </main>
        <Footer />
      </div>
    );
  }

  // Use profile data if available, fallback to user data
  const currentProfile = profile || user;
  const loyaltyPoints = profile?.loyalty_points || user.loyaltyPoints || 0;
  const userLevel = getUserLevel(loyaltyPoints);
  const nextLevel = getPointsForNextLevel(loyaltyPoints);
  const orderStats = getOrderStats();

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container-cowema">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Mon compte</h1>
              <div className="flex gap-2">
                {(user.role === 'admin' || user.role === 'sales_manager') && (
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2"
                  >
                    <Settings size={18} />
                    Administration
                  </Button>
                )}
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  className="flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Déconnexion
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonne principale */}
              <div className="lg:col-span-2 space-y-6">
                {/* Informations personnelles - Composant amélioré */}
                <EnhancedProfileEditForm />

                {/* Récentes commandes */}
                {orders.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Commandes récentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {orders.slice(0, 5).map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div>
                              <p className="font-medium">Commande #{order.id.slice(0, 8)}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              <p className="text-sm">
                                {order.order_items?.length || 0} article(s)
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{order.total_amount.toLocaleString()} FCFA</p>
                              <Badge 
                                variant={
                                  order.status === 'delivered' ? 'default' :
                                  order.status === 'confirmed' ? 'secondary' :
                                  order.status === 'pending' ? 'outline' : 'destructive'
                                }
                              >
                                {order.status === 'pending' ? 'En attente' :
                                 order.status === 'confirmed' ? 'Confirmée' :
                                 order.status === 'shipped' ? 'Expédiée' :
                                 order.status === 'delivered' ? 'Livrée' :
                                 order.status === 'cancelled' ? 'Annulée' :
                                 order.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar - reste identique */}
              <div className="space-y-6">
                {/* Informations de compte */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User size={20} />
                      Compte
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {currentProfile.nom.charAt(0).toUpperCase()}
                      </div>
                      <h3 className="font-medium">{currentProfile.nom}</h3>
                      <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                        <Mail size={14} />
                        {user.email}
                      </p>
                    </div>
                    
                    <div className="pt-3 border-t text-center">
                      <Badge variant="secondary" className="mb-2">
                        {getRoleLabel(currentProfile.role)}
                      </Badge>
                      {currentProfile.city && (
                        <p className="text-sm text-gray-500">
                          📍 {currentProfile.city.charAt(0).toUpperCase() + currentProfile.city.slice(1)}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Programme de fidélité */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star size={20} />
                      Programme de fidélité
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
                          <span>Progression vers {nextLevel.nextLevel}</span>
                          <span>{Math.round(nextLevel.progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${nextLevel.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Il vous reste {nextLevel.pointsNeeded} points
                        </p>
                      </div>
                    )}

                    {userLevel.discount > 0 && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-green-800 text-sm font-medium">
                          🎉 Remise de {(userLevel.discount * 100).toFixed(0)}% sur vos commandes !
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Statistiques de commandes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package size={20} />
                      Mes commandes
                    </CardTitle>
                    <CardDescription>
                      Suivi de vos achats
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {ordersLoading ? (
                      <div className="flex justify-center">
                        <Loader2 className="animate-spin h-6 w-6" />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-lg">{orderStats.total}</p>
                            <p className="text-gray-500">Total</p>
                          </div>
                          <div>
                            <p className="font-medium text-lg">{orderStats.pending}</p>
                            <p className="text-gray-500">En attente</p>
                          </div>
                          <div>
                            <p className="font-medium text-lg">{orderStats.confirmed}</p>
                            <p className="text-gray-500">Confirmées</p>
                          </div>
                          <div>
                            <p className="font-medium text-lg">{orderStats.delivered}</p>
                            <p className="text-gray-500">Livrées</p>
                          </div>
                        </div>
                        
                        <div className="pt-3 border-t">
                          <p className="text-sm">
                            <span className="font-medium">Total dépensé:</span>{' '}
                            <span className="text-lg font-bold text-primary">
                              {orderStats.totalAmount.toLocaleString()} FCFA
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Account;
