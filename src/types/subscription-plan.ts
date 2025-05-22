/**
 * Billing cycle types
 */
export type BillingCycle = 'monthly' | 'quarterly' | 'biannual' | 'annual';

/**
 * Subscription plan interface
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  billing_cycle: BillingCycle;
  duration_in_months: number;
  max_products: number;
  max_stores: number;
  max_users: number;
  max_customers: number;
  storage_limit: number;
  is_active: boolean;
  features: string[];
  created_at: string;
  updated_at: string;
} 