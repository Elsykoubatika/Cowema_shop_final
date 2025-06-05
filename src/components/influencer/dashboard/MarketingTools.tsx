
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Megaphone, Link, QrCode, Share2 } from 'lucide-react';
import CustomLinkGenerator from './marketing/CustomLinkGenerator';
import QRCodeGenerator from './marketing/QRCodeGenerator';
import SocialMediaTemplates from './marketing/SocialMediaTemplates';

interface MarketingToolsProps {
  influencerName: string;
  referralCode: string;
  baseReferralLink: string;
  copyToClipboard: (text: string, label: string) => void;
}

const MarketingTools: React.FC<MarketingToolsProps> = ({
  influencerName,
  referralCode,
  baseReferralLink,
  copyToClipboard
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          Outils Marketing Avancés
        </CardTitle>
        <CardDescription>
          Créez des liens personnalisés, des QR codes et des messages optimisés pour maximiser vos conversions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="links" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="links" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Liens Personnalisés
            </TabsTrigger>
            <TabsTrigger value="qr" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              QR Codes
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Templates
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="links" className="mt-6">
            <CustomLinkGenerator 
              baseLink={baseReferralLink}
              referralCode={referralCode}
              copyToClipboard={copyToClipboard}
            />
          </TabsContent>
          
          <TabsContent value="qr" className="mt-6">
            <QRCodeGenerator 
              referralLink={baseReferralLink}
              influencerName={influencerName}
            />
          </TabsContent>
          
          <TabsContent value="templates" className="mt-6">
            <SocialMediaTemplates 
              influencerName={influencerName}
              referralCode={referralCode}
              copyToClipboard={copyToClipboard}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MarketingTools;
