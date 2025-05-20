'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  Chip
} from '@mui/material';

import { 
  ArrowRight,
  Buildings,
  CurrencyDollar,
  Package,
  Bell,
  Warning
} from '@phosphor-icons/react/dist/ssr';

import { paths } from '@/paths';
import { useCompanies } from '@/hooks/use-companies';
import { useCurrencies } from '@/hooks/use-companies';
import { useSubscriptionPlans } from '@/hooks/use-companies';
import { Company } from '@/services/api/companies';
import { format } from 'date-fns';

// Component to render stat cards
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'primary',
  loading = false
}: { 
  title: string; 
  value: number | string; 
  icon: any; 
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  loading?: boolean;
}) => {
  const theme = useTheme();
  const colors = {
    primary: {
      light: theme.palette.primary.light || '#EBF3FE',
      main: theme.palette.primary.main,
      contrastText: theme.palette.primary.contrastText
    },
    success: {
      light: theme.palette.success.light || '#EAFBF3',
      main: theme.palette.success.main,
      contrastText: theme.palette.success.contrastText
    },
    warning: {
      light: theme.palette.warning.light || '#FFF8E5',
      main: theme.palette.warning.main,
      contrastText: theme.palette.warning.contrastText
    },
    error: {
      light: theme.palette.error.light || '#FEEEEE',
      main: theme.palette.error.main,
      contrastText: theme.palette.error.contrastText
    },
    info: {
      light: theme.palette.info.light || '#EBF9FE',
      main: theme.palette.info.main,
      contrastText: theme.palette.info.contrastText
    }
  };

  return (
    <Card sx={{ 
      height: '100%', 
      position: 'relative', 
      overflow: 'visible',
      border: 'none',
      boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.04)'
    }}>
      <CardContent sx={{ padding: 3 }}>
        <Typography 
          color="text.secondary" 
          variant="overline" 
          sx={{ 
            textTransform: 'uppercase', 
            fontSize: '0.75rem',
            mb: 1,
            display: 'block',
            fontWeight: 500
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            fontSize: '2rem',
            my: 1
          }}
        >
          {loading ? <CircularProgress size={24} /> : value}
        </Typography>
        
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            backgroundColor: colors[color].light,
            borderRadius: '50%',
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors[color].main
          }}
        >
          <Icon weight="fill" size={24} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default function SuperAdminDashboard(): React.JSX.Element {
  const router = useRouter();
  const { data: companies, isLoading: isLoadingCompanies } = useCompanies();
  const { data: currencies, isLoading: isLoadingCurrencies } = useCurrencies();
  const { data: subscriptionPlans, isLoading: isLoadingPlans } = useSubscriptionPlans();
  
  // Function to get status counts
  const getStatusCounts = (companies: Company[] = []) => {
    let active = 0;
    let inactive = 0;
    
    companies.forEach(company => {
      if (company.is_active) {
        active++;
      } else {
        inactive++;
      }
    });
    
    return { active, inactive };
  };
  
  const { active, inactive } = getStatusCounts(companies);
  
  const getStatusChipProps = (isActive: boolean) => ({
    label: isActive ? 'Active' : 'Inactive',
    color: (isActive ? 'success' : 'error') as 'success' | 'error',
    size: 'small' as const,
    sx: { 
      borderRadius: '16px',
      fontSize: '0.75rem',
      fontWeight: 500,
      py: 0.5,
      px: 1,
      backgroundColor: isActive ? '#EAFBF3' : '#FEEEEE',
      color: isActive ? '#0B815A' : '#B42318',
    }
  });

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" spacing={4}>
            <Stack spacing={1}>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                Dashboard
              </Typography>
              <Stack direction="row" spacing={1}>
                <Typography color="text.secondary" variant="body2">
                  Super Admin Overview
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <StatCard 
                title="TOTAL COMPANIES" 
                value={companies?.length || 0} 
                icon={Buildings} 
                color="primary"
                loading={isLoadingCompanies}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard 
                title="ACTIVE COMPANIES" 
                value={active} 
                icon={Buildings} 
                color="success"
                loading={isLoadingCompanies}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard 
                title="SUBSCRIPTION PLANS" 
                value={subscriptionPlans?.length || 0} 
                icon={Package} 
                color="info"
                loading={isLoadingPlans}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard 
                title="CURRENCIES" 
                value={currencies?.length || 0} 
                icon={CurrencyDollar} 
                color="warning"
                loading={isLoadingCurrencies}
              />
            </Grid>
          </Grid>
          
          <Card sx={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.04)', borderRadius: '8px', border: '1px solid rgba(0, 0, 0, 0.05)' }}>
            <CardHeader 
              title="Companies" 
              subheader="Recently added companies" 
              action={
                <Button
                  color="inherit"
                  endIcon={<ArrowRight size={16} />}
                  size="small"
                  variant="text"
                  onClick={() => router.push(paths.superAdmin.companies)}
                >
                  View all
                </Button>
              }
              sx={{
                '& .MuiCardHeader-title': {
                  fontSize: '1.125rem',
                  fontWeight: 600
                },
                '& .MuiCardHeader-subheader': {
                  fontSize: '0.875rem'
                }
              }}
            />
            <Divider />
            <Box sx={{ position: 'relative', minHeight: 200 }}>
              {isLoadingCompanies ? (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: 200
                }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer sx={{ px: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.secondary', py: 2 }}>Company Name</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.secondary', py: 2 }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.secondary', py: 2 }}>Subscription</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.secondary', py: 2 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.secondary', py: 2 }}>Created At</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {companies && companies.length > 0 ? (
                        companies.slice(0, 5).map((company) => (
                          <TableRow
                            hover
                            key={company.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell sx={{ py: 2 }}>{company.name}</TableCell>
                            <TableCell sx={{ py: 2 }}>{company.description}</TableCell>
                            <TableCell sx={{ py: 2 }}>{company.subscription_plan || 'None'}</TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <Chip
                                {...getStatusChipProps(company.is_active)}
                              />
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              {format(new Date(company.created_at), 'MMM dd, yyyy')}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <Typography variant="body2">
                              No companies found
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Card>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.04)', borderRadius: '8px', border: '1px solid rgba(0, 0, 0, 0.05)' }}>
                <CardHeader 
                  title="Subscription Plans" 
                  action={
                    <Button
                      color="inherit"
                      endIcon={<ArrowRight size={16} />}
                      size="small"
                      variant="text"
                      onClick={() => router.push(paths.superAdmin.subscriptionPlans)}
                    >
                      Manage
                    </Button>
                  }
                  sx={{
                    '& .MuiCardHeader-title': {
                      fontSize: '1.125rem',
                      fontWeight: 600
                    }
                  }}
                />
                <Divider />
                <Box sx={{ position: 'relative', minHeight: 200 }}>
                  {isLoadingPlans ? (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      height: 200
                    }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <TableContainer sx={{ px: 2 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.secondary', py: 2 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.secondary', py: 2 }}>Price</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.secondary', py: 2 }}>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {subscriptionPlans && subscriptionPlans.length > 0 ? (
                            subscriptionPlans.slice(0, 4).map((plan) => (
                              <TableRow
                                hover
                                key={plan.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell sx={{ py: 2 }}>{plan.name}</TableCell>
                                <TableCell sx={{ py: 2 }}>{plan.price}</TableCell>
                                <TableCell sx={{ py: 2 }}>
                                  <Chip
                                    {...getStatusChipProps(plan.is_active)}
                                  />
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} align="center">
                                <Typography variant="body2">
                                  No subscription plans found
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.04)', borderRadius: '8px', border: '1px solid rgba(0, 0, 0, 0.05)' }}>
                <CardHeader 
                  title="Currencies" 
                  action={
                    <Button
                      color="inherit"
                      endIcon={<ArrowRight size={16} />}
                      size="small"
                      variant="text"
                      onClick={() => router.push(paths.superAdmin.currencies)}
                    >
                      Manage
                    </Button>
                  }
                  sx={{
                    '& .MuiCardHeader-title': {
                      fontSize: '1.125rem',
                      fontWeight: 600
                    }
                  }}
                />
                <Divider />
                <Box sx={{ position: 'relative', minHeight: 200 }}>
                  {isLoadingCurrencies ? (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      height: 200
                    }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <TableContainer sx={{ px: 2 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.secondary', py: 2 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.secondary', py: 2 }}>Code</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {currencies && currencies.length > 0 ? (
                            currencies.slice(0, 4).map((currency) => (
                              <TableRow
                                hover
                                key={currency.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell sx={{ py: 2 }}>{currency.name}</TableCell>
                                <TableCell sx={{ py: 2 }}>{currency.code}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={2} align="center">
                                <Typography variant="body2">
                                  No currencies found
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
} 