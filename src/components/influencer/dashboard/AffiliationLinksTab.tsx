
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Link, 
  Info, 
  BarChart3,
  Settings,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { getDomainInfo } from '@/utils/influencerUtils';
import { useAffiliationAnalytics } from '@/hooks/useAffiliationAnalytics';
import LinkAnalyticsStats from './components/LinkAnalyticsStats';
import EnhancedLinkGenerator from './components/EnhancedLinkGenerator';

interface AffiliationLinksTabProps {
  referralCode: string;
  influencerName: string;
  copyToClipboard: (text: string, label: string) => void;
}

const AffiliationLinksTab: React.FC<AffiliationLinksTabProps> = ({
  referralCode,
  influencerName,
  copyToClipboard
}) => {
  const domainInfo = getDomainInfo();
  const { analytics, isLoading, refetch } = useAffiliationAnalytics(referralCode);

  return (
    <div className="space-y-6">
      {/* Header avec information du domaine */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🔗 Liens d'Affiliation
          </h1>
          <p className="text-muted-foreground mt-2">
            Partagez vos liens personnalisés et gagnez des commissions sur chaque vente
          </p>
        </div>
        <div className="text-right">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 mb-2">
            Code: {referralCode}
          </Badge>
          {domainInfo.isCustomDomain && (
            <Badge className="bg-green-100 text-green-700 block">
              <Sparkles className="h-3 w-3 mr-1" />
              Domaine Premium
            </Badge>
          )}
        </div>
      </div>

      {/* Alerte pour le développement */}
      {!domainInfo.isCustomDomain && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            En développement, les liens utilisent {domainInfo.hostname}. En production, ils utiliseront cowema.net automatiquement.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Générateur
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Avancé
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <LinkAnalyticsStats 
            analytics={analytics}
            isLoading={isLoading}
            onRefresh={refetch}
          />

          {/* Activité récente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Activité Récente
              </CardTitle>
              <CardDescription>
                Dernières interactions avec vos liens
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.recentClicks.length > 0 ? (
                <div className="space-y-3">
                  {analytics.recentClicks.slice(0, 5).map((click) => (
                    <div key={click.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          click.converted ? 'bg-green-500' : 'bg-blue-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-sm">
                            {click.converted ? 'Conversion' : 'Clic'} depuis {click.source}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(click.timestamp).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <Badge variant={click.converted ? 'default' : 'secondary'}>
                        {click.converted ? 'Converti' : 'En attente'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune activité récente</p>
                  <p className="text-sm">Partagez vos liens pour voir l'activité ici</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generator" className="space-y-6">
          <EnhancedLinkGenerator 
            referralCode={referralCode}
            influencerName={influencerName}
            copyToClipboard={copyToClipboard}
          />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>⚙️ Paramètres Avancés</CardTitle>
              <CardDescription>
                Configurez des options avancées pour vos liens d'affiliation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Fonctionnalités à venir :</strong>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• QR Codes personnalisés</li>
                      <li>• Liens avec expiration automatique</li>
                      <li>• A/B testing des messages</li>
                      <li>• Intégration avec Google Analytics</li>
                      <li>• Notifications push pour les conversions</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AffiliationLinksTab;
