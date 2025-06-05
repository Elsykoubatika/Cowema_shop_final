
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, CheckCircle, XCircle } from 'lucide-react';
import { createDefaultAdminAccount } from '@/utils/adminSetup';
import { useToast } from '@/hooks/use-toast';

const AdminAccountSetup: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const { toast } = useToast();

  const handleCreateAdmin = async () => {
    setIsCreating(true);
    
    try {
      const success = await createDefaultAdminAccount();
      
      if (success) {
        setIsCreated(true);
        toast({
          title: "Compte admin créé",
          description: "Le compte administrateur par défaut a été créé avec succès.",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de créer le compte admin. Il existe peut-être déjà.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la création du compte.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Configuration Admin
        </CardTitle>
        <CardDescription>
          Créer le compte administrateur par défaut
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Détails du compte:</h4>
          <ul className="text-sm space-y-1">
            <li><strong>Nom:</strong> Cowema Admin 2</li>
            <li><strong>Email:</strong> info.cowema@gmail.com</li>
            <li><strong>Rôle:</strong> Administrateur</li>
          </ul>
        </div>
        
        {isCreated ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span>Compte créé avec succès!</span>
          </div>
        ) : (
          <Button 
            onClick={handleCreateAdmin}
            disabled={isCreating}
            className="w-full"
          >
            {isCreating ? (
              <>
                <span className="animate-spin">⟳</span>
                Création en cours...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Créer le compte admin
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminAccountSetup;
