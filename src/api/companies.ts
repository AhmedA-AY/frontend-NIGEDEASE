import { apiCall } from '@/utils/api-call';
import { Subscription } from '@/types/subscription';

/**
 * Get a company's subscription details
 * @param companyId - The ID of the company
 * @returns Promise with subscription details
 */
export async function getCompanySubscription(companyId: string): Promise<Subscription> {
  const response = await apiCall({
    url: `/companies/companies/${companyId}/subscription/check/`,
    method: 'GET',
  });
  return response.data;
}

/**
 * Renew a company's subscription
 * @param companyId - The ID of the company
 * @param planId - The ID of the subscription plan
 * @returns Promise with the updated subscription
 */
export async function renewCompanySubscription(companyId: string, planId: string): Promise<Subscription> {
  const response = await apiCall({
    url: `/companies/companies/${companyId}/subscription/renew/`,
    method: 'POST',
    data: { plan_id: planId },
  });
  return response.data;
}

/**
 * Cancel a company's subscription
 * @param companyId - The ID of the company
 * @returns Promise with the result of the cancellation
 */
export async function cancelCompanySubscription(companyId: string): Promise<{ success: boolean }> {
  const response = await apiCall({
    url: `/api/companies/${companyId}/subscription/cancel`,
    method: 'POST',
  });
  return response.data;
}

/**
 * Change a company's subscription plan
 * @param companyId - The ID of the company
 * @param planId - The ID of the new subscription plan
 * @returns Promise with the updated subscription
 */
export async function changeCompanySubscriptionPlan(
  companyId: string, 
  planId: string
): Promise<Subscription> {
  const response = await apiCall({
    url: `/api/companies/${companyId}/subscription/change-plan`,
    method: 'POST',
    data: { plan_id: planId },
  });
  return response.data;
} 