
import { useInfluencerStore } from './useInfluencerStore';
import { useToast } from './use-toast';
import { useState, useEffect } from 'react';
import { Commission } from '../types/influencer';

export const useInfluencerNotifications = () => {
  const { currentUserInfluencer } = useInfluencerStore();
  const { toast } = useToast();
  const [lastCheckedCommissions, setLastCheckedCommissions] = useState<string[]>([]);

  // Vérifie les nouvelles commissions à chaque changement dans currentUserInfluencer
  useEffect(() => {
    if (currentUserInfluencer) {
      checkNewCommissions();
    }
  }, [currentUserInfluencer]);

  // Vérifie s'il y a de nouvelles commissions
  const checkNewCommissions = () => {
    if (!currentUserInfluencer) return;

    const currentCommissionIds = lastCheckedCommissions;
    const newCommissions: Commission[] = [];

    // Parcourir les commissions actuelles et identifier les nouvelles
    currentUserInfluencer.commissions.forEach(commission => {
      if (!currentCommissionIds.includes(commission.id)) {
        newCommissions.push(commission);
        currentCommissionIds.push(commission.id);
      }
    });

    // Mettre à jour la liste des commissions vérifiées
    setLastCheckedCommissions(currentCommissionIds);

    // Notifier l'utilisateur des nouvelles commissions
    if (newCommissions.length > 0) {
      newCommissions.forEach(commission => {
        toast({
          title: "Nouvelle commission !",
          description: `Vous avez gagné ${commission.amount.toFixed(0)} FCFA sur une commande de ${commission.productTotal.toFixed(0)} FCFA.`,
          duration: 5000,
        });
      });
    }
  };

  // Vérifie si un montant minimum peut être retiré
  const canWithdraw = () => {
    if (!currentUserInfluencer) return false;
    
    const availableToPayout = currentUserInfluencer.totalEarned - currentUserInfluencer.totalPaid;
    return availableToPayout >= 10000; // Seuil de 10 000 FCFA
  };

  // Alerte si le montant minimum est atteint
  const alertIfCanWithdraw = () => {
    if (canWithdraw()) {
      toast({
        title: "Retrait disponible",
        description: "Votre solde disponible dépasse 10 000 FCFA. Vous pouvez effectuer un retrait.",
        duration: 8000,
      });
      return true;
    }
    return false;
  };

  return {
    checkNewCommissions,
    canWithdraw,
    alertIfCanWithdraw
  };
};
