
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSupabaseInfluencers } from '@/hooks/useSupabaseInfluencers';
import { InfluencerProfile } from '@/hooks/useSupabaseInfluencers';
import { 
  getMainSocialNetwork, 
  calculateSocialStats, 
  formatDate 
} from '@/components/admin/influencers/utils/influencerUtils';

export const useInfluencerManager = () => {
  const navigate = useNavigate();
  const { influencers, updateInfluencerStatus, isLoading } = useSupabaseInfluencers();
  
  // États
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('influencers');
  const [mainNetworkFilter, setMainNetworkFilter] = useState('all');
  const [selectedInfluencers, setSelectedInfluencers] = useState<string[]>([]);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<InfluencerProfile | null>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState<'approve' | 'reject' | null>(null);

  // Séparer les influenceurs par statut
  const approvedInfluencers = influencers.filter(inf => inf.status === 'approved');
  const pendingApplications = influencers.filter(inf => inf.status === 'pending');

  // Filtrage des influenceurs approuvés
  const filteredInfluencers = approvedInfluencers.filter(inf => {
    const matchesSearch = 
      inf.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inf.socialNetworks?.instagram && inf.socialNetworks.instagram.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inf.socialNetworks?.tiktok && inf.socialNetworks.tiktok.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inf.referralCode && inf.referralCode.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesNetwork = 
      mainNetworkFilter === 'all' || 
      getMainSocialNetwork(inf) === mainNetworkFilter;
    
    return matchesSearch && matchesNetwork;
  });

  // Filtrage des candidatures en attente
  const filteredApplications = pendingApplications.filter(inf => {
    const matchesSearch = 
      inf.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inf.socialNetworks?.instagram && inf.socialNetworks.instagram.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inf.socialNetworks?.tiktok && inf.socialNetworks.tiktok.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesNetwork = 
      mainNetworkFilter === 'all' || 
      getMainSocialNetwork(inf) === mainNetworkFilter;
    
    return matchesSearch && matchesNetwork;
  });

  // Gestionnaires d'événements
  const handleViewInfluencer = useCallback((id: string) => {
    navigate(`/admin/influencers/${id}`);
  }, [navigate]);

  const handleApproveApplication = useCallback(async (id: string) => {
    const success = await updateInfluencerStatus(id, 'approved');
    if (success) {
      toast.success('Candidature approuvée avec succès');
    }
  }, [updateInfluencerStatus]);

  const handleRejectApplication = useCallback(async (id: string) => {
    const success = await updateInfluencerStatus(id, 'rejected');
    if (success) {
      toast.success('Candidature rejetée');
    }
  }, [updateInfluencerStatus]);

  // Afficher les détails d'un influenceur ou d'une candidature
  const showDetails = useCallback((item: InfluencerProfile) => {
    setSelectedDetail(item);
    setShowDetailsDialog(true);
  }, []);

  // Gérer les actions groupées
  const handleBulkAction = useCallback(async () => {
    if (bulkAction === 'approve') {
      for (const id of selectedApplications) {
        await handleApproveApplication(id);
      }
      toast.success(`${selectedApplications.length} candidature${selectedApplications.length > 1 ? 's' : ''} approuvée${selectedApplications.length > 1 ? 's' : ''}`);
    } else if (bulkAction === 'reject') {
      for (const id of selectedApplications) {
        await handleRejectApplication(id);
      }
      toast.success(`${selectedApplications.length} candidature${selectedApplications.length > 1 ? 's' : ''} rejetée${selectedApplications.length > 1 ? 's' : ''}`);
    }

    setSelectedApplications([]);
    setShowActionDialog(false);
    setBulkAction(null);
  }, [bulkAction, selectedApplications, handleApproveApplication, handleRejectApplication]);

  // Gestion des sélections
  const toggleInfluencerSelection = useCallback((id: string) => {
    setSelectedInfluencers(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    );
  }, []);

  const toggleApplicationSelection = useCallback((id: string) => {
    setSelectedApplications(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    );
  }, []);

  const toggleAllInfluencers = useCallback((checked: boolean) => {
    setSelectedInfluencers(checked ? filteredInfluencers.map(inf => inf.id) : []);
  }, [filteredInfluencers]);

  const toggleAllApplications = useCallback((checked: boolean) => {
    setSelectedApplications(checked ? filteredApplications.map(app => app.id) : []);
  }, [filteredApplications]);

  // Calculer les statistiques et les retourner sous forme d'objet simple
  const rawSocialStats = calculateSocialStats(approvedInfluencers, pendingApplications);

  return {
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedTab,
    setSelectedTab,
    mainNetworkFilter,
    setMainNetworkFilter,
    selectedInfluencers,
    setSelectedInfluencers,
    selectedApplications,
    setSelectedApplications,
    showStatsDialog,
    setShowStatsDialog,
    showDetailsDialog,
    setShowDetailsDialog,
    selectedDetail,
    setSelectedDetail,
    showActionDialog,
    setShowActionDialog,
    bulkAction,
    setBulkAction,
    filteredInfluencers,
    filteredApplications,
    handleViewInfluencer,
    handleApproveApplication,
    handleRejectApplication,
    showDetails,
    handleBulkAction,
    toggleInfluencerSelection,
    toggleApplicationSelection,
    toggleAllInfluencers,
    toggleAllApplications,
    formatDate,
    getMainSocialNetwork,
    socialStats: rawSocialStats
  };
};
