
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { WhatsAppSetupWizard } from './WhatsAppSetupWizard';
import { 
  Smartphone, 
  Plus, 
  Settings, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Trash2,
  Edit
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/hooks/useAuthStore';

interface WhatsAppAccount {
  id: string;
  phoneNumber: string;
  businessName: string;
  status: 'active' | 'inactive' | 'error';
  phoneNumberId: string;
  businessAccountId: string;
  accessToken: string;
  assignedVendors: string[];
  totalMessagesSent: number;
  lastUsed?: string;
  configuredAt: string;
  configuredBy: string;
}

interface VendorAssignment {
  vendorId: string;
  vendorName: string;
  selectedAccountId?: string;
}

export const WhatsAppAccountManager: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>([]);
  const [vendors, setVendors] = useState<VendorAssignment[]>([]);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<string>('');

  useEffect(() => {
    loadAccounts();
    loadVendors();
  }, []);

  const loadAccounts = async () => {
    // Simulation des comptes WhatsApp configurés
    const mockAccounts: WhatsAppAccount[] = [
      {
        id: '1',
        phoneNumber: '+243812345678',
        businessName: 'COWEMA Principal',
        status: 'active',
        phoneNumberId: 'PN123456789',
        businessAccountId: 'BA987654321',
        accessToken: 'ACCESS_TOKEN_123',
        assignedVendors: ['vendor1', 'vendor2'],
        totalMessagesSent: 1250,
        lastUsed: '2024-01-15T10:30:00Z',
        configuredAt: '2024-01-10T09:00:00Z',
        configuredBy: 'admin'
      },
      {
        id: '2',
        phoneNumber: '+243823456789',
        businessName: 'COWEMA Kinshasa',
        status: 'active',
        phoneNumberId: 'PN234567890',
        businessAccountId: 'BA876543210',
        accessToken: 'ACCESS_TOKEN_456',
        assignedVendors: ['vendor3'],
        totalMessagesSent: 890,
        lastUsed: '2024-01-14T16:45:00Z',
        configuredAt: '2024-01-12T14:30:00Z',
        configuredBy: 'team_lead'
      }
    ];
    setAccounts(mockAccounts);
  };

  const loadVendors = async () => {
    // Simulation des vendeurs
    const mockVendors: VendorAssignment[] = [
      {
        vendorId: 'vendor1',
        vendorName: 'Jean Dupont',
        selectedAccountId: '1'
      },
      {
        vendorId: 'vendor2',
        vendorName: 'Marie Martin',
        selectedAccountId: '1'
      },
      {
        vendorId: 'vendor3',
        vendorName: 'Paul Kasongo',
        selectedAccountId: '2'
      },
      {
        vendorId: 'vendor4',
        vendorName: 'Sophie Mumbere',
        selectedAccountId: undefined
      }
    ];
    setVendors(mockVendors);
  };

  const handleSetupComplete = (config: any) => {
    const newAccount: WhatsAppAccount = {
      id: `account_${Date.now()}`,
      phoneNumber: config.phoneNumber,
      businessName: config.businessName,
      status: 'active',
      phoneNumberId: config.phoneNumberId,
      businessAccountId: config.businessAccountId,
      accessToken: config.accessToken,
      assignedVendors: [],
      totalMessagesSent: 0,
      configuredAt: config.configuredAt,
      configuredBy: user?.id || 'unknown'
    };

    setAccounts(prev => [...prev, newAccount]);
    setIsSetupOpen(false);

    toast({
      title: "Compte configuré !",
      description: `Le compte WhatsApp ${config.phoneNumber} est maintenant actif.`,
    });
  };

  const handleVendorAssignment = (vendorId: string, accountId: string) => {
    setVendors(prev => prev.map(vendor =>
      vendor.vendorId === vendorId
        ? { ...vendor, selectedAccountId: accountId }
        : vendor
    ));

    // Mettre à jour les comptes assignés
    setAccounts(prev => prev.map(account => ({
      ...account,
      assignedVendors: vendors
        .filter(v => v.selectedAccountId === account.id)
        .map(v => v.vendorId)
    })));

    const vendor = vendors.find(v => v.vendorId === vendorId);
    const account = accounts.find(a => a.id === accountId);

    toast({
      title: "Attribution mise à jour",
      description: `${vendor?.vendorName} utilise maintenant ${account?.phoneNumber}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Smartphone className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestion des comptes WhatsApp</h2>
          <p className="text-muted-foreground">
            Configurez et gérez les comptes WhatsApp Business pour vos vendeurs
          </p>
        </div>

        <Dialog open={isSetupOpen} onOpenChange={setIsSetupOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un compte
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Configuration automatique WhatsApp Business</DialogTitle>
            </DialogHeader>
            <WhatsAppSetupWizard
              onComplete={handleSetupComplete}
              onCancel={() => setIsSetupOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Comptes existants */}
      <div className="grid gap-4">
        <h3 className="text-lg font-semibold">Comptes configurés ({accounts.length})</h3>
        
        {accounts.map((account) => (
          <Card key={account.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                    <Smartphone className="text-green-600" size={24} />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{account.businessName}</h4>
                      <Badge className={getStatusColor(account.status)}>
                        {getStatusIcon(account.status)}
                        <span className="ml-1 capitalize">{account.status}</span>
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {account.phoneNumber}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{account.totalMessagesSent} messages envoyés</span>
                      <span>{account.assignedVendors.length} vendeur(s) assigné(s)</span>
                      {account.lastUsed && (
                        <span>
                          Dernière utilisation: {new Date(account.lastUsed).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Settings size={16} className="mr-2" />
                    Configurer
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Edit size={16} className="mr-2" />
                    Modifier
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Attribution des vendeurs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="text-blue-500" size={20} />
            Attribution des vendeurs
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Assignez un compte WhatsApp à chaque vendeur
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vendors.map((vendor) => (
              <div key={vendor.vendorId} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{vendor.vendorName}</p>
                  <p className="text-sm text-muted-foreground">
                    {vendor.selectedAccountId 
                      ? `Utilise: ${accounts.find(a => a.id === vendor.selectedAccountId)?.phoneNumber}`
                      : 'Aucun compte assigné'
                    }
                  </p>
                </div>
                
                <Select
                  value={vendor.selectedAccountId || ''}
                  onValueChange={(value) => handleVendorAssignment(vendor.vendorId, value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Choisir un compte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Aucun compte</SelectItem>
                    {accounts.filter(a => a.status === 'active').map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.phoneNumber} - {account.businessName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {accounts.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Smartphone className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-muted-foreground mb-4">
              Aucun compte WhatsApp Business configuré
            </p>
            <Button onClick={() => setIsSetupOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Configurer votre premier compte
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
