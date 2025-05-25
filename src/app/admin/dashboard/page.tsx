'use client';

import React, { useState, useEffect } from 'react';
import { Box, Card, CardHeader, Container, Grid, Stack, Typography, Button, Paper } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import { ApexOptions } from 'apexcharts';
import RefreshIcon from '@mui/icons-material/Refresh';
import { format as formatDate, subDays, subMonths } from 'date-fns';
import { useTranslation } from 'react-i18next';

import DynamicApexChart from '@/components/dynamic-apex-chart';
import { TopSellingProduct, RecentSale, StockAlert, TopCustomer } from '@/services/api/dashboard';
import { TopSellingProducts } from '@/components/dashboard/overview/top-selling-products';
import { RecentSales } from '@/components/dashboard/overview/recent-sales';
import { StockAlerts } from '@/components/dashboard/overview/stock-alerts';
import { TopCustomers } from '@/components/dashboard/overview/top-customers';
import { useCurrentUser } from '@/hooks/use-auth';
import { useStore, STORE_CHANGED_EVENT } from '@/providers/store-provider';
import { transactionsApi } from '@/services/api/transactions';
import { financialsApi } from '@/services/api/financials';
import { inventoryApi, Product, Inventory } from '@/services/api/inventory';
import { useDashboardData, DashboardPeriod } from '@/hooks/admin/use-dashboard';

// Import the @phosphor-icons
import { Storefront } from '@phosphor-icons/react/dist/ssr/Storefront';

