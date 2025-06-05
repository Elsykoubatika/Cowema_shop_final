
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Phone, Mail } from 'lucide-react';

const AdminCustomers: React.FC = () => {
  const mockCustomers = [
    {
      id: '1',
      name: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      phone: '+242 06 123 4567',
      city: 'Brazzaville',
      orders: 5,
      totalSpent: 125000,
      status: 'active'
    },
    {
      id: '2',
      name: 'Marie Martin',
      email: 'marie.martin@email.com',
      phone: '+242 06 234 5678',
      city: 'Pointe-Noire',
      orders: 3,
      totalSpent: 85000,
      status: 'active'
    },
    {
      id: '3',
      name: 'Paul Durand',
      email: 'paul.durand@email.com',
      phone: '+242 06 345 6789',
      city: 'Dolisie',
      orders: 1,
      totalSpent: 15000,
      status: 'new'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'new': return 'Nouveau';
      case 'inactive': return 'Inactif';
      default: return status;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tous les clients</h2>
        <p className="text-muted-foreground">
          Gérez tous les clients de votre boutique
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{customer.name}</p>
                    <Badge className={getStatusColor(customer.status)}>
                      {getStatusText(customer.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{customer.email}</p>
                  <p className="text-sm text-gray-500">{customer.city} - {customer.orders} commandes</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="font-semibold">{customer.totalSpent.toLocaleString()} FCFA</p>
                    <p className="text-sm text-gray-500">Total dépensé</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-1" />
                    Appeler
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCustomers;
