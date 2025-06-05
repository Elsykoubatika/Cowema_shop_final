import React, { useState, useEffect } from 'react';
import { useOrderStore } from '../../hooks/useOrderStore';
import { Order, OrderStatus, OrderSource } from '../../types/order';
import { useAuthStore } from '../../hooks/useAuthStore';
import { useToast } from '../../hooks/use-toast';
import { useMessageTemplates } from '../../hooks/useMessageTemplates';
import { formatDistanceToNow, format, isAfter, isBefore, isEqual, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { generateReceiptPDF, sendOrderReminder, sendReviewRequest } from '../../utils/orderUtils';
import { generateWhatsAppLink } from '../../utils/whatsappUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  X, 
  Phone, 
  Truck, 
  Download, 
  Clock, 
  Eye, 
  RefreshCw, 
  MessageSquare, 
  Loader2, 
  ShoppingCart, 
  Users,
  ChevronDown,
  Send,
  CalendarIcon,
  PieChartIcon,
  TrendingUpIcon,
  MapPinIcon,
  FilterIcon,
  SearchIcon
} from 'lucide-react';

enum OrderType {
  ALL = 'all',
  DIRECT = 'direct',
  WHATSAPP = 'whatsapp',
  INFLUENCER = 'influencer'
}

// Updated DateRange type to match react-day-picker's definition
type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

// Define types for statistics data
type OrderStats = {
  totalOrders: number;
  totalAmount: number;
  pendingOrders: number;
  confirmedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
};

type CityStats = {
  name: string;
  count: number;
  amount: number;
};

