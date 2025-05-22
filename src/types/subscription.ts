/**
 * Subscription status types
 */
export type SubscriptionStatus = 'active' | 'expired' | 'canceled' | 'pending';

/**
 * Subscription interface
 */
export interface Subscription {
  id: string;
  company_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  start_date: string;
  expiry_date: string;
  is_auto_renew: boolean;
  payment_reference?: string;
  created_at: string;
  updated_at: string;
} 