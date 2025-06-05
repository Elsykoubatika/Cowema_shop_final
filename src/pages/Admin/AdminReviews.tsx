
import React, { useState } from 'react';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { Star, Eye, Check, X, Search, Trash, RefreshCw, MessageSquare, AlertTriangle } from 'lucide-react';
import { useAdminReviews } from '@/hooks/admin/useAdminReviews';
import type { AdminReview } from '@/hooks/admin/useAdminReviews';

type ReviewStatus = 'all' | 'pending' | 'published' | 'rejected';

const AdminReviews: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReviewStatus>('all');
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  const { reviews, isLoading, deleteReview, getStatistics, refetch } = useAdminReviews();
  const statistics = getStatistics();

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (review.comment && review.comment.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (review: AdminReview) => {
    setSelectedReview(review);
    setIsDeleteDialogOpen(true);
  };

  const handleViewDetails = (review: AdminReview) => {
    setSelectedReview(review);
    setIsDetailsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedReview) {
      const success = await deleteReview(selectedReview.id);
      if (success) {
        setIsDeleteDialogOpen(false);
        setSelectedReview(null);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Publié';
      case 'pending': return 'En attente';
      case 'rejected': return 'Rejeté';
      default: return status;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (isLoading) {
    return (
      <AdminPageLayout>
        <AdminPageHeader title="Avis clients" />
        <div className="container-cowema p-4">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout>
      <AdminPageHeader title="Avis clients" />
      <div className="container-cowema p-4">
        {/* Statistiques */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Statistiques des avis
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refetch}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Actualiser
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-md flex items-center space-x-4">
                <div className="bg-green-500 p-2 rounded-full">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Note moyenne</p>
                  <h3 className="text-2xl font-bold">{statistics.averageRating}/5</h3>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md flex items-center space-x-4">
                <div className="bg-blue-500 p-2 rounded-full">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total des avis</p>
                  <h3 className="text-2xl font-bold">{statistics.totalReviews}</h3>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-md flex items-center space-x-4">
                <div className="bg-amber-500 p-2 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">En attente</p>
                  <h3 className="text-2xl font-bold">{statistics.pendingReviews}</h3>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex flex-1 relative">
            <Input
              placeholder="Rechercher par client, produit ou contenu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ReviewStatus)}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les avis</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="published">Publiés</SelectItem>
              <SelectItem value="rejected">Rejetés</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Liste des avis */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des avis ({filteredReviews.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead className="hidden md:table-cell">Commentaire</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">{review.productName}</TableCell>
                      <TableCell>
                        <div>
                          {review.customerName}
                          {review.isVerifiedPurchase && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Vérifié
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs truncate">
                        {review.comment || 'Aucun commentaire'}
                      </TableCell>
                      <TableCell>{new Date(review.date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(review.status)}>
                          {getStatusText(review.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleViewDetails(review)}
                            className="text-gray-600 hover:text-blue-600"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(review)}
                            className="text-gray-600 hover:text-red-600"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredReviews.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        {searchTerm || statusFilter !== 'all' 
                          ? 'Aucun avis trouvé avec ces critères' 
                          : 'Aucun avis disponible'
                        }
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Dialog de détails */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails de l'avis</DialogTitle>
            </DialogHeader>
            {selectedReview && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Produit</p>
                    <p className="text-sm text-gray-600">{selectedReview.productName}</p>
                  </div>
                  <div>
                    <p className="font-medium">Client</p>
                    <p className="text-sm text-gray-600">{selectedReview.customerName}</p>
                  </div>
                  <div>
                    <p className="font-medium">Note</p>
                    <div className="flex">
                      {renderStars(selectedReview.rating)}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedReview.date).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                {selectedReview.comment && (
                  <div>
                    <p className="font-medium">Commentaire</p>
                    <p className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded-md">
                      {selectedReview.comment}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(selectedReview.status)}>
                    {getStatusText(selectedReview.status)}
                  </Badge>
                  {selectedReview.isVerifiedPurchase && (
                    <Badge variant="outline">
                      Achat vérifié
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog de suppression */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer cet avis ? Cette action ne peut pas être annulée.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminPageLayout>
  );
};

export default AdminReviews;
