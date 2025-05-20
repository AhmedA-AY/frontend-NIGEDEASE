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
import { FormControl, InputLabel, Select, SelectChangeEvent } from '@mui/material';

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
    description: '',
    is_active: true,
    subscription_plan: ''
  });
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});

  // Set initial form data when company data loads
  React.useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        description: company.description || '',
        is_active: company.is_active,
        subscription_plan: company.subscription_plan || ''
      });
    }
  }, [company]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<boolean>
  ) => {
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
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.subscription_plan) {
      errors.subscription_plan = 'Subscription plan is required';
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
                      label="Description"
                      name="description"
                      onChange={handleChange}
                      required
                      value={formData.description}
                      error={!!formErrors.description}
                      helperText={formErrors.description}
                      disabled={isLoading}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Subscription Plan"
                      name="subscription_plan"
                      onChange={handleChange}
                      required
                      select
                      value={formData.subscription_plan}
                      error={!!formErrors.subscription_plan}
                      helperText={formErrors.subscription_plan || 'Select a subscription plan'}
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
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        name="is_active"
                        value={formData.is_active ? "true" : "false"}
                        label="Status"
                        onChange={(e) => {
                          const value = e.target.value === "true";
                          setFormData({
                            ...formData,
                            is_active: value
                          });
                        }}
                      >
                        <MenuItem value="true">Active</MenuItem>
                        <MenuItem value="false">Inactive</MenuItem>
                      </Select>
                    </FormControl>
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