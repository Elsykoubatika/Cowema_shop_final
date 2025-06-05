
import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';

export interface MessageSegment {
  id: string;
  name: string;
  description: string;
  criteria: {
    city?: string[];
    totalSpentMin?: number;
    totalSpentMax?: number;
    orderCountMin?: number;
    orderCountMax?: number;
    lastOrderDaysAgo?: number;
    vendorId?: string; // Pour filtrer par vendeur
  };
  customerCount: number;
  createdAt: string;
  createdBy: string;
}

interface MessageSegmentsState {
  segments: MessageSegment[];
  getSegmentsByUser: () => MessageSegment[];
  addSegment: (segment: Omit<MessageSegment, 'id' | 'createdAt' | 'createdBy' | 'customerCount'>) => void;
  updateSegment: (id: string, segment: Partial<MessageSegment>) => void;
  deleteSegment: (id: string) => void;
}

export const useMessageSegments = create<MessageSegmentsState>((set, get) => ({
  segments: [
    {
      id: '1',
      name: 'Clients VIP',
      description: 'Clients ayant dépensé plus de 100 000 FCFA',
      criteria: { totalSpentMin: 100000 },
      customerCount: 45,
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    },
    {
      id: '2', 
      name: 'Clients Brazzaville',
      description: 'Tous les clients de Brazzaville',
      criteria: { city: ['Brazzaville'] },
      customerCount: 120,
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    },
    {
      id: '3',
      name: 'Clients inactifs',
      description: 'Clients sans commande depuis 30 jours',
      criteria: { lastOrderDaysAgo: 30 },
      customerCount: 67,
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    }
  ],

  getSegmentsByUser: () => {
    // We'll get the user from the hook when this function is called from a component
    const allSegments = get().segments;
    
    // For now, return all segments - this will be properly filtered in the component
    return allSegments;
  },

  addSegment: (segment) => {
    const newSegment: MessageSegment = {
      ...segment,
      id: `segment-${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: 'current-user', // This will be set properly from the component
      customerCount: 0 // À calculer selon les critères
    };
    
    set((state) => ({
      segments: [...state.segments, newSegment]
    }));
  },

  updateSegment: (id, updatedSegment) => {
    set((state) => ({
      segments: state.segments.map((segment) =>
        segment.id === id ? { ...segment, ...updatedSegment } : segment
      )
    }));
  },

  deleteSegment: (id) => {
    set((state) => ({
      segments: state.segments.filter((segment) => segment.id !== id)
    }));
  }
}));

// Custom hook to get segments with proper user filtering
export const useUserSegments = () => {
  const { user } = useAuthStore();
  const { segments, addSegment, updateSegment, deleteSegment } = useMessageSegments();

  const getSegmentsByUser = () => {
    if (!user) return [];
    
    // Admin et sales_manager voient tous les segments
    if (user.role === 'admin' || user.role === 'sales_manager') {
      return segments;
    }
    
    // Team_lead et seller ne voient que leurs segments et les segments généraux
    if (user.role === 'team_lead' || user.role === 'seller') {
      return segments.filter(segment => 
        segment.createdBy === user.id || 
        segment.createdBy === 'admin' ||
        (segment.criteria.vendorId === user.id) ||
        (segment.criteria.city && user.city && segment.criteria.city.includes(user.city))
      );
    }
    
    return [];
  };

  const addSegmentWithUser = (segment: Omit<MessageSegment, 'id' | 'createdAt' | 'createdBy' | 'customerCount'>) => {
    if (!user) return;
    
    const segmentWithUser = {
      ...segment,
      createdBy: user.id
    };
    
    addSegment(segmentWithUser);
  };

  return {
    segments: getSegmentsByUser(),
    addSegment: addSegmentWithUser,
    updateSegment,
    deleteSegment
  };
};
