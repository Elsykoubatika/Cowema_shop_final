
import React from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../hooks/useAuthStore';

const HeroBanner: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  const handleJoinProgram = () => {
    if (!isAuthenticated) {
      navigate('/register');
    } else {
      navigate('/account?tab=loyalty');
    }
  };

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-amber-500 py-16">
      <div className="container-cowema text-center">
        <div className="bg-white/90 rounded-lg p-8 max-w-3xl mx-auto">
          <div className="flex justify-center mb-4">
            <span className="bg-yellow-500 text-white text-xl font-bold px-4 py-2 rounded-full flex items-center gap-2">
              <Star size={24} fill="currentColor" className="text-white" /> Programme YA BA BOSS
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Devenez un client privilégié</h1>
          <p className="text-xl mb-8">Rejoignez notre programme de fidélité exclusif et profitez d'avantages exceptionnels</p>
          <Button 
            onClick={handleJoinProgram}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-8 text-lg rounded-md"
          >
            Rejoindre maintenant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
