
import { User } from '../../types/auth';

// Type for the mock user database
export interface MockUserRecord {
  password: string;
  user: User;
}

export const createMockDatabase = () => {
  // Mock users database
  const mockUsers: Record<string, MockUserRecord> = {};
  
  return { mockUsers };
};
