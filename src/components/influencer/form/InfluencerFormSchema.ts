
import * as z from 'zod';

// Schema de validation avec Zod
export const influencerFormSchema = z.object({
  firstName: z.string().min(2, { message: "Le prénom doit comporter au moins 2 caractères." }),
  lastName: z.string().min(2, { message: "Le nom doit comporter au moins 2 caractères." }),
  email: z.string().email({ message: "Veuillez entrer une adresse e-mail valide." }),
  phone: z.string().min(8, { message: "Le numéro de téléphone doit comporter au moins 8 chiffres." }),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  youtube: z.string().optional(),
  facebook: z.string().optional(),
  otherSocial: z.string().optional(),
  followersCount: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 100, {
    message: "Veuillez entrer un nombre valide d'au moins 100 followers."
  }),
  niche: z.string().min(3, { message: "Veuillez décrire votre niche (séparez par des virgules si plusieurs)." }),
  motivation: z.string().min(20, { message: "Veuillez expliquer votre motivation en au moins 20 caractères." }),
});

export type InfluencerFormValues = z.infer<typeof influencerFormSchema>;
