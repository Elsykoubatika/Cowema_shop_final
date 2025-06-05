
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, UserPlus } from "lucide-react";
import { InfluencerProfile } from '@/hooks/useSupabaseInfluencers';
import { getSocialIcon } from './utils/influencerUtils';

interface InfluencersTableProps {
  influencers: InfluencerProfile[];
  selectedInfluencers: string[];
  toggleInfluencerSelection: (id: string) => void;
  toggleAllInfluencers: (checked: boolean) => void;
  handleViewInfluencer: (id: string) => void;
  showDetails: (influencer: InfluencerProfile) => void;
  getMainSocialNetwork: (influencer: InfluencerProfile) => string;
}

const InfluencersTable: React.FC<InfluencersTableProps> = ({
  influencers,
  selectedInfluencers,
  toggleInfluencerSelection,
  toggleAllInfluencers,
  handleViewInfluencer,
  showDetails,
  getMainSocialNetwork
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox 
                onCheckedChange={(checked) => 
                  toggleAllInfluencers(checked as boolean)
                }
                checked={
                  influencers.length > 0 && 
                  selectedInfluencers.length === influencers.length
                }
              />
            </TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead>Réseau principal</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Taux</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {influencers.map((influencer) => {
            const mainNetwork = getMainSocialNetwork(influencer);
            return (
              <TableRow key={influencer.id} className={
                selectedInfluencers.includes(influencer.id) 
                  ? 'bg-muted/50' 
                  : ''
              }>
                <TableCell>
                  <Checkbox 
                    checked={selectedInfluencers.includes(influencer.id)}
                    onCheckedChange={() => toggleInfluencerSelection(influencer.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {influencer.userId}
                </TableCell>
                <TableCell>N/A</TableCell>
                <TableCell>N/A</TableCell>
                <TableCell>-</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getSocialIcon(mainNetwork)}
                    <span className="capitalize">
                      {mainNetwork !== 'other' ? mainNetwork : '-'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{influencer.referralCode}</TableCell>
                <TableCell>{influencer.commissionRate}%</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleViewInfluencer(influencer.id)}
                      title="Voir les détails"
                    >
                      <Eye size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => showDetails(influencer)}
                      title="Aperçu rapide"
                    >
                      <UserPlus size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
          {influencers.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                Aucun influenceur trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InfluencersTable;
