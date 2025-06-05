
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit } from 'lucide-react';
import { useDeliveryFees, NeighborhoodFee } from '@/hooks/useDeliveryFees';

interface DeliveryFeesTabProps {
  handleSaveSettings: () => void;
}

const DeliveryFeesTab: React.FC<DeliveryFeesTabProps> = ({
  handleSaveSettings
}) => {
  const { cities, addCity, removeCity, addNeighborhood, updateNeighborhood, removeNeighborhood } = useDeliveryFees();
  const { toast } = useToast();
  const [newCityName, setNewCityName] = useState('');
  const [isAddNeighborhoodDialogOpen, setIsAddNeighborhoodDialogOpen] = useState(false);
  const [isEditNeighborhoodDialogOpen, setIsEditNeighborhoodDialogOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState('');
  const [neighborhoodForm, setNeighborhoodForm] = useState<{ name: string; fee: number }>({ name: '', fee: 1000 });
  const [currentNeighborhood, setCurrentNeighborhood] = useState<string>('');

  const handleAddCity = () => {
    if (!newCityName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un nom de ville",
        variant: "destructive"
      });
      return;
    }

    // Create a City object with empty neighborhoods array
    const newCity = {
      name: newCityName,
      neighborhoods: []
    };
    
    addCity(newCity);
    setNewCityName('');
    toast({
      title: "Ville ajoutée",
      description: `${newCityName} a été ajoutée avec succès.`
    });
  };

  const handleRemoveCity = (cityName: string) => {
    if (cityName === 'Autre') {
      toast({
        title: "Action impossible",
        description: "Vous ne pouvez pas supprimer la ville 'Autre' qui sert de valeur par défaut.",
        variant: "destructive"
      });
      return;
    }

    removeCity(cityName);
    toast({
      title: "Ville supprimée",
      description: `${cityName} a été supprimée de la liste.`
    });
  };

  const openAddNeighborhoodDialog = (cityName: string) => {
    setCurrentCity(cityName);
    setNeighborhoodForm({ name: '', fee: 1000 });
    setIsAddNeighborhoodDialogOpen(true);
  };

  const openEditNeighborhoodDialog = (cityName: string, neighborhood: NeighborhoodFee) => {
    setCurrentCity(cityName);
    setCurrentNeighborhood(neighborhood.name);
    setNeighborhoodForm({ name: neighborhood.name, fee: neighborhood.fee });
    setIsEditNeighborhoodDialogOpen(true);
  };

  const handleAddNeighborhood = () => {
    if (!neighborhoodForm.name.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un nom d'arrondissement",
        variant: "destructive"
      });
      return;
    }

    // Create a Neighborhood object
    const newNeighborhood = {
      name: neighborhoodForm.name,
      fee: neighborhoodForm.fee
    };
    
    addNeighborhood(currentCity, newNeighborhood);
    setIsAddNeighborhoodDialogOpen(false);
    toast({
      title: "Arrondissement ajouté",
      description: `${neighborhoodForm.name} a été ajouté à ${currentCity}.`
    });
  };

  const handleUpdateNeighborhood = () => {
    if (!neighborhoodForm.name.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un nom d'arrondissement",
        variant: "destructive"
      });
      return;
    }

    updateNeighborhood(currentCity, currentNeighborhood, neighborhoodForm.fee);
    setIsEditNeighborhoodDialogOpen(false);
    toast({
      title: "Arrondissement mis à jour",
      description: `Les informations ont été mises à jour avec succès.`
    });
  };

  const handleRemoveNeighborhood = (cityName: string, neighborhoodName: string) => {
    removeNeighborhood(cityName, neighborhoodName);
    toast({
      title: "Arrondissement supprimé",
      description: `${neighborhoodName} a été supprimé de ${cityName}.`
    });
  };

  const handleSave = () => {
    handleSaveSettings();
    toast({
      title: "Configurations enregistrées",
      description: "Les frais de livraison ont été mis à jour."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration des frais de livraison</CardTitle>
        <CardDescription>
          Définissez les frais de livraison par ville et par arrondissement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Nom de la nouvelle ville" 
            value={newCityName} 
            onChange={(e) => setNewCityName(e.target.value)} 
            className="max-w-xs"
          />
          <Button size="sm" onClick={handleAddCity}>
            <Plus className="h-4 w-4 mr-1" /> Ajouter une ville
          </Button>
        </div>

        <Accordion type="multiple" className="w-full">
          {cities.map((city) => (
            <AccordionItem key={city.name} value={city.name}>
              <AccordionTrigger className="hover:bg-gray-50 px-3">
                <div className="flex justify-between w-full items-center">
                  <span>{city.name}</span>
                  {city.name !== 'Autre' && (
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="h-8"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleRemoveCity(city.name); 
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openAddNeighborhoodDialog(city.name)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Ajouter un arrondissement
                  </Button>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Arrondissement</TableHead>
                        <TableHead className="text-right">Frais (FCFA)</TableHead>
                        <TableHead className="text-right w-24">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {city.neighborhoods.map((neighborhood) => (
                        <TableRow key={neighborhood.name}>
                          <TableCell className="font-medium">{neighborhood.name}</TableCell>
                          <TableCell className="text-right">{neighborhood.fee} FCFA</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => openEditNeighborhoodDialog(city.name, neighborhood)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              
                              {city.neighborhoods.length > 1 && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleRemoveNeighborhood(city.name, neighborhood.name)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Button onClick={handleSave} className="mt-4">Enregistrer les configurations</Button>

        {/* Ajouter un arrondissement */}
        <Dialog open={isAddNeighborhoodDialogOpen} onOpenChange={setIsAddNeighborhoodDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un arrondissement à {currentCity}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="neighborhood-name" className="text-sm font-medium">Nom de l'arrondissement</label>
                <Input 
                  id="neighborhood-name"
                  value={neighborhoodForm.name}
                  onChange={(e) => setNeighborhoodForm({...neighborhoodForm, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="neighborhood-fee" className="text-sm font-medium">Frais de livraison (FCFA)</label>
                <Input 
                  id="neighborhood-fee"
                  type="number"
                  value={neighborhoodForm.fee}
                  onChange={(e) => setNeighborhoodForm({...neighborhoodForm, fee: Number(e.target.value)})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddNeighborhoodDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleAddNeighborhood}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modifier un arrondissement */}
        <Dialog open={isEditNeighborhoodDialogOpen} onOpenChange={setIsEditNeighborhoodDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier l'arrondissement {currentNeighborhood}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-neighborhood-name" className="text-sm font-medium">Nom de l'arrondissement</label>
                <Input 
                  id="edit-neighborhood-name"
                  value={neighborhoodForm.name}
                  onChange={(e) => setNeighborhoodForm({...neighborhoodForm, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-neighborhood-fee" className="text-sm font-medium">Frais de livraison (FCFA)</label>
                <Input 
                  id="edit-neighborhood-fee"
                  type="number"
                  value={neighborhoodForm.fee}
                  onChange={(e) => setNeighborhoodForm({...neighborhoodForm, fee: Number(e.target.value)})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditNeighborhoodDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleUpdateNeighborhood}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DeliveryFeesTab;
