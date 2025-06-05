
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Clock, User, Loader2 } from 'lucide-react';
import { useInfluencerMessaging } from '@/hooks/useInfluencerMessaging';

const RealTimeDirectMessaging: React.FC = () => {
  const { conversations, isLoading } = useInfluencerMessaging();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Il y a quelques minutes';
    } else if (diffInHours < 24) {
      return `Il y a ${Math.floor(diffInHours)} heure(s)`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">
              Chargement des conversations...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Résumé des conversations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <MessageSquare className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Conversations</p>
                <p className="text-2xl font-bold text-blue-600">{conversations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <MessageSquare className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Non lus</p>
                <p className="text-2xl font-bold text-red-600">
                  {conversations.reduce((sum, conv) => sum + conv.unread_count, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <User className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Support</p>
                <p className="text-sm text-green-600 font-medium">Disponible</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des conversations */}
      {conversations.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversations récentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {conversations.map(conversation => (
              <div
                key={conversation.id}
                className="p-4 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{conversation.title}</h4>
                      {conversation.unread_count > 0 && (
                        <Badge variant="destructive" className="text-xs px-1.5 py-0.5 h-auto">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {conversation.last_message}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDate(conversation.updated_at)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400" />
              <div>
                <h3 className="font-medium">Aucune conversation</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Vos conversations avec l'équipe Cowema apparaîtront ici.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTimeDirectMessaging;
