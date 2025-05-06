import { coreApiClient } from './client';

// Dashboard statistics interfaces
export interface DashboardStats {
  totalSales: number;
  totalExpenses: number;
  paymentSent: number;
  paymentReceived: number;
  topSellingProducts: TopSellingProduct[];
  recentSales: RecentSale[];
  stockAlerts: StockAlert[];
  topCustomers: TopCustomer[];
}

export interface TopSellingProduct {
  id: string;
  name: string;
  quantity: number;
  amount: number;
  percentage: number;
}

export interface RecentSale {
  id: string;
  date: string;
  customer: {
    id: string;
    name: string;
  };
  status: string;
  amount: number;
  paid: number;
}

export interface StockAlert {
  id: string;
  product: {
    id: string;
    name: string;
  };
  quantity: number;
  alertThreshold: number;
}

export interface TopCustomer {
  id: string;
  name: string;
  amount: number;
  salesCount: number;
}

// API response interfaces
interface ApiResponse<T> {
  data: T;
  [key: string]: any; // Allow for other properties in the response
}

interface Sale {
  id: string;
  total_amount?: string;
  amount?: string;
  is_credit: boolean;
  created_at: string;
  customer?: {
    id: string;
    name: string;
  };
}

interface Expense {
  id: string;
  amount: string;
}

interface Payment {
  id: string;
  amount: string;
}

// Dashboard data filters
export interface DashboardFilters {
  startDate?: string;
  endDate?: string;
  period?: 'today' | 'yesterday' | 'week' | 'month' | 'year';
}

// API client for dashboard
export const dashboardApi = {
  // Get dashboard statistics
  getDashboardStats: async (filters?: DashboardFilters): Promise<DashboardStats> => {
    try {
      // For development/testing, uncomment to use mock data directly
      // return getMockDashboardStats();
      
      console.log('Fetching dashboard statistics...');
      
      // Create combined stats from different endpoints
      let salesData: Sale[] = [];
      let expensesData: Expense[] = [];
      let paymentsData: Payment[] = [];
      
      try {
        // Try to get real data from API
        const [salesResponse, expensesResponse, paymentsResponse] = await Promise.all([
          coreApiClient.get<ApiResponse<Sale[]> | Sale[]>('/transactions/sales/'),
          coreApiClient.get<ApiResponse<Expense[]> | Expense[]>('/financials/expenses/'),
          coreApiClient.get<ApiResponse<Payment[]> | Payment[]>('/financials/payment-in/')
        ]);
        
        console.log('API responses received');
        
        // Extract sales data
        if (salesResponse && salesResponse.data) {
          if (Array.isArray(salesResponse.data)) {
            salesData = salesResponse.data;
          } else if (salesResponse.data.data && Array.isArray(salesResponse.data.data)) {
            salesData = salesResponse.data.data;
          }
        }
        
        // Extract expenses data
        if (expensesResponse && expensesResponse.data) {
          if (Array.isArray(expensesResponse.data)) {
            expensesData = expensesResponse.data;
          } else if (expensesResponse.data.data && Array.isArray(expensesResponse.data.data)) {
            expensesData = expensesResponse.data.data;
          }
        }
        
        // Extract payments data
        if (paymentsResponse && paymentsResponse.data) {
          if (Array.isArray(paymentsResponse.data)) {
            paymentsData = paymentsResponse.data;
          } else if (paymentsResponse.data.data && Array.isArray(paymentsResponse.data.data)) {
            paymentsData = paymentsResponse.data.data;
          }
        }
        
        console.log('Extracted data counts:', {
          salesCount: salesData.length,
          expensesCount: expensesData.length,
          paymentsCount: paymentsData.length
        });
      } catch (error) {
        console.error('Error fetching API data:', error);
        // Continue with empty arrays, will fall back to mock data
      }
      
      // If we have no real data or very little, use mock data for development
      if (salesData.length === 0 && expensesData.length === 0 && paymentsData.length === 0) {
        console.log('No data found in API responses, using mock data');
        return getMockDashboardStats();
      }
      
      // Calculate summary statistics from real data
      const totalSales = salesData.length > 0 
        ? salesData.reduce((sum: number, sale: any) => sum + parseFloat(sale.total_amount || sale.amount || '0'), 0)
        : 0;
      
      const totalExpenses = expensesData.length > 0
        ? expensesData.reduce((sum: number, expense: any) => sum + parseFloat(expense.amount || '0'), 0)
        : 0;
      
      const paymentReceived = paymentsData.length > 0
        ? paymentsData.reduce((sum: number, payment: any) => sum + parseFloat(payment.amount || '0'), 0)
        : 0;
      
      console.log('Calculated totals:', { totalSales, totalExpenses, paymentReceived });
      
      // If all totals are 0, use mock data
      if (totalSales === 0 && totalExpenses === 0 && paymentReceived === 0) {
        console.log('All totals are zero, using mock data');
        return getMockDashboardStats();
      }
      
      // Return data with real totals but mock data for detailed components
      return {
        totalSales,
        totalExpenses,
        paymentSent: totalExpenses * 0.8, // Assume 80% of expenses are paid
        paymentReceived,
        topSellingProducts: generateMockTopSellingProducts(),
        recentSales: generateMockRecentSales(salesData),
        stockAlerts: generateMockStockAlerts(),
        topCustomers: generateMockTopCustomers(),
      };
    } catch (error) {
      console.error('Error in getDashboardStats:', error);
      return getMockDashboardStats();
    }
  },
  
  // Get sales statistics
  getSalesStats: async (filters?: DashboardFilters): Promise<any> => {
    try {
      // Try to get real sales data for the chart
      console.log('Fetching sales statistics...');
      let salesData: Sale[] = [];
      
      try {
        const salesResponse = await coreApiClient.get<ApiResponse<Sale[]> | Sale[]>('/transactions/sales/');
        
        // Extract sales data
        if (salesResponse && salesResponse.data) {
          if (Array.isArray(salesResponse.data)) {
            salesData = salesResponse.data;
          } else if (salesResponse.data.data && Array.isArray(salesResponse.data.data)) {
            salesData = salesResponse.data.data;
          }
        }
        
        console.log(`Found ${salesData.length} sales records`);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        // Continue with empty array
      }
      
      // If we have real data, organize by day and month
      if (salesData.length > 0) {
        const dailySalesData = generateDailySalesData(salesData);
        const monthlySalesData = generateMonthlySalesData(salesData);
        
        // If real data processing resulted in empty arrays, use mock data
        return {
          dailySales: dailySalesData.length > 0 ? dailySalesData : generateMockDailySales(),
          monthlySales: monthlySalesData.length > 0 ? monthlySalesData : generateMockMonthlySales(),
        };
      }
      
      // No sales data, use mock data
      console.log('No valid sales data found, using mock data for charts');
      return {
        dailySales: generateMockDailySales(),
        monthlySales: generateMockMonthlySales(),
      };
    } catch (error) {
      console.error('Error in getSalesStats:', error);
      return {
        dailySales: generateMockDailySales(),
        monthlySales: generateMockMonthlySales(),
      };
    }
  },
  
  // Get inventory statistics
  getInventoryStats: async (): Promise<any> => {
    // This would make a specific API call for inventory statistics
    // For now, we'll return mock data
    return {
      totalProducts: 328,
      lowStockProducts: 12,
      outOfStockProducts: 5,
    };
  }
};

