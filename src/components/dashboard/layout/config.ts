import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
  { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];

export const adminNavItems = [
  { key: 'admin-dashboard', title: 'Dashboard', href: paths.admin.dashboard, icon: 'chart-pie' },
  { key: 'admin-product-manager', title: 'Product Manager', href: paths.admin.productManager, icon: 'package' },
  { key: 'admin-sales', title: 'Sales', href: paths.admin.sales, icon: 'currency-dollar' },
  { key: 'admin-purchases', title: 'Purchases', href: paths.admin.purchases, icon: 'shopping-bag' },
  { key: 'admin-expenses', title: 'Expenses', href: paths.admin.expenses, icon: 'bank' },
  { key: 'admin-payments', title: 'Payments', href: paths.admin.payments, icon: 'credit-card' },
  { key: 'admin-parties', title: 'Parties', href: paths.admin.parties, icon: 'users' },
] satisfies NavItemConfig[];

export const stockManagerNavItems = [
  { key: 'stockmanager-dashboard', title: 'Dashboard', href: paths.stockManager.dashboard, icon: 'chart-pie' },
  { key: 'stockmanager-parties', title: 'Parties', href: paths.stockManager.parties, icon: 'users' },
  { 
    key: 'stockmanager-purchases', 
    title: 'Purchases', 
    href: paths.stockManager.purchases, 
    icon: 'shopping-bag',
    items: [
      { key: 'stockmanager-purchases-list', title: 'Purchases List', href: paths.stockManager.purchases },
      { key: 'stockmanager-purchases-payment-out', title: 'Payment Out', href: paths.stockManager.purchases + '/payment-out' }
    ]
  },
  { key: 'stockmanager-expenses', title: 'Expenses', href: paths.stockManager.expenses, icon: 'bank' },
  { key: 'stockmanager-reports', title: 'Reports', href: paths.stockManager.reports, icon: 'chart-line-up' },
] satisfies NavItemConfig[];

export const superAdminNavItems = [
  { key: 'admin-dashboard', title: 'Dashboard', href: paths.superAdmin.dashboard, icon: 'chart-pie' },
  { key: 'admin-companies', title: 'Companies', href: paths.superAdmin.companies, icon: 'buildings' },
  { key: 'admin-subscriptions', title: 'Subscription Plans', href: paths.superAdmin.subscriptionPlans, icon: 'package' },
  { key: 'admin-currencies', title: 'Currencies', href: paths.superAdmin.currencies, icon: 'currency-dollar' },
] satisfies NavItemConfig[];

export const salesmanNavItems = [
  { key: 'salesman-dashboard', title: 'Dashboard', href: paths.salesman.dashboard, icon: 'chart-pie' },
  { key: 'salesman-parties', title: 'Parties', href: paths.salesman.parties, icon: 'users' },
  { 
    key: 'salesman-sales', 
    title: 'Sales', 
    href: paths.salesman.sales, 
    icon: 'currency-dollar',
    items: [
      { key: 'salesman-sales-list', title: 'Sales List', href: paths.salesman.sales },
      { key: 'salesman-sales-payment-in', title: 'Payment In', href: paths.salesman.paymentIn }
    ]
  },
  { key: 'salesman-expenses', title: 'Expenses', href: paths.salesman.expenses, icon: 'bank' },
  { key: 'salesman-reports', title: 'Reports', href: paths.salesman.reports, icon: 'chart-line-up' },
] satisfies NavItemConfig[];
