import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Subscription,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  DashboardStats,
  SubscriptionWithDaysToRenewal,
  BillingInterval,
  SubscriptionStatus
} from '@/types';

export function useSubscriptions() {
  const { token } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demo purposes
  const mockSubscriptions: Subscription[] = [
    {
      id: '1',
      user_id: 'user-1',
      name: 'Netflix',
      vendor: 'Netflix',
      email: 'netflix@example.com',
      amount: 15.99,
      currency: 'USD',
      billing_interval: BillingInterval.MONTHLY,
      next_billing_date: '2024-09-15',
      category: 'streaming',
      status: SubscriptionStatus.ACTIVE,
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      user_id: 'user-1',
      name: 'Spotify Premium',
      vendor: 'Spotify',
      email: 'spotify@example.com',
      amount: 9.99,
      currency: 'USD',
      billing_interval: BillingInterval.MONTHLY,
      next_billing_date: '2024-09-20',
      category: 'streaming',
      status: SubscriptionStatus.ACTIVE,
      created_at: '2024-02-01T00:00:00Z'
    },
    {
      id: '3',
      user_id: 'user-1',
      name: 'Adobe Creative Suite',
      vendor: 'Adobe',
      email: 'adobe@example.com',
      amount: 52.99,
      currency: 'USD',
      billing_interval: BillingInterval.MONTHLY,
      next_billing_date: '2024-09-10',
      category: 'software',
      status: SubscriptionStatus.ACTIVE,
      created_at: '2024-03-01T00:00:00Z'
    }
  ];

  const createSubscription = async (data: CreateSubscriptionRequest): Promise<Subscription> => {
    setIsLoading(true);
    try {
      const newSubscription: Subscription = {
        id: Date.now().toString(),
        user_id: 'user-1',
        email: `${data.vendor.toLowerCase()}@example.com`,
        ...data
      };
      
      setSubscriptions(prev => [...prev, newSubscription]);
      return newSubscription;
    } catch (err) {
      setError('Failed to create subscription');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubscription = async (id: string, data: UpdateSubscriptionRequest): Promise<Subscription> => {
    setIsLoading(true);
    try {
      const updatedSubscription = subscriptions.find(sub => sub.id === id);
      if (!updatedSubscription) {
        throw new Error('Subscription not found');
      }

      const updated = { ...updatedSubscription, ...data };
      setSubscriptions(prev => prev.map(sub => sub.id === id ? updated : sub));
      return updated;
    } catch (err) {
      setError('Failed to update subscription');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSubscription = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      setSubscriptions(prev => prev.filter(sub => sub.id !== id));
    } catch (err) {
      setError('Failed to delete subscription');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getSubscriptionById = (id: string): Subscription | undefined => {
    return subscriptions.find(sub => sub.id === id);
  };

  const getSubscriptionsByStatus = (status: SubscriptionStatus): Subscription[] => {
    return subscriptions.filter(sub => sub.status === status);
  };

  const getSubscriptionsByCategory = (category: string): Subscription[] => {
    return subscriptions.filter(sub => sub.category === category);
  };

  const calculateDashboardStats = (): DashboardStats => {
    const activeSubscriptions = getSubscriptionsByStatus(SubscriptionStatus.ACTIVE);
    
    const monthlyTotal = activeSubscriptions.reduce((sum, sub) => {
      const amount = sub.amount || 0;
      switch (sub.billing_interval) {
        case BillingInterval.MONTHLY:
          return sum + amount;
        case BillingInterval.YEARLY:
          return sum + (amount / 12);
        case BillingInterval.WEEKLY:
          return sum + (amount * 4.33);
        default:
          return sum + amount;
      }
    }, 0);

    const yearlyTotal = monthlyTotal * 12;
    const avgPerSubscription = activeSubscriptions.length > 0 ? monthlyTotal / activeSubscriptions.length : 0;
    
    // Calculate upcoming renewals (next 7 days)
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const upcomingRenewals = activeSubscriptions.filter(sub => {
      const renewalDate = new Date(sub.next_billing_date);
      return renewalDate >= now && renewalDate <= nextWeek;
    }).length;

    return {
      totalSubscriptions: activeSubscriptions.length,
      monthlyTotal,
      yearlyTotal,
      avgPerSubscription,
      upcomingRenewals
    };
  };

  const getSubscriptionsWithDaysToRenewal = (): SubscriptionWithDaysToRenewal[] => {
    const now = new Date();
    
    return subscriptions.map(sub => {
      const renewalDate = new Date(sub.next_billing_date);
      const timeDiff = renewalDate.getTime() - now.getTime();
      const daysToRenewal = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      return {
        ...sub,
        daysToRenewal
      };
    });
  };

  const refreshSubscriptions = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from an API
      // For demo, we'll use mock data
      setSubscriptions(mockSubscriptions);
    } catch (err) {
      setError('Failed to refresh subscriptions');
    } finally {
      setIsLoading(false);
    }
  };

  // Load mock data on mount
  useEffect(() => {
    if (token) {
      refreshSubscriptions();
    }
  }, [token]);

  return {
    subscriptions,
    isLoading,
    error,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    getSubscriptionById,
    getSubscriptionsByStatus,
    getSubscriptionsByCategory,
    calculateDashboardStats,
    getSubscriptionsWithDaysToRenewal,
    refreshSubscriptions,
    clearError: () => setError(null)
  };
}