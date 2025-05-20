'use client';

import React from 'react';
import { Box, Card, Container, Grid, Stack, Typography, Button } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { ApexOptions } from 'apexcharts';
import RefreshIcon from '@mui/icons-material/Refresh';
import { format as formatDate, subDays, subMonths } from 'date-fns';

import DynamicApexChart from '@/components/dynamic-apex-chart';
import { DashboardFilters, dashboardApi, TopSellingProduct, RecentSale, StockAlert, TopCustomer } from '@/services/api/dashboard';
import { TopSellingProducts } from '@/components/dashboard/overview/top-selling-products';
import { RecentSales } from '@/components/dashboard/overview/recent-sales';
import { StockAlerts } from '@/components/dashboard/overview/stock-alerts';
import { TopCustomers } from '@/components/dashboard/overview/top-customers';
import { useCurrentUser } from '@/hooks/use-auth';
import { useStore, STORE_CHANGED_EVENT } from '@/providers/store-provider';
import { transactionsApi } from '@/services/api/transactions';
import { financialsApi } from '@/services/api/financials';
import { inventoryApi } from '@/services/api/inventory';

export default function StockManagerDashboardPage() {
  const { userInfo } = useCurrentUser();
  const { currentStore } = useStore();
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
  const [selectedPeriod, setSelectedPeriod] = React.useState<'today' | 'week' | 'month' | 'year'>('month');
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);

  const fetchDashboardData = React.useCallback(async () => {
    if (!currentStore) {
      setError('Please select a store to view dashboard data');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching dashboard data with period:', selectedPeriod);
      
      // Use either direct API calls or the dashboardApi service
      if (dashboardApi.getDashboardStats) {
        // If using the dashboard API service
        const [dashboardStats, sales] = await Promise.all([
          dashboardApi.getDashboardStats({ 
            period: selectedPeriod as DashboardFilters['period'],
            storeId: currentStore.id 
          }),
          dashboardApi.getSalesStats({ 
            period: selectedPeriod as DashboardFilters['period'],
            storeId: currentStore.id
          }),
        ]);
        
        setStats(dashboardStats);
        setSalesStats(sales);
      } else {
        // Direct API calls if dashboard service isn't available
        const [sales, expenses, products, inventories] = await Promise.all([
          transactionsApi.getSales(currentStore.id),
          financialsApi.getExpenses(currentStore.id),
          inventoryApi.getProducts(currentStore.id),
          inventoryApi.getInventories(currentStore.id),
        ]);
        
        console.log('Data fetched:', {
          salesCount: sales.length,
          expensesCount: expenses.length,
          productsCount: products.length,
          inventoriesCount: inventories.length
        });
        
        // Process the data
        const dailySalesData = processRecentSalesData(sales, expenses, selectedPeriod);
        const monthlySalesData = processMonthlySalesData(sales, expenses);
        const topSellingProducts = generateTopSellingProducts(sales, products);
        const recentSales = generateRecentSales(sales);
        const stockAlerts = generateStockAlerts(products, inventories);
        
        setStats({
          totalSales: sales.reduce((sum, sale) => sum + parseFloat(sale.total_amount || '0'), 0),
          totalExpenses: expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || '0'), 0),
          paymentSent: 0, // Would come from payments API
          paymentReceived: 0, // Would come from payments API
          topSellingProducts,
          recentSales,
          stockAlerts,
          topCustomers: [],
        });
        
        setSalesStats({
          dailySales: dailySalesData,
          monthlySales: monthlySalesData,
        });
      }
      
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedPeriod, currentStore]);

  // Process sales and expenses data into daily points for chart
  const processRecentSalesData = (sales: any[], expenses: any[], period: string) => {
    const days = period === 'today' ? 1 : 
                period === 'week' ? 7 : 
                period === 'month' ? 30 : 365;
    
    const result = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = formatDate(date, 'yyyy-MM-dd');
      const dayLabel = formatDate(date, 'MMM dd');
      
      // Filter sales for this day
      const daySales = sales.filter(sale => 
        sale.created_at?.substring(0, 10) === dateStr
      );
      
      // Calculate total sales for the day
      const daySalesTotal = daySales.reduce((sum, sale) => 
        sum + parseFloat(sale.total_amount || '0'), 0
      );
      
      // Filter expenses for this day
      const dayExpenses = expenses.filter(expense => 
        expense.created_at?.substring(0, 10) === dateStr
      );
      
      // Calculate total expenses for the day
      const dayExpensesTotal = dayExpenses.reduce((sum, expense) => 
        sum + parseFloat(expense.amount || '0'), 0
      );
      
      result.push({
        day: dayLabel,
        sales: daySalesTotal,
        expenses: dayExpensesTotal,
        purchases: dayExpensesTotal, // For the stock manager, show purchases instead of expenses
      });
    }
    
    return result;
  };
  
  // Process sales data into monthly points for chart and growth calculation
  const processMonthlySalesData = (sales: any[], expenses: any[]) => {
    const result = [];
    const today = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(today, i);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const monthLabel = formatDate(date, 'MMM yy');
      
      // Filter sales for this month
      const monthSales = sales.filter(sale => {
        if (!sale.created_at) return false;
        const saleDate = new Date(sale.created_at);
        return saleDate.getFullYear() === year && saleDate.getMonth() + 1 === month;
      });
      
      // Calculate total sales for the month
      const monthSalesTotal = monthSales.reduce((sum, sale) => 
        sum + parseFloat(sale.total_amount || '0'), 0
      );
      
      // Filter expenses for this month
      const monthExpenses = expenses.filter(expense => {
        if (!expense.created_at) return false;
        const expenseDate = new Date(expense.created_at);
        return expenseDate.getFullYear() === year && expenseDate.getMonth() + 1 === month;
      });
      
      // Calculate total expenses for the month
      const monthExpensesTotal = monthExpenses.reduce((sum, expense) => 
        sum + parseFloat(expense.amount || '0'), 0
      );
      
      result.push({
        month: monthLabel,
        sales: monthSalesTotal,
        expenses: monthExpensesTotal,
        purchases: monthExpensesTotal,
      });
    }
    
    return result;
  };

  // Helper functions to generate dashboard data
  const generateTopSellingProducts = (sales: any[], products: any[]): TopSellingProduct[] => {
    // Implementation similar to admin dashboard
    return [];
  };

  const generateRecentSales = (sales: any[]): RecentSale[] => {
    // Implementation similar to admin dashboard
    return [];
  };

  const generateStockAlerts = (products: any[], inventories: any[]): StockAlert[] => {
    // Implementation similar to admin dashboard
    return [];
  };

  // Listen for store changes
  React.useEffect(() => {
    const handleStoreChange = () => {
      fetchDashboardData();
    };

    window.addEventListener(STORE_CHANGED_EVENT, handleStoreChange);
    
    return () => {
      window.removeEventListener(STORE_CHANGED_EVENT, handleStoreChange);
    };
  }, [fetchDashboardData]);

  React.useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handlePeriodChange = (period: 'today' | 'week' | 'month' | 'year') => {
    setSelectedPeriod(period);
  };

  const handleRetry = () => {
    fetchDashboardData();
  };

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
            Stock Manager Dashboard
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
                    Total Purchases
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

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6">Sales & Purchases Overview</Typography>
              </Box>
              <Box sx={{ height: 375 }}>
                <DynamicApexChart
                  type="area"
                  height={375}
                  options={salesChartOptions}
                  series={salesChartSeries}
                />
              </Box>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <StockAlerts alerts={stats.stockAlerts} />
          </Grid>

          <Grid item xs={12} md={6}>
            <TopSellingProducts products={stats.topSellingProducts} />
          </Grid>
          
          <Grid item xs={12}>
            <RecentSales sales={stats.recentSales} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
} 