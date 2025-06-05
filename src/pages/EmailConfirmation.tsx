
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CheckCircle, Loader2 } from 'lucide-react';

const EmailConfirmation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirection automatique après 3 secondes si pas déjà redirigé
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Email confirmé!
            </h1>
            <p className="text-gray-600">
              Votre adresse email a été confirmée avec succès.
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Redirection en cours...</span>
          </div>
          
          <div className="mt-6">
            <button
              onClick={() => navigate('/', { replace: true })}
              className="text-primary hover:underline text-sm"
            >
              Aller à l'accueil maintenant
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EmailConfirmation;
