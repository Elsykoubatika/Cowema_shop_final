
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SocialMediaStats, { SocialMediaStat } from './SocialMediaStats';

interface StatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: SocialMediaStat[];
}

const StatsDialog: React.FC<StatsDialogProps> = ({
  open,
  onOpenChange,
  stats
}) => {
  const totalInfluencers = stats.reduce((sum, stat) => sum + stat.count, 0);
  const totalFollowers = stats.reduce((sum, stat) => sum + (stat.count * stat.averageFollowers), 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Statistiques des influenceurs</DialogTitle>
          <DialogDescription>
            Vue d'ensemble de la répartition par réseaux sociaux
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="text-2xl font-bold text-blue-600">{totalInfluencers}</div>
              <div className="text-sm text-blue-600">Total influenceurs</div>
            </div>
            <div className="bg-green-50 p-4 rounded-md">
              <div className="text-2xl font-bold text-green-600">{totalFollowers.toLocaleString()}</div>
              <div className="text-sm text-green-600">Total abonnés</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-md">
              <div className="text-2xl font-bold text-purple-600">
                {totalInfluencers > 0 ? Math.round(totalFollowers / totalInfluencers).toLocaleString() : 0}
              </div>
              <div className="text-sm text-purple-600">Moyenne par influenceur</div>
            </div>
          </div>

          <SocialMediaStats stats={stats} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatsDialog;
