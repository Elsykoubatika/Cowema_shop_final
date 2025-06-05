
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
import { Badge } from "@/components/ui/badge";
import { Eye, Check, X } from "lucide-react";
import { InfluencerProfile } from '@/hooks/useSupabaseInfluencers';
import { getSocialIcon } from './utils/influencerUtils';

interface ApplicationsTableProps {
  applications: InfluencerProfile[];
  selectedApplications: string[];
  toggleApplicationSelection: (id: string) => void;
  toggleAllApplications: (checked: boolean) => void;
  showDetails: (application: InfluencerProfile) => void;
  handleApproveApplication: (id: string) => void;
  handleRejectApplication: (id: string) => void;
  getMainSocialNetwork: (application: InfluencerProfile) => string;
  formatDate: (date: string) => string;
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  applications,
  selectedApplications,
  toggleApplicationSelection,
  toggleAllApplications,
  showDetails,
  handleApproveApplication,
  handleRejectApplication,
  getMainSocialNetwork,
  formatDate
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox 
                onCheckedChange={(checked) => 
                  toggleAllApplications(checked as boolean)
                }
                checked={
                  applications.length > 0 && 
                  selectedApplications.length === applications.length
                }
              />
            </TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Réseau principal</TableHead>
            <TableHead>Abonnés</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => {
            const mainNetwork = getMainSocialNetwork(application);
            return (
              <TableRow key={application.id} className={
                selectedApplications.includes(application.id) 
                  ? 'bg-muted/50' 
                  : ''
              }>
                <TableCell>
                  <Checkbox 
                    checked={selectedApplications.includes(application.id)}
                    onCheckedChange={() => toggleApplicationSelection(application.id)}
                    disabled={application.status !== 'pending'}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {application.userId}
                </TableCell>
                <TableCell>N/A</TableCell>
                <TableCell>N/A</TableCell>
                <TableCell>-</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={
                      application.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      application.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                      'bg-red-100 text-red-800 border-red-200'
                    }
                  >
                    {application.status === 'pending' ? 'En attente' :
                    application.status === 'approved' ? 'Approuvée' :
                    'Rejetée'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getSocialIcon(mainNetwork)}
                    <span className="capitalize">
                      {mainNetwork !== 'other' ? mainNetwork : '-'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{application.followerCount?.toLocaleString() || 0}</TableCell>
                <TableCell>{formatDate(application.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => showDetails(application)}
                      title="Voir les détails"
                    >
                      <Eye size={16} />
                    </Button>
                    {application.status === 'pending' && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleApproveApplication(application.id)}
                          className="text-green-600"
                          title="Approuver"
                        >
                          <Check size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRejectApplication(application.id)}
                          className="text-red-600"
                          title="Rejeter"
                        >
                          <X size={16} />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
          {applications.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                Aucune candidature trouvée
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicationsTable;
