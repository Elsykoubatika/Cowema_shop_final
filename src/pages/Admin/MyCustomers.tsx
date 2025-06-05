import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseCustomers } from '@/hooks/useSupabaseCustomers';
import { useCustomerPermissions } from '@/hooks/useCustomerPermissions';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useCustomerOrderSync } from '@/hooks/useCustomerOrderSync';
import CustomerSyncDebug from '@/components/admin/customers/CustomerSyncDebug';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Phone, 
  MessageCircle, 
  Plus,
  Eye,
  Edit,
  Search,
  UserPlus
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { generateWhatsAppLink } from '@/utils/whatsappUtils';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';

const MyCustomers: React.FC = () => {
  const navigate = useNavigate();
  const { customers, isLoading } = useSupabaseCustomers();
  const customerPermissions = useCustomerPermissions();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('all');

  // Activer la synchronisation des clients avec les commandes
  useCustomerOrderSync();

  // Filtrer pour obtenir seulement mes clients (ceux qui me sont assignés)
  const myCustomers = customerPermissions.getMyCustomers(customers);
  
  // Extraire les villes uniques de mes clients
  const uniqueCities = [...new Set(myCustomers.map(customer => customer.city).filter(Boolean))];
  
  // Appliquer les filtres de recherche et ville
  const filteredCustomers = myCustomers.filter(customer => {
    // Filtre par ville
    if (cityFilter !== 'all' && customer.city?.toLowerCase() !== cityFilter.toLowerCase()) {
      return false;
    }
    
    // Filtre par terme de recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
      
      return fullName.includes(searchLower) ||
             customer.email?.toLowerCase().includes(searchLower) ||
             customer.phone.toLowerCase().includes(searchLower);
    }
    
    return true;
  });

  // Trier par dernière activité (plus récent d'abord)
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const dateA = new Date(a.lastOrderDate || a.updatedAt || a.createdAt || '');
    const dateB = new Date(b.lastOrderDate || b.updatedAt || b.createdAt || '');
    return dateB.getTime() - dateA.getTime();
  });

  const handleContactWhatsApp = (customer: any) => {
    const message = `Bonjour ${customer.firstName}, j'espère que vous allez bien. Je vous contacte concernant nos nouvelles offres...`;
    const whatsappLink = generateWhatsAppLink(customer.phone, message);
    window.open(whatsappLink, '_blank');
    toast.success(`Ouverture de WhatsApp pour contacter ${customer.firstName}`);
  };

  const handleCall = (customer: any) => {
    window.open(`tel:${customer.phone}`, '_self');
    toast.info(`Appel vers ${customer.firstName} ${customer.lastName}`);
  };

  const handleNewOrder = (customer: any) => {
    toast.info(`Création d'une nouvelle commande pour ${customer.firstName} - Fonctionnalité à venir`);
  };

  const handleViewDetails = (customerId: string) => {
    navigate(`/admin/customer/${customerId}`);
  };

  const handleEditCustomer = (customer: any) => {
    toast.info("Fonctionnalité d'édition client à venir");
  };

  const formatAmount = (amount: number) => {
    return `${amount.toLocaleString()} FCFA`;
  };

  const getRelativeTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: fr
    });
  };

  if (isLoading) {
    return (
      <AdminPageLayout>
        <AdminPageHeader title="Mes Clients" />
        <div className="container-cowema p-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout>
      <AdminPageHeader title="Mes Clients" />
      <div className="container-cowema p-4 space-y-6">
        {/* Composant de debug temporaire */}
        <CustomerSyncDebug />
        
        {/* En-tête avec filtres */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Mes clients assignés</h2>
            <p className="text-muted-foreground">
              Clients qui vous sont assignés ({myCustomers.length} client{myCustomers.length > 1 ? 's' : ''})
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/customers')}
              className="flex items-center gap-2"
            >
              Voir tous les clients
            </Button>
            <Button className="flex items-center gap-2">
              <UserPlus size={16} />
              Nouveau Client
            </Button>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par nom, email, téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par ville" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les villes</SelectItem>
              {uniqueCities.map(city => (
                city && <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{myCustomers.length}</div>
              <p className="text-muted-foreground">Mes clients</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {formatAmount(myCustomers.reduce((sum, c) => sum + (c.totalSpent || 0), 0))}
              </div>
              <p className="text-muted-foreground">Chiffre d'affaires généré</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {myCustomers.reduce((sum, c) => sum + (c.orderCount || 0), 0)}
              </div>
              <p className="text-muted-foreground">Commandes totales</p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des clients */}
        <Card>
          <CardHeader>
            <CardTitle>Mes clients assignés</CardTitle>
          </CardHeader>
          <CardContent>
            {sortedCustomers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchTerm || cityFilter !== 'all' 
                    ? 'Aucun client trouvé pour cette recherche'
                    : 'Aucun client ne vous est encore assigné'
                  }
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate('/admin/customers')}
                >
                  Voir tous les clients disponibles
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                        {customer.orderCount && customer.orderCount > 0 && (
                          <Badge variant="outline">
                            {customer.orderCount} commande{customer.orderCount > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{customer.email || 'Email non renseigné'}</p>
                      <p className="text-sm text-gray-600">{customer.phone}</p>
                      <p className="text-sm text-gray-500">
                        {customer.city} - 
                        {customer.lastOrderDate 
                          ? ` Dernière commande: ${getRelativeTime(customer.lastOrderDate)}`
                          : ` Inscrit ${getRelativeTime(customer.createdAt || '')}`
                        }
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="text-right mr-4">
                        <p className="font-semibold">{formatAmount(customer.totalSpent || 0)}</p>
                        <p className="text-sm text-gray-500">Total dépensé</p>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCall(customer)}
                        title="Appeler"
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Appeler
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleContactWhatsApp(customer)}
                        className="text-green-600 hover:text-green-700"
                        title="Contacter par WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        WhatsApp
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(customer.id)}
                        title="Voir les détails"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                      
                      <Button 
                        size="sm"
                        onClick={() => handleNewOrder(customer)}
                        title="Nouvelle commande"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Commande
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  );
};

export default MyCustomers;
