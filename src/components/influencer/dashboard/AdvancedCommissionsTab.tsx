
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Filter, 
  Calendar, 
  Download, 
  TrendingUp,
  DollarSign,
  Package,
  Clock,
  X
} from 'lucide-react';
import { Commission } from '@/types/influencer';

interface AdvancedCommissionsTabProps {
  commissions: Commission[];
}

interface FilterState {
  search: string;
  status: string;
  dateRange: string;
  minAmount: string;
  maxAmount: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const AdvancedCommissionsTab: React.FC<AdvancedCommissionsTabProps> = ({ 
  commissions 
}) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    dateRange: 'all',
    minAmount: '',
    maxAmount: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const [activeTab, setActiveTab] = useState('list');

  // Mise à jour des filtres
  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      dateRange: 'all',
      minAmount: '',
      maxAmount: '',
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  // Filtrage des commissions
  const filteredCommissions = commissions.filter(commission => {
    // Recherche textuelle
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!commission.orderId.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    // Filtre par statut
    if (filters.status !== 'all') {
      if (filters.status === 'paid' && !commission.paid) return false;
      if (filters.status === 'pending' && commission.paid) return false;
    }

    // Filtre par montant
    if (filters.minAmount && commission.amount < Number(filters.minAmount)) return false;
    if (filters.maxAmount && commission.amount > Number(filters.maxAmount)) return false;

    // Filtre par période
    if (filters.dateRange !== 'all') {
      const commissionDate = new Date(commission.date);
      const now = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          if (commissionDate.toDateString() !== now.toDateString()) return false;
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (commissionDate < weekAgo) return false;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (commissionDate < monthAgo) return false;
          break;
        case 'quarter':
          const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          if (commissionDate < quarterAgo) return false;
          break;
      }
    }

    return true;
  });

  // Tri des commissions
  const sortedCommissions = [...filteredCommissions].sort((a, b) => {
    let compareValue = 0;
    
    switch (filters.sortBy) {
      case 'date':
        compareValue = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case 'amount':
        compareValue = a.amount - b.amount;
        break;
      case 'productTotal':
        compareValue = a.productTotal - b.productTotal;
        break;
      case 'commissionRate':
        compareValue = a.commissionRate - b.commissionRate;
        break;
      default:
        compareValue = 0;
    }

    return filters.sortOrder === 'desc' ? -compareValue : compareValue;
  });

  // Statistiques des commissions filtrées
  const stats = {
    total: sortedCommissions.reduce((sum, c) => sum + c.amount, 0),
    paid: sortedCommissions.filter(c => c.paid).reduce((sum, c) => sum + c.amount, 0),
    pending: sortedCommissions.filter(c => !c.paid).reduce((sum, c) => sum + c.amount, 0),
    count: sortedCommissions.length,
    avgAmount: sortedCommissions.length > 0 ? sortedCommissions.reduce((sum, c) => sum + c.amount, 0) / sortedCommissions.length : 0
  };

  // Données pour les graphiques/analyses
  const monthlyData = sortedCommissions.reduce((acc: Record<string, number>, commission) => {
    const month = new Date(commission.date).toISOString().substring(0, 7);
    acc[month] = (acc[month] || 0) + commission.amount;
    return acc;
  }, {});

  const exportData = () => {
    const csvContent = [
      ['Date', 'Commande', 'Montant Achat', 'Commission', 'Taux', 'Statut'].join(','),
      ...sortedCommissions.map(c => [
        new Date(c.date).toLocaleDateString('fr-FR'),
        c.orderId,
        c.productTotal,
        c.amount,
        `${c.commissionRate}%`,
        c.paid ? 'Payé' : 'En attente'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commissions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.dateRange !== 'all' || 
    filters.minAmount || filters.maxAmount;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Historique des Commissions Avancé
          </div>
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </CardTitle>
        <CardDescription>
          Filtrage et analyse avancés de vos commissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filtres avancés */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par ID de commande..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="paid">Payé</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.dateRange} onValueChange={(value) => updateFilter('dateRange', value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="week">7 derniers jours</SelectItem>
                <SelectItem value="month">30 derniers jours</SelectItem>
                <SelectItem value="quarter">3 derniers mois</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Min"
                type="number"
                value={filters.minAmount}
                onChange={(e) => updateFilter('minAmount', e.target.value)}
                className="w-24"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                placeholder="Max"
                type="number"
                value={filters.maxAmount}
                onChange={(e) => updateFilter('maxAmount', e.target.value)}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">FCFA</span>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="amount">Commission</SelectItem>
                  <SelectItem value="productTotal">Montant achat</SelectItem>
                  <SelectItem value="commissionRate">Taux</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {filters.sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>

            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <X className="h-4 w-4 mr-1" />
                Réinitialiser
              </Button>
            )}
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.total.toLocaleString()} FCFA
              </div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.paid.toLocaleString()} FCFA
              </div>
              <div className="text-sm text-muted-foreground">Payé</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.pending.toLocaleString()} FCFA
              </div>
              <div className="text-sm text-muted-foreground">En attente</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">
                {stats.count}
              </div>
              <div className="text-sm text-muted-foreground">Commissions</div>
            </CardContent>
          </Card>
        </div>

        {/* Tableau des résultats */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="list">Liste détaillée</TabsTrigger>
            <TabsTrigger value="analytics">Analyses</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            {sortedCommissions.length > 0 ? (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Commande</TableHead>
                      <TableHead>Montant achat</TableHead>
                      <TableHead>Taux</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedCommissions.map(commission => (
                      <TableRow key={commission.id}>
                        <TableCell>
                          {new Date(commission.date).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {commission.orderId}
                          </code>
                        </TableCell>
                        <TableCell>{commission.productTotal.toLocaleString()} FCFA</TableCell>
                        <TableCell>{commission.commissionRate}%</TableCell>
                        <TableCell className="font-medium">
                          {commission.amount.toLocaleString()} FCFA
                        </TableCell>
                        <TableCell>
                          <Badge variant={commission.paid ? "default" : "secondary"}>
                            {commission.paid ? 'Payé' : 'En attente'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Aucune commission trouvée avec ces critères
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Évolution mensuelle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(monthlyData)
                      .sort(([a], [b]) => b.localeCompare(a))
                      .slice(0, 6)
                      .map(([month, amount]) => (
                        <div key={month} className="flex items-center justify-between">
                          <span className="text-sm">
                            {new Date(month + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                          </span>
                          <span className="font-medium">
                            {amount.toLocaleString()} FCFA
                          </span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Commission moyenne</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-center">
                      {stats.avgAmount.toLocaleString()} FCFA
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Taux de paiement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-center">
                      {stats.count > 0 ? Math.round((sortedCommissions.filter(c => c.paid).length / stats.count) * 100) : 0}%
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedCommissionsTab;
