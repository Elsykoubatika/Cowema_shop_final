
import { useCallback } from 'react';
import { z } from 'zod';
import { useErrorHandler } from './useErrorHandler';

type ValidationResult<T> = 
  | { success: true; data: T; errors?: never }
  | { success: false; errors: string[]; data?: never };

export const useDataValidation = () => {
  const { handleError } = useErrorHandler();

  const validateData = useCallback(<T>(
    schema: z.ZodSchema<T>, 
    data: unknown
  ): ValidationResult<T> => {
    try {
      const result = schema.safeParse(data);
      
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        const errors = result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
        return { success: false, errors };
      }
    } catch (error) {
      console.error('Validation error:', error);
      return { success: false, errors: ['Erreur de validation'] };
    }
  }, []);

  const validateAndExecute = useCallback(async <T, R>(
    schema: z.ZodSchema<T>,
    data: unknown,
    executor: (validatedData: T) => Promise<R> | R,
    errorContext?: string
  ): Promise<R | null> => {
    try {
      const validation = validateData(schema, data);
      
      if (!validation.success) {
        validation.errors.forEach(error => {
          handleError(new Error(error), errorContext || 'Validation');
        });
        return null;
      }

      return await executor(validation.data);
    } catch (error) {
      console.error('Execute error:', error);
      handleError(error, errorContext || 'Execution');
      return null;
    }
  }, [validateData, handleError]);

  const validateFormData = useCallback(<T>(
    schema: z.ZodSchema<T>,
    formData: FormData,
    errorContext?: string
  ): ValidationResult<T> => {
    try {
      const data = Object.fromEntries(formData.entries());
      const validation = validateData(schema, data);
      
      if (!validation.success) {
        validation.errors.forEach(error => {
          handleError(new Error(error), errorContext || 'Form Validation');
        });
      }
      
      return validation;
    } catch (error) {
      console.error('Form validation error:', error);
      handleError(error, errorContext || 'Form Validation');
      return { success: false, errors: ['Erreur de validation du formulaire'] };
    }
  }, [validateData, handleError]);

  return {
    validateData,
    validateAndExecute,
    validateFormData
  };
};
