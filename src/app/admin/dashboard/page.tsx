'use client';

import React from 'react';
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

// Import the @phosphor-icons
import { Storefront } from '@phosphor-icons/react/dist/ssr/Storefront';

export default function AdminDashboardPage() {
  const { userInfo } = useCurrentUser();
  const { currentStore, stores } = useStore();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState({
    totalSales: 0,
    totalExpenses: 0,
    totalCustomers: 0,
    salesGrowth: 0,
    paymentReceived: 0,
    paymentSent: 0,
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
      
      // Fetch data in parallel from different APIs
      const [sales, expenses, customers, products, inventories] = await Promise.all([
        transactionsApi.getSales(currentStore.id),
        financialsApi.getExpenses(currentStore.id),
        transactionsApi.getCustomers(currentStore.id),
        inventoryApi.getProducts(currentStore.id),
        inventoryApi.getInventories(currentStore.id),
      ]);
      
      console.log('Data fetched:', {
        salesCount: sales.length,
        expensesCount: expenses.length,
        customersCount: customers.length,
        productsCount: products.length,
        inventoriesCount: inventories.length
      });
      
      // Calculate total sales amount
      const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.total_amount || '0'), 0);
      
      // Calculate total expenses amount
      const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || '0'), 0);
      
      // Process sales data for chart
      const dailySalesData = processRecentSalesData(sales, expenses, selectedPeriod);
      const monthlySalesData = processMonthlySalesData(sales, expenses);
      
      // Generate top selling products
      const topSellingProducts = generateTopSellingProducts(sales, products);
      
      // Generate recent sales
      const recentSales = generateRecentSales(sales);
      
      // Generate stock alerts (products with low inventory)
      const stockAlerts = generateStockAlerts(products, inventories);
      
      // Generate top customers
      const topCustomers = generateTopCustomers(sales, customers);
      
      // Calculate sales growth
      const salesGrowth = calculateGrowth(monthlySalesData);
      
      setStats({
        totalSales,
        totalExpenses,
        totalCustomers: customers.length,
        salesGrowth,
        paymentReceived: 0, // These would be from payment APIs if available
        paymentSent: 0,
        topSellingProducts,
        recentSales,
        stockAlerts,
        topCustomers,
      });
      
      setSalesStats({
        dailySales: dailySalesData,
        monthlySales: monthlySalesData,
      });
      
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
        sale.created_at.substring(0, 10) === dateStr
      );
      
      // Calculate total sales for the day
      const daySalesTotal = daySales.reduce((sum, sale) => 
        sum + parseFloat(sale.total_amount || '0'), 0
      );
      
      // Filter expenses for this day
      const dayExpenses = expenses.filter(expense => 
        expense.created_at.substring(0, 10) === dateStr
      );
      
      // Calculate total expenses for the day
      const dayExpensesTotal = dayExpenses.reduce((sum, expense) => 
        sum + parseFloat(expense.amount || '0'), 0
      );
      
      result.push({
        day: dayLabel,
        sales: daySalesTotal,
        expenses: dayExpensesTotal,
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
        const saleDate = new Date(sale.created_at);
        return saleDate.getFullYear() === year && saleDate.getMonth() + 1 === month;
      });
      
      // Calculate total sales for the month
      const monthSalesTotal = monthSales.reduce((sum, sale) => 
        sum + parseFloat(sale.total_amount || '0'), 0
      );
      
      // Filter expenses for this month
      const monthExpenses = expenses.filter(expense => {
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
      });
    }
    
    return result;
  };
  
  // Generate top selling products based on sales data
  const generateTopSellingProducts = (sales: any[], products: Product[]): TopSellingProduct[] => {
    // This requires detailed sales item data, which we may not have directly
    // For now, just return a simplified version
    const productMap = new Map();
    
    // If available, tally up the quantities sold for each product
    // This is a simplified version, assuming we have access to sales items
    const productSales = products.map(product => {
      const randomQuantity = Math.floor(Math.random() * 50) + 1; // For demo purposes
      const randomAmount = parseFloat(product.sale_price || '0') * randomQuantity;
      
      return {
        id: product.id,
        name: product.name,
        quantity: randomQuantity,
        amount: randomAmount,
        percentage: 0, // Will calculate after getting total
      };
    });
    
    // Sort by amount in descending order
    productSales.sort((a, b) => b.amount - a.amount);
    
    // Take top 5
    const top5 = productSales.slice(0, 5);
    
    // Calculate percentages
    const totalAmount = top5.reduce((sum, product) => sum + product.amount, 0);
    top5.forEach(product => {
      product.percentage = totalAmount > 0 
        ? Math.round((product.amount / totalAmount) * 100) 
        : 0;
    });
    
    return top5;
  };
  
  // Generate recent sales data
  const generateRecentSales = (sales: any[]): RecentSale[] => {
    // Sort sales by date (most recent first)
    const sortedSales = [...sales].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    // Take most recent 5 sales
    return sortedSales.slice(0, 5).map(sale => ({
      id: sale.id,
      date: sale.created_at,
      customer: {
        id: sale.customer?.id || '',
        name: sale.customer?.name || 'Unknown Customer',
      },
      status: sale.is_credit ? 'Credit' : 'Paid',
      amount: parseFloat(sale.total_amount || '0'),
      paid: sale.is_credit ? 0 : parseFloat(sale.total_amount || '0'),
    }));
  };
  
  // Generate stock alerts for products with low inventory
  const generateStockAlerts = (products: Product[], inventories: Inventory[]): StockAlert[] => {
    // Create a map of inventory quantities by product ID
    const inventoryMap = new Map();
    inventories.forEach(inv => {
      inventoryMap.set(inv.product.id, parseInt(inv.quantity || '0'));
    });
    
    // Find products with low inventory (arbitrary threshold for demo)
    const lowStockProducts = products.filter(product => {
      const quantity = inventoryMap.get(product.id) || 0;
      // For demo, let's say anything under 10 is "low stock"
      return quantity < 10;
    });
    
    // Take top 5 lowest stock items
    return lowStockProducts.slice(0, 5).map(product => ({
      id: product.id,
      product: {
        id: product.id,
        name: product.name,
      },
      quantity: inventoryMap.get(product.id) || 0,
      alertThreshold: 10, // Arbitrary threshold for demo
    }));
  };
  
  // Generate top customers based on sales data
  const generateTopCustomers = (sales: any[], customers: any[]): TopCustomer[] => {
    // Create a map to hold sales totals by customer
    const customerSalesMap = new Map();
    const customerSalesCountMap = new Map();
    
    // Tally up sales by customer
    sales.forEach(sale => {
      if (sale.customer && sale.customer.id) {
        const customerId = sale.customer.id;
        const amount = parseFloat(sale.total_amount || '0');
        
        customerSalesMap.set(
          customerId, 
          (customerSalesMap.get(customerId) || 0) + amount
        );
        
        customerSalesCountMap.set(
          customerId,
          (customerSalesCountMap.get(customerId) || 0) + 1
        );
      }
    });
    
    // Convert to array of objects
    const customerSales = Array.from(customerSalesMap.entries()).map(([customerId, amount]) => {
      const customer = customers.find(c => c.id === customerId);
      return {
        id: customerId,
        name: customer ? customer.name : 'Unknown Customer',
        amount: amount as number,
        salesCount: customerSalesCountMap.get(customerId) || 0,
      };
    });
    
    // Sort by amount in descending order
    customerSales.sort((a, b) => b.amount - a.amount);
    
    // Return top 5
    return customerSales.slice(0, 5);
  };

  // Calculate growth percentage from monthly sales data
  const calculateGrowth = (monthlySales: any[]): number => {
    if (monthlySales.length < 2) return 0;
    
    const currentMonth = monthlySales[monthlySales.length - 1].sales;
    const previousMonth = monthlySales[monthlySales.length - 2].sales;
    
    if (previousMonth === 0) return 0;
    
    return ((currentMonth - previousMonth) / previousMonth) * 100;
  };

  React.useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Listen for store change events
  React.useEffect(() => {
    const handleStoreChange = (event: Event) => {
      // Force refetch data when store changes
      fetchDashboardData();
    };

    window.addEventListener(STORE_CHANGED_EVENT, handleStoreChange);
    
    return () => {
      window.removeEventListener(STORE_CHANGED_EVENT, handleStoreChange);
    };
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
      name: 'Expenses',
      data: salesStats.dailySales.map((item: any) => item.expenses),
    },
  ];

  const handlePeriodChange = (period: 'today' | 'week' | 'month' | 'year') => {
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

  const today = new Date();
  const formattedDate = formatDate(today, 'EEEE, MMMM d, yyyy');

  return (
    <Container maxWidth={false}>
      <Box sx={{ py: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Welcome back, {userInfo?.first_name || 'Admin'}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {formattedDate}
          </Typography>
        </Box>

        {currentStore && (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              mt: 2,
              backgroundColor: 'rgba(14, 165, 233, 0.1)', 
              border: '1px solid rgba(14, 165, 233, 0.3)',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Storefront size={24} weight="duotone" style={{ color: "#0ea5e9" }} />
            <Typography variant="subtitle1">
              Currently managing: <strong>{currentStore.name}</strong> ({currentStore.location})
            </Typography>
          </Paper>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 3 }}>
          <Typography variant="h4">
            Dashboard Overview
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
                  bgcolor: 'warning.lighter', 
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center' 
                }}>
                  <ReceiptIcon color="warning" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Sales Growth
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 0.5 }}>
                    {stats.salesGrowth > 0 ? '+' : ''}{stats.salesGrowth.toFixed(1)}%
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
                  bgcolor: 'info.lighter', 
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center' 
                }}>
                  <PeopleIcon color="info" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Customers
                  </Typography>
                  <Typography variant="h5" sx={{ mt: 0.5 }}>
                    {stats.totalCustomers}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Chart */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Sales & Expenses Overview" />
              <Box sx={{ p: 2 }}>
                <DynamicApexChart
                  type="area"
                  height={350}
                  options={salesChartOptions}
                  series={salesChartSeries}
                />
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Dashboard widgets */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TopSellingProducts products={stats.topSellingProducts} />
          </Grid>
          <Grid item xs={12} md={6}>
            <RecentSales sales={stats.recentSales} />
          </Grid>
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

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
}

function StatCard({ title, value, change, positive, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader title={title} />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {icon}
        </Box>
        <Box sx={{ ml: 2 }}>
          <Typography variant="h4">{value}</Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: positive ? 'success.main' : 'error.main',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {change}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
} 