export default function AdminDashboardPage() {
  const { t, i18n } = useTranslation('admin');
  const { userInfo } = useCurrentUser();
  const { currentStore, stores } = useStore();
  const [selectedPeriod, setSelectedPeriod] = useState<DashboardPeriod>('month');
  const [isDebugVisible, setIsDebugVisible] = useState(false);
  
  // Debug information
  const isDevMode = process.env.NODE_ENV === 'development';
  
  // Use the new TanStack Query hook
  const { 
    data: dashboardData, 
    isLoading, 
    error, 
    refetch,
    dataUpdatedAt 
  } = useDashboardData(currentStore?.id, selectedPeriod);

  // For debugging - log translation key values
  useEffect(() => {
    if (isDevMode) {
      console.log('Current language:', i18n.language);
      console.log('Translation key values:');
      console.log('dashboard.overview =', t('dashboard.overview'));
      console.log('dashboard.stats.total_sales =', t('dashboard.stats.total_sales'));
      console.log('dashboard.stats.total_expenses =', t('dashboard.stats.total_expenses'));
      console.log('dashboard.stats.payment_received =', t('dashboard.stats.payment_received'));
      console.log('dashboard.stats.total_customers =', t('dashboard.stats.total_customers'));
      console.log('dashboard.charts.sales_vs_expenses =', t('dashboard.charts.sales_vs_expenses'));
      
      // Check if the admin namespace is loaded
      console.log('Is admin namespace loaded:', i18n.hasResourceBundle(i18n.language, 'admin'));
      console.log('Available namespaces:', Object.keys(i18n.services.resourceStore.data[i18n.language] || {}));
      
      // Check if specific keys exist in the resources
      const adminResources = i18n.getResourceBundle(i18n.language, 'admin');
      console.log('Admin resources:', adminResources);
      
      if (adminResources) {
        console.log('Has dashboard key:', 'dashboard' in adminResources);
        if ('dashboard' in adminResources) {
          const dashboardRes = adminResources.dashboard;
          console.log('Dashboard resources:', dashboardRes);
          console.log('Has overview key:', 'overview' in dashboardRes);
          console.log('Has stats key:', 'stats' in dashboardRes);
        }
      }
      
      // Try to manually force loading the namespace if it's not loaded
      if (!i18n.hasResourceBundle(i18n.language, 'admin')) {
        console.log('Attempting to load admin namespace...');
        i18n.loadNamespaces('admin').then(() => {
          console.log('Admin namespace loaded successfully');
        }).catch(err => {
          console.error('Error loading admin namespace:', err);
        });
      }
    }
  }, [t, i18n, isDevMode]);

  // Helper function to safely get translations with fallbacks
  const safeTranslate = (key: string, fallback: string): string => {
    // First try to get the translation directly
    const result = t(key);
    
    // If we're using a non-English language, show more detailed debugging
    if (isDevMode && i18n.language !== 'en') {
      console.log(`Translating [${key}] in language [${i18n.language}]:`, result);
      console.log('Has resource bundle:', i18n.hasResourceBundle(i18n.language, 'admin'));
      
      // Try to inspect the resource directly
      const resourceBundle = i18n.getResourceBundle(i18n.language, 'admin');
      if (resourceBundle) {
        // Get nested keys
        const keys = key.split('.');
        let value = resourceBundle;
        for (const k of keys) {
          value = value?.[k];
          if (!value) break;
        }
        console.log('Direct resource lookup:', value);
      }
    }
    
    // If the result is the same as the key, it means translation failed
    if (result === key) {
      return fallback;
    }
    
    return result;
  };

  const handlePeriodChange = (period: DashboardPeriod) => {
    setSelectedPeriod(period);
  };

  const handleRetry = () => {
    refetch();
  };
  
  const toggleDebug = () => {
    setIsDebugVisible(!isDebugVisible);
  };

  // Create the options for the charts
  const dailySalesChartOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false,
      },
    },
    colors: ['#2979ff', '#ff9800'],
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: '#eeeeee',
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      lineCap: 'square',
    },
    theme: {
      mode: 'light',
    },
    tooltip: {
      theme: 'light',
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: true,
      },
      categories: dashboardData?.dailySales.map((item: any) => item.day) || [],
      labels: {
        style: {
          colors: '#637381',
        },
      },
    },
    yaxis: [{
      labels: {
        formatter: (value: number) => `$${value.toFixed(0)}`,
        style: {
          colors: '#637381',
        },
      },
    }],
  } as ApexOptions;

  // Create the chart series based on the data
  const dailySalesChartSeries = [
    {
      name: safeTranslate('dashboard.charts.sales', 'Sales'),
      data: dashboardData?.dailySales.map((item: any) => item.sales) || [],
    },
    {
      name: safeTranslate('dashboard.charts.expenses', 'Expenses'),
      data: dashboardData?.dailySales.map((item: any) => item.expenses) || [],
    },
  ];

  if (isLoading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            {safeTranslate('dashboard.loading', 'Loading dashboard data...')}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <Box sx={{ position: 'relative' }}>
              <RefreshIcon 
                fontSize="large" 
                sx={{ 
                  animation: 'spin 2s linear infinite',
                  color: 'primary.main',
                  fontSize: 48
                }} 
              />
            </Box>
          </Box>
      </Box>
        <style jsx global>{`
          @keyframes spin {
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom color="error">
            {safeTranslate('dashboard.error', 'Error Loading Dashboard')}
          </Typography>
          <Paper sx={{ p: 3, mb: 3, bgcolor: '#fff8f8', color: 'error.main' }}>
            <Typography variant="body1" paragraph>
              {error instanceof Error ? error.message : safeTranslate('dashboard.error_message', 'Failed to load dashboard data. Please try again.')}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
                color="primary" 
                startIcon={<RefreshIcon />}
            onClick={handleRetry}
          >
            {safeTranslate('dashboard.retry', 'Retry')}
          </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  if (!currentStore) {
  return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
              {safeTranslate('dashboard.no_store', 'No Store Selected')}
            </Typography>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="body1" paragraph>
              {safeTranslate('dashboard.no_store_message', 'Please select a store from the dropdown menu to view the dashboard.')}
            </Typography>
          </Paper>
          </Box>
      </Container>
    );
  }

  // Destructure dash data for cleaner usage below
  const {
    totalSales,
    totalExpenses,
    totalCustomers,
    salesGrowth,
    paymentReceived,
    paymentSent,
    topSellingProducts,
    recentSales,
    stockAlerts,
    topCustomers
  } = dashboardData || {};

  // Format values for display
  const formattedTotalSales = totalSales ? `$${totalSales.toFixed(2)}` : '$0.00';
  const formattedTotalExpenses = totalExpenses ? `$${totalExpenses.toFixed(2)}` : '$0.00';
  const formattedPaymentReceived = paymentReceived ? `$${paymentReceived.toFixed(2)}` : '$0.00';
  const formattedTotalCustomers = totalCustomers ? totalCustomers.toString() : '0';

  // Calculate growth percentages
  const salesGrowthFormatted = salesGrowth ? `${salesGrowth >= 0 ? '+' : ''}${salesGrowth.toFixed(1)}%` : '0%';
  const expensesChangePercentage = totalExpenses && totalSales 
    ? `${((totalExpenses / (totalSales || 1)) * 100).toFixed(1)}%` 
    : '0%';
  const paymentsChangePercentage = paymentReceived && totalSales 
    ? `${((paymentReceived / (totalSales || 1)) * 100).toFixed(1)}%` 
    : '0%';
  const customersChangePercentage = totalCustomers ? '+NEW' : '0%';

  return (
    <Box component="main" sx={{ flexGrow: 1, py: { xs: 2, sm: 4 } }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: { xs: 2, sm: 4 } }}>
          <Grid container justifyContent="space-between" spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                {safeTranslate('dashboard.overview', 'Admin Overview')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack 
                direction={{ xs: 'row', sm: 'row' }} 
                spacing={1} 
                sx={{ 
                  justifyContent: { xs: 'center', sm: 'flex-end' },
                  mb: { xs: 1, sm: 0 } 
                }}
              >
                {['today', 'week', 'month', 'year'].map((period) => (
                  <Button
                    key={period}
                    variant={selectedPeriod === period ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => handlePeriodChange(period as DashboardPeriod)}
                    sx={{ 
                      minWidth: 'auto',
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      textTransform: 'capitalize'
                    }}
                  >
                    {safeTranslate(`dashboard.filter_periods.${period}`, period)}
                  </Button>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Main Stats */}
        <Grid container spacing={3} sx={{ mb: { xs: 2, sm: 4 } }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title={safeTranslate('dashboard.stats.total_sales', 'Total Sales')}
              value={formattedTotalSales}
              change={salesGrowthFormatted}
              positive={salesGrowth ? salesGrowth >= 0 : true}
              icon={<TrendingUpIcon sx={{ fontSize: 30, color: '#2979ff' }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title={safeTranslate('dashboard.stats.total_expenses', 'Total Expenses')}
              value={formattedTotalExpenses}
              change={expensesChangePercentage}
              positive={false}
              icon={<TrendingDownIcon sx={{ fontSize: 30, color: '#ff9800' }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title={safeTranslate('dashboard.stats.payment_received', 'Payment Received')}
              value={formattedPaymentReceived}
              change={paymentsChangePercentage}
              positive={true}
              icon={<ReceiptIcon sx={{ fontSize: 30, color: '#4caf50' }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              title={safeTranslate('dashboard.stats.total_customers', 'Total Customers')}
              value={formattedTotalCustomers}
              change={customersChangePercentage}
              positive={true}
              icon={<PeopleIcon sx={{ fontSize: 30, color: '#f44336' }} />}
            />
          </Grid>
        </Grid>

        {/* Sales vs Expenses Chart */}
        <Card sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 4 } }}>
          <CardHeader
            title={safeTranslate('dashboard.charts.sales_vs_expenses', 'Sales vs Expenses')}
            sx={{ p: 0, mb: 2 }}
            titleTypographyProps={{ variant: 'h6' }}
          />
          <Box sx={{ p: 2, height: 350 }}>
            <DynamicApexChart 
              options={dailySalesChartOptions}
              series={dailySalesChartSeries}
              type="line"
              height={350}
            />
          </Box>
        </Card>

        {/* Overview Sections */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TopSellingProducts 
              products={topSellingProducts || []} 
              t={t} 
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <RecentSales 
              sales={recentSales || []} 
              t={t}  
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <StockAlerts 
              alerts={stockAlerts || []} 
              t={t}  
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TopCustomers 
              customers={topCustomers || []} 
              t={t}  
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
}

function StatCard({ title, value, change, positive, icon }: StatCardProps) {
  const { t, i18n } = useTranslation('admin');
  
  // Helper function to safely get translations with fallbacks
  const safeTranslate = (key: string, fallback: string): string => {
    // First try to get the translation directly
    const result = t(key);
    
    // If we're using a non-English language, show more detailed debugging
    if (process.env.NODE_ENV === 'development' && i18n.language !== 'en') {
      console.log(`Translating [${key}] in language [${i18n.language}]:`, result);
      console.log('Has resource bundle:', i18n.hasResourceBundle(i18n.language, 'admin'));
      
      // Try to inspect the resource directly
      const resourceBundle = i18n.getResourceBundle(i18n.language, 'admin');
      if (resourceBundle) {
        // Get nested keys
        const keys = key.split('.');
        let value = resourceBundle;
        for (const k of keys) {
          value = value?.[k];
          if (!value) break;
        }
        console.log('Direct resource lookup:', value);
      }
    }
    
    // If the result is the same as the key, it means translation failed
    if (result === key) {
      return fallback;
    }
    
    return result;
  };
  
  return (
    <Card sx={{ 
      p: 3, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <Box 
          sx={{ 
            bgcolor: positive ? 'success.lighter' : 'error.lighter',
            color: positive ? 'success.main' : 'error.main',
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </Box>
      </Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
        {value}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {positive ? (
          <TrendingUpIcon sx={{ color: 'success.main', mr: 0.5, fontSize: 16 }} />
        ) : (
          <TrendingDownIcon sx={{ color: 'error.main', mr: 0.5, fontSize: 16 }} />
        )}
        <Typography 
          variant="caption" 
          sx={{ 
            color: positive ? 'success.main' : 'error.main',
            fontWeight: 'medium'
          }}
        >
          {change}
        </Typography>
      </Box>
    </Card>
  );
} 