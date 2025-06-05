
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { useInfluencerApplication } from '@/hooks/useInfluencerApplication';
import { influencerFormSchema, type InfluencerFormValues } from './form/InfluencerFormSchema';
import PersonalInfoSection from './form/PersonalInfoSection';
import SocialNetworksSection from './form/SocialNetworksSection';
import NicheAndMotivationSection from './form/NicheAndMotivationSection';

const InfluencerApplicationForm = () => {
  const { user } = useUnifiedAuth();
  const { submitApplication, isSubmitting } = useInfluencerApplication();
  
  const form = useForm<InfluencerFormValues>({
    resolver: zodResolver(influencerFormSchema),
    defaultValues: {
      firstName: user?.firstName || user?.nom || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      instagram: "",
      tiktok: "",
      youtube: "",
      facebook: "",
      otherSocial: "",
      followersCount: "",
      niche: "",
      motivation: "",
    },
  });

  const onSubmit = async (values: InfluencerFormValues) => {
    console.log('🚀 Form submitted with values:', values);
    
    // Convertir les données du formulaire
    const applicationData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      socialNetworks: {
        instagram: values.instagram || undefined,
        tiktok: values.tiktok || undefined,
        youtube: values.youtube || undefined,
        facebook: values.facebook || undefined,
        other: values.otherSocial || undefined,
      },
      followerCount: Number(values.followersCount),
      niche: values.niche.split(',').map(n => n.trim()).filter(Boolean),
      motivation: values.motivation,
    };

    const success = await submitApplication(applicationData);
    
    if (success) {
      // Réinitialiser le formulaire en cas de succès
      form.reset();
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-cowema">
      <h2 className="text-2xl font-bold mb-6 text-center">Postuler au programme influenceurs</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <PersonalInfoSection form={form} />
          <SocialNetworksSection form={form} />
          <NicheAndMotivationSection form={form} />
          
          <Button 
            type="submit" 
            className="w-full mt-6" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Soumission en cours...' : 'Soumettre ma candidature'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default InfluencerApplicationForm;
