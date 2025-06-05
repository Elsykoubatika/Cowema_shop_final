
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../hooks/useAuthStore';

const CallToAction: React.FC = () => {
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
    <section className="py-16 bg-gradient-to-r from-yellow-400 to-amber-500">
      <div className="container-cowema text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">Prêt à devenir YA BA BOSS ?</h2>
        <p className="text-xl mb-8 text-white">Rejoignez notre programme de fidélité dès aujourd'hui et commencez à profiter d'avantages exclusifs</p>
        <Button 
          onClick={handleJoinProgram}
          className="bg-white text-yellow-600 py-3 px-8 rounded-lg font-bold text-lg hover:bg-yellow-50 transition-colors"
        >
          Rejoindre maintenant
        </Button>
      </div>
    </section>
  );
};

export default CallToAction;
