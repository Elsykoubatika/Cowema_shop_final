
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InfluencerProfile } from '@/hooks/useSupabaseInfluencers';
import { getSocialIcon } from './utils/influencerUtils';

interface DetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDetail: InfluencerProfile | null;
  formatDate: (date: string) => string;
  handleViewInfluencer?: (id: string) => void;
  handleApproveApplication?: (id: string) => void;
  handleRejectApplication?: (id: string) => void;
}

const DetailsDialog: React.FC<DetailsDialogProps> = ({
  open,
  onOpenChange,
  selectedDetail,
  formatDate,
  handleViewInfluencer,
  handleApproveApplication,
  handleRejectApplication
}) => {
  if (!selectedDetail) return null;

  const isApproved = selectedDetail.status === 'approved';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {selectedDetail.userId}
          </DialogTitle>
          <DialogDescription>
            {isApproved ? 'Détails de l\'influenceur' : 'Détails de la candidature'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-muted-foreground">ID Utilisateur</div>
                <div>{selectedDetail.userId}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Statut</div>
                <div>
                  <Badge 
                    variant="outline" 
                    className={
                      selectedDetail.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      selectedDetail.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                      'bg-red-100 text-red-800 border-red-200'
                    }
                  >
                    {selectedDetail.status === 'pending' ? 'En attente' :
                    selectedDetail.status === 'approved' ? 'Approuvé' :
                    'Rejeté'}
                  </Badge>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Abonnés</div>
                <div>{selectedDetail.followerCount?.toLocaleString() || 0}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Taux d'engagement</div>
                <div>{selectedDetail.engagementRate || 0}%</div>
              </div>
            </div>

            <div className="space-y-3">
              {isApproved && (
                <>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Code de parrainage</div>
                    <div>{selectedDetail.referralCode || 'Non défini'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Taux de commission</div>
                    <div>{selectedDetail.commissionRate}%</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Total gagné</div>
                    <div>{selectedDetail.totalEarnings?.toLocaleString() || 0} FCFA</div>
                  </div>
                </>
              )}
              <div>
                <div className="text-sm font-medium text-muted-foreground">Niches</div>
                <div>{selectedDetail.niche?.join(', ') || 'Non spécifiées'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Date de création</div>
                <div>{formatDate(selectedDetail.createdAt)}</div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Réseaux sociaux</h4>
            <div className="space-y-2">
              {Object.entries(selectedDetail.socialNetworks || {}).map(([network, url]) => 
                url ? (
                  <div key={network} className="flex items-center gap-2">
                    {getSocialIcon(network)}
                    <a 
                      href={url as string} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline break-all"
                    >
                      {url as string}
                    </a>
                  </div>
                ) : null
              )}
              {!selectedDetail.socialNetworks || Object.values(selectedDetail.socialNetworks).every(v => !v) && (
                <p className="text-sm text-muted-foreground">Aucun réseau social renseigné</p>
              )}
            </div>
          </div>

          {selectedDetail.motivation && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Motivation</h4>
              <p className="text-sm">{selectedDetail.motivation}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {isApproved ? (
            <Button onClick={() => {
              onOpenChange(false);
              handleViewInfluencer && handleViewInfluencer(selectedDetail.id);
            }}>
              Voir profil complet
            </Button>
          ) : (
            selectedDetail.status === 'pending' && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleRejectApplication && handleRejectApplication(selectedDetail.id);
                    onOpenChange(false);
                  }}
                  className="text-red-600"
                >
                  Rejeter
                </Button>
                <Button 
                  onClick={() => {
                    handleApproveApplication && handleApproveApplication(selectedDetail.id);
                    onOpenChange(false);
                  }}
                >
                  Approuver
                </Button>
              </>
            )
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailsDialog;
