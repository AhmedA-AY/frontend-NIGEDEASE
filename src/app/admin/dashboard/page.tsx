'use client';

import React from 'react';
import { Box, Card, Container, Grid, Stack, Typography, Button, FormControlLabel, Switch } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { ApexOptions } from 'apexcharts';

import DynamicApexChart from '@/components/dynamic-apex-chart';
import { DashboardFilters, dashboardApi, TopSellingProduct, RecentSale, StockAlert, TopCustomer } from '@/services/api/dashboard';
import { TopSellingProducts } from '@/components/dashboard/overview/top-selling-products';
import { RecentSales } from '@/components/dashboard/overview/recent-sales';
import { StockAlerts } from '@/components/dashboard/overview/stock-alerts';
import { TopCustomers } from '@/components/dashboard/overview/top-customers';

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [useMockData, setUseMockData] = React.useState(true);
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

  const fetchDashboardData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching dashboard data with period:', selectedPeriod);
      
      if (useMockData) {
        console.log('Using mock data (toggle enabled)');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setStats({
          totalSales: 10250.75,
          totalExpenses: 3450.25,
          paymentSent: 2760.20,
          paymentReceived: 8950.50,
          topSellingProducts: [
            { id: '1', name: 'Acer Aspire Desktop', quantity: 78, amount: 54670, percentage: 35 },
            { id: '2', name: 'Dell Gaming Monitor', quantity: 45, amount: 32990, percentage: 25 },
            { id: '3', name: 'Sony Bravia Google TV', quantity: 36, amount: 25560, percentage: 20 },
            { id: '4', name: 'ZINUS Metal Box Spring Mattress', quantity: 32, amount: 12800, percentage: 12 },
            { id: '5', name: 'ASUS Eye Care Display Monitor', quantity: 23, amount: 9890, percentage: 8 },
          ],
          recentSales: [
            { id: 'SALE-65', date: '19-04-2025', customer: { id: '1', name: 'Maverick Runte' }, status: 'Confirmed', amount: 1671.00, paid: 0.00 },
            { id: 'SALE-64', date: '29-04-2025', customer: { id: '2', name: 'Charles Rohan' }, status: 'Shipping', amount: 340.90, paid: 0.00 },
            { id: 'SALE-63', date: '26-04-2025', customer: { id: '3', name: 'Efrain Hermann' }, status: 'Processing', amount: 454.25, paid: 454.25 },
            { id: 'SALE-62', date: '25-04-2025', customer: { id: '4', name: 'Izaiah Bogisich MD' }, status: 'Shipping', amount: 494.00, paid: 0.00 },
            { id: 'SALE-61', date: '23-04-2025', customer: { id: '5', name: 'Corbin Hoppe Jr.' }, status: 'Confirmed', amount: 1064.35, paid: 1064.35 },
          ],
          stockAlerts: [
            { id: '1', product: { id: '1', name: 'Furinno Office Computer Desk' }, quantity: 21, alertThreshold: 40 },
            { id: '2', product: { id: '2', name: 'Infantino Flip Carrier' }, quantity: 38, alertThreshold: 70 },
            { id: '3', product: { id: '3', name: 'Pampers Pants Girls and Boy' }, quantity: 25, alertThreshold: 25 },
            { id: '4', product: { id: '4', name: 'Tostitos Rounds Salsa Cups Nacho' }, quantity: 7, alertThreshold: 70 },
            { id: '5', product: { id: '5', name: "Welch's Fruit Snacks, Mixed Fruit, Gluten Free" }, quantity: 24, alertThreshold: 50 },
          ],
          topCustomers: [
            { id: '1', name: 'Corbin Hoppe Jr.', amount: 7207.35, salesCount: 3 },
            { id: '2', name: 'Jasper Lueilwitz', amount: 4944.00, salesCount: 1 },
            { id: '3', name: 'Alexis Collins', amount: 4040.60, salesCount: 1 },
            { id: '4', name: 'Dr. Sven Stamm Jr.', amount: 3448.00, salesCount: 1 },
            { id: '5', name: 'Alex Mann Sr.', amount: 3308.96, salesCount: 2 },
          ],
        });
        
        setSalesStats({
          dailySales: [
            { day: 'Mon', sales: 5200, purchases: 3100 },
            { day: 'Tue', sales: 4800, purchases: 2800 },
            { day: 'Wed', sales: 6700, purchases: 4100 },
            { day: 'Thu', sales: 5400, purchases: 3300 },
            { day: 'Fri', sales: 7900, purchases: 4800 },
            { day: 'Sat', sales: 8900, purchases: 5400 },
            { day: 'Sun', sales: 4600, purchases: 2700 },
          ],
          monthlySales: [
            { month: 'Jan', sales: 52000, purchases: 31000 },
            { month: 'Feb', sales: 48000, purchases: 28000 },
            { month: 'Mar', sales: 67000, purchases: 41000 },
            { month: 'Apr', sales: 54000, purchases: 33000 },
            { month: 'May', sales: 79000, purchases: 48000 },
            { month: 'Jun', sales: 89000, purchases: 54000 },
            { month: 'Jul', sales: 46000, purchases: 27000 },
            { month: 'Aug', sales: 62000, purchases: 38000 },
            { month: 'Sep', sales: 58000, purchases: 35000 },
            { month: 'Oct', sales: 71000, purchases: 43000 },
            { month: 'Nov', sales: 83000, purchases: 50000 },
            { month: 'Dec', sales: 96000, purchases: 58000 },
          ],
        });
      } else {
        const [dashboardStats, sales] = await Promise.all([
          dashboardApi.getDashboardStats({ period: selectedPeriod }),
          dashboardApi.getSalesStats({ period: selectedPeriod }),
        ]);
        
        console.log('Dashboard data received:', { 
          totalSales: dashboardStats.totalSales,
          totalExpenses: dashboardStats.totalExpenses,
          dailySalesCount: sales.dailySales.length
        });
        
        setStats(dashboardStats);
        setSalesStats(sales);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedPeriod, useMockData]);

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

  const handleToggleMockData = () => {
    setUseMockData(!useMockData);
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
          
          <FormControlLabel
            control={
              <Switch 
                checked={useMockData}
                onChange={handleToggleMockData}
                color="warning"
              />
            }
            label="Use Demo Data"
          />
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