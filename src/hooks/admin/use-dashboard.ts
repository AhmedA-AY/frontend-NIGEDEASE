import { useQuery } from '@tanstack/react-query';
import { format as formatDate, subDays } from 'date-fns';
import { TopSellingProduct, RecentSale, StockAlert, TopCustomer } from '@/services/api/dashboard';
import { reportsApi } from '@/services/api/reports';

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

      // Calculate date ranges based on selected period
      const today = new Date();
      let startDate: string;
      const endDate = formatDate(today, 'yyyy-MM-dd');
      
      switch (period) {
        case 'today':
          startDate = endDate;
          break;
        case 'week':
          startDate = formatDate(subDays(today, 7), 'yyyy-MM-dd');
          break;
        case 'month':
          startDate = formatDate(subDays(today, 30), 'yyyy-MM-dd');
          break;
        case 'year':
          startDate = formatDate(subDays(today, 365), 'yyyy-MM-dd');
          break;
        default:
          startDate = formatDate(subDays(today, 30), 'yyyy-MM-dd');
      }

      console.log(`Fetching dashboard data for store ${storeId} from ${startDate} to ${endDate}`);

      try {
        // Fetch data in parallel from reports API
        const [
          salesReport, 
          financialsReport, 
          customerReport, 
          inventoryReport,
          productReport, 
          profitReport, 
          revenueReport
        ] = await Promise.all([
          reportsApi.getSalesReport(storeId, startDate, endDate),
          reportsApi.getFinancialReport(storeId, startDate, endDate),
          reportsApi.getCustomerReport(storeId, startDate, endDate),
          reportsApi.getInventoryReport(storeId),
          reportsApi.getProductReport(storeId, startDate, endDate),
          reportsApi.getProfitReport(storeId, startDate, endDate),
          reportsApi.getRevenueReport(storeId, startDate, endDate)
        ]);
        
        // Log the responses for debugging
        console.log('Sales Report:', salesReport);
        console.log('Revenue Report:', revenueReport);
        console.log('Daily sales breakdown:', salesReport.daily_sales_breakdown);
        console.log('Top selling products:', salesReport.top_selling_products);
        
        // Extract data from reports
        const totalSales = salesReport.total_amount_received || salesReport.total_sales || 0;
        const totalExpenses = financialsReport.total_costs || financialsReport.total_expenses || 0;
        const totalCustomers = customerReport.total_customers || 0;
        const paymentReceived = revenueReport.total_revenue || salesReport.total_amount_received || 0;
        const salesGrowth = profitReport.growth_percentage || profitReport.profit_margin_percentage || 0;
        
        // Daily sales data for chart
        let dailySales = [];
        
        // Check if daily_sales_breakdown exists and is an array
        if (salesReport.daily_sales_breakdown && Array.isArray(salesReport.daily_sales_breakdown)) {
          dailySales = salesReport.daily_sales_breakdown.map((item: any) => ({
            day: item.date,
            sales: item.amount_received || item.amount_expected || 0,
            expenses: financialsReport.daily_expenses?.find((expense: any) => expense.date === item.date)?.amount || 0
          }));
        } else if (revenueReport.daily_revenue && Array.isArray(revenueReport.daily_revenue)) {
          // Alternative: use revenue report for daily data
          dailySales = revenueReport.daily_revenue.map((item: any) => ({
            day: item.date,
            sales: item.amount || 0,
            expenses: financialsReport.daily_expenses?.find((expense: any) => expense.date === item.date)?.amount || 0
          }));
        } else {
          // Fallback option: create dummy data
          const daysInPeriod = period === 'today' ? 1 : period === 'week' ? 7 : period === 'month' ? 30 : 12;
          for (let i = 0; i < daysInPeriod; i++) {
            const date = formatDate(subDays(today, daysInPeriod - i - 1), 'yyyy-MM-dd');
            dailySales.push({
              day: date,
              sales: 0,
              expenses: 0
            });
          }
        }

        const monthlySales = revenueReport.monthly_revenue || [];
        
        // Top selling products - Use data from sales or product report
        const topSellingProducts = (salesReport.top_selling_products || productReport.top_performing_products || []).map((product: any) => ({
          id: product.product_id,
          name: product.product_name,
          quantity: product.total_quantity || 0,
          amount: product.total_sales || 0,
          percentage: Math.min(Math.round((product.total_sales / (totalSales || 1)) * 100), 100)
        }));
        
        // Recent sales - Might not be available in the standard reports
        const recentSales = (salesReport.recent_transactions || []).map((sale: any) => ({
          id: sale.transaction_id || '',
          date: sale.date || '',
          customer: {
            id: sale.customer_id || '',
            name: sale.customer_name || 'Unknown Customer'
          },
          amount: sale.amount || 0,
          status: sale.status || 'Completed',
          paid: sale.paid_amount || 0
        }));
        
        // Stock alerts - Use inventory report data
        const stockAlerts = (inventoryReport.low_stock_products || []).map((item: any) => ({
          id: item.product_id,
          product: {
            id: item.product_id,
            name: item.product_name
          },
          quantity: item.current_quantity || 0,
          alertThreshold: item.threshold || 10
        }));
        
        // Top customers - Use customer report data
        const topCustomers = (customerReport.top_customers || []).map((customer: any) => ({
          id: customer.customer_id,
          name: customer.customer_name,
          amount: customer.total_spent || 0,
          salesCount: customer.purchase_count || 0
        }));

      return {
        totalSales,
        totalExpenses,
          totalCustomers,
        salesGrowth,
          paymentReceived,
          paymentSent: 0, // Not included in current reports
        topSellingProducts,
        recentSales,
        stockAlerts,
        topCustomers,
        dailySales,
          monthlySales
      };
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
      }
    },
    enabled: !!storeId,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
} 