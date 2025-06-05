
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Users, Gift, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { useLoyaltyPoints } from '@/hooks/useLoyaltyPoints';

const ReferralSection: React.FC = () => {
  const { user } = useUnifiedAuth();
  const { createReferralCode, referrals } = useLoyaltyPoints();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [userReferralCode, setUserReferralCode] = useState<string | null>(null);

  // Générer un code de parrainage basé sur l'ID utilisateur
  const generateCode = () => {
    if (user?.id) {
      return `YBB${user.id.slice(0, 8).toUpperCase()}`;
    }
    return null;
  };

  const handleCreateCode = async () => {
    setIsCreating(true);
    try {
      const code = await createReferralCode();
      if (code) {
        setUserReferralCode(code);
        toast({
          title: "Code de parrainage créé !",
          description: `Votre code ${code} est prêt à être partagé.`,
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le code de parrainage",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copié !",
        description: "Le lien a été copié dans votre presse-papiers",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive"
      });
    }
  };

  const shareOnWhatsApp = (code: string) => {
    const message = `🎉 Rejoins Ya Ba Boss avec mon code de parrainage ${code} et fais-moi gagner des points ! 

Inscris-toi sur https://cowema.org/register?ref=${code}

Merci ! 😊`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const currentCode = userReferralCode || generateCode();
  const referralLink = currentCode ? `https://cowema.org/register?ref=${currentCode}` : '';
  const completedReferrals = referrals.filter(r => r.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} />
            Parrainer des amis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
              <Gift size={48} className="mx-auto text-green-600 mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Gagnez 10 points Ya Ba Boss !
              </h3>
              <p className="text-gray-600">
                Invitez vos amis à rejoindre Ya Ba Boss et gagnez 10 points pour chaque inscription réussie.
              </p>
            </div>

            {!currentCode ? (
              <Button 
                onClick={handleCreateCode}
                disabled={isCreating}
                className="bg-primary hover:bg-primary-hover text-white"
              >
                {isCreating ? (
                  <>
                    <span className="animate-spin">⟳</span> Création...
                  </>
                ) : (
                  <>
                    <Share2 size={16} className="mr-2" />
                    Créer mon code de parrainage
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-4">
                {/* Code de parrainage */}
                <div className="bg-white border-2 border-dashed border-primary p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Votre code de parrainage :</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-bold text-primary">{currentCode}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(currentCode)}
                    >
                      <Copy size={16} />
                    </Button>
                  </div>
                </div>

                {/* Boutons de partage */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    onClick={() => shareOnWhatsApp(currentCode)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Share2 size={16} className="mr-2" />
                    Partager sur WhatsApp
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(referralLink)}
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Copier le lien
                  </Button>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>💡 <strong>Comment ça marche :</strong></p>
                  <p>1. Partagez votre code ou lien avec vos amis</p>
                  <p>2. Ils s'inscrivent avec votre code</p>
                  <p>3. Vous gagnez automatiquement 10 points Ya Ba Boss !</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Historique des parrainages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Mes parrainages</span>
            <span className="text-lg font-bold text-primary">{completedReferrals} amis parrainés</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users size={48} className="mx-auto mb-3 opacity-50" />
              <p>Aucun parrainage pour le moment</p>
              <p className="text-sm">Partagez votre code pour commencer !</p>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">Code : {referral.referral_code}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(referral.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        referral.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : referral.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {referral.status === 'completed' 
                        ? '✅ Complété' 
                        : referral.status === 'pending' 
                        ? '⏳ En attente' 
                        : '❌ Expiré'
                      }
                    </span>
                    {referral.status === 'completed' && (
                      <p className="text-sm text-green-600 font-medium mt-1">
                        +{referral.points_earned} points
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralSection;
