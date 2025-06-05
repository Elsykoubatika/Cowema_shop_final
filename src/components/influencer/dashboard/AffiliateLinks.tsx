
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Link, Copy, Globe, Info } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { generateShortInfluencerLink, generateBrandedShortLink, getDomainInfo } from '@/utils/influencerUtils';

interface AffiliateLinksProps {
  referralLink: string;
  personalizedLink: string;
  shortLink: string;
  copyToClipboard: (text: string, label: string) => void;
}

const AffiliateLinks: React.FC<AffiliateLinksProps> = ({
  referralLink,
  personalizedLink,
  shortLink,
  copyToClipboard
}) => {
  const domainInfo = getDomainInfo();
  
  // Extraire le code de parrainage du lien
  const extractReferralCode = (link: string) => {
    try {
      const url = new URL(link);
      return url.searchParams.get('ref') || '';
    } catch {
      return '';
    }
  };

  const referralCode = extractReferralCode(referralLink);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Vos liens d'affiliation
        </CardTitle>
        <CardDescription>
          Partagez ces liens avec votre audience pour gagner des commissions
        </CardDescription>
        
        {!domainInfo.isCustomDomain && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              En développement, les liens utilisent {domainInfo.hostname}. En production, ils utiliseront cowema.net automatiquement.
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md bg-muted p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center min-w-0 flex-1">
                <Globe className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                <code className="text-sm font-mono break-all">{referralLink}</code>
              </div>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => copyToClipboard(referralLink, "Lien d'affiliation standard")}
                className="flex-shrink-0"
              >
                <Copy className="h-3 w-3 mr-2" /> Copier
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Lien standard d'affiliation</p>
          </div>
          
          <div className="rounded-md bg-muted p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center min-w-0 flex-1">
                <Link className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                <code className="text-sm font-mono break-all">{personalizedLink}</code>
              </div>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => copyToClipboard(personalizedLink, "Lien personnalisé")}
                className="flex-shrink-0"
              >
                <Copy className="h-3 w-3 mr-2" /> Copier
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Lien avec votre nom pour tracking</p>
          </div>
          
          <div className="rounded-md bg-green-50 border border-green-200 p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center min-w-0 flex-1">
                <Link className="h-4 w-4 mr-2 text-green-600 flex-shrink-0" />
                <code className="text-sm font-mono break-all text-green-800">{shortLink}</code>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-green-300 text-green-700 hover:bg-green-100 flex-shrink-0"
                onClick={() => copyToClipboard(shortLink, "Lien court")}
              >
                <Copy className="h-3 w-3 mr-2" /> Copier
              </Button>
            </div>
            <p className="text-xs text-green-600 mt-2">
              <strong>Lien court de marque</strong> - Plus facile à partager et mémoriser
            </p>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Conseils d'utilisation :</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Utilisez le <strong>lien court</strong> pour les stories Instagram et TikTok</li>
              <li>• Le <strong>lien personnalisé</strong> est parfait pour les descriptions YouTube</li>
              <li>• Le <strong>lien standard</strong> fonctionne partout et contient tous les paramètres</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AffiliateLinks;
