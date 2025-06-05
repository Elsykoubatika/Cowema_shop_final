
import React from 'react';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserStatsCard from '@/components/loyalty/UserStatsCard';
import AchievementsSection from '@/components/loyalty/AchievementsSection';
import PendingRewardsCard from '@/components/loyalty/PendingRewardsCard';
import MissionsSection from '@/components/loyalty/MissionsSection';
import ReferralSection from '@/components/loyalty/ReferralSection';
import EnhancedPointsEarningSection from '@/components/loyalty/EnhancedPointsEarningSection';
import { Card, CardContent } from '@/components/ui/card';

const EnhancedLoyaltySection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Grille avec progression, accomplissements et points en attente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UserStatsCard />
        <AchievementsSection />
        <PendingRewardsCard />
      </div>

      {/* Section des moyens de gagner des points */}
      <EnhancedPointsEarningSection />

      {/* Grille avec missions et parrainage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MissionsSection />
        <ReferralSection />
      </div>

      {/* Call to action */}
      <Card className="bg-gradient-to-r from-primary to-purple-600 text-white">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-white/20 rounded-full">
                <Crown size={32} className="text-yellow-300" />
              </div>
            </div>
            <h3 className="text-2xl font-bold">Continuez votre progression !</h3>
            <p className="text-white/90">
              Découvrez nos produits Ya Ba Boss et gagnez encore plus de points
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold"
              onClick={() => navigate('/ya-ba-boss')}
            >
              <Sparkles size={18} className="mr-2" />
              Explorer Ya Ba Boss
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedLoyaltySection;
