import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from '@/services/api/transactions';
import { financialsApi } from '@/services/api/financials';
import { inventoryApi } from '@/services/api/inventory';
import { format as formatDate, subDays, subMonths } from 'date-fns';
import { TopSellingProduct, RecentSale, StockAlert, TopCustomer } from '@/services/api/dashboard';

export type DashboardPeriod = 'today' | 'week' | 'month' | 'year';

export interface DashboardStats {
  totalSales: number;
  totalExpenses: number;
  totalCustomers: number;
  salesGrowth: number;
  paymentReceived: number;
  paymentSent: number;
  topSellingProducts: TopSellingProduct[];
  recentSales: RecentSale[];
  stockAlerts: StockAlert[];
  topCustomers: TopCustomer[];
  dailySales: any[];
  monthlySales: any[];
}

export function useDashboardData(storeId: string | undefined, period: DashboardPeriod = 'month') {
  return useQuery({
    queryKey: ['dashboard', storeId, period],
    queryFn: async (): Promise<DashboardStats> => {
      if (!storeId) {
        throw new Error('Store ID is required');
      }

      // Fetch data in parallel from different APIs
      const [sales, expenses, customers, products, inventories] = await Promise.all([
        transactionsApi.getSales(storeId),
        financialsApi.getExpenses(storeId),
        transactionsApi.getCustomers(storeId),
        inventoryApi.getProducts(storeId),
        inventoryApi.getInventories(storeId)
      ]);
      
      // Calculate total sales amount
      const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.total_amount || '0'), 0);
      
      // Calculate total expenses amount
      const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || '0'), 0);
      
      // Process sales data for chart
      const dailySales = processRecentSalesData(sales, expenses, period);
      const monthlySales = processMonthlySalesData(sales, expenses);
      
      // Generate top selling products
      const topSellingProducts = generateTopSellingProducts(sales, products);
      
      // Generate recent sales
      const recentSales = generateRecentSales(sales);
      
      // Generate stock alerts (products with low inventory)
      const stockAlerts = generateStockAlerts(products, inventories);
      
      // Generate top customers
      const topCustomers = generateTopCustomers(sales, customers);
      
      // Calculate sales growth
      const salesGrowth = calculateGrowth(monthlySales);

      return {
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
        dailySales,
        monthlySales,
      };
    },
    enabled: !!storeId,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Process sales and expenses data into daily points for chart
function processRecentSalesData(sales: any[], expenses: any[], period: string) {
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
}

// Process sales data into monthly points for chart and growth calculation
function processMonthlySalesData(sales: any[], expenses: any[]) {
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
}

// Generate top selling products based on sales data
function generateTopSellingProducts(sales: any[], products: any[]): TopSellingProduct[] {
  // This is a simplified version, assuming we have access to sales items
  const productMap = new Map();
  
  // If available, tally up the quantities sold for each product
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
      ? (product.amount / totalAmount) * 100 
      : 0;
  });
  
  return top5;
}

// Generate recent sales
function generateRecentSales(sales: any[]): RecentSale[] {
  // Sort sales by date (newest first)
  const sortedSales = [...sales].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  
  // Take the most recent 5 sales
  return sortedSales.slice(0, 5).map(sale => ({
    id: sale.id,
    date: new Date(sale.created_at).toISOString(),
    customer: {
      id: sale.customer?.id || 'unknown',
      name: sale.customer?.name || 'Unknown Customer',
    },
    status: sale.is_credit ? 'credit' : 'paid',
    amount: parseFloat(sale.total_amount || '0'),
    paid: sale.is_credit ? 0 : parseFloat(sale.total_amount || '0'),
  }));
}

// Generate stock alerts
function generateStockAlerts(products: any[], inventories: any[]): StockAlert[] {
  const alerts: StockAlert[] = [];
  
  // Create a map of inventories for quick lookup
  const inventoryMap = new Map();
  inventories.forEach(inventory => {
    inventoryMap.set(inventory.product_id, inventory.quantity);
  });
  
  // Find products with low inventory (below alert threshold)
  products.forEach(product => {
    const quantity = inventoryMap.get(product.id) || 0;
    const alertThreshold = 10; // This would ideally come from the product settings
    
    if (quantity < alertThreshold) {
      alerts.push({
        id: product.id,
        product: {
          id: product.id,
          name: product.name,
        },
        quantity: quantity,
        alertThreshold: alertThreshold,
      });
    }
  });
  
  // Sort by quantity ascending (lowest stock first)
  alerts.sort((a, b) => a.quantity - b.quantity);
  
  return alerts.slice(0, 5);
}

// Generate top customers
function generateTopCustomers(sales: any[], customers: any[]): TopCustomer[] {
  const customerMap = new Map<string, { id: string; name: string; amount: number; salesCount: number }>();
  
  // Process each sale to calculate customer totals
  sales.forEach(sale => {
    const customerId = sale.customer?.id;
    if (!customerId) return;
    
    const amount = parseFloat(sale.total_amount || '0');
    
    if (customerMap.has(customerId)) {
      const customer = customerMap.get(customerId)!;
      customer.amount += amount;
      customer.salesCount += 1;
    } else {
      const customerName = sale.customer?.name || 'Unknown';
      customerMap.set(customerId, {
        id: customerId,
        name: customerName,
        amount: amount,
        salesCount: 1,
      });
    }
  });
  
  // Convert map to array and sort by amount
  const topCustomers = Array.from(customerMap.values())
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
  
  return topCustomers;
}

// Calculate sales growth percentage
function calculateGrowth(monthlySales: any[]): number {
  // Need at least 2 months of data
  if (monthlySales.length < 2) {
    return 0;
  }
  
  // Get sales from current and previous month
  const currentMonth = monthlySales[monthlySales.length - 1]?.sales || 0;
  const previousMonth = monthlySales[monthlySales.length - 2]?.sales || 0;
  
  // Calculate growth percentage
  if (previousMonth === 0) {
    return currentMonth > 0 ? 100 : 0;
  }
  
  return ((currentMonth - previousMonth) / previousMonth) * 100;
} 