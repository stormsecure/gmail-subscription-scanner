export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface Subscription {
  id: string;
  user_id?: string;
  name: string;
  vendor: string;
  email: string;
  amount: number;
  cost?: number;
  currency?: string;
  billing_interval: BillingInterval;
  billingCycle?: 'monthly' | 'annual' | 'weekly' | 'daily';
  next_billing_date: string;
  nextBilling?: Date;
  category?: string;
  unsubscribeLink?: string;
  status: SubscriptionStatus;
  lastEmailDate?: Date;
  created_at?: string;
  updated_at?: string;
}

export interface EmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  from: string;
  subject: string;
  date: Date;
  body?: string;
  unsubscribeLink?: string;
}

export interface ScanResult {
  subscriptions: Subscription[];
  totalFound: number;
  estimatedMonthlyCost: number;
  scanDate: Date;
  job_id?: string;
  status?: JobStatus;
  emails_processed?: number;
  subscriptions_found?: number;
  error_message?: string;
}

export interface EmailScanJob {
  id: string;
  status: JobStatus;
  progress: number;
  totalEmails: number;
  processedEmails: number;
  foundSubscriptions: Subscription[];
  error?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  token?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token?: string;
  signIn: () => Promise<void>;
  signOut: () => void;
  handleCallback: (code: string) => Promise<void>;
}

export interface CreateSubscriptionRequest {
  name: string;
  vendor: string;
  amount: number;
  billing_interval: BillingInterval;
  next_billing_date: string;
  category?: string;
  status: SubscriptionStatus;
}

export interface UpdateSubscriptionRequest {
  name?: string;
  vendor?: string;
  amount?: number;
  billing_interval?: BillingInterval;
  next_billing_date?: string;
  category?: string;
  status?: SubscriptionStatus;
}

export interface DashboardStats {
  totalSubscriptions: number;
  monthlyTotal: number;
  yearlyTotal: number;
  avgPerSubscription: number;
  upcomingRenewals: number;
}

export interface SubscriptionWithDaysToRenewal extends Subscription {
  daysToRenewal: number;
}

export enum SubscriptionCategory {
  STREAMING = 'streaming',
  SOFTWARE = 'software',
  NEWS = 'news',
  SHOPPING = 'shopping',
  FINANCE = 'finance',
  EDUCATION = 'education',
  HEALTH = 'health',
  OTHER = 'other'
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  PENDING = 'pending'
}

export enum BillingInterval {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  WEEKLY = 'weekly',
  DAILY = 'daily'
}

export enum JobStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed'
}