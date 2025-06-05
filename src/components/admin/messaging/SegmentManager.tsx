
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserSegments } from '@/hooks/useMessageSegments';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash, Users, Filter } from 'lucide-react';

export const SegmentManager: React.FC = () => {
  const { segments, addSegment, updateSegment, deleteSegment } = useUserSegments();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    criteria: {
      city: [] as string[],
      totalSpentMin: undefined as number | undefined,
      totalSpentMax: undefined as number | undefined,
      orderCountMin: undefined as number | undefined,
      lastOrderDaysAgo: undefined as number | undefined,
      category: 'all'
    }
  });

  const cities = ['Brazzaville', 'Pointe-Noire', 'Dolisie', 'Ouesso'];
  const categories = ['Générateurs', 'Panneaux Solaires', 'Batteries', 'Accessoires'];

  const handleOpenDialog = (segment?: any) => {
    if (segment) {
      setEditingSegment(segment);
      setFormData({
        name: segment.name,
        description: segment.description,
        criteria: {
          city: segment.criteria?.city || [],
          totalSpentMin: segment.criteria?.totalSpentMin,
          totalSpentMax: segment.criteria?.totalSpentMax,
          orderCountMin: segment.criteria?.orderCountMin,
          lastOrderDaysAgo: segment.criteria?.lastOrderDaysAgo,
          category: segment.criteria?.category || 'all'
        }
      });
    } else {
      setEditingSegment(null);
      setFormData({
        name: '',
        description: '',
        criteria: {
          city: [],
          totalSpentMin: undefined,
          totalSpentMax: undefined,
          orderCountMin: undefined,
          lastOrderDaysAgo: undefined,
          category: 'all'
        }
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du segment est requis.",
        variant: "destructive"
      });
      return;
    }

    const cleanCriteria = {
      ...(formData.criteria.city.length > 0 && { city: formData.criteria.city }),
      ...(formData.criteria.totalSpentMin && { totalSpentMin: formData.criteria.totalSpentMin }),
      ...(formData.criteria.totalSpentMax && { totalSpentMax: formData.criteria.totalSpentMax }),
      ...(formData.criteria.orderCountMin && { orderCountMin: formData.criteria.orderCountMin }),
      ...(formData.criteria.lastOrderDaysAgo && { lastOrderDaysAgo: formData.criteria.lastOrderDaysAgo }),
      ...(formData.criteria.category !== 'all' && { category: formData.criteria.category })
    };

    const segmentData = {
      name: formData.name,
      description: formData.description,
      criteria: cleanCriteria
    };

    if (editingSegment) {
      updateSegment(editingSegment.id, { ...segmentData, customerCount: Math.floor(Math.random() * 100) + 10 });
      toast({
        title: "Segment mis à jour",
        description: "Le segment a été mis à jour avec succès."
      });
    } else {
      addSegment(segmentData);
      toast({
        title: "Segment créé",
        description: "Le nouveau segment a été créé avec succès."
      });
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (segmentId: string) => {
    deleteSegment(segmentId);
    toast({
      title: "Segment supprimé",
      description: "Le segment a été supprimé avec succès."
    });
  };

  const getCriteriaDescription = (criteria: any) => {
    const descriptions = [];
    
    if (criteria.city && criteria.city.length > 0) descriptions.push(`Villes: ${criteria.city.join(', ')}`);
    if (criteria.totalSpentMin) descriptions.push(`Dépenses min: ${criteria.totalSpentMin} FCFA`);
    if (criteria.totalSpentMax) descriptions.push(`Dépenses max: ${criteria.totalSpentMax} FCFA`);
    if (criteria.orderCountMin) descriptions.push(`Min commandes: ${criteria.orderCountMin}`);
    if (criteria.lastOrderDaysAgo) descriptions.push(`Inactif depuis: ${criteria.lastOrderDaysAgo} jours`);
    if (criteria.category && criteria.category !== 'all') descriptions.push(`Catégorie: ${criteria.category}`);
    
    return descriptions.length > 0 ? descriptions.join(' • ') : 'Aucun critère défini';
  };

  const handleCityToggle = (city: string) => {
    setFormData(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        city: prev.criteria.city.includes(city)
          ? prev.criteria.city.filter(c => c !== city)
          : [...prev.criteria.city, city]
      }
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Segments de clients</h3>
          <p className="text-sm text-muted-foreground">
            Créez des segments pour cibler précisément vos clients
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus size={16} className="mr-2" />
          Nouveau segment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {segments.map((segment) => (
          <Card key={segment.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{segment.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Users size={12} />
                      {segment.customerCount}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDialog(segment)}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    onClick={() => handleDelete(segment.id)}
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {segment.description}
              </p>
              <div className="flex items-start gap-1">
                <Filter size={12} className="text-muted-foreground mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  {getCriteriaDescription(segment.criteria)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog de création/édition */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingSegment ? 'Modifier le segment' : 'Créer un nouveau segment'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du segment</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Clients VIP Brazzaville"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description du segment..."
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Critères de segmentation</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Villes</Label>
                  <div className="flex flex-wrap gap-2">
                    {cities.map(city => (
                      <div
                        key={city}
                        className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                          formData.criteria.city.includes(city)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        onClick={() => handleCityToggle(city)}
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Catégorie préférée</Label>
                  <Select
                    value={formData.criteria.category}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      criteria: { ...prev.criteria, category: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Montant min dépensé (FCFA)</Label>
                  <Input
                    type="number"
                    value={formData.criteria.totalSpentMin || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      criteria: { ...prev.criteria, totalSpentMin: e.target.value ? Number(e.target.value) : undefined }
                    }))}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Montant max dépensé (FCFA)</Label>
                  <Input
                    type="number"
                    value={formData.criteria.totalSpentMax || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      criteria: { ...prev.criteria, totalSpentMax: e.target.value ? Number(e.target.value) : undefined }
                    }))}
                    placeholder="Illimité"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Nombre min de commandes</Label>
                  <Input
                    type="number"
                    value={formData.criteria.orderCountMin || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      criteria: { ...prev.criteria, orderCountMin: e.target.value ? Number(e.target.value) : undefined }
                    }))}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Inactif depuis (jours)</Label>
                  <Input
                    type="number"
                    value={formData.criteria.lastOrderDaysAgo || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      criteria: { ...prev.criteria, lastOrderDaysAgo: e.target.value ? Number(e.target.value) : undefined }
                    }))}
                    placeholder="Ex: 30"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              {editingSegment ? 'Mettre à jour' : 'Créer le segment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
