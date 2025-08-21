import { User, Subscription, ScanResult, SubscriptionStatus, BillingInterval } from '@/types';

export async function authenticateWithGoogle(_accessToken: string): Promise<User> {
  // For demo purposes, return a mock user
  return {
    id: 'demo-user',
    email: 'demo@example.com',
    name: 'Demo User',
    picture: 'https://via.placeholder.com/40'
  };
}

export async function scanGmailForSubscriptions(_query: string = '', _limit: number = 100): Promise<ScanResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock subscription data
  const mockSubscriptions: Subscription[] = [
    {
      id: '1',
      name: 'Netflix',
      vendor: 'Netflix',
      email: 'billing@netflix.com',
      amount: 15.99,
      currency: 'USD',
      billing_interval: BillingInterval.MONTHLY,
      next_billing_date: '2024-09-15',
      category: 'streaming',
      status: SubscriptionStatus.ACTIVE,
      lastEmailDate: new Date('2024-08-15')
    },
    {
      id: '2',
      name: 'Spotify Premium',
      vendor: 'Spotify',
      email: 'noreply@spotify.com',
      amount: 9.99,
      currency: 'USD',
      billing_interval: BillingInterval.MONTHLY,
      next_billing_date: '2024-09-20',
      category: 'streaming',
      status: SubscriptionStatus.ACTIVE,
      lastEmailDate: new Date('2024-08-20')
    },
    {
      id: '3',
      name: 'Adobe Creative Cloud',
      vendor: 'Adobe',
      email: 'adobe@adobe.com',
      amount: 52.99,
      currency: 'USD',
      billing_interval: BillingInterval.MONTHLY,
      next_billing_date: '2024-09-10',
      category: 'software',
      status: SubscriptionStatus.ACTIVE,
      lastEmailDate: new Date('2024-08-10')
    },
    {
      id: '4',
      name: 'GitHub Pro',
      vendor: 'GitHub',
      email: 'noreply@github.com',
      amount: 4.00,
      currency: 'USD',
      billing_interval: BillingInterval.MONTHLY,
      next_billing_date: '2024-09-25',
      category: 'software',
      status: SubscriptionStatus.ACTIVE,
      lastEmailDate: new Date('2024-08-25')
    },
    {
      id: '5',
      name: 'The New York Times',
      vendor: 'NYTimes',
      email: 'help@nytimes.com',
      amount: 17.00,
      currency: 'USD',
      billing_interval: BillingInterval.MONTHLY,
      next_billing_date: '2024-09-05',
      category: 'news',
      status: SubscriptionStatus.ACTIVE,
      lastEmailDate: new Date('2024-08-05')
    }
  ];

  const totalMonthlyCost = mockSubscriptions.reduce((sum, sub) => {
    switch (sub.billing_interval) {
      case BillingInterval.MONTHLY:
        return sum + sub.amount;
      case BillingInterval.YEARLY:
        return sum + (sub.amount / 12);
      case BillingInterval.WEEKLY:
        return sum + (sub.amount * 4.33);
      default:
        return sum + sub.amount;
    }
  }, 0);

  return {
    subscriptions: mockSubscriptions,
    totalFound: mockSubscriptions.length,
    estimatedMonthlyCost: totalMonthlyCost,
    scanDate: new Date()
  };
}

export async function getGmailMessages(_query: string = '', _maxResults: number = 10) {
  // Mock Gmail messages for demo
  return {
    messages: [
      {
        id: '1',
        threadId: 'thread-1',
        snippet: 'Your Netflix subscription has been renewed...',
        from: 'billing@netflix.com',
        subject: 'Netflix - Payment Receipt',
        date: new Date('2024-08-15'),
        unsubscribeLink: 'https://netflix.com/unsubscribe'
      },
      {
        id: '2',
        threadId: 'thread-2',
        snippet: 'Thank you for your Spotify Premium subscription...',
        from: 'noreply@spotify.com',
        subject: 'Your Spotify Premium Receipt',
        date: new Date('2024-08-20'),
        unsubscribeLink: 'https://spotify.com/account/subscription'
      }
    ],
    resultSizeEstimate: 2,
    nextPageToken: null
  };
}