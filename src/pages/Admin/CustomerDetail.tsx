
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Edit, Save, X, MessageSquare, Phone, Mail, MapPin, Calendar, DollarSign, Package } from 'lucide-react';
import { useSupabaseCustomers } from '@/hooks/useSupabaseCustomers';
import { useCustomerPermissions } from '@/hooks/useCustomerPermissions';
import { toast } from 'sonner';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { customers, updateCustomer } = useSupabaseCustomers();
  const { canEditCustomer, canAddNotes, getCustomerStats } = useCustomerPermissions();
  
  const [customer, setCustomer] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (id && customers.length > 0) {
      const foundCustomer = customers.find(c => c.id === id);
      if (foundCustomer) {
        setCustomer(foundCustomer);
      }
    }
  }, [id, customers]);

  const handleSaveNote = async () => {
    if (!customer || !newNote.trim()) return;

    const updatedNotes = customer.notes ? `${customer.notes}\n${new Date().toLocaleDateString()}: ${newNote}` : `${new Date().toLocaleDateString()}: ${newNote}`;
    
    const success = await updateCustomer(customer.id, { notes: updatedNotes });
    if (success) {
      setCustomer({ ...customer, notes: updatedNotes });
      setNewNote('');
      toast.success('Note ajoutée avec succès');
    }
  };

  if (!customer) {
    return (
      <AdminPageLayout>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => navigate('/admin/customers')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Client introuvable</h1>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  const stats = getCustomerStats(customer);
  
  // Safely access preferredCategories
  const preferredCategories = customer.preferredCategories || {};
  const topCategories = Object.entries(preferredCategories)
    .sort(([,a], [,b]) => {
      const numA = typeof a === 'number' ? a : 0;
      const numB = typeof b === 'number' ? b : 0;
      return numB - numA;
    })
    .slice(0, 3);

  // Safely access ordersByVendor
  const ordersByVendor = customer.ordersByVendor || {};
  const hasVendorOrders = Object.keys(ordersByVendor).length > 0;

  return (
    <AdminPageLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/admin/customers')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{customer.firstName} {customer.lastName}</h1>
              <p className="text-gray-600">ID: {customer.id}</p>
            </div>
          </div>
          {canEditCustomer(customer) && (
            <Button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
              {isEditing ? 'Annuler' : 'Modifier'}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{customer.email || 'Email non renseigné'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{customer.city} {customer.address && `, ${customer.address}`}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Client depuis le {new Date(customer.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </CardContent>
            </Card>

            {/* Order History */}
            <Card>
              <CardHeader>
                <CardTitle>Historique des commandes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{customer.orderCount || 0}</div>
                      <div className="text-sm text-gray-600">Commandes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {new Intl.NumberFormat('fr-FR').format(customer.totalSpent || 0)} FCFA
                      </div>
                      <div className="text-sm text-gray-600">Total dépensé</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString('fr-FR') : 'Jamais'}
                      </div>
                      <div className="text-sm text-gray-600">Dernière commande</div>
                    </div>
                  </div>

                  {topCategories.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Catégories préférées</h4>
                      <div className="flex gap-2 flex-wrap">
                        {topCategories.map(([category, count]) => {
                          const displayCount = typeof count === 'number' ? count : 0;
                          return (
                            <Badge key={category} variant="secondary">
                              {category} ({displayCount})
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {hasVendorOrders && (
                    <div>
                      <h4 className="font-medium mb-2">Commandes par vendeur</h4>
                      <div className="space-y-2">
                        {Object.entries(ordersByVendor).map(([vendorId, data]) => {
                          const vendorData = data && typeof data === 'object' ? data as any : {};
                          const orderCount = vendorData.orderCount || 0;
                          return (
                            <div key={vendorId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="text-sm">Vendeur {vendorId}</span>
                              <div className="text-sm">
                                {orderCount} commandes
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {canAddNotes(customer) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {customer.notes && (
                    <div className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded">
                      {customer.notes}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Ajouter une note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={3}
                    />
                    <Button onClick={handleSaveNote} disabled={!newNote.trim()}>
                      <Save className="h-4 w-4 mr-2" />
                      Ajouter la note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Statut</span>
                  <Badge variant={stats.isVIP ? "default" : "secondary"}>
                    {stats.isVIP ? 'VIP' : 'Standard'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Panier moyen</span>
                  <span className="font-medium">
                    {customer.orderCount > 0 
                      ? new Intl.NumberFormat('fr-FR').format(Math.round((customer.totalSpent || 0) / customer.orderCount))
                      : '0'
                    } FCFA
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Dernière activité</span>
                  <span className="text-sm">
                    {new Date(customer.updatedAt || customer.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer un email
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Package className="h-4 w-4 mr-2" />
                  Nouvelle commande
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default CustomerDetail;
