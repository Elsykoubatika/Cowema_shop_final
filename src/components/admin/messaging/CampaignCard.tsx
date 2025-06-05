
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCampaign } from '@/types/messageCampaigns';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock,
  Mail,
  MessageSquare,
  Eye
} from 'lucide-react';

interface CampaignCardProps {
  campaign: MessageCampaign;
  onViewDetails: (campaign: MessageCampaign) => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onViewDetails }) => {
  const getStatusIcon = (status: MessageCampaign['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'failed':
        return <XCircle className="text-red-500" size={16} />;
      case 'sending':
        return <Clock className="text-yellow-500" size={16} />;
      default:
        return <Clock className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status: MessageCampaign['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'sending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getChannelIcon = (channel: string) => {
    return channel === 'email' ? (
      <Mail size={16} className="text-blue-600" />
    ) : (
      <MessageSquare size={16} className="text-green-600" />
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getChannelIcon(campaign.channel)}
              <h3 className="font-medium">{campaign.title}</h3>
              <Badge className={getStatusColor(campaign.status)}>
                {getStatusIcon(campaign.status)}
                <span className="ml-1">{campaign.status}</span>
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {campaign.content}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(campaign.created_at).toLocaleDateString('fr-FR')}
              </div>
              <div className="flex items-center gap-1">
                <Users size={14} />
                {campaign.total_recipients} destinataires
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle size={14} />
                {campaign.sent_count} envoyés
              </div>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(campaign)}
          >
            <Eye size={16} className="mr-1" />
            Voir détails
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
