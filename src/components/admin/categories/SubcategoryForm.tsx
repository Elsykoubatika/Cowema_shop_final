
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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

// Schéma de validation
const subcategorySchema = z.object({
  name: z.string().min(2, { message: "Le nom doit comporter au moins 2 caractères" }),
});

type SubcategoryFormProps = {
  categoryId: string;
  onSubmit: (categoryId: string, subcategoryName: string) => void;
};

const SubcategoryForm: React.FC<SubcategoryFormProps> = ({
  categoryId,
  onSubmit
}) => {
  const form = useForm<z.infer<typeof subcategorySchema>>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: {
      name: '',
    },
  });

  const handleSubmit = (values: z.infer<typeof subcategorySchema>) => {
    onSubmit(categoryId, values.name);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la sous-catégorie</FormLabel>
              <FormControl>
                <Input placeholder="Nom de la sous-catégorie" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button type="submit">Ajouter</Button>
        </div>
      </form>
    </Form>
  );
};

export default SubcategoryForm;
