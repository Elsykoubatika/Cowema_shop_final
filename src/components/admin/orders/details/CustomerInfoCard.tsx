
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, Mail, MapPin } from 'lucide-react';

interface CustomerInfoCardProps {
  order: any;
}

const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({ order }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Informations client
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Nom complet</p>
          <p className="font-medium">
            {order.customer_info?.firstName} {order.customer_info?.lastName}
          </p>
        </div>
        
        {order.customer_info?.phone && (
          <div>
            <p className="text-sm font-medium text-gray-500">Téléphone</p>
            <p className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <a 
                href={`tel:${order.customer_info.phone}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {order.customer_info.phone}
              </a>
            </p>
          </div>
        )}
        
        {order.customer_info?.email && (
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <a 
                href={`mailto:${order.customer_info.email}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {order.customer_info.email}
              </a>
            </p>
          </div>
        )}
        
        {(order.customer_info?.city || order.delivery_address?.city) && (
          <div>
            <p className="text-sm font-medium text-gray-500">Ville</p>
            <p className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {order.customer_info?.city || order.delivery_address?.city}
            </p>
          </div>
        )}

        {(order.customer_info?.address || order.delivery_address?.address) && (
          <div>
            <p className="text-sm font-medium text-gray-500">Adresse</p>
            <p className="text-sm">
              {order.customer_info?.address || order.delivery_address?.address}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerInfoCard;