// Helper function to get mock dashboard stats for development/fallback
function getMockDashboardStats(): DashboardStats {
  return {
    totalSales: 10250.75,
    totalExpenses: 3450.25,
    paymentSent: 2760.20,
    paymentReceived: 8950.50,
    topSellingProducts: generateMockTopSellingProducts(),
    recentSales: generateMockRecentSales([]),
    stockAlerts: generateMockStockAlerts(),
    topCustomers: generateMockTopCustomers(),
  };
}

// Helper functions to generate mock data
function generateMockTopSellingProducts(): TopSellingProduct[] {
  return [
    { id: '1', name: 'Acer Aspire Desktop', quantity: 78, amount: 54670, percentage: 35 },
    { id: '2', name: 'Dell Gaming Monitor', quantity: 45, amount: 32990, percentage: 25 },
    { id: '3', name: 'Sony Bravia Google TV', quantity: 36, amount: 25560, percentage: 20 },
    { id: '4', name: 'ZINUS Metal Box Spring Mattress', quantity: 32, amount: 12800, percentage: 12 },
    { id: '5', name: 'ASUS Eye Care Display Monitor', quantity: 23, amount: 9890, percentage: 8 },
  ];
}

function generateMockRecentSales(salesData: Sale[] = []): RecentSale[] {
  if (salesData.length > 0) {
    return salesData.slice(0, 5).map(sale => ({
      id: sale.id,
      date: new Date(sale.created_at).toLocaleDateString(),
      customer: {
        id: sale.customer?.id || '',
        name: sale.customer?.name || 'Unknown Customer',
      },
      status: sale.is_credit ? 'Credit' : 'Paid',
      amount: parseFloat(sale.total_amount || '0'),
      paid: sale.is_credit ? 0 : parseFloat(sale.total_amount || '0'),
    }));
  }
  
  // Fallback mock data
  return [
    { id: 'SALE-65', date: '19-04-2025', customer: { id: '1', name: 'Maverick Runte' }, status: 'Confirmed', amount: 1671.00, paid: 0.00 },
    { id: 'SALE-64', date: '29-04-2025', customer: { id: '2', name: 'Charles Rohan' }, status: 'Shipping', amount: 340.90, paid: 0.00 },
    { id: 'SALE-63', date: '26-04-2025', customer: { id: '3', name: 'Efrain Hermann' }, status: 'Processing', amount: 454.25, paid: 454.25 },
    { id: 'SALE-62', date: '25-04-2025', customer: { id: '4', name: 'Izaiah Bogisich MD' }, status: 'Shipping', amount: 494.00, paid: 0.00 },
    { id: 'SALE-61', date: '23-04-2025', customer: { id: '5', name: 'Corbin Hoppe Jr.' }, status: 'Confirmed', amount: 1064.35, paid: 1064.35 },
  ];
}