const OrdersManager: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { getAllOrders, updateOrderStatus, assignOrder, markReminderSent } = useOrderStore();
  const { templates, getTemplatesByType } = useMessageTemplates();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [viewOrderDetails, setViewOrderDetails] = useState(false);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [activeTab, setActiveTab] = useState<OrderType>(OrderType.ALL);
  const [isLoading, setIsLoading] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [messageContent, setMessageContent] = useState<string>("");
  
  // New filter states
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showStats, setShowStats] = useState<boolean>(true);
  const [orderStats, setOrderStats] = useState<OrderStats>({
    totalOrders: 0,
    totalAmount: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0
  });
  const [topCities, setTopCities] = useState<CityStats[]>([]);

  useEffect(() => {
    loadOrders();
  }, [activeTab]);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    applyFilters();
  }, [orders, filter, cityFilter, dateRange, searchQuery]);

  const loadOrders = () => {
    setIsLoading(true);
    const allOrders = getAllOrders();
    
    // Filter orders based on the active tab
    const filteredOrders = allOrders.filter(order => {
      switch (activeTab) {
        case OrderType.DIRECT:
          return !order.influencerCode && !order.customer.phone.includes('whatsapp');
        case OrderType.WHATSAPP:
          return order.customer.phone.includes('whatsapp');
        case OrderType.INFLUENCER:
          return !!order.influencerCode;
        case OrderType.ALL:
        default:
          return true;
      }
    });
    
    setOrders(filteredOrders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
    
    setIsLoading(false);
    
    // Calculate statistics when orders are loaded
    calculateOrderStats(filteredOrders);
  };

  // Calculate statistics from orders
  const calculateOrderStats = (orders: Order[]) => {
    // Basic order statistics
    const stats: OrderStats = {
      totalOrders: orders.length,
      totalAmount: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      confirmedOrders: orders.filter(o => o.status === 'confirmed').length,
      deliveredOrders: orders.filter(o => o.status === 'delivered').length,
      cancelledOrders: orders.filter(o => o.status === 'cancelled').length
    };
    
    setOrderStats(stats);
    
    // City statistics - find top cities by order count
    const cityCounts: Record<string, { count: number, amount: number }> = {};
    
    orders.forEach(order => {
      const city = order.customer.city;
      if (!cityCounts[city]) {
        cityCounts[city] = { count: 0, amount: 0 };
      }
      cityCounts[city].count += 1;
      cityCounts[city].amount += order.totalAmount;
    });
    
    const cityStats: CityStats[] = Object.entries(cityCounts).map(([name, data]) => ({
      name,
      count: data.count,
      amount: data.amount
    })).sort((a, b) => b.count - a.count).slice(0, 5);
    
    setTopCities(cityStats);
  };

  // Get unique cities from orders
  const getUniqueCities = (): string[] => {
    const cities = new Set<string>();
    orders.forEach(order => {
      if (order.customer.city) {
        cities.add(order.customer.city);
      }
    });
    return Array.from(cities).sort();
  };
  
  // Apply all filters to orders
  const applyFilters = () => {
    let result = [...orders];
    
    // Apply status filter
    if (filter !== 'all') {
      result = result.filter(order => order.status === filter);
    }
    
    // Apply city filter
    if (cityFilter !== 'all') {
      result = result.filter(order => order.customer.city === cityFilter);
    }
    
    // Apply date range filter
    if (dateRange.from || dateRange.to) {
      result = result.filter(order => {
        const orderDate = parseISO(order.createdAt);
        
        if (dateRange.from && dateRange.to) {
          // Both from and to dates are set
          return (
            (isAfter(orderDate, dateRange.from) || isEqual(orderDate, dateRange.from)) &&
            (isBefore(orderDate, dateRange.to) || isEqual(orderDate, dateRange.to))
          );
        } else if (dateRange.from) {
          // Only from date is set
          return isAfter(orderDate, dateRange.from) || isEqual(orderDate, dateRange.from);
        } else if (dateRange.to) {
          // Only to date is set
          return isBefore(orderDate, dateRange.to) || isEqual(orderDate, dateRange.to);
        }
        
        return true;
      });
    }
    
    // Apply search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        order.customer.firstName.toLowerCase().includes(query) ||
        order.customer.lastName.toLowerCase().includes(query) ||
        order.customer.phone.toLowerCase().includes(query) ||
        order.customer.email?.toLowerCase().includes(query) ||
        order.customer.address.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query)
      );
    }
    
    setFilteredOrders(result);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilter('all');
    setCityFilter('all');
    setDateRange({ from: undefined, to: undefined });
    setSearchQuery('');
  };

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    
    // Si la commande est marquée comme livrée, envoyer une demande de revue
    if (status === 'delivered') {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        sendReviewRequest(order);
        
        toast({
          title: "Demande de revue envoyée",
          description: `Une demande de revue a été envoyée à ${order.customer.firstName} ${order.customer.lastName}.`,
        });
      }
    }
    
    toast({
      title: "Statut mis à jour",
      description: `La commande ${orderId.slice(0, 8)} est maintenant ${getStatusLabel(status)}.`,
    });
    
    loadOrders();
  };

  const handleSendReviewRequest = (order: Order) => {
    const success = sendReviewRequest(order);
    
    if (success) {
      toast({
        title: "Demande de revue envoyée",
        description: `Une demande de revue a été envoyée à ${order.customer.firstName} ${order.customer.lastName}.`,
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la demande de revue. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleAssignToMe = (orderId: string) => {
    if (!user) return;
    
    assignOrder(orderId, `${user.firstName} ${user.lastName}`);
    
    toast({
      title: "Commande assignée",
      description: `La commande ${orderId.slice(0, 8)} vous a été assignée.`,
    });
    
    loadOrders();
  };

  const handleSendReminder = (order: Order) => {
    sendOrderReminder(order);
    markReminderSent(order.id);
    
    toast({
      title: "Rappel envoyé",
      description: `Un rappel a été envoyé au client au ${order.customer.phone}.`,
    });
    
    loadOrders();
  };

  const filterOrdersByStatus = () => {
    if (filter === 'all') return orders;
    return orders.filter(order => order.status === filter);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Confirmée</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Livrée</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Annulée</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return 'Inconnu';
    }
  };

  // Helper function to get order type badge
  const getOrderSourceBadge = (order: Order) => {
    if (order.influencerCode) {
      return <Badge variant="outline" className="bg-purple-100 text-purple-800 flex items-center gap-1">
        <Users size={12} /> Influenceur: {order.influencerCode}
      </Badge>;
    } else if (order.customer.phone.includes('whatsapp')) {
      return <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1">
        <Phone size={12} /> WhatsApp
      </Badge>;
    } else {
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 flex items-center gap-1">
        <ShoppingCart size={12} /> Directe
      </Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true,
      locale: fr
    });
  };

  // Format date for display in a more readable way
  const formatDateFull = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: fr });
  };

  // Helper function to safely format numbers
  const safeFormatNumber = (value: number | null | undefined): string => {
    if (value === null || value === undefined) {
      return "0";
    }
    return value.toLocaleString();
  };

  // Get counts for each order category
  const getOrderCounts = () => {
    const allOrders = getAllOrders();
    const direct = allOrders.filter(o => !o.influencerCode && !o.customer.phone.includes('whatsapp')).length;
    const whatsapp = allOrders.filter(o => o.customer.phone.includes('whatsapp')).length;
    const influencer = allOrders.filter(o => !!o.influencerCode).length;
    
    return {
      all: allOrders.length,
      direct,
      whatsapp,
      influencer
    };
  };
  
  // Fonction pour ouvrir WhatsApp avec un message
  const openWhatsApp = (phoneNumber: string, message: string = "") => {
    // Nettoyer le numéro de téléphone
    const cleanPhone = phoneNumber.replace('whatsapp:', '').replace(/\D/g, '');
    // Créer le lien WhatsApp
    const whatsappLink = generateWhatsAppLink(cleanPhone, message);
    // Ouvrir dans un nouvel onglet
    window.open(whatsappLink, '_blank');
  };
  
  // Gestion de la sélection multiple
  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };
  
  const toggleSelectAll = () => {
    if (selectedOrders.length === filterOrdersByStatus().length) {
      // Si tous sont sélectionnés, tout désélectionner
      setSelectedOrders([]);
    } else {
      // Sinon, sélectionner tous les ordres visibles
      setSelectedOrders(filterOrdersByStatus().map(order => order.id));
    }
  };
  
  // Ouvrir la boîte de dialogue de message avec des commandes sélectionnées
  const openMessageDialog = () => {
    if (selectedOrders.length === 0) {
      toast({
        title: "Aucune commande sélectionnée",
        description: "Veuillez sélectionner au moins une commande.",
        variant: "destructive",
      });
      return;
    }
    
    setIsMessageDialogOpen(true);
  };
  
  // Mettre à jour le contenu du message lors du changement de modèle
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    // Trouver le modèle sélectionné
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setMessageContent(template.content);
    }
  };
  
  // Envoyer des messages aux commandes sélectionnées
  const sendMessagesToSelected = () => {
    if (selectedOrders.length === 0 || !messageContent.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner des commandes et saisir un message.",
        variant: "destructive",
      });
      return;
    }
    
    // Obtenir les commandes sélectionnées
    const selectedOrderObjects = orders.filter(order => selectedOrders.includes(order.id));
    
    let successCount = 0;
    
    // Pour chaque commande, envoyer un message
    selectedOrderObjects.forEach(order => {
      try {
        // Personnaliser le message pour cette commande
        let personalizedMessage = messageContent
          .replace(/\{\{nom\}\}/g, `${order.customer.firstName} ${order.customer.lastName}`)
          .replace(/\{\{orderNumber\}\}/g, order.id.slice(0, 8));
        
        // Ouvrir WhatsApp dans un nouvel onglet
        openWhatsApp(order.customer.phone, personalizedMessage);
        
        successCount++;
      } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error);
      }
    });
    
    if (successCount > 0) {
      toast({
        title: "Messages envoyés",
        description: `${successCount} messages ont été préparés pour envoi.`,
      });
    }
    
    setIsMessageDialogOpen(false);
    setSelectedOrders([]);
  };
  
  // Changement de statut groupé
  const updateStatusForSelected = (status: OrderStatus) => {
    if (selectedOrders.length === 0) {
      toast({
        title: "Aucune commande sélectionnée",
        description: "Veuillez sélectionner au moins une commande.",
        variant: "destructive",
      });
      return;
    }
    
    // Mettre à jour le statut de toutes les commandes sélectionnées
    selectedOrders.forEach(orderId => {
      updateOrderStatus(orderId, status);
    });
    
    toast({
      title: "Statuts mis à jour",
      description: `${selectedOrders.length} commandes ont été mises à jour avec le statut "${getStatusLabel(status)}".`,
    });
    
    loadOrders();
    setSelectedOrders([]);
  };

  const orderCounts = getOrderCounts();

  return (
    <AdminPageLayout>
      <AdminPageHeader title="Gestion des Commandes" />
      
      <div className="container-cowema space-y-6">
        <Tabs 
          defaultValue="all" 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as OrderType)}
          className="w-full"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value={OrderType.ALL} className="flex items-center gap-2">
                <ShoppingCart size={16} />
                Toutes les commandes
                <Badge variant="secondary">{orderCounts.all}</Badge>
              </TabsTrigger>
              <TabsTrigger value={OrderType.DIRECT} className="flex items-center gap-2">
                <Truck size={16} />
                Commandes directes
                <Badge variant="secondary">{orderCounts.direct}</Badge>
              </TabsTrigger>
              <TabsTrigger value={OrderType.WHATSAPP} className="flex items-center gap-2">
                <Phone size={16} />
                Commandes WhatsApp
                <Badge variant="secondary">{orderCounts.whatsapp}</Badge>
              </TabsTrigger>
              <TabsTrigger value={OrderType.INFLUENCER} className="flex items-center gap-2">
                <Users size={16} />
                Commandes influenceurs
                <Badge variant="secondary">{orderCounts.influencer}</Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Statistics Cards */}
          {showStats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {/* Total Orders Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    Commandes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orderStats.totalOrders}</div>
                  <div className="text-sm text-muted-foreground flex justify-between">
                    <span>Total de commandes</span>
                    <span className="font-medium">{safeFormatNumber(orderStats.totalAmount)} FCFA</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Status Distribution Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-blue-500" />
                    Statuts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center text-xs">
                        <Badge variant="outline" className="bg-yellow-100 h-2 w-2 p-0 mr-1"></Badge>
                        En attente
                      </span>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                        {orderStats.pendingOrders}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center text-xs">
                        <Badge variant="outline" className="bg-blue-100 h-2 w-2 p-0 mr-1"></Badge>
                        Confirmées
                      </span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        {orderStats.confirmedOrders}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center text-xs">
                        <Badge variant="outline" className="bg-green-100 h-2 w-2 p-0 mr-1"></Badge>
                        Livrées
                      </span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        {orderStats.deliveredOrders}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Source Distribution Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUpIcon className="h-5 w-5 text-green-500" />
                    Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Direct</span>
                      <Badge>{orderCounts.direct}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs">WhatsApp</span>
                      <Badge className="bg-green-600">{orderCounts.whatsapp}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Influenceurs</span>
                      <Badge className="bg-purple-600">{orderCounts.influencer}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Top Cities Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5 text-orange-500" />
                    Top Villes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1">
                    {topCities.slice(0, 3).map((city, index) => (
                      <div key={city.name} className="flex justify-between items-center">
                        <span className="text-xs">{city.name}</span>
                        <span className="text-xs font-medium">{city.count} commandes</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === OrderType.ALL && "Toutes les commandes"}
                {activeTab === OrderType.DIRECT && "Commandes directes"}
                {activeTab === OrderType.WHATSAPP && "Commandes WhatsApp"}
                {activeTab === OrderType.INFLUENCER && "Commandes influenceurs"}
              </CardTitle>
              <CardDescription>
                {activeTab === OrderType.ALL && "Tous types de commandes"}
                {activeTab === OrderType.DIRECT && "Commandes passées directement sur le site"}
                {activeTab === OrderType.WHATSAPP && "Commandes passées via WhatsApp"}
                {activeTab === OrderType.INFLUENCER && "Commandes avec code influenceur"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Advanced Filters */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <FilterIcon className="h-4 w-4" />
                    Filtres avancés
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowStats(!showStats)}
                    className="text-xs"
                  >
                    {showStats ? 'Masquer' : 'Afficher'} les statistiques
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search Box */}
                  <div className="relative">
                    <SearchIcon className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  
                  {/* Date Range Picker */}
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${
                            dateRange.from || dateRange.to ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "P", { locale: fr })} -{" "}
                                {format(dateRange.to, "P", { locale: fr })}
                              </>
                            ) : (
                              format(dateRange.from, "P", { locale: fr })
                            )
                          ) : (
                            "Toutes les dates"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={dateRange.from}
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={2}
                          className="pointer-events-auto"
                        />
                        <div className="p-3 border-t border-border flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDateRange({ from: undefined, to: undefined })}
                          >
                            Réinitialiser
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {/* Status Filter */}
                  <div>
                    <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Statut: Tous" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="confirmed">Confirmées</SelectItem>
                        <SelectItem value="delivered">Livrées</SelectItem>
                        <SelectItem value="cancelled">Annulées</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* City Filter */}
                  <div>
                    <Select value={cityFilter} onValueChange={setCityFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Ville: Toutes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les villes</SelectItem>
                        {getUniqueCities().map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Filter Actions */}
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearFilters}
                  >
                    Réinitialiser les filtres
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={loadOrders} 
                    className="flex items-center gap-1"
                  >
                    <RefreshCw size={16} />
                    Actualiser
                  </Button>
                </div>
              </div>

              {/* Orders Table */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  {selectedOrders.length > 0 && (
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="flex items-center gap-1">
                            Actions groupées
                            <ChevronDown size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Actions sur {selectedOrders.length} commande{selectedOrders.length > 1 ? 's' : ''}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={openMessageDialog}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            <span>Envoyer message WhatsApp</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => updateStatusForSelected('confirmed')}>
                            <Check className="mr-2 h-4 w-4 text-blue-600" />
                            <span>Marquer comme confirmées</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatusForSelected('delivered')}>
                            <Truck className="mr-2 h-4 w-4 text-green-600" />
                            <span>Marquer comme livrées</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatusForSelected('cancelled')}>
                            <X className="mr-2 h-4 w-4 text-red-600" />
                            <span>Annuler les commandes</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setSelectedOrders([])}>
                            <X className="mr-2 h-4 w-4" />
                            <span>Désélectionner tout</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''}
                </div>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                  <span>Chargement des commandes...</span>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40px]">
                          <Checkbox 
                            checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Assigné à</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow 
                          key={order.id} 
                          className={selectedOrders.includes(order.id) ? "bg-muted/80" : ""}
                        >
                          <TableCell>
                            <Checkbox 
                              checked={selectedOrders.includes(order.id)}
                              onCheckedChange={() => toggleOrderSelection(order.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">#{order.id.slice(0, 8)}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.customer.firstName} {order.customer.lastName}</div>
                              <div className="flex items-center gap-2">
                                <a 
                                  href={`tel:${order.customer.phone.replace('whatsapp:', '')}`}
                                  className="text-xs text-blue-600 hover:underline"
                                >
                                  {order.customer.phone.replace('whatsapp:', '')}
                                </a>
                                {order.customer.phone.includes('whatsapp') && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 px-2 text-green-600"
                                    onClick={() => openWhatsApp(order.customer.phone)}
                                    title="Contacter par WhatsApp"
                                  >
                                    <Phone size={14} />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getOrderSourceBadge(order)}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-xs">{formatDateFull(order.createdAt)}</span>
                              <span className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</span>
                            </div>
                          </TableCell>
                          <TableCell>{safeFormatNumber(order.totalAmount)} FCFA</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            {order.assignedTo || (
                              <Button
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleAssignToMe(order.id)}
                                className="text-xs"
                              >
                                Assigner à moi
                              </Button>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setViewOrderDetails(true);
                                }}
                              >
                                <Eye size={16} />
                              </Button>
                              
                              {order.status === 'pending' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-green-600"
                                    onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                                  >
                                    <Check size={16} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-blue-600"
                                    onClick={() => handleSendReminder(order)}
                                    disabled={order.reminderSent}
                                  >
                                    <Phone size={16} />
                                  </Button>
                                </>
                              )}
                              
                              {order.status === 'confirmed' && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-green-600"
                                  onClick={() => handleUpdateStatus(order.id, 'delivered')}
                                >
                                  <Truck size={16} />
                                </Button>
                              )}
                              
                              {order.status === 'delivered' && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-blue-600"
                                  onClick={() => handleSendReviewRequest(order)}
                                  title="Demander un avis"
                                >
                                  <MessageSquare size={16} />
                                </Button>
                              )}
                              
                              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600"
                                  onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                >
                                  <X size={16} />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {filteredOrders.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                            Aucune commande trouvée
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-gray-500">
                Total: {filteredOrders.length} commandes
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  {filteredOrders.filter(o => o.status === 'pending').length} en attente
                </Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  {filteredOrders.filter(o => o.status === 'confirmed').length} confirmées
                </Badge>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  {filteredOrders.filter(o => o.status === 'delivered').length} livrées
                </Badge>
              </div>
            </CardFooter>
          </Card>
        </Tabs>
        
        {/* Order Details Modal */}
        <Dialog open={viewOrderDetails} onOpenChange={setViewOrderDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails de la commande #{selectedOrder?.id.slice(0, 8)}</DialogTitle>
              <DialogDescription>
                Créée {selectedOrder && formatDate(selectedOrder.createdAt)}
              </DialogDescription>
            </DialogHeader>
            
            {selectedOrder && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold mb-2">Informations client</h3>
                    <p><span className="font-medium">Nom:</span> {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Téléphone:</span> 
                      <a 
                        href={`tel:${selectedOrder.customer.phone.replace('whatsapp:', '')}`}
                        className="text-blue-600 hover:underline"
                      >
                        {selectedOrder.customer.phone.replace('whatsapp:', '')}
                      </a>
                      
                      {selectedOrder.customer.phone.includes('whatsapp') && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-6 px-2 text-green-600"
                          onClick={() => openWhatsApp(selectedOrder.customer.phone)}
                        >
                          <Phone size={14} className="mr-1" />
                          WhatsApp
                        </Button>
                      )}
                    </div>
                    
                    {selectedOrder.customer.email && (
                      <p><span className="font-medium">Email:</span> {selectedOrder.customer.email}</p>
                    )}
                    <p><span className="font-medium">Adresse:</span> {selectedOrder.customer.address}</p>
                    <p><span className="font-medium">Ville:</span> {selectedOrder.customer.city}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Informations commande</h3>
                    <p><span className="font-medium">Date:</span> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    <p><span className="font-medium">Status:</span> {getStatusLabel(selectedOrder.status)}</p>
                    <p>
                      <span className="font-medium">Source:</span> {' '}
                      {selectedOrder.influencerCode 
                        ? `Influenceur (${selectedOrder.influencerCode})` 
                        : selectedOrder.customer.phone.includes('whatsapp')
                          ? 'WhatsApp'
                          : 'Commande directe'}
                    </p>
                    <p><span className="font-medium">Montant total:</span> {safeFormatNumber(selectedOrder.totalAmount)} FCFA</p>
                    <p>
                      <span className="font-medium">Assignée à:</span> {selectedOrder.assignedTo || 'Non assignée'}
                    </p>
                    {selectedOrder.influencerCode && (
                      <p><span className="font-medium">Code influenceur:</span> {selectedOrder.influencerCode}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Articles commandés</h3>
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produit</TableHead>
                          <TableHead className="text-right">Qté</TableHead>
                          <TableHead className="text-right">Prix</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.title}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">
                              {safeFormatNumber(item.promoPrice || item.price)} FCFA
                            </TableCell>
                            <TableCell className="text-right">
                              {safeFormatNumber(
                                (item.promoPrice !== null ? item.promoPrice : item.price) * item.quantity
                              )} FCFA
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                {selectedOrder.customer.notes && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-1">Notes du client</h3>
                    <p className="text-gray-700 bg-gray-50 p-2 rounded">{selectedOrder.customer.notes}</p>
                  </div>
                )}
                
                <DialogFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-1"
                      onClick={() => generateReceiptPDF(selectedOrder)}
                    >
                      <Download size={16} />
                      Télécharger reçu
                    </Button>
                    
                    {selectedOrder.status === 'pending' && (
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-1"
                        onClick={() => {
                          handleSendReminder(selectedOrder);
                          setViewOrderDetails(false);
                        }}
                        disabled={selectedOrder.reminderSent}
                      >
                        <Phone size={16} />
                        {selectedOrder.reminderSent ? 'Rappel déjà envoyé' : 'Envoyer rappel'}
                      </Button>
                    )}
                    
                    {selectedOrder.status === 'delivered' && (
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-1"
                        onClick={() => {
                          handleSendReviewRequest(selectedOrder);
                        }}
                      >
                        <MessageSquare size={16} />
                        Demander un avis
                      </Button>
                    )}
                  </div>
                  
                  {selectedOrder.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button 
                        variant="destructive"
                        onClick={() => {
                          handleUpdateStatus(selectedOrder.id, 'cancelled');
                          setViewOrderDetails(false);
                        }}
                      >
                        Annuler
                      </Button>
                      <Button 
                        onClick={() => {
                          handleUpdateStatus(selectedOrder.id, 'confirmed');
                          setViewOrderDetails(false);
                        }}
                      >
                        Confirmer
                      </Button>
                    </div>
                  )}
                  
                  {selectedOrder.status === 'confirmed' && (
                    <Button 
                      onClick={() => {
                        handleUpdateStatus(selectedOrder.id, 'delivered');
                        setViewOrderDetails(false);
                      }}
                    >
                      Marquer comme livré
                    </Button>
                  )}
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
        
        {/* WhatsApp Messages Modal */}
        <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Envoyer un message WhatsApp</DialogTitle>
              <DialogDescription>
                Vous allez envoyer un message à {selectedOrders.length} client{selectedOrders.length > 1 ? 's' : ''}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="template" className="text-sm font-medium">
                  Modèle de message
                </label>
                <Select
                  value={selectedTemplate}
                  onValueChange={handleTemplateChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un modèle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Aucun (message personnalisé)</SelectItem>
                    {getTemplatesByType('whatsapp').map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Vous pouvez gérer vos modèles de messages dans la section "Modèles de messages".
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea 
                  id="message"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Saisissez votre message ici..."
                  className="min-h-32"
                />
                <p className="text-xs text-muted-foreground">
                  Variables disponibles: {'{{'}{'{nom}'}{'}}'} sera remplacé par le nom du client, {'{{'}{'{orderNumber}'}{'}}'} par le numéro de commande.
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={sendMessagesToSelected}
                className="flex items-center gap-2"
              >
                <Send size={16} />
                Envoyer {selectedOrders.length > 1 ? `(${selectedOrders.length})` : ''}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminPageLayout>
  );
};

export default OrdersManager;
