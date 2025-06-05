
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import InfluencerHero from '../components/influencer/InfluencerHero';
import InfluencerBenefits from '../components/influencer/InfluencerBenefits';
import InfluencerApplicationForm from '../components/influencer/InfluencerApplicationForm';
import InfluencerFAQ from '../components/influencer/InfluencerFAQ';
import { useUnifiedAuth } from '../hooks/useUnifiedAuth';
import { useSupabaseInfluencers } from '../hooks/useSupabaseInfluencers';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Influencer = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useUnifiedAuth();
  const { influencers, isLoading } = useSupabaseInfluencers();
  const [userInfluencerProfile, setUserInfluencerProfile] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Vérifier si l'utilisateur a déjà un profil influenceur
      const existingProfile = influencers.find(inf => inf.userId === user.id);
      setUserInfluencerProfile(existingProfile);
      
      // Si c'est un influenceur approuvé, rediriger vers le dashboard
      if (user.role === 'influencer' && existingProfile?.status === 'approved') {
        navigate('/influencer/dashboard');
      }
    }
  }, [isAuthenticated, user, influencers, navigate]);

  // Affichage du chargement
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="text-gray-600">Chargement...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Contenu principal
  const renderContent = () => {
    // Si l'utilisateur a déjà une candidature
    if (userInfluencerProfile) {
      if (userInfluencerProfile.status === 'pending') {
        return (
          <div className="container-cowema py-12">
            <div className="bg-white p-8 rounded-lg shadow-cowema my-8 max-w-2xl mx-auto text-center">
              <h2 className="text-xl font-bold mb-4 text-blue-600">Candidature en cours d'examen</h2>
              <p className="text-gray-600 mb-4">
                Votre candidature a été soumise et est en cours d'examen par notre équipe.
              </p>
              <p className="text-gray-600">
                Nous vous contacterons prochainement avec une réponse.
              </p>
            </div>
          </div>
        );
      } else if (userInfluencerProfile.status === 'approved') {
        return (
          <div className="container-cowema py-12">
            <div className="bg-white p-8 rounded-lg shadow-cowema my-8 max-w-2xl mx-auto text-center">
              <h2 className="text-xl font-bold mb-4 text-green-600">Candidature approuvée</h2>
              <p className="text-gray-600 mb-4">
                Félicitations! Votre candidature a été approuvée.
              </p>
              <div className="mt-6">
                <Link to="/influencer/login">
                  <Button>
                    Accéder à mon espace influenceur
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        );
      } else if (userInfluencerProfile.status === 'rejected') {
        return (
          <div className="container-cowema py-12">
            <div className="bg-white p-8 rounded-lg shadow-cowema my-8 max-w-2xl mx-auto text-center">
              <h2 className="text-xl font-bold mb-4 text-red-600">Candidature non retenue</h2>
              <p className="text-gray-600">
                Nous sommes désolés, mais votre candidature n'a pas été retenue à ce stade. 
                N'hésitez pas à postuler à nouveau dans 3 mois avec des statistiques mises à jour.
              </p>
            </div>
          </div>
        );
      }
    }

    // Affichage normal avec formulaire de candidature
    return (
      <>
        <InfluencerHero />
        <InfluencerBenefits />
        <div className="bg-gray-50 py-12">
          <div className="container-cowema">
            <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-white rounded-lg shadow-cowema">
              <div className="mb-6 md:mb-0 md:mr-6">
                <h2 className="text-2xl font-bold mb-2">Déjà influenceur?</h2>
                <p className="text-gray-600">
                  Connectez-vous à votre espace influenceur pour accéder à votre tableau de bord, 
                  vos statistiques et vos commissions.
                </p>
              </div>
              <Link to="/influencer/login">
                <Button size="lg">
                  Accéder à mon espace
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div id="apply" className="py-12">
          <div className="container-cowema">
            <InfluencerApplicationForm />
          </div>
        </div>
        <InfluencerFAQ />
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default Influencer;
