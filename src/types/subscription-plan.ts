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
  features: string;
  is_active: boolean;
  storage_limit_gb: number;
  max_products: number;
  max_stores: number;
  max_customers: number;
  created_at: string;
  updated_at: string;
} 