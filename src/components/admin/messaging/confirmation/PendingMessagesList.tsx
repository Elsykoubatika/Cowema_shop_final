
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSend } from '@/types/messageCampaigns';
import { CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';

interface PendingMessagesListProps {
  pendingSends: MessageSend[];
  onConfirmSent: (send: MessageSend) => void;
  onMarkFailed: (send: MessageSend) => void;
}

export const PendingMessagesList: React.FC<PendingMessagesListProps> = ({
  pendingSends,
  onConfirmSent,
  onMarkFailed
}) => {
  const getStatusIcon = (status: MessageSend['status']) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'delivered':
        return <CheckCircle className="text-blue-500" size={16} />;
      case 'failed':
        return <XCircle className="text-red-500" size={16} />;
      default:
        return <Clock className="text-yellow-500" size={16} />;
    }
  };

  const getStatusColor = (status: MessageSend['status']) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare size={20} />
          Messages à confirmer
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingSends.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Aucun message en attente de confirmation
          </p>
        ) : (
          <div className="space-y-2">
            {pendingSends.map((send) => (
              <div
                key={send.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(send.status)}
                  <div>
                    <p className="font-medium">{send.recipient_name || 'Client'}</p>
                    <p className="text-sm text-muted-foreground">{send.recipient_phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(send.status)}>
                    {send.status === 'pending' ? 'En attente' : send.status}
                  </Badge>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600"
                      onClick={() => onConfirmSent(send)}
                    >
                      Confirmer
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600"
                      onClick={() => onMarkFailed(send)}
                    >
                      Échec
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
