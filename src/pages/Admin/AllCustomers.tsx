import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseCustomers } from '@/hooks/useSupabaseCustomers';
import { useCustomerPermissions } from '@/hooks/useCustomerPermissions';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useCustomerOrderSync } from '@/hooks/useCustomerOrderSync';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Eye,
  Edit,
  Trash2,
  Filter,
  UserPlus
} from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from "sonner";
import { generateWhatsAppLink } from '@/utils/whatsappUtils';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';

const AllCustomers: React.FC = () => {
  const navigate = useNavigate();
  const { customers, isLoading } = useSupabaseCustomers();
  const customerPermissions = useCustomerPermissions();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('all');
  
  // Activer la synchronisation des clients avec les commandes
  useCustomerOrderSync();
  
  // Extraire les villes uniques des clients
  const uniqueCities = [...new Set(customers.map(customer => customer.city).filter(Boolean))];
  
  // Filtrer les clients selon les permissions et les filtres
  const filteredCustomers = customers.filter(customer => {
    // Vérifier les permissions
    if (!customerPermissions.canViewCustomerDetails(customer)) {
      return false;
    }
    
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
             customer.phone.toLowerCase().includes(searchLower) ||
             (customer.city && customer.city.toLowerCase().includes(searchLower));
    }
    
    return true;
  });
  
  // Trier par dépenses totales (descendant)
  const sortedCustomers = [...filteredCustomers].sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));
  
  const handleContactWhatsApp = (customer: any) => {
    const message = `Bonjour ${customer.firstName}, nous souhaitons vous informer de nos nouvelles offres...`;
    const whatsappLink = generateWhatsAppLink(customer.phone, message);
    window.open(whatsappLink, '_blank');
    toast.success(`Ouverture de WhatsApp pour contacter ${customer.firstName}`);
  };
  
  const handleViewDetails = (customerId: string) => {
    navigate(`/admin/customer/${customerId}`);
  };
  
  const handleEditCustomer = (customer: any) => {
    toast.info("Fonctionnalité d'édition client à venir");
  };
  
  const handleDeleteCustomer = (customer: any) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le client ${customer.firstName} ${customer.lastName} ?`)) {
      toast.success(`Client ${customer.firstName} supprimé`);
    }
  };
  
  const handleAddCustomer = () => {
    toast.info("Fonctionnalité d'ajout de client à venir");
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
  
  // Identifier le vendeur principal d'un client par son ID
  const getPrimaryVendorName = (vendorId: string | undefined) => {
    if (!vendorId) return "Non assigné";
    
    if (user && user.id === vendorId) {
      return "Vous";
    }
    
    // Dans une implémentation complète, nous rechercherions le vendeur dans une liste d'utilisateurs
    return `Vendeur #${vendorId.substring(0, 5)}`;
  };

  if (isLoading) {
    return (
      <AdminPageLayout>
        <AdminPageHeader title="Tous les Clients" />
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
      <AdminPageHeader title="Tous les Clients" />
      <div className="container-cowema p-4">
        {/* Filtres et recherche */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <Input 
              type="text"
              placeholder="Rechercher par nom, email, téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sm:max-w-sm"
            />
            
            <div className="flex items-center gap-2 flex-wrap">
              {/* Filtre par ville */}
              <Select 
                value={cityFilter} 
                onValueChange={setCityFilter}
              >
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
              
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                Filtrer
              </Button>
              
              {customerPermissions.canViewAnalytics && (
                <Button variant="outline" className="ml-auto">
                  Voir les statistiques clients
                </Button>
              )}
              
              <Button onClick={handleAddCustomer} className="flex items-center gap-2">
                <UserPlus size={16} />
                Nouveau Client
              </Button>
            </div>
          </div>
          
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{sortedCustomers.length}</div>
                <p className="text-muted-foreground">Clients au total</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {formatAmount(sortedCustomers.reduce((sum, c) => sum + (c.totalSpent || 0), 0))}
                </div>
                <p className="text-muted-foreground">Total des ventes</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {formatAmount(sortedCustomers.length > 0 
                    ? Math.round(sortedCustomers.reduce((sum, c) => sum + (c.totalSpent || 0), 0) / sortedCustomers.length) 
                    : 0
                  )}
                </div>
                <p className="text-muted-foreground">Panier moyen</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {sortedCustomers.filter(c => {
                    const lastActivity = new Date(c.updatedAt || c.createdAt || '');
                    const oneMonthAgo = new Date();
                    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                    return lastActivity >= oneMonthAgo;
                  }).length}
                </div>
                <p className="text-muted-foreground">Clients actifs (30j)</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Liste des clients */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Ville</TableHead>
                    <TableHead>Dépenses totales</TableHead>
                    <TableHead>Commandes</TableHead>
                    <TableHead>Dernière activité</TableHead>
                    <TableHead>Vendeur principal</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCustomers.length > 0 ? (
                    sortedCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                            <p className="text-sm text-muted-foreground">{customer.email || 'Email non renseigné'}</p>
                            <p className="text-sm text-muted-foreground">{customer.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>{customer.city || "Non spécifié"}</TableCell>
                        <TableCell className="font-medium">{formatAmount(customer.totalSpent || 0)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{customer.orderCount || 0}</Badge>
                        </TableCell>
                        <TableCell>{getRelativeTime(customer.updatedAt || customer.createdAt || '')}</TableCell>
                        <TableCell>
                          {getPrimaryVendorName(customer.primaryVendor)}
                          {customer.primaryVendor === user?.id && (
                            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">
                              Vous
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleContactWhatsApp(customer)}
                              title="Contacter par WhatsApp"
                            >
                              <MessageSquare size={16} />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDetails(customer.id)}
                              title="Voir les détails"
                            >
                              <Eye size={16} />
                            </Button>
                            
                            {customerPermissions.canEditCustomer(customer) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditCustomer(customer)}
                                title="Modifier"
                              >
                                <Edit size={16} />
                              </Button>
                            )}
                            
                            {customerPermissions.canDeleteCustomer(customer) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteCustomer(customer)}
                                title="Supprimer"
                              >
                                <Trash2 size={16} />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        {searchTerm || cityFilter !== 'all' ? 'Aucun client trouvé pour cette recherche' : 'Aucun client enregistré'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              Affichage de {sortedCustomers.length} client{sortedCustomers.length > 1 ? 's' : ''}
            </p>
          </CardFooter>
        </Card>
      </div>
    </AdminPageLayout>
  );
};

export default AllCustomers;
