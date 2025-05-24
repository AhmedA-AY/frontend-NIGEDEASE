'use client';

import React, { useState } from 'react';
import { Box, Card, CardHeader, Container, Grid, Stack, Typography, Button, Paper } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import { ApexOptions } from 'apexcharts';
import RefreshIcon from '@mui/icons-material/Refresh';
import { format as formatDate, subDays, subMonths } from 'date-fns';

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
  const { userInfo } = useCurrentUser();
  const { currentStore, stores } = useStore();
  const [selectedPeriod, setSelectedPeriod] = useState<DashboardPeriod>('month');
  
  // Use the new TanStack Query hook
  const { 
    data: dashboardData, 
    isLoading, 
    error, 
    refetch,
    dataUpdatedAt 
  } = useDashboardData(currentStore?.id, selectedPeriod);

  const handlePeriodChange = (period: DashboardPeriod) => {
    setSelectedPeriod(period);
  };

  const handleRetry = () => {
    refetch();
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
      name: 'Sales',
      data: dashboardData?.dailySales.map((item: any) => item.sales) || [],
    },
    {
      name: 'Expenses',
      data: dashboardData?.dailySales.map((item: any) => item.expenses) || [],
    },
  ];

  if (isLoading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Loading dashboard data...
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
            Error Loading Dashboard
          </Typography>
          <Paper sx={{ p: 3, mb: 3, bgcolor: '#fff8f8', color: 'error.main' }}>
            <Typography variant="body1" paragraph>
              {error instanceof Error ? error.message : 'Failed to load dashboard data. Please try again.'}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
                color="primary" 
                startIcon={<RefreshIcon />}
            onClick={handleRetry}
          >
            Retry
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
            No Store Selected
            </Typography>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="body1" paragraph>
              Please select a store from the dropdown menu to view the dashboard.
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
                Dashboard
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
          <Button 
                  color={selectedPeriod === 'today' ? 'primary' : 'inherit'}
            onClick={() => handlePeriodChange('today')}
                  variant={selectedPeriod === 'today' ? 'contained' : 'text'}
                  size="small"
                  sx={{ minWidth: { xs: '60px', sm: '80px' } }}
          >
            Today
          </Button>
          <Button 
                  color={selectedPeriod === 'week' ? 'primary' : 'inherit'}
            onClick={() => handlePeriodChange('week')}
                  variant={selectedPeriod === 'week' ? 'contained' : 'text'}
                  size="small"
                  sx={{ minWidth: { xs: '60px', sm: '80px' } }}
          >
                  Week
          </Button>
          <Button 
                  color={selectedPeriod === 'month' ? 'primary' : 'inherit'}
            onClick={() => handlePeriodChange('month')}
                  variant={selectedPeriod === 'month' ? 'contained' : 'text'}
                  size="small"
                  sx={{ minWidth: { xs: '60px', sm: '80px' } }}
          >
                  Month
          </Button>
          <Button 
                  color={selectedPeriod === 'year' ? 'primary' : 'inherit'}
            onClick={() => handlePeriodChange('year')}
                  variant={selectedPeriod === 'year' ? 'contained' : 'text'}
                  size="small"
                  sx={{ minWidth: { xs: '60px', sm: '80px' } }}
          >
                  Year
          </Button>
        </Stack>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Sales"
                value={formattedTotalSales}
                change={salesGrowthFormatted}
                positive={salesGrowth ? salesGrowth >= 0 : false}
                icon={<TrendingUpIcon />}
              />
            </Grid>
          <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Expenses"
                value={formattedTotalExpenses}
                change={expensesChangePercentage}
                positive={false}
                icon={<TrendingDownIcon />}
              />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Payment Received"
                value={formattedPaymentReceived}
                change={paymentsChangePercentage}
                positive={true}
                icon={<ReceiptIcon />}
              />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Customers"
                value={formattedTotalCustomers}
                change={customersChangePercentage}
                positive={true}
                icon={<PeopleIcon />}
              />
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardHeader 
                title="Sales vs Expenses" 
                sx={{ 
                  '& .MuiCardHeader-title': {
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }
                }}
              />
              <Box 
                sx={{ 
                  height: { xs: 300, sm: 400 },
                  p: { xs: 1, sm: 3 },
                  position: 'relative'
                }}
              >
                <DynamicApexChart
                  options={dailySalesChartOptions}
                  series={dailySalesChartSeries}
                  type="area"
                  height={350}
                />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TopSellingProducts products={topSellingProducts || []} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <RecentSales sales={recentSales || []} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <StockAlerts alerts={stockAlerts || []} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <TopCustomers customers={topCustomers || []} />
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
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        p: { xs: 2, sm: 3 },
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        borderRadius: 2,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography 
          color="text.secondary" 
          variant="overline" 
          sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
        >
          {title}
        </Typography>
        <Box
            sx={{ 
            backgroundColor: positive ? 'success.lightest' : 'error.lightest',
            borderRadius: 1,
              display: 'flex',
            alignItems: 'center',
            p: '4px 8px',
          }}
        >
          {positive ? (
            <TrendingUpIcon
              fontSize="small"
              sx={{ color: 'success.main', fontSize: { xs: '0.875rem', sm: '1rem' } }}
            />
          ) : (
            <TrendingDownIcon
              fontSize="small"
              sx={{ color: 'error.main', fontSize: { xs: '0.875rem', sm: '1rem' } }}
            />
          )}
          <Typography
            color={positive ? 'success.main' : 'error.main'}
            sx={{ ml: 0.5, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            variant="body2"
            >
              {change}
            </Typography>
        </Box>
      </Box>
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 700,
          fontSize: { xs: '1.5rem', sm: '2rem' }, 
          mb: 2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {value}
      </Typography>
      <Box
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          display: 'flex',
          mt: 'auto',
          width: 'fit-content',
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            backgroundColor: 'primary.lightest',
            borderRadius: '50%',
            display: 'flex',
            height: { xs: 32, sm: 40 },
            justifyContent: 'center',
            width: { xs: 32, sm: 40 },
          }}
        >
          {React.cloneElement(icon as React.ReactElement, {
            style: { color: 'var(--mui-palette-primary-main)', fontSize: '1.25rem' },
          })}
        </Box>
      </Box>
    </Card>
  );
} 