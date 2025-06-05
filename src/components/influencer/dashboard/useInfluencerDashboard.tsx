
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfluencerStore } from '@/hooks/useInfluencerStore';
import { useInfluencerCommission } from '@/hooks/useInfluencerCommission';
import { useInfluencerNotifications } from '@/hooks/useInfluencerNotifications';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseInfluencers } from '@/hooks/useSupabaseInfluencers';
import { 
  generateReferralLink, 
  generatePersonalizedReferralLink, 
  generateShortInfluencerLink,
  getDomainInfo 
} from '@/utils/influencerUtils';

export const useInfluencerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isInitializing, setIsInitializing] = useState(true);
  const { currentUserInfluencer, setCurrentUserInfluencer } = useInfluencerStore();
  const { toast } = useToast();
  const { getInfluencerStats } = useInfluencerCommission();
  const { checkNewCommissions } = useInfluencerNotifications();
  const { user, isAuthenticated, isLoading } = useUnifiedAuth();
  const { influencers, createInfluencerProfile } = useSupabaseInfluencers();
  const navigate = useNavigate();

  console.log('🎯 useInfluencerDashboard:', {
    isAuthenticated,
    userRole: user?.role,
    hasInfluencer: !!currentUserInfluencer,
    isLoading,
    isInitializing,
    influencersCount: influencers.length
  });

  // Initialiser ou créer le profil influenceur
  useEffect(() => {
    const initializeInfluencerProfile = async () => {
      if (!user || user.role !== 'influencer' || !isAuthenticated) {
        setIsInitializing(false);
        return;
      }

      console.log('🔍 Looking for influencer profile for user:', user.id);
      
      // Chercher le profil influenceur existant
      const existingInfluencer = influencers.find(inf => inf.userId === user.id);
      
      if (existingInfluencer) {
        console.log('✅ Found existing influencer profile:', existingInfluencer);
        // Convertir le profil Supabase vers le format du store
        const influencerData = {
          id: existingInfluencer.id,
          applicationId: existingInfluencer.id, // Utiliser l'ID comme applicationId
          userId: existingInfluencer.userId,
          firstName: user.nom?.split(' ')[0] || 'Influenceur',
          lastName: user.nom?.split(' ').slice(1).join(' ') || '',
          email: user.email || '',
          phone: user.phone || '',
          city: user.city || '',
          socialNetworks: existingInfluencer.socialNetworks || {},
          referralCode: existingInfluencer.referralCode || '',
          referralLink: `${window.location.origin}/?ref=${existingInfluencer.referralCode}`,
          commissionRate: existingInfluencer.commissionRate || 5,
          commissions: [], // Les commissions seront chargées séparément
          totalEarned: existingInfluencer.totalEarnings || 0,
          totalPaid: 0, // À calculer depuis les commissions
          createdAt: existingInfluencer.createdAt
        };
        
        setCurrentUserInfluencer(influencerData);
      } else {
        console.log('❌ No influencer profile found, creating one...');
        
        try {
          // Créer un nouveau profil influenceur
          const newProfile = await createInfluencerProfile({
            userId: user.id,
            socialNetworks: {},
            followerCount: 0,
            engagementRate: 0,
            niche: [],
            motivation: 'Profil créé automatiquement'
          });

          if (newProfile) {
            console.log('✅ Created new influencer profile:', newProfile);
            
            const influencerData = {
              id: newProfile.id,
              applicationId: newProfile.id,
              userId: newProfile.userId,
              firstName: user.nom?.split(' ')[0] || 'Influenceur',
              lastName: user.nom?.split(' ').slice(1).join(' ') || '',
              email: user.email || '',
              phone: user.phone || '',
              city: user.city || '',
              socialNetworks: newProfile.socialNetworks || {},
              referralCode: newProfile.referralCode || '',
              referralLink: `${window.location.origin}/?ref=${newProfile.referralCode}`,
              commissionRate: newProfile.commissionRate || 5,
              commissions: [],
              totalEarned: 0,
              totalPaid: 0,
              createdAt: newProfile.createdAt
            };
            
            setCurrentUserInfluencer(influencerData);
            
            toast({
              title: "Profil influenceur créé",
              description: `Votre code de parrainage est: ${newProfile.referralCode}`,
            });
          } else {
            throw new Error('Échec de la création du profil');
          }
        } catch (error) {
          console.error('❌ Error creating influencer profile:', error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de créer votre profil influenceur. Veuillez contacter le support.",
          });
        }
      }
      
      setIsInitializing(false);
    };

    if (!isLoading) {
      initializeInfluencerProfile();
    }
  }, [user, isAuthenticated, isLoading, influencers, createInfluencerProfile, setCurrentUserInfluencer, toast]);

  // Vérification d'accès
  useEffect(() => {
    if (!isLoading && !isInitializing) {
      if (!isAuthenticated || !user) {
        console.log('❌ No authentication, redirecting to login');
        navigate('/influencer/login');
        return;
      }

      if (user.role !== 'influencer') {
        console.log('❌ Wrong role, redirecting');
        navigate('/influencer');
        return;
      }

      // Vérifier les nouvelles commissions seulement si tout est OK
      if (currentUserInfluencer) {
        checkNewCommissions();
      }
    }
  }, [isAuthenticated, user, isLoading, isInitializing, currentUserInfluencer, navigate, checkNewCommissions]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copié !",
          description: `${label} copié dans le presse-papiers.`,
        });
      },
      (err) => {
        console.error('Clipboard error:', err);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de copier le texte.",
        });
      }
    );
  };

  // Si en cours de chargement ou d'initialisation
  if (isLoading || isInitializing || !currentUserInfluencer) {
    return { 
      activeTab, 
      setActiveTab, 
      currentUserInfluencer: null, 
      data: null, 
      isLoading: true 
    };
  }

  // Calculs des statistiques
  const totalEarned = currentUserInfluencer.totalEarned || 0;
  const availableToPayout = totalEarned - (currentUserInfluencer.totalPaid || 0);
  const totalOrders = new Set(currentUserInfluencer.commissions.map(c => c.orderId)).size;
  const progressPercentage = availableToPayout >= 10000 ? 100 : (availableToPayout / 10000) * 100;
  
  // Génération des liens avec le domaine personnalisé
  const domainInfo = getDomainInfo();
  const referralCode = currentUserInfluencer.referralCode;
  const firstName = currentUserInfluencer.firstName;
  
  // Liens mis à jour avec le domaine cowema.net
  const baseReferralLink = generateReferralLink(referralCode);
  const personalizedLink = generatePersonalizedReferralLink(referralCode, `${firstName} ${currentUserInfluencer.lastName}`);
  const shortLink = generateShortInfluencerLink(referralCode, firstName);

  // Statistiques de l'influenceur
  const influencerStats = currentUserInfluencer?.id ? getInfluencerStats(currentUserInfluencer.id) : null;

  // Données mensuelles pour le graphique
  const monthlyData = currentUserInfluencer.commissions.reduce((acc: Record<string, number>, commission) => {
    const month = new Date(commission.date).toISOString().substring(0, 7);
    acc[month] = (acc[month] || 0) + commission.amount;
    return acc;
  }, {});

  const chartData = Object.entries(monthlyData)
    .map(([month, amount]) => ({
      month: new Date(month + '-01').toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
      amount
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return {
    activeTab,
    setActiveTab,
    currentUserInfluencer,
    isLoading: false,
    data: {
      totalEarned,
      availableToPayout,
      totalOrders,
      progressPercentage,
      personalizedLink,
      shortLink,
      baseReferralLink,
      domainInfo,
      influencerStats,
      chartData,
      copyToClipboard
    }
  };
};
