import { SubscriptionPlan } from '@/contexts/admin-context';

export const mapSubscriptionPlanToFormState = (plan: SubscriptionPlan) => {
  return {
    id: plan.id,
    name: plan.name,
    monthlyPrice: `$${parseFloat(plan.monthlyPrice).toFixed(2)}`,
    annualPrice: `$${parseFloat(plan.annualPrice).toFixed(2)}`,
    maxProducts: plan.maxProducts,
    modules: plan.modules,
  };
};

export const mapFormStateToSubscriptionPlan = (formState: any) => {
  return {
    name: formState.name,
    description: formState.description || 'Default description',
    price: parseFloat(formState.monthlyPrice.replace('$', '')), // Assuming monthly price is used as the main price
    billing_cycle: 'monthly', // Default to monthly for now
    features: formState.modules.join(', '),
    is_active: true, // Default to active
    storage_limit_gb: 100, // Default storage limit
  };
};