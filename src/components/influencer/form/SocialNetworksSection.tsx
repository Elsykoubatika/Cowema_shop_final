
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InfluencerFormValues } from './InfluencerFormSchema';

type SocialNetworksSectionProps = {
  form: UseFormReturn<InfluencerFormValues>;
};

const SocialNetworksSection: React.FC<SocialNetworksSectionProps> = ({ form }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Réseaux sociaux</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="instagram"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram</FormLabel>
              <FormControl>
                <Input placeholder="@votre_compte" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="tiktok"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TikTok</FormLabel>
              <FormControl>
                <Input placeholder="@votre_compte" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="youtube"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Youtube</FormLabel>
              <FormControl>
                <Input placeholder="URL de votre chaîne" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="facebook"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook</FormLabel>
              <FormControl>
                <Input placeholder="URL de votre page" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="otherSocial"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Autre réseau social</FormLabel>
              <FormControl>
                <Input placeholder="URL ou nom d'utilisateur" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="followersCount"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Nombre total d'abonnés</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Estimation du nombre total d'abonnés" 
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

export default SocialNetworksSection;