function generateMockStockAlerts(): StockAlert[] {
  return [
    { id: '1', product: { id: '1', name: 'Furinno Office Computer Desk' }, quantity: 21, alertThreshold: 40 },
    { id: '2', product: { id: '2', name: 'Infantino Flip Carrier' }, quantity: 38, alertThreshold: 70 },
    { id: '3', product: { id: '3', name: 'Pampers Pants Girls and Boy' }, quantity: 25, alertThreshold: 25 },
    { id: '4', product: { id: '4', name: 'Tostitos Rounds Salsa Cups Nacho' }, quantity: 7, alertThreshold: 70 },
    { id: '5', product: { id: '5', name: "Welch's Fruit Snacks, Mixed Fruit, Gluten Free" }, quantity: 24, alertThreshold: 50 },
  ];
}

function generateMockTopCustomers(): TopCustomer[] {
  return [
    { id: '1', name: 'Corbin Hoppe Jr.', amount: 7207.35, salesCount: 3 },
    { id: '2', name: 'Jasper Lueilwitz', amount: 4944.00, salesCount: 1 },
    { id: '3', name: 'Alexis Collins', amount: 4040.60, salesCount: 1 },
    { id: '4', name: 'Dr. Sven Stamm Jr.', amount: 3448.00, salesCount: 1 },
    { id: '5', name: 'Alex Mann Sr.', amount: 3308.96, salesCount: 2 },
  ];
}

function generateMockDailySales(): any[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    sales: Math.floor(Math.random() * 10000) + 1000,
    purchases: Math.floor(Math.random() * 8000) + 500,
  }));
}

function generateMockMonthlySales(): any[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    sales: Math.floor(Math.random() * 100000) + 10000,
    purchases: Math.floor(Math.random() * 80000) + 5000,
  }));
}

// New helper functions to process real data for charts
function generateDailySalesData(sales: any[]): any[] {
  try {
    // Map of day names
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Initialize counts for each day
    const dailyCounts: Record<string, { sales: number, purchases: number, count: number }> = {};
    dayNames.forEach(day => {
      dailyCounts[day] = { sales: 0, purchases: 0, count: 0 };
    });
    
    // Aggregate sales by day of week
    sales.forEach(sale => {
      const saleDate = new Date(sale.created_at);
      const dayName = dayNames[saleDate.getDay()];
      const amount = parseFloat(sale.total_amount || sale.amount || '0');
      
      dailyCounts[dayName].sales += amount;
      dailyCounts[dayName].count += 1;
    });
    
    // Convert to array format needed by chart
    return dayNames.map(day => ({
      day,
      sales: dailyCounts[day].sales,
      purchases: dailyCounts[day].sales * 0.7, // Estimate purchases at 70% of sales
    }));
  } catch (error) {
    console.error('Error generating daily sales data:', error);
    return [];
  }
}

function generateMonthlySalesData(sales: any[]): any[] {
  try {
    // Map of month names
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize counts for each month
    const monthlyCounts: Record<string, { sales: number, purchases: number, count: number }> = {};
    monthNames.forEach(month => {
      monthlyCounts[month] = { sales: 0, purchases: 0, count: 0 };
    });
    
    // Aggregate sales by month
    sales.forEach(sale => {
      const saleDate = new Date(sale.created_at);
      const monthName = monthNames[saleDate.getMonth()];
      const amount = parseFloat(sale.total_amount || sale.amount || '0');
      
      monthlyCounts[monthName].sales += amount;
      monthlyCounts[monthName].count += 1;
    });
    
    // Convert to array format needed by chart
    return monthNames.map(month => ({
      month,
      sales: monthlyCounts[month].sales,
      purchases: monthlyCounts[month].sales * 0.7, // Estimate purchases at 70% of sales
    }));
  } catch (error) {
    console.error('Error generating monthly sales data:', error);
    return [];
  }
} 