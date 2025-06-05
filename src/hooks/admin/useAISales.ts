
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AICustomerScore, AISalesAction, AIAnalytics } from './ai-sales/types';
import { calculateAdvancedEngagementScore, calculatePurchaseProbability, determineTrend, calculateOptimalContactDate } from './ai-sales/customerScoring';
import { calculateAnalytics } from './ai-sales/analyticsCalculator';
import { determineOptimalAction, calculateOptimalSendTime } from './ai-sales/actionGenerator';
import { generateAdvancedWhatsAppMessage } from './ai-sales/messageGenerator';

// Mock data generators
const generateMockCustomers = (): any[] => {
  const customers = [];
  const names = ['Marie Dubois', 'Jean Martin', 'Sophie Laurent', 'Pierre Moreau', 'Emma Bernard'];
  const cities = ['Brazzaville', 'Pointe-Noire'];
  const categories = ['Electronics', 'Beauté', 'Habillements', 'Cuisine', 'Sport'];

  for (let i = 0; i < 50; i++) {
    customers.push({
      id: `customer_${i + 1}`,
      name: names[Math.floor(Math.random() * names.length)],
      phone: `+242 ${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
      city: cities[Math.floor(Math.random() * cities.length)],
      total_spent: Math.floor(Math.random() * 200000) + 5000,
      order_count: Math.floor(Math.random() * 15) + 1,
      last_order_date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      preferred_categories: [categories[Math.floor(Math.random() * categories.length)]],
      last_activity_days: Math.floor(Math.random() * 200)
    });
  }

  return customers;
};

const generateMockProducts = (): any[] => {
  return [
    {
      id: 'prod_1',
      name: 'Smartphone Premium',
      price: 150000,
      promo_price: 120000,
      category: 'Electronics',
      images: ['https://picsum.photos/400/400?random=1'],
      is_flash_offer: true
    },
    {
      id: 'prod_2',
      name: 'Casque Audio Bluetooth',
      price: 35000,
      category: 'Electronics',
      images: ['https://picsum.photos/400/400?random=2']
    },
    {
      id: 'prod_3',
      name: 'Robe Élégante',
      price: 25000,
      category: 'Habillements',
      images: ['https://picsum.photos/400/400?random=3']
    }
  ];
};

export const useAISales = () => {
  const [customerScores, setCustomerScores] = useState<AICustomerScore[]>([]);
  const [salesActions, setSalesActions] = useState<AISalesAction[]>([]);
  const [analytics, setAnalytics] = useState<AIAnalytics | null>(null);
  const [isGeneratingActions, setIsGeneratingActions] = useState(false);
  
  const queryClient = useQueryClient();

  // Fetch customers data
  const { data: customersData = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['ai-customers'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return generateMockCustomers();
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch products data
  const { data: productsData = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['ai-products'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return generateMockProducts();
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch sales actions
  const { data: actionsData = [], isLoading: isLoadingActions } = useQuery({
    queryKey: ['ai-sales-actions'],
    queryFn: async () => {
      // Simulate API call - get existing actions
      const existingActions = localStorage.getItem('aiSalesActions');
      return existingActions ? JSON.parse(existingActions) : [];
    },
    staleTime: 2 * 60 * 1000,
  });

  const isLoading = isLoadingCustomers || isLoadingProducts || isLoadingActions;

  // Process customer scores
  useEffect(() => {
    const processCustomerScores = async () => {
      if (customersData.length === 0) return;

      const scores: AICustomerScore[] = [];

      for (const customer of customersData) {
        const engagementScore = await calculateAdvancedEngagementScore(customer);
        const purchaseProbability = calculatePurchaseProbability(customer, engagementScore);
        const trend = determineTrend(customer);
        const nextContactDate = calculateOptimalContactDate(customer, engagementScore);

        scores.push({
          id: customer.id,
          customer_id: customer.id,
          customer_name: customer.name,
          customer_phone: customer.phone,
          customer_city: customer.city,
          engagement_score: engagementScore,
          purchase_probability: purchaseProbability,
          last_activity_days: customer.last_activity_days,
          total_spent: customer.total_spent,
          order_frequency: customer.order_count,
          preferred_categories: customer.preferred_categories || [],
          trend,
          next_contact_date: nextContactDate
        });
      }

      scores.sort((a, b) => b.engagement_score - a.engagement_score);
      setCustomerScores(scores);
    };

    processCustomerScores();
  }, [customersData]);

  // Process analytics
  useEffect(() => {
    const processAnalytics = async () => {
      if (customerScores.length === 0) return;

      const analyticsData = await calculateAnalytics(customerScores, salesActions);
      setAnalytics(analyticsData);
    };

    processAnalytics();
  }, [customerScores, salesActions]);

  // Load existing sales actions
  useEffect(() => {
    setSalesActions(actionsData);
  }, [actionsData]);

  // Generate AI actions
  const generateActionsMutation = useMutation({
    mutationFn: async () => {
      setIsGeneratingActions(true);
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newActions: AISalesAction[] = [];
      const currentWeek = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));

      // Filter customers who haven't received actions this week
      const eligibleCustomers = customerScores.filter(customer => {
        const existingActionsThisWeek = salesActions.filter(action => 
          action.customer_id === customer.customer_id && 
          action.week_number === currentWeek &&
          action.status !== 'declined'
        );
        return existingActionsThisWeek.length < 3; // Max 3 actions per customer per week
      });

      // Generate actions for top customers
      const topCustomers = eligibleCustomers
        .sort((a, b) => b.engagement_score - a.engagement_score)
        .slice(0, 20);

      for (const customer of topCustomers) {
        const actionDetails = determineOptimalAction(customer, productsData);
        
        const action: AISalesAction = {
          id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          customer_id: customer.customer_id,
          customer_name: customer.customer_name,
          customer_phone: customer.customer_phone,
          action_type: actionDetails.type,
          priority_score: customer.engagement_score,
          recommended_products: actionDetails.products,
          message_template: generateAdvancedWhatsAppMessage(customer, actionDetails),
          status: 'pending',
          expected_revenue: actionDetails.expectedRevenue,
          confidence_level: actionDetails.confidence,
          ai_reasoning: actionDetails.reasoning,
          week_number: currentWeek,
          year: new Date().getFullYear(),
          created_at: new Date().toISOString(),
          optimal_send_time: calculateOptimalSendTime(customer),
          success_probability: customer.purchase_probability
        };

        newActions.push(action);
      }

      return newActions;
    },
    onSuccess: (newActions) => {
      const updatedActions = [...salesActions, ...newActions];
      setSalesActions(updatedActions);
      
      // Save to localStorage
      localStorage.setItem('aiSalesActions', JSON.stringify(updatedActions));
      
      toast.success(`${newActions.length} nouvelles actions IA générées avec succès !`);
      queryClient.invalidateQueries({ queryKey: ['ai-sales-actions'] });
    },
    onError: (error) => {
      console.error('Error generating AI actions:', error);
      toast.error('Erreur lors de la génération des actions IA');
    },
    onSettled: () => {
      setIsGeneratingActions(false);
    }
  });

  // Execute action
  const executeActionMutation = useMutation({
    mutationFn: async (actionId: string) => {
      const action = salesActions.find(a => a.id === actionId);
      if (!action) throw new Error('Action not found');

      // Simulate WhatsApp message sending
      await new Promise(resolve => setTimeout(resolve, 1000));

      return actionId;
    },
    onSuccess: (actionId) => {
      const updatedActions = salesActions.map(action =>
        action.id === actionId
          ? { ...action, status: 'executed' as const }
          : action
      );
      setSalesActions(updatedActions);
      localStorage.setItem('aiSalesActions', JSON.stringify(updatedActions));
      
      toast.success('Message WhatsApp envoyé avec succès !');
      queryClient.invalidateQueries({ queryKey: ['ai-sales-actions'] });
    },
    onError: (error) => {
      console.error('Error executing action:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
  });

  // Decline action
  const declineActionMutation = useMutation({
    mutationFn: async (actionId: string) => {
      const action = salesActions.find(a => a.id === actionId);
      if (!action) throw new Error('Action not found');

      return actionId;
    },
    onSuccess: (actionId) => {
      const updatedActions = salesActions.map(action =>
        action.id === actionId
          ? { ...action, status: 'declined' as const }
          : action
      );
      setSalesActions(updatedActions);
      localStorage.setItem('aiSalesActions', JSON.stringify(updatedActions));
      
      toast.info('Action refusée');
      queryClient.invalidateQueries({ queryKey: ['ai-sales-actions'] });
    },
    onError: (error) => {
      console.error('Error declining action:', error);
      toast.error('Erreur lors du refus de l\'action');
    }
  });

  // Refresh data
  const refreshData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['ai-customers'] });
    queryClient.invalidateQueries({ queryKey: ['ai-products'] });
    queryClient.invalidateQueries({ queryKey: ['ai-sales-actions'] });
    toast.success('Données actualisées');
  }, [queryClient]);

  return {
    customerScores,
    salesActions,
    analytics,
    isLoading,
    isGeneratingActions,
    generateAIActions: generateActionsMutation.mutate,
    executeAction: executeActionMutation.mutate,
    declineAction: declineActionMutation.mutate,
    refreshData
  };
};
