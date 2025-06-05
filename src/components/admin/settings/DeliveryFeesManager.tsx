
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Edit, Save, MapPin, Truck } from 'lucide-react';
import { CONGO_GEOGRAPHY, Ville, Arrondissement } from '@/data/congoGeography';

const DeliveryFeesManager: React.FC = () => {
  const [cities, setCities] = useState<Ville[]>(CONGO_GEOGRAPHY);
  const [editingFee, setEditingFee] = useState<{
    cityName: string;
    arrondissementName: string;
    currentFee: number;
  } | null>(null);
  const [newFee, setNewFee] = useState<string>('');

  const handleEditFee = (cityName: string, arrondissementName: string, currentFee: number) => {
    setEditingFee({ cityName, arrondissementName, currentFee });
    setNewFee(currentFee.toString());
  };

  const handleSaveFee = () => {
    if (!editingFee) return;
    
    const feeValue = parseInt(newFee);
    if (isNaN(feeValue) || feeValue < 0) {
      toast.error("Le montant doit être un nombre positif");
      return;
    }

    setCities(prevCities => 
      prevCities.map(city => {
        if (city.name === editingFee.cityName) {
          return {
            ...city,
            arrondissements: city.arrondissements.map(arr =>
              arr.name === editingFee.arrondissementName
                ? { ...arr, deliveryFee: feeValue }
                : arr
            )
          };
        }
        return city;
      })
    );

    toast.success(`Frais de livraison mis à jour pour ${editingFee.arrondissementName}`);
    setEditingFee(null);
    setNewFee('');
  };

  const getTotalArrondissements = () => {
    return cities.reduce((total, city) => total + city.arrondissements.length, 0);
  };

  const getAverageDeliveryFee = () => {
    const allFees = cities.flatMap(city => city.arrondissements.map(arr => arr.deliveryFee));
    return Math.round(allFees.reduce((sum, fee) => sum + fee, 0) / allFees.length);
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              Villes couvertes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cities.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Truck className="h-4 w-4 text-green-600" />
              Arrondissements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalArrondissements()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Frais moyen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getAverageDeliveryFee().toLocaleString()} FCFA</div>
          </CardContent>
        </Card>
      </div>

      {/* Gestion des frais par ville */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Frais de livraison par arrondissement
          </CardTitle>
          <CardDescription>
            Gérez les frais de livraison pour chaque arrondissement de la République du Congo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {cities.map((city) => (
              <AccordionItem key={city.name} value={city.name}>
                <AccordionTrigger className="text-left">
                  <div className="flex items-center justify-between w-full mr-4">
                    <span className="font-medium">{city.name}</span>
                    <Badge variant="secondary">
                      {city.arrondissements.length} arrondissement{city.arrondissements.length > 1 ? 's' : ''}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Arrondissement</TableHead>
                        <TableHead className="text-right">Frais de livraison</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {city.arrondissements.map((arrondissement) => (
                        <TableRow key={arrondissement.name}>
                          <TableCell className="font-medium">
                            {arrondissement.name}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline">
                              {arrondissement.deliveryFee.toLocaleString()} FCFA
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditFee(city.name, arrondissement.name, arrondissement.deliveryFee)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Dialog pour éditer les frais */}
      <Dialog open={!!editingFee} onOpenChange={() => setEditingFee(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier les frais de livraison</DialogTitle>
          </DialogHeader>
          
          {editingFee && (
            <div className="space-y-4">
              <div>
                <Label>Ville</Label>
                <p className="text-sm text-gray-600">{editingFee.cityName}</p>
              </div>
              
              <div>
                <Label>Arrondissement</Label>
                <p className="text-sm text-gray-600">{editingFee.arrondissementName}</p>
              </div>
              
              <div>
                <Label htmlFor="newFee">Nouveau frais de livraison (FCFA)</Label>
                <Input
                  id="newFee"
                  type="number"
                  value={newFee}
                  onChange={(e) => setNewFee(e.target.value)}
                  placeholder="Ex: 2000"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingFee(null)}>
              Annuler
            </Button>
            <Button onClick={handleSaveFee}>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeliveryFeesManager;
