
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSend } from '@/types/messageCampaigns';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface SendStatusCardsProps {
  sends: MessageSend[];
}

export const SendStatusCards: React.FC<SendStatusCardsProps> = ({ sends }) => {
  const pendingSends = sends.filter(send => send.status === 'pending');
  const sentSends = sends.filter(send => send.status === 'sent');
  const failedSends = sends.filter(send => send.status === 'failed');

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingSends.length}</p>
            </div>
            <Clock className="text-yellow-500" size={24} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Envoyés</p>
              <p className="text-2xl font-bold text-green-600">{sentSends.length}</p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Échoués</p>
              <p className="text-2xl font-bold text-red-600">{failedSends.length}</p>
            </div>
            <XCircle className="text-red-500" size={24} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
