
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/hooks/useAuthStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, RefreshCw } from "lucide-react";

interface AssignOrderDialogProps {
  orderId: string;
  onAssign: (userId: string, userName: string) => Promise<boolean>;
  isLoading: boolean;
  children: React.ReactNode;
}

interface User {
  id: string;
  nom: string;
  first_name?: string;
  last_name?: string;
  role: string;
  city?: string;
}

const AssignOrderDialog: React.FC<AssignOrderDialogProps> = ({
  orderId,
  onAssign,
  isLoading,
  children
}) => {
  const { user } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchUsers = async () => {
    if (!user) return;

    try {
      setLoading(true);
      let query = supabase
        .from('profiles')
        .select('id, nom, first_name, last_name, role, city')
        .in('role', ['seller', 'team_lead', 'sales_manager']);

      // Filter users based on current user's role and city
      if (user.role === 'team_lead' && user.city) {
        // Team leads can only assign to sellers in their area
        const cityCondition = user.city.toLowerCase() === 'pointe-noire' 
          ? ['pointe-noire', 'dolisie']
          : user.city.toLowerCase() === 'brazzaville'
          ? ['brazzaville'] // Will be expanded to include other cities in the filter
          : [user.city.toLowerCase()];

        query = query
          .eq('role', 'seller')
          .or(cityCondition.map(city => `city.ilike.%${city}%`).join(','));
      } else if (user.role === 'sales_manager' || user.role === 'admin') {
        // Sales managers and admins can assign to anyone
        // Already filtered by role above
      }

      const { data, error } = await query.order('nom');

      if (error) throw error;

      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open, user]);

  const handleAssign = async () => {
    if (!selectedUserId) return;

    const selectedUser = users.find(u => u.id === selectedUserId);
    if (!selectedUser) return;

    const userName = selectedUser.first_name && selectedUser.last_name 
      ? `${selectedUser.first_name} ${selectedUser.last_name}`
      : selectedUser.nom;

    const success = await onAssign(selectedUserId, userName);
    if (success) {
      setOpen(false);
      setSelectedUserId('');
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'seller': return 'Vendeur';
      case 'team_lead': return 'Chef d\'équipe';
      case 'sales_manager': return 'Responsable vente';
      case 'admin': return 'Administrateur';
      default: return role;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Assigner la commande
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Sélectionner un utilisateur
            </label>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span className="ml-2">Chargement...</span>
              </div>
            ) : (
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un utilisateur" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>
                          {user.first_name && user.last_name 
                            ? `${user.first_name} ${user.last_name}`
                            : user.nom
                          }
                        </span>
                        <div className="flex items-center gap-2 ml-2">
                          <Badge variant="outline" className="text-xs">
                            {getRoleLabel(user.role)}
                          </Badge>
                          {user.city && (
                            <Badge variant="secondary" className="text-xs">
                              {user.city}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                  {users.length === 0 && (
                    <SelectItem value="no-users" disabled>
                      Aucun utilisateur disponible
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleAssign}
              disabled={!selectedUserId || isLoading || selectedUserId === 'no-users'}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Attribution...
                </>
              ) : (
                'Assigner'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignOrderDialog;
