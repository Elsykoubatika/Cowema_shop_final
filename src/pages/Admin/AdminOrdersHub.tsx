
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderManagement } from '@/hooks/useOrderManagement';
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import OrdersStats from '@/components/admin/orders/OrdersStats';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShoppingCart, 
  ClipboardList, 
  User, 
  Users,
  ArrowRight,
  Bell
} from 'lucide-react';

const AdminOrdersHub: React.FC = () => {
  const navigate = useNavigate();
  const { 
    getAllOrders, 
    getUnassignedOrders, 
    getMyOrders,
    isLoading,
    refreshOrders
  } = useOrderManagement();
  
  const { newOrders, hasNewOrders, clearNewOrders } = useRealtimeOrders();
  
  // Get order counts
  const allOrders = getAllOrders();
  const unassignedOrders = getUnassignedOrders();
  const myOrders = getMyOrders();

  // Calculate stats for all orders
  const stats = {
    total: allOrders.length,
    pending: allOrders.filter(o => o.status === 'pending').length,
    confirmed: allOrders.filter(o => o.status === 'confirmed').length,
    delivered: allOrders.filter(o => o.status === 'delivered').length,
    totalAmount: allOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
  };

  const handleClearNewOrders = () => {
    clearNewOrders();
    refreshOrders();
  };

  const orderSections = [
    {
      title: "Toutes les Commandes",
      description: "Vue d'ensemble de toutes les commandes accessibles",
      icon: ShoppingCart,
      count: allOrders.length,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      route: "/admin/orders",
      stats: {
        pending: allOrders.filter(o => o.status === 'pending').length,
        confirmed: allOrders.filter(o => o.status === 'confirmed').length,
        delivered: allOrders.filter(o => o.status === 'delivered').length,
      }
    },
    {
      title: "Commandes Non Assignées",
      description: "Commandes en attente d'attribution à un vendeur",
      icon: ClipboardList,
      count: unassignedOrders.length,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      route: "/admin/unassigned-orders",
      stats: {
        pending: unassignedOrders.filter(o => o.status === 'pending').length,
        total: unassignedOrders.length,
      }
    },
    {
      title: "Mes Commandes",
      description: "Commandes qui vous sont assignées",
      icon: User,
      count: myOrders.length,
      color: "text-green-600",
      bgColor: "bg-green-50",
      route: "/admin/my-orders",
      stats: {
        pending: myOrders.filter(o => o.status === 'pending').length,
        confirmed: myOrders.filter(o => o.status === 'confirmed').length,
        delivered: myOrders.filter(o => o.status === 'delivered').length,
      }
    }
  ];

  return (
    <AdminPageLayout>
      <AdminPageHeader 
        title="Gestion des Commandes" 
        icon={<ShoppingCart className="h-6 w-6" />}
        description="Centre de gestion de toutes les commandes"
      />

      <div className="container mx-auto p-4 space-y-6">
        {/* Notifications pour nouvelles commandes */}
        {hasNewOrders && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-orange-600" />
                  <div>
                    <h3 className="font-medium text-orange-900">
                      Nouvelles commandes disponibles
                    </h3>
                    <p className="text-sm text-orange-700">
                      {newOrders.length} nouvelle{newOrders.length > 1 ? 's' : ''} commande{newOrders.length > 1 ? 's' : ''} reçue{newOrders.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <Button onClick={handleClearNewOrders} variant="outline" size="sm">
                  Marquer comme vues
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistiques globales */}
        <OrdersStats stats={stats} />

        {/* Sections de commandes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orderSections.map((section) => (
            <Card key={section.route} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${section.bgColor}`}>
                    <section.icon className={`h-6 w-6 ${section.color}`} />
                  </div>
                  <Badge variant="secondary" className="text-lg font-bold">
                    {section.count}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{section.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2 mb-4">
                  {section.stats.pending !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">En attente:</span>
                      <span className="font-medium text-yellow-600">{section.stats.pending}</span>
                    </div>
                  )}
                  {section.stats.confirmed !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Confirmées:</span>
                      <span className="font-medium text-purple-600">{section.stats.confirmed}</span>
                    </div>
                  )}
                  {section.stats.delivered !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Livrées:</span>
                      <span className="font-medium text-green-600">{section.stats.delivered}</span>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={() => navigate(section.route)}
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  variant="outline"
                >
                  Voir les commandes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Actions Rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => navigate('/admin/unassigned-orders')}
                variant="outline"
                disabled={unassignedOrders.length === 0}
              >
                Traiter les commandes non assignées ({unassignedOrders.length})
              </Button>
              
              <Button 
                onClick={() => navigate('/admin/my-orders')}
                variant="outline"
                disabled={myOrders.filter(o => o.status === 'pending').length === 0}
              >
                Mes commandes en attente ({myOrders.filter(o => o.status === 'pending').length})
              </Button>
              
              <Button 
                onClick={refreshOrders}
                variant="outline"
                disabled={isLoading}
              >
                {isLoading ? 'Actualisation...' : 'Actualiser toutes les données'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  );
};

export default AdminOrdersHub;
