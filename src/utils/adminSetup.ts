
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

export const createDefaultAdminAccount = async () => {
  const { register } = useUnifiedAuth();
  
  const adminData = {
    nom: 'Cowema Admin 2',
    firstName: 'Cowema',
    lastName: 'Admin 2',
    email: 'info.cowema@gmail.com',
    password: 'COwem@_25@!',
    phone: '+242000000000',
    gender: 'male' as const,
    role: 'admin' as const,
    autoLogin: false
  };

  try {
    console.log('Creating default admin account...');
    const success = await register(adminData);
    
    if (success) {
      console.log('✅ Default admin account created successfully');
      return true;
    } else {
      console.log('❌ Failed to create default admin account');
      return false;
    }
  } catch (error) {
    console.error('Error creating default admin account:', error);
    return false;
  }
};
