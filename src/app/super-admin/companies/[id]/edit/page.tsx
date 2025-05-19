// @ts-nocheck
'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { useRouter } from 'next/navigation';

import { useUpdateCompany, useCompany, useCurrencies, useSubscriptionPlans } from '@/hooks/use-companies';
import { paths } from '@/paths';

export default function CompanyEditPage({ params }: { params: { id: string } }): React.JSX.Element {
  const router = useRouter();
  const { id } = params;
  const { data: company, isLoading: isLoadingCompany } = useCompany(id);
  const updateCompanyMutation = useUpdateCompany();
  const { data: currencies, isLoading: isLoadingCurrencies } = useCurrencies();
  const { data: subscriptionPlans, isLoading: isLoadingSubscriptionPlans } = useSubscriptionPlans();
  
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    short_name: '',
    address: '',
    subscription_plan_id: '',
    currency_id: ''
  });
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});

  // Set initial form data when company data loads
  React.useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        short_name: company.short_name,
        address: company.address,
        subscription_plan_id: company.subscription_plan.id,
        currency_id: company.currency.id
      });
    }
  }, [company]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: value
      });
      
      // Clear error when field is edited
      if (formErrors[name]) {
        setFormErrors({
          ...formErrors,
          [name]: ''
        });
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Company name is required';
    }
    
    if (!formData.short_name.trim()) {
      errors.short_name = 'Short name is required';
    }
    
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }
    
    if (!formData.subscription_plan_id) {
      errors.subscription_plan_id = 'Subscription plan is required';
    }
    
    if (!formData.currency_id) {
      errors.currency_id = 'Currency is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await updateCompanyMutation.mutateAsync({ id, data: formData });
      setOpenSnackbar(true);
      
      // Navigate back to companies list after successful update
      setTimeout(() => {
        router.push(paths.superAdmin.companies);
      }, 1500);
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const isLoading = isLoadingCompany || isLoadingCurrencies || isLoadingSubscriptionPlans || updateCompanyMutation.isPending;

  // Show loading state while company data is being fetched
  if (isLoadingCompany) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show error if company is not found
  if (!company && !isLoadingCompany) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
        flexDirection="column"
        gap={2}
      >
        <Alert severity="error">Company not found</Alert>
        <Button
          color="primary"
          variant="contained"
          onClick={() => router.push(paths.superAdmin.companies)}
        >
          Back to Companies
        </Button>
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Button
              color="inherit"
              startIcon={<ArrowLeftIcon />}
              onClick={() => router.push(paths.superAdmin.companies)}
            >
              Back to Companies
            </Button>
            <Typography variant="h4">Edit Company: {company?.name}</Typography>
          </Stack>
          
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader title="Company Information" />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      name="name"
                      onChange={handleChange}
                      required
                      value={formData.name}
                      error={!!formErrors.name}
                      helperText={formErrors.name}
                      disabled={isLoading}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Short Name"
                      name="short_name"
                      onChange={handleChange}
                      required
                      value={formData.short_name}
                      error={!!formErrors.short_name}
                      helperText={formErrors.short_name}
                      disabled={isLoading}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      onChange={handleChange}
                      required
                      value={formData.address}
                      error={!!formErrors.address}
                      helperText={formErrors.address}
                      disabled={isLoading}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Subscription Plan"
                      name="subscription_plan_id"
                      onChange={handleChange}
                      required
                      select
                      value={formData.subscription_plan_id}
                      error={!!formErrors.subscription_plan_id}
                      helperText={formErrors.subscription_plan_id || 'Select a subscription plan'}
                      disabled={isLoading || isLoadingSubscriptionPlans}
                    >
                      {isLoadingSubscriptionPlans ? (
                        <MenuItem disabled>Loading subscription plans...</MenuItem>
                      ) : (
                        subscriptionPlans?.map((plan) => (
                          <MenuItem key={plan.id} value={plan.id}>
                            {plan.name} - {plan.billing_cycle} ({plan.price})
                          </MenuItem>
                        ))
                      )}
                    </TextField>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Currency"
                      name="currency_id"
                      onChange={handleChange}
                      required
                      select
                      value={formData.currency_id}
                      error={!!formErrors.currency_id}
                      helperText={formErrors.currency_id || 'Select a currency'}
                      disabled={isLoading || isLoadingCurrencies}
                    >
                      {isLoadingCurrencies ? (
                        <MenuItem disabled>Loading currencies...</MenuItem>
                      ) : (
                        currencies?.map((currency) => (
                          <MenuItem key={currency.id} value={currency.id}>
                            {currency.name} ({currency.code})
                          </MenuItem>
                        ))
                      )}
                    </TextField>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      size="large"
                      type="submit"
                      variant="contained"
                      disabled={isLoading}
                      startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Grid>
                  
                  {updateCompanyMutation.isError && (
                    <Grid item xs={12}>
                      <Alert severity="error">
                        Error updating company: {(updateCompanyMutation.error as Error).message}
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </form>
        </Stack>
      </Container>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Company updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
} 