
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CategoryData } from '@/types/api';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Schéma de validation
const categorySchema = z.object({
  name: z.string().min(2, { message: "Le nom doit comporter au moins 2 caractères" }),
  description: z.string().optional(),
  image: z.string().url({ message: "L'URL de l'image n'est pas valide" }).optional().or(z.literal('')),
});

type CategoryFormProps = {
  category?: CategoryData;
  onSubmit: (data: CategoryData) => void;
  isEdit?: boolean;
};

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSubmit,
  isEdit = false
}) => {
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      image: category?.image || '',
    },
  });

  const handleSubmit = (values: z.infer<typeof categorySchema>) => {
    const categoryData: CategoryData = {
      id: category?.id || values.name.toLowerCase().replace(/\s+/g, '-'),
      name: values.name,
      description: values.description,
      image: values.image || undefined,
      subcategories: category?.subcategories || [],
      productCount: category?.productCount || 0,
    };
    onSubmit(categoryData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la catégorie</FormLabel>
              <FormControl>
                <Input placeholder="Nom de la catégorie" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optionnel)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Description de la catégorie" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de l'image (optionnel)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://exemple.com/image.jpg" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button type="submit">
            {isEdit ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CategoryForm;
