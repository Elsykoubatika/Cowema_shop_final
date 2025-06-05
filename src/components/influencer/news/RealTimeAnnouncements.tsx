
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Megaphone, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { useInfluencerMessaging } from '@/hooks/useInfluencerMessaging';

const RealTimeAnnouncements: React.FC = () => {
  const { announcements, isLoading } = useInfluencerMessaging();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">
              Chargement des actualités...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const importantAnnouncements = announcements.filter(a => a.is_important);
  const regularAnnouncements = announcements.filter(a => !a.is_important);

  return (
    <div className="space-y-6">
      {/* Résumé des actualités */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Megaphone className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-blue-600">{announcements.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Importantes</p>
                <p className="text-2xl font-bold text-red-600">{importantAnnouncements.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Cette semaine</p>
                <p className="text-2xl font-bold text-green-600">
                  {announcements.filter(a => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(a.created_at) > weekAgo;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actualités importantes */}
      {importantAnnouncements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Actualités importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {importantAnnouncements.map(announcement => (
              <div
                key={announcement.id}
                className="p-4 rounded-lg border-l-4 border-l-red-500 bg-red-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-sm">{announcement.title}</h4>
                      <Badge variant="destructive" className="text-xs">
                        Important
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      {announcement.content}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {formatDate(announcement.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Actualités régulières */}
      {regularAnnouncements.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Dernières actualités
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {regularAnnouncements.map(announcement => (
              <div
                key={announcement.id}
                className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-2">{announcement.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {announcement.content}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(announcement.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        announcements.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center space-y-4">
                <Megaphone className="h-12 w-12 mx-auto text-gray-400" />
                <div>
                  <h3 className="font-medium">Aucune actualité</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Les dernières actualités et annonces apparaîtront ici.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
};

export default RealTimeAnnouncements;
