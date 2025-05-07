import { useApiQuery, useApiMutation } from '@/utils/api';
import { useQueryClient } from '@tanstack/react-query';

export interface Company {
  id: string;
  name: string;
  tradeLicenseNumber: string;
  taxId: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CompaniesResponse {
  data: Company[];
  total: number;
  page: number;
  limit: number;
}

export interface CompanyParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface CompanyInput {
  name: string;
  tradeLicenseNumber: string;
  taxId: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
}

// Get all companies with pagination and filters
export function useCompanies(params: CompanyParams = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.status) queryParams.append('status', params.status);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

  const endpoint = `/companies?${queryParams.toString()}`;
  
  return useApiQuery<CompaniesResponse>(
    ['companies', JSON.stringify(params)], 
    endpoint
  );
}

// Get a single company by ID
export function useCompany(id: string) {
  return useApiQuery<Company>(
    ['company', id], 
    `/companies/${id}`,
    {
      enabled: !!id, // Only run query if id is provided
    }
  );
}

// Create a new company
export function useCreateCompany() {
  const queryClient = useQueryClient();
  
  return useApiMutation<Company, CompanyInput>(
    '/companies',
    'POST',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['companies'] });
      },
    }
  );
}

// Update an existing company
export function useUpdateCompany(id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Company, Partial<CompanyInput>>(
    `/companies/${id}`,
    'PATCH',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['company', id] });
        queryClient.invalidateQueries({ queryKey: ['companies'] });
      },
    }
  );
}

// Delete a company
export function useDeleteCompany() {
  const queryClient = useQueryClient();
  
  return useApiMutation<void, string>(
    '/companies',
    'DELETE',
    {
      onSuccess: (_, companyId) => {
        queryClient.invalidateQueries({ queryKey: ['companies'] });
        queryClient.invalidateQueries({ queryKey: ['company', companyId] });
      },
    }
  );
}

// Toggle company status (activate/deactivate)
export function useToggleCompanyStatus(id: string) {
  const queryClient = useQueryClient();
  
  return useApiMutation<Company, { status: 'active' | 'inactive' }>(
    `/companies/${id}/status`,
    'PATCH',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['company', id] });
        queryClient.invalidateQueries({ queryKey: ['companies'] });
      },
    }
  );
} 