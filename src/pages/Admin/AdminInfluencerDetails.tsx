
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInfluencerStore } from '@/hooks/useInfluencerStore';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit, Save, Clipboard } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminInfluencerDetails: React.FC = () => {
  const { influencerId } = useParams<{ influencerId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { influencers, updateInfluencerCommissionRate } = useInfluencerStore();
  
  const [influencer, setInfluencer] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [commissionRate, setCommissionRate] = useState(0);
  
  useEffect(() => {
    if (influencerId) {
      const foundInfluencer = influencers.find(inf => inf.id === influencerId);
      
      if (foundInfluencer) {
        setInfluencer(foundInfluencer);
        setCommissionRate(foundInfluencer.commissionRate);
      }
    }
  }, [influencerId, influencers]);

  const handleCommissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setCommissionRate(isNaN(value) ? 0 : value);
  };

  const handleSave = () => {
    if (influencerId) {
      updateInfluencerCommissionRate(influencerId, commissionRate);
      toast({
        title: "Taux de commission mis à jour",
        description: `Le taux de commission de ${influencer?.firstName} est maintenant de ${commissionRate}%`,
      });
      setIsEditing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: "Le texte a été copié dans le presse-papiers.",
    });
  };

  if (!influencer) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-2" 
            size="sm"
            onClick={() => navigate('/admin/influencers')}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour
          </Button>
          <h2 className="text-2xl font-bold">Influenceur non trouvé</h2>
        </div>
        <p>L'influenceur demandé n'existe pas.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-2" 
          size="sm"
          onClick={() => navigate('/admin/influencers')}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold">
          {influencer.firstName} {influencer.lastName}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Nom complet</p>
              <p>{influencer.firstName} {influencer.lastName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p>{influencer.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Téléphone</p>
              <p>{influencer.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date d'inscription</p>
              <p>{new Date(influencer.createdAt).toLocaleDateString()}</p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(influencer.createdAt), { 
                  addSuffix: true,
                  locale: fr
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Réseaux sociaux */}
        <Card>
          <CardHeader>
            <CardTitle>Réseaux sociaux</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(influencer.socialNetworks).map(([network, url]) => (
              url && (
                <div key={network}>
                  <p className="text-sm font-medium text-gray-500">
                    {network.charAt(0).toUpperCase() + network.slice(1)}
                  </p>
                  <a
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    {url as string}
                  </a>
                </div>
              )
            ))}
            {Object.values(influencer.socialNetworks).every(v => !v) && (
              <p className="text-gray-500">Aucun réseau social renseigné</p>
            )}
          </CardContent>
        </Card>

        {/* Informations d'affiliation */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Affiliation</CardTitle>
              {isEditing ? (
                <Button size="sm" onClick={handleSave}>
                  <Save size={16} className="mr-1" />
                  Enregistrer
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit size={16} className="mr-1" />
                  Modifier
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Code de parrainage</p>
                <p>{influencer.referralCode}</p>
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => copyToClipboard(influencer.referralCode)}
              >
                <Clipboard size={16} />
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Lien d'affiliation</p>
                <p className="break-all">{influencer.referralLink}</p>
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => copyToClipboard(influencer.referralLink)}
              >
                <Clipboard size={16} />
              </Button>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Taux de commission</p>
              {isEditing ? (
                <div className="flex items-center mt-1">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={commissionRate}
                    onChange={handleCommissionChange}
                    className="max-w-[100px]"
                  />
                  <span className="ml-2">%</span>
                </div>
              ) : (
                <p>{influencer.commissionRate}%</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistiques de commissions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-500">Total gagné</p>
                <p className="text-2xl font-bold">{influencer.totalEarned.toLocaleString()} FCFA</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-500">Total payé</p>
                <p className="text-2xl font-bold">{influencer.totalPaid.toLocaleString()} FCFA</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-500">En attente de paiement</p>
                <p className="text-2xl font-bold">{(influencer.totalEarned - influencer.totalPaid).toLocaleString()} FCFA</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Commissions récentes</h3>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commande</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {influencer.commissions.slice(0, 5).map((commission: any) => (
                      <tr key={commission.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(commission.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          #{commission.orderId.substring(0, 8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {commission.amount.toLocaleString()} FCFA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${commission.paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {commission.paid ? 'Payé' : 'En attente'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {influencer.commissions.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                          Aucune commission enregistrée
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminInfluencerDetails;
