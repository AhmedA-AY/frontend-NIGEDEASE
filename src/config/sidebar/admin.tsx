import { paths } from '@/paths';
import {
  ChartLine as ChartLineIcon,
  Users as UsersIcon,
  Storefront as StorefrontIcon,
  Package as PackageIcon,
  ArrowsLeftRight as ArrowsLeftRightIcon,
  Money as MoneyIcon,
  FileText as FileTextIcon,
  Gear as GearIcon,
  User as UserIcon,
  ShoppingCart as ShoppingCartIcon,
  Receipt as ReceiptIcon,
  CreditCard as CreditCardIcon,
  Building as BuildingIcon,
  MagnifyingGlass as MagnifyingGlassIcon,
  ChartBar as ChartBarIcon,
} from '@phosphor-icons/react/dist/ssr';

export const adminSidebarConfig = [
  {
    title: 'Overview',
    items: [
      {
        title: 'Dashboard',
        path: paths.admin.dashboard,
        icon: <ChartLineIcon />,
      },
    ],
  },
  {
    title: 'Inventory',
    items: [
      {
        title: 'Stock',
        path: paths.admin.stock,
        icon: <PackageIcon />,
      },
      {
        title: 'Stock Transfers',
        path: paths.admin.stockTransfers,
        icon: <ArrowsLeftRightIcon />,
      },
      {
        title: 'Inventory Search',
        path: paths.admin.inventorySearch,
        icon: <MagnifyingGlassIcon />,
      },
    ],
  },
  {
    title: 'Sales',
    items: [
      {
        title: 'Sales',
        path: paths.admin.sales,
        icon: <ShoppingCartIcon />,
      },
      {
        title: 'Purchases',
        path: paths.admin.purchases,
        icon: <ReceiptIcon />,
      },
      {
        title: 'Expenses',
        path: paths.admin.expenses,
        icon: <MoneyIcon />,
      },
    ],
  },
  {
    title: 'Payments',
    items: [
      {
        title: 'Payments',
        path: paths.admin.payments,
        icon: <CreditCardIcon />,
      },
      {
        title: 'Payment Modes',
        path: paths.admin.paymentModes,
        icon: <CreditCardIcon />,
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        title: 'Users',
        path: paths.admin.users,
        icon: <UsersIcon />,
      },
      {
        title: 'Companies',
        path: paths.admin.companies,
        icon: <BuildingIcon />,
      },
      {
        title: 'Stores',
        path: paths.admin.stores,
        icon: <StorefrontIcon />,
      },
    ],
  },
  {
    title: 'Reports',
    items: [
      {
        title: 'Reports',
        path: paths.admin.reports,
        icon: <ChartBarIcon />,
      },
      {
        title: 'Predictions',
        path: paths.admin.predictions,
        icon: <ChartLineIcon />,
      },
    ],
  },
  {
    title: 'Settings',
    items: [
      {
        title: 'Profile',
        path: paths.admin.profile,
        icon: <UserIcon />,
      },
      {
        title: 'Settings',
        path: paths.admin.settings,
        icon: <GearIcon />,
      },
    ],
  },
]; 