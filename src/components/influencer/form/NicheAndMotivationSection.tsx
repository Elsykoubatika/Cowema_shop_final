
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { InfluencerFormValues } from './InfluencerFormSchema';

type NicheAndMotivationSectionProps = {
  form: UseFormReturn<InfluencerFormValues>;
};

const NicheAndMotivationSection: React.FC<NicheAndMotivationSectionProps> = ({ form }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Votre niche et motivation</h3>
      
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="niche"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Votre niche</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Mode, Beauté, Tech, Fitness..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="motivation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pourquoi souhaitez-vous devenir influenceur pour notre marque?</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Expliquez votre motivation et comment vous pourriez promouvoir nos produits..." 
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default NicheAndMotivationSection;
