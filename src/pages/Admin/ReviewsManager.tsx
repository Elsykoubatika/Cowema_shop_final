
import React, { useState } from 'react';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Search, Star, Trash, RefreshCw } from 'lucide-react';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { useAdminReviews } from '@/hooks/admin/useAdminReviews';
import type { AdminReview } from '@/hooks/admin/useAdminReviews';

type ReviewStatus = 'all' | 'pending' | 'published' | 'rejected';

const ReviewsManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReviewStatus>('all');
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
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
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedReview) {
      const success = await deleteReview(selectedReview.id);
      if (success) {
        setIsDialogOpen(false);
        setSelectedReview(null);
      }
    }
  };

  if (isLoading) {
    return (
      <AdminPageLayout>
        <AdminPageHeader title="Gestion des avis" />
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
      <AdminPageHeader title="Gestion des avis" />
      <div className="container-cowema p-4">
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

        <Card>
          <CardContent className="pt-6">
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
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs truncate">
                        {review.comment || 'Aucun commentaire'}
                      </TableCell>
                      <TableCell>{new Date(review.date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            review.status === 'published' ? 'default' : 
                            review.status === 'pending' ? 'outline' : 'destructive'
                          }
                        >
                          {review.status === 'published' ? 'Publié' : 
                           review.status === 'pending' ? 'En attente' : 'Rejeté'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(review)}
                          className="text-gray-600 hover:text-red-600"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
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
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet avis ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
};

const MessageSquare: React.FC<any> = (props) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );
};

export default ReviewsManager;
