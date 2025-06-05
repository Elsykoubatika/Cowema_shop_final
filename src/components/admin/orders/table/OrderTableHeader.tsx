
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

const OrderTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">Commande N°</TableHead>
        <TableHead className="w-[120px]">Date</TableHead>
        <TableHead className="min-w-[200px]">Produit</TableHead>
        <TableHead className="w-[80px] text-center">Quantité</TableHead>
        <TableHead className="w-[120px] text-right">Prix unitaire</TableHead>
        <TableHead className="w-[120px] text-right">Sous-total</TableHead>
        <TableHead className="w-[100px] text-right">Remise</TableHead>
        <TableHead className="w-[120px] text-right">Livraison</TableHead>
        <TableHead className="w-[120px] text-right">Total commande</TableHead>
        <TableHead className="min-w-[150px]">Client</TableHead>
        <TableHead className="w-[120px]">Téléphone</TableHead>
        <TableHead className="w-[100px]">Statut</TableHead>
        <TableHead className="w-[100px]">Source</TableHead>
        <TableHead className="w-[100px]">Lien produit</TableHead>
        <TableHead className="w-[100px]">Reçu PDF</TableHead>
        <TableHead className="w-[120px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default OrderTableHeader;
