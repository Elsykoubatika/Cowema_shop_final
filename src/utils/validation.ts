
import { z } from 'zod';

export const ProfileSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  gender: z.enum(['male', 'female']),
  role: z.enum(['user', 'admin', 'seller', 'team_lead', 'sales_manager', 'influencer']).optional()
});

export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return {
      success: false,
      errors: ['Erreur de validation inconnue']
    };
  }
}
