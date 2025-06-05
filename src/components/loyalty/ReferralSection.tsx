
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLoyaltyPoints } from '@/hooks/useLoyaltyPoints';
import { useToast } from '@/hooks/use-toast';
import { Users, Share2, Gift, Copy, ExternalLink } from 'lucide-react';

const ReferralSection: React.FC = () => {
  const { referrals, createReferralCode, useReferralCode } = useLoyaltyPoints();
  const { toast } = useToast();
  const [referralCodeToUse, setReferralCodeToUse] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateReferralCode = async () => {
    setIsCreating(true);
    const code = await createReferralCode();
    if (code) {
      toast({
        title: "Code créé !",
        description: `Votre code de parrainage: ${code}`,
      });
    }
    setIsCreating(false);
  };

  const handleUseReferralCode = async () => {
    if (!referralCodeToUse.trim()) {
      toast({
        title: "Code requis",
        description: "Veuillez entrer un code de parrainage",
        variant: "destructive"
      });
      return;
    }

    const success = await useReferralCode(referralCodeToUse.trim());
    if (success) {
      setReferralCodeToUse('');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: "Le code a été copié dans le presse-papiers",
    });
  };

  const shareReferralCode = (code: string) => {
    const message = `Rejoins Ya Ba Boss avec mon code de parrainage: ${code} et découvre des produits incroyables !`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Section: Parrainer des amis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} />
            Parrainer des amis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Gift size={24} className="text-green-600" />
              <div>
                <h4 className="font-semibold text-green-800">Gagnez 10 points par parrainage !</h4>
                <p className="text-sm text-green-700">
                  Invitez vos amis à rejoindre Ya Ba Boss et gagnez des points quand ils s'inscrivent.
                </p>
              </div>
            </div>
          </div>

          {referrals.length === 0 ? (
            <div className="text-center py-6">
              <Button 
                onClick={handleCreateReferralCode}
                disabled={isCreating}
                className="bg-green-600 hover:bg-green-700"
              >
                {isCreating ? 'Création...' : 'Créer mon code de parrainage'}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Vos codes de parrainage :</h4>
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <code className="bg-white px-3 py-1 rounded border font-mono text-sm">
                      {referral.referral_code}
                    </code>
                    <Badge 
                      variant={referral.status === 'completed' ? 'default' : 'secondary'}
                      className={referral.status === 'completed' ? 'bg-green-600' : ''}
                    >
                      {referral.status === 'completed' ? 'Utilisé' : 'En attente'}
                    </Badge>
                    {referral.status === 'completed' && (
                      <span className="text-sm text-green-600 font-medium">
                        +{referral.points_earned} points
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(referral.referral_code)}
                    >
                      <Copy size={14} className="mr-1" />
                      Copier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => shareReferralCode(referral.referral_code)}
                    >
                      <ExternalLink size={14} className="mr-1" />
                      Partager
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section: Utiliser un code de parrainage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 size={20} />
            Utiliser un code de parrainage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Vous avez reçu un code de parrainage ? Entrez-le ici pour aider votre ami à gagner des points !
            </p>
            
            <div className="flex gap-2">
              <Input
                placeholder="Entrez le code de parrainage"
                value={referralCodeToUse}
                onChange={(e) => setReferralCodeToUse(e.target.value.toUpperCase())}
                className="flex-1"
              />
              <Button onClick={handleUseReferralCode}>
                Utiliser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralSection;
