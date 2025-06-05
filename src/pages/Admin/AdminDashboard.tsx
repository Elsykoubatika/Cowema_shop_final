
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Users, Package, TrendingUp, RefreshCw, Eye, UserCheck, MapPin, Calendar, DollarSign } from 'lucide-react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useDashboardData } from '@/hooks/admin/useDashboardData';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import SalesSegmentationChart from '@/components/admin/dashboard/SalesSegmentationChart';
import DetailedStatsModal from '@/components/admin/dashboard/DetailedStatsModal';
import SellerPerformanceTable from '@/components/admin/dashboard/SellerPerformanceTable';

const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { stats, loading, error, refetch } = useDashboardData();
  const navigate = useNavigate();
  const [selectedStatType, setSelectedStatType] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'En attente',
      'confirmed': 'Confirmée',
      'shipped': 'Expédiée',
      'delivered': 'Livrée',
      'cancelled': 'Annulée'
    };
    return statusMap[status] || status;
  };

  const handleStatCardClick = (statType: string) => {
    setSelectedStatType(statType);
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center">
          <p className="text-red-500 mb-4">Erreur: {error}</p>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Aucune donnée disponible</p>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      id: 'orders',
      title: 'Commandes totales',
      value: stats.totalOrders,
      description: `${stats.monthlyGrowth.orders > 0 ? '+' : ''}${stats.monthlyGrowth.orders.toFixed(1)}% ce mois`,
      icon: ShoppingCart,
      color: 'text-blue-600',
      trend: stats.monthlyGrowth.orders
    },
    {
      id: 'customers',
      title: 'Clients actifs',
      value: stats.totalCustomers,
      description: `${stats.monthlyGrowth.customers > 0 ? '+' : ''}${stats.monthlyGrowth.customers.toFixed(1)}% ce mois`,
      icon: Users,
      color: 'text-green-600',
      trend: stats.monthlyGrowth.customers
    },
    {
      id: 'products',
      title: 'Produits actifs',
      value: stats.totalProducts,
      description: `${stats.monthlyGrowth.products > 0 ? '+' : ''}${stats.monthlyGrowth.products.toFixed(1)}% ce mois`,
      icon: Package,
      color: 'text-purple-600',
      trend: stats.monthlyGrowth.products
    },
    {
      id: 'revenue',
      title: 'Revenus',
      value: formatCurrency(stats.totalRevenue),
      description: `${stats.monthlyGrowth.revenue > 0 ? '+' : ''}${stats.monthlyGrowth.revenue.toFixed(1)}% ce mois`,
      icon: TrendingUp,
      color: 'text-orange-600',
      trend: stats.monthlyGrowth.revenue
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Bienvenue {user?.nom || 'Admin'} - Aperçu de votre activité
          </p>
        </div>
        <Button onClick={refetch} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleStatCardClick(stat.id)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.trend >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                  <TrendingUp className={`h-3 w-3 mr-1 ${stat.trend < 0 ? 'rotate-180' : ''}`} />
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Enhanced Dashboard Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="sales">Ventes par vendeur</TabsTrigger>
          <TabsTrigger value="analytics">Analytics avancées</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Évolution des ventes mensuelles</CardTitle>
                <CardDescription>
                  Revenus et commandes par mois
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SalesSegmentationChart data={stats.monthlyRevenue} />
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Commandes récentes</CardTitle>
                  <CardDescription>
                    {stats.recentOrders.length} dernières commandes
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin/orders')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Voir tout
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentOrders.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">Aucune commande récente</p>
                  ) : (
                    stats.recentOrders.map((order) => (
                      <div 
                        key={order.id} 
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.customer_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(order.created_at), {
                              addSuffix: true,
                              locale: fr
                            })}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="font-medium">
                            {formatCurrency(order.total_amount)}
                          </div>
                          <Badge 
                            className={`text-xs ${getStatusColor(order.status)}`}
                            variant="secondary"
                          >
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <SellerPerformanceTable />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Ventes par ville
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Brazzaville</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pointe-Noire</span>
                    <span className="text-sm font-medium">35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Dolisie</span>
                    <span className="text-sm font-medium">20%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Performance hebdomadaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Cette semaine</span>
                    <span className="text-sm font-medium text-green-600">+12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Semaine dernière</span>
                    <span className="text-sm font-medium text-blue-600">+8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Moyenne mensuelle</span>
                    <span className="text-sm font-medium">+10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Panier moyen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {formatCurrency(stats.totalRevenue / Math.max(stats.totalOrders, 1))}
                  </div>
                  <p className="text-xs text-green-600">+5% vs mois dernier</p>
                  <div className="text-sm text-muted-foreground">
                    Basé sur {stats.totalOrders} commandes
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Taux de conversion</CardTitle>
                <CardDescription>
                  Pourcentage de visiteurs qui passent commande
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">3.2%</div>
                <p className="text-xs text-green-600 mt-1">+0.5% vs mois dernier</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Temps de traitement moyen</CardTitle>
                <CardDescription>
                  Délai moyen de traitement des commandes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">2.5h</div>
                <p className="text-xs text-green-600 mt-1">-0.3h vs mois dernier</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal for detailed stats */}
      {selectedStatType && (
        <DetailedStatsModal
          statType={selectedStatType}
          data={stats}
          isOpen={!!selectedStatType}
          onClose={() => setSelectedStatType(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
