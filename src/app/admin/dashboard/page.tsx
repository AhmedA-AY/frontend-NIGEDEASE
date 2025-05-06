'use client';

import React from 'react';
import { Box, Card, Container, Grid, Stack, Typography, Button } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { ApexOptions } from 'apexcharts';
import RefreshIcon from '@mui/icons-material/Refresh';

import DynamicApexChart from '@/components/dynamic-apex-chart';
import { DashboardFilters, dashboardApi, TopSellingProduct, RecentSale, StockAlert, TopCustomer } from '@/services/api/dashboard';
import { TopSellingProducts } from '@/components/dashboard/overview/top-selling-products';
import { RecentSales } from '@/components/dashboard/overview/recent-sales';
import { StockAlerts } from '@/components/dashboard/overview/stock-alerts';
import { TopCustomers } from '@/components/dashboard/overview/top-customers';

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState({
    totalSales: 0,
    totalExpenses: 0,
    paymentSent: 0,
    paymentReceived: 0,
    topSellingProducts: [] as TopSellingProduct[],
    recentSales: [] as RecentSale[],
    stockAlerts: [] as StockAlert[],
    topCustomers: [] as TopCustomer[],
  });
  const [salesStats, setSalesStats] = React.useState({
    dailySales: [] as any[],
    monthlySales: [] as any[],
  });
  const [selectedPeriod, setSelectedPeriod] = React.useState<DashboardFilters['period']>('month');
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);

  const fetchDashboardData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching dashboard data with period:', selectedPeriod);
      const [dashboardStats, sales] = await Promise.all([
        dashboardApi.getDashboardStats({ period: selectedPeriod }),
        dashboardApi.getSalesStats({ period: selectedPeriod }),
      ]);
      
      console.log('Dashboard data received:', { 
        totalSales: dashboardStats.totalSales,
        totalExpenses: dashboardStats.totalExpenses,
        paymentSent: dashboardStats.paymentSent,
        paymentReceived: dashboardStats.paymentReceived,
        dailySalesCount: sales.dailySales.length
      });
      
      // Add more detailed logging for debugging
      console.log('Dashboard stats data type check:', {
        totalSalesType: typeof dashboardStats.totalSales,
        totalExpensesType: typeof dashboardStats.totalExpenses,
        paymentSentType: typeof dashboardStats.paymentSent,
        paymentReceivedType: typeof dashboardStats.paymentReceived
      });
      
      // Check if values are zero or not defined correctly
      console.log('Values check - zeros or NaN?', {
        totalSalesIsZero: dashboardStats.totalSales === 0,
        totalExpensesIsZero: dashboardStats.totalExpenses === 0,
        paymentSentIsZero: dashboardStats.paymentSent === 0,
        paymentReceivedIsZero: dashboardStats.paymentReceived === 0,
        totalSalesIsNaN: isNaN(dashboardStats.totalSales),
        totalExpensesIsNaN: isNaN(dashboardStats.totalExpenses),
        paymentSentIsNaN: isNaN(dashboardStats.paymentSent),
        paymentReceivedIsNaN: isNaN(dashboardStats.paymentReceived)
      });
      
      setStats(dashboardStats);
      setSalesStats(sales);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedPeriod]);

  React.useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Configure chart options
  const salesChartOptions: ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    xaxis: {
      categories: salesStats.dailySales.map((item: any) => item.day),
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
    legend: {
      position: 'top',
    },
    colors: ['#4CAF50', '#FF9800'],
  };

  const salesChartSeries = [
    {
      name: 'Sales',
      data: salesStats.dailySales.map((item: any) => item.sales),
    },
    {
      name: 'Purchases',
      data: salesStats.dailySales.map((item: any) => item.purchases),
    },
  ];

  const handlePeriodChange = (period: DashboardFilters['period']) => {
    setSelectedPeriod(period);
  };

  const handleRetry = () => {
    fetchDashboardData();
  };

  if (isLoading) {
  return (
      <Container>
        <Box sx={{ my: 5, textAlign: 'center' }}>
          <Typography variant="h5">Loading dashboard data...</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please wait while we fetch the latest statistics...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ my: 5, textAlign: 'center' }}>
          <Typography variant="h5" color="error">{error}</Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={handleRetry}
          >
            Retry
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth={false}>
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Dashboard
          </Typography>
          <Box>
            {lastUpdated && (
              <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Typography>
            )}
            <Button 
              variant="outlined" 
              size="small" 
              onClick={handleRetry}
              disabled={isLoading}
              startIcon={isLoading ? null : <RefreshIcon />}
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </Box>
        </Box>

        {/* Time period selector */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Button 
            variant={selectedPeriod === 'today' ? 'contained' : 'outlined'} 
            onClick={() => handlePeriodChange('today')}
          >
            Today
          </Button>
          <Button 
            variant={selectedPeriod === 'week' ? 'contained' : 'outlined'} 
            onClick={() => handlePeriodChange('week')}
          >
            This Week
          </Button>
          <Button 
            variant={selectedPeriod === 'month' ? 'contained' : 'outlined'} 
            onClick={() => handlePeriodChange('month')}
          >
            This Month
          </Button>
          <Button 
            variant={selectedPeriod === 'year' ? 'contained' : 'outlined'} 
            onClick={() => handlePeriodChange('year')}
          >
            This Year
          </Button>
        </Stack>

        {/* Statistics summary cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ 
                  p: 1.5, 
                  bgcolor: 'primary.lighter', 
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                  justifyContent: 'center' 
              }}>
                  <TrendingUpIcon color="primary" />
              </Box>
              <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Sales
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 0.5 }}>
                    ${stats.totalSales.toFixed(2)}
                  </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ 
                  p: 1.5, 
                  bgcolor: 'error.lighter', 
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                  justifyContent: 'center' 
              }}>
                  <TrendingDownIcon color="error" />
              </Box>
              <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Expenses
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 0.5 }}>
                    ${stats.totalExpenses.toFixed(2)}
                  </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ 
                  p: 1.5, 
                  bgcolor: 'success.lighter', 
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                  justifyContent: 'center' 
              }}>
                  <ReceiptIcon color="success" />
              </Box>
              <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Payment Received
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 0.5 }}>
                    ${stats.paymentReceived.toFixed(2)}
                  </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ 
                  p: 1.5, 
                  bgcolor: 'warning.lighter', 
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                  justifyContent: 'center' 
              }}>
                  <AccountBalanceIcon color="warning" />
              </Box>
              <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Payment Sent
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 0.5 }}>
                    ${stats.paymentSent.toFixed(2)}
                  </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

        {/* Sales Chart */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Card>
              <Box sx={{ p: 3, pb: 1 }}>
                <Typography variant="h6">Sales Overview</Typography>
                <Typography variant="body2" color="text.secondary">
                  ({selectedPeriod === 'today' ? 'Today' : 
                     selectedPeriod === 'week' ? 'This Week' : 
                     selectedPeriod === 'month' ? 'This Month' : 'This Year'})
              </Typography>
            </Box>
              <Box sx={{ p: 3, pt: 0, height: 400 }}>
                <DynamicApexChart
                  type="area"
                  series={salesChartSeries}
                  options={salesChartOptions}
                  height={350}
                />
            </Box>
          </Card>
        </Grid>
      </Grid>

        {/* Top selling products & Recent Sales */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TopSellingProducts products={stats.topSellingProducts} />
          </Grid>
          <Grid item xs={12} md={6}>
            <RecentSales sales={stats.recentSales} />
          </Grid>
        </Grid>
        
        {/* Stock Alerts & Top Customers */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
            <StockAlerts alerts={stats.stockAlerts} />
        </Grid>
        <Grid item xs={12} md={6}>
            <TopCustomers customers={stats.topCustomers} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
} 