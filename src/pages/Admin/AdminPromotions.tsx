
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useSupabasePromotions, SupabasePromotion } from '@/hooks/admin/useSupabasePromotions';
import DynamicPromotionForm from '@/components/admin/promotions/DynamicPromotionForm';
import DeletePromotionDialog from '@/components/admin/promotions/DeletePromotionDialog';

const AdminPromotions: React.FC = () => {
  const {
    promotions,
    isLoading,
    error,
    createPromotion,
    updatePromotion,
    deletePromotion,
    togglePromotionStatus
  } = useSupabasePromotions();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPromo, setCurrentPromo] = useState<SupabasePromotion | null>(null);
  const [promoToDelete, setPromoToDelete] = useState<string | null>(null);

  const getStatusColor = (promo: SupabasePromotion) => {
    const now = new Date();
    const endDate = new Date(promo.end_date);
    const startDate = new Date(promo.start_date);

    if (!promo.is_active) return 'bg-gray-100 text-gray-800';
    if (endDate < now) return 'bg-red-100 text-red-800';
    if (startDate > now) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (promo: SupabasePromotion) => {
    const now = new Date();
    const endDate = new Date(promo.end_date);
    const startDate = new Date(promo.start_date);

    if (!promo.is_active) return 'Inactif';
    if (endDate < now) return 'Expiré';
    if (startDate > now) return 'Programmé';
    return 'Actif';
  };

  const handleOpenCreateDialog = () => {
    setCurrentPromo(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (promo: SupabasePromotion) => {
    setCurrentPromo(promo);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentPromo(null);
  };

  const handleSavePromotion = async (formData: any) => {
    if (currentPromo) {
      await updatePromotion(currentPromo.id, formData);
    } else {
      await createPromotion(formData);
    }
    handleCloseDialog();
  };

  const handleDeleteClick = (id: string) => {
    setPromoToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (promoToDelete) {
      await deletePromotion(promoToDelete);
      setIsDeleteDialogOpen(false);
      setPromoToDelete(null);
    }
  };

  const handleToggleStatus = async (promo: SupabasePromotion) => {
    await togglePromotionStatus(promo.id, !promo.is_active);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Erreur</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Promotions</h2>
          <p className="text-muted-foreground">
            Gérez vos codes de promotion et remises
          </p>
        </div>
        <Button onClick={handleOpenCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Créer une promotion
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Codes de promotion ({promotions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {promotions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucune promotion trouvée</p>
              <Button onClick={handleOpenCreateDialog} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Créer votre première promotion
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {promotions.map((promo) => (
                <div key={promo.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium font-mono">{promo.promo_code || promo.name}</p>
                      <Badge className={getStatusColor(promo)}>
                        {getStatusText(promo)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Remise: {promo.discount_value}{promo.discount_type === 'percentage' ? '%' : ' FCFA'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Du {new Date(promo.start_date).toLocaleDateString()} au {new Date(promo.end_date).toLocaleDateString()}
                      {promo.used_count !== undefined && ` - ${promo.used_count} utilisations`}
                    </p>
                    {promo.description && (
                      <p className="text-sm text-gray-500">{promo.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(promo)}
                      className="flex items-center gap-1"
                    >
                      {promo.is_active ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          Désactiver
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          Activer
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEditDialog(promo)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(promo.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog for create/edit promotion */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentPromo ? 'Modifier' : 'Créer'} une promotion
            </DialogTitle>
          </DialogHeader>
          <DynamicPromotionForm
            promotion={currentPromo}
            onSave={handleSavePromotion}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <DeletePromotionDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default AdminPromotions;
