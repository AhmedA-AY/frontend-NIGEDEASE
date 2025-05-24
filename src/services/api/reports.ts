import { coreApiClient } from './client';

export interface ReportType {
  type: string;
  name: string;
  description: string;
  endpoint: string;
  supports_date_range: boolean;
}

export interface ReportData {
  title: string;
  description: string;
  store: string;
  date_range_start?: string;
  date_range_end?: string;
  [key: string]: any; // For report-specific fields
}

export const reportsApi = {
  getAvailableReports: async (storeId: string): Promise<{ store: string; store_name: string; available_reports: ReportType[] }> => {
    const response = await coreApiClient.get(`/reports/stores/${storeId}/reports/`);
    return response.data;
  },

  getReport: async (
    storeId: string,
    reportType: string,
    filters?: {
      start_date?: string;
      end_date?: string;
      format?: 'table' | 'graph';
    }
  ): Promise<ReportData> => {
    // Map report types to their correct endpoint names
    const reportTypeMap: Record<string, string> = {
      'customer': 'customers',
      'financial': 'financials',
      'product': 'products',
      'purchase': 'purchases',
      'revenue': 'revenue',
      'profit': 'profit',
      'sales': 'sales',
      'inventory': 'inventory'
    };

    const endpointType = reportTypeMap[reportType] || reportType;
    let url = `/reports/stores/${storeId}/reports/${endpointType}/`;
    
    // Add query parameters if they exist
    if (filters?.start_date && filters?.end_date) {
      url += `?start_date=${filters.start_date}&end_date=${filters.end_date}`;
    }

    const response = await coreApiClient.get(url);
    return response.data;
  }
}; 