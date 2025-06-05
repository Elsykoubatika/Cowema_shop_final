
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, MapPin, Phone, Mail, User, DollarSign, Wrench, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface InstallationRequest {
  id: string;
  request_code: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  city: string;
  description: string;
  status: string;
  phase: string;
  priority_level: string;
  estimated_cost: number;
  installation_date?: string;
  technician_assigned?: string;
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

interface SolarTechnician {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  specializations: string[];
  experience_years: number;
  rating: number;
  is_active: boolean;
}

const SolarInstallations: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<InstallationRequest | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<InstallationRequest>>({});

  // Récupérer les demandes d'installation
  const { data: requests = [], refetch: refetchRequests } = useQuery({
    queryKey: ['installation-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('installation_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as InstallationRequest[];
    }
  });

  // Mock technicians data since table doesn't exist
  const technicians: SolarTechnician[] = [];

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return;

    try {
      const { error } = await supabase
        .from('installation_requests')
        .update(editForm)
        .eq('id', selectedRequest.id);

      if (error) throw error;

      toast.success('Demande mise à jour avec succès');
      setIsEditModalOpen(false);
      refetchRequests();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openEditModal = (request: InstallationRequest) => {
    setSelectedRequest(request);
    setEditForm({
      status: request.status,
      phase: request.phase,
      priority_level: request.priority_level,
      estimated_cost: request.estimated_cost,
      installation_date: request.installation_date,
      technician_assigned: request.technician_assigned,
      admin_notes: request.admin_notes
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Gestion des Installations Solaires</h1>
        <p className="text-gray-600">Gérez les demandes d'installation et assignez les techniciens</p>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList>
          <TabsTrigger value="requests">Demandes ({requests.length})</TabsTrigger>
          <TabsTrigger value="technicians">Techniciens ({technicians.length})</TabsTrigger>
          <TabsTrigger value="statistics">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <div className="grid gap-4">
            {requests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {request.name}
                        <Badge variant="outline">{request.request_code}</Badge>
                      </CardTitle>
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {request.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {request.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(request.created_at), 'dd/MM/yyyy', { locale: fr })}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                      <Badge className={getPriorityColor(request.priority_level)}>
                        {request.priority_level}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{request.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 text-sm">
                      {request.estimated_cost > 0 && (
                        <span className="flex items-center gap-1 text-green-600">
                          <DollarSign className="h-4 w-4" />
                          {request.estimated_cost.toLocaleString()} FCFA
                        </span>
                      )}
                      {request.installation_date && (
                        <span className="flex items-center gap-1 text-blue-600">
                          <Calendar className="h-4 w-4" />
                          Installation: {format(new Date(request.installation_date), 'dd/MM/yyyy', { locale: fr })}
                        </span>
                      )}
                    </div>
                    <Button onClick={() => openEditModal(request)} variant="outline" size="sm">
                      <Wrench className="h-4 w-4 mr-2" />
                      Gérer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="technicians" className="space-y-4">
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Fonctionnalité en développement</h3>
            <p className="text-gray-500">La gestion des techniciens nécessite la création de la table solar_technicians</p>
          </div>
        </TabsContent>

        <TabsContent value="statistics">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Demandes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{requests.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">En Attente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {requests.filter(r => r.status === 'pending').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">En Cours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {requests.filter(r => r.status === 'in_progress').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Terminées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {requests.filter(r => r.status === 'completed').length}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal d'édition */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Gérer la demande - {selectedRequest?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Statut</Label>
                <Select value={editForm.status} onValueChange={(value) => setEditForm({...editForm, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="in_progress">En cours</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priorité</Label>
                <Select value={editForm.priority_level} onValueChange={(value) => setEditForm({...editForm, priority_level: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Basse</SelectItem>
                    <SelectItem value="normal">Normale</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cost">Coût estimé (FCFA)</Label>
                <Input
                  type="number"
                  value={editForm.estimated_cost || 0}
                  onChange={(e) => setEditForm({...editForm, estimated_cost: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="date">Date d'installation</Label>
                <Input
                  type="date"
                  value={editForm.installation_date || ''}
                  onChange={(e) => setEditForm({...editForm, installation_date: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes administratives</Label>
              <Textarea
                value={editForm.admin_notes || ''}
                onChange={(e) => setEditForm({...editForm, admin_notes: e.target.value})}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleUpdateRequest}>
                Sauvegarder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SolarInstallations;
