import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
  { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  { key: 'account', title: 'My Profile', href: paths.dashboard.account, icon: 'user' },
  { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];

export interface NavItemsConfig {
  items?: NavItemConfig[];
  subheader?: string;
}

export interface NavSearchConfig {
  placeholder?: string;
}

export const adminNavItems = [
  { key: 'admin-dashboard', title: 'Dashboard', href: paths.admin.dashboard, icon: 'chart-pie' },
  { 
    key: 'admin-product-manager', 
    title: 'Product Manager', 
    href: paths.admin.productManager, 
    icon: 'package',
    items: [
      { key: 'admin-categories', title: 'Categories', href: paths.admin.categories },
      { key: 'admin-product-units', title: 'Product Units', href: paths.admin.productUnits },
      { 
        key: 'admin-products', 
        title: 'Products', 
        href: paths.admin.products
      },
      { 
        key: 'admin-clothing', 
        title: 'Clothing', 
        href: paths.admin.clothing,
        items: [
          { key: 'admin-clothing-colors', title: 'Colors', href: paths.admin.clothingColors },
          { key: 'admin-clothing-seasons', title: 'Seasons', href: paths.admin.clothingSeasons },
          { key: 'admin-clothing-collections', title: 'Collections', href: paths.admin.clothingCollections },
        ]
      },
    ]
  },
  { key: 'admin-sales', title: 'Sales', href: paths.admin.sales, icon: 'currency-dollar' },
  { key: 'admin-purchases', title: 'Purchases', href: paths.admin.purchases, icon: 'shopping-bag' },
  { 
    key: 'admin-expenses', 
    title: 'Expenses', 
    href: paths.admin.expenses, 
    icon: 'bank',
    items: [
      { key: 'admin-expense-main', title: 'All Expenses', href: paths.admin.expenses },
      { key: 'admin-expense-categories', title: 'Categories', href: paths.admin.expenseCategories }
    ]
  },
  { 
    key: 'admin-payments', 
    title: 'Payments', 
    href: paths.admin.payments, 
    icon: 'credit-card',
    items: [
      { key: 'admin-payments-main', title: 'All Payments', href: paths.admin.payments },
      { key: 'admin-payment-modes', title: 'Payment Modes', href: paths.admin.paymentModes }
    ]
  },
  { key: 'admin-parties', title: 'Parties', href: paths.admin.parties, icon: 'users' },
  { key: 'admin-stores', title: 'Stores', href: paths.admin.stores, icon: 'storefront' },
  { key: 'admin-users', title: 'Users', href: paths.admin.users, icon: 'user-gear' },
] satisfies NavItemConfig[];

export const stockManagerNavItems = [
  { key: 'stock-manager-dashboard', title: 'Dashboard', href: paths.stockManager.dashboard, icon: 'chart-pie' },
  { key: 'stock-manager-parties', title: 'Parties', href: paths.stockManager.parties, icon: 'users' },
  { key: 'stock-manager-purchases', title: 'Purchases', href: paths.stockManager.purchases, icon: 'shopping-bag' },
  { key: 'stock-manager-expenses', title: 'Expenses', href: paths.stockManager.expenses, icon: 'bank' },
  { key: 'stock-manager-payments', title: 'Payments', href: paths.stockManager.payments, icon: 'credit-card' },
] satisfies NavItemConfig[];

export const superAdminNavItems = [
  { key: 'admin-dashboard', title: 'Dashboard', href: paths.superAdmin.dashboard, icon: 'chart-pie' },
  { key: 'admin-companies', title: 'Companies', href: paths.superAdmin.companies, icon: 'buildings' },
  { key: 'admin-subscriptions', title: 'Subscription Plans', href: paths.superAdmin.subscriptionPlans, icon: 'package' },
  { key: 'admin-currencies', title: 'Currencies', href: paths.superAdmin.currencies, icon: 'currency-dollar' },
] satisfies NavItemConfig[];

export const salesNavItems = [
  { key: 'sales-dashboard', title: 'Dashboard', href: paths.salesman.dashboard, icon: 'chart-pie' },
  { key: 'sales-parties', title: 'Parties', href: paths.salesman.parties, icon: 'users' },
  { key: 'sales-sales', title: 'Sales', href: paths.salesman.sales, icon: 'currency-dollar' },
  { key: 'sales-expenses', title: 'Expenses', href: paths.salesman.expenses, icon: 'bank' },
] satisfies NavItemConfig[];
