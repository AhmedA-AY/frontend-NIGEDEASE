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

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Grid container justifyContent="space-between" spacing={3}>
            <Grid item>
              <Typography variant="h4">
                Dashboard
              </Typography>
            </Grid>
            <Grid item>
              <Stack direction="row" spacing={1}>
              <Button 
                  color={selectedPeriod === 'today' ? 'primary' : 'inherit'}
            onClick={() => handlePeriodChange('today')}
                  variant={selectedPeriod === 'today' ? 'contained' : 'text'}
          >
            Today
          </Button>
          <Button 
                  color={selectedPeriod === 'week' ? 'primary' : 'inherit'}
            onClick={() => handlePeriodChange('week')}
                  variant={selectedPeriod === 'week' ? 'contained' : 'text'}
          >
                  Week
          </Button>
          <Button 
                  color={selectedPeriod === 'month' ? 'primary' : 'inherit'}
            onClick={() => handlePeriodChange('month')}
                  variant={selectedPeriod === 'month' ? 'contained' : 'text'}
          >
                  Month
          </Button>
          <Button 
                  color={selectedPeriod === 'year' ? 'primary' : 'inherit'}
            onClick={() => handlePeriodChange('year')}
                  variant={selectedPeriod === 'year' ? 'contained' : 'text'}
                >
                  Year
                </Button>
                <Button
                  onClick={handleRetry}
                  startIcon={<RefreshIcon />}
                  variant="outlined"
                >
                  Refresh
          </Button>
        </Stack>
            </Grid>
          </Grid>
        </Box>
        
        {/* Welcome message with store info */}
        <Box sx={{ mb: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Storefront style={{ marginRight: 8 }} />
              <Typography variant="h5">
                Welcome back, {userInfo?.first_name || 'Admin'}!
                    </Typography>
                  </Box>
            <Typography variant="body1">
              You are viewing data for <strong>{currentStore?.name}</strong>. 
              {dataUpdatedAt && (
                <span> Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()}</span>
              )}
            </Typography>
          </Paper>
        </Box>
        
        {/* Stat cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Sales"
              value={`$${totalSales?.toFixed(2) ?? '0.00'}`}
              change={`${(salesGrowth ?? 0) >= 0 ? '+' : ''}${(salesGrowth ?? 0).toFixed(1)}%`}
              positive={(salesGrowth ?? 0) >= 0}
              icon={<TrendingUpIcon />}
            />
            </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Expenses"
              value={`$${totalExpenses?.toFixed(2) ?? '0.00'}`}
              change={`${(totalExpenses ?? 0) > 0 ? '+' : ''}${totalExpenses ? ((totalExpenses / (totalSales || 1)) * 100).toFixed(1) : '0.0'}%`}
              positive={false} // Expenses are generally considered negative
              icon={<TrendingDownIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Payment Received"
              value={`$${paymentReceived?.toFixed(2) ?? '0.00'}`}
              change={`${(paymentReceived ?? 0) > 0 ? '+' : ''}${paymentReceived ? ((paymentReceived / (totalSales || 1)) * 100).toFixed(1) : '0.0'}%`}
              positive={true}
              icon={<ReceiptIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Customers"
              value={totalCustomers?.toString() ?? '0'}
              change={(totalCustomers ?? 0) > 0 ? '+NEW' : 'NO CHANGE'}
              positive={(totalCustomers ?? 0) > 0}
              icon={<PeopleIcon />}
            />
          </Grid>
        </Grid>

        {/* Main chart */}
        <Box sx={{ mb: 4 }}>
            <Card>
            <CardHeader 
              title="Sales Overview" 
              subheader={`Sales and expenses data for the selected period: ${selectedPeriod}`} 
            />
            <Box sx={{ p: 2, height: 380 }}>
                <DynamicApexChart
                options={dailySalesChartOptions}
                series={dailySalesChartSeries}
                type="line"
                  height={350}
                />
              </Box>
            </Card>
        </Box>

        {/* Additional widgets */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TopSellingProducts products={topSellingProducts || []} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TopCustomers customers={topCustomers || []} />
          </Grid>
          <Grid item xs={12} md={6}>
            <RecentSales sales={recentSales || []} />
          </Grid>
          <Grid item xs={12} md={6}>
            <StockAlerts alerts={stockAlerts || []} />
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
    <Card sx={{ height: '100%' }}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography color="text.secondary" variant="overline">
            {title}
          </Typography>
          <Box sx={{ 
            borderRadius: '50%', 
            bgcolor: positive ? 'success.light' : 'error.light',
            color: positive ? 'success.main' : 'error.main',
            p: 0.75
          }}>
            {icon}
          </Box>
        </Box>
        <Typography variant="h4" sx={{ mt: 1 }}>
          {value}
        </Typography>
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            borderRadius: 1, 
            bgcolor: positive ? 'success.lightest' : 'error.lightest',
              color: positive ? 'success.main' : 'error.main',
            px: 0.5,
            py: 0.25
          }}>
            <Typography variant="caption">
              {change}
            </Typography>
          </Box>
          <Typography color="text.secondary" sx={{ ml: 1 }} variant="caption">
            {positive ? 'Increase' : 'Decrease'}
            </Typography>
        </Box>
      </Box>
    </Card>
  );
} 