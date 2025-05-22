import { apiCall } from '@/utils/api-call';
import { SubscriptionPlan } from '@/types/subscription-plan';

/**
 * Get all subscription plans
 * @returns Promise with array of subscription plans
 */
export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const response = await apiCall({
    url: '/companies/subscription-plans/',
    method: 'GET',
  });
  return response.data;
}

/**
 * Get a specific subscription plan by ID
 * @param planId - The ID of the subscription plan
 * @returns Promise with subscription plan details
 */
export async function getSubscriptionPlan(planId: string): Promise<SubscriptionPlan> {
  const response = await apiCall({
    url: `/companies/subscription-plans/${planId}/`,
    method: 'GET',
  });
  return response.data;
} 