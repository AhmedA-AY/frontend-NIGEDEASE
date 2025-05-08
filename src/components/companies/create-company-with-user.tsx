'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Stack,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Alert,
  Step,
  Stepper,
  StepLabel,
  Typography,
  Paper
} from '@mui/material';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';

import { useCreateCompany, useCurrencies, useSubscriptionPlans } from '@/hooks/use-companies';
import { inventoryApi } from '@/services/api/inventory';
import { paths } from '@/paths';
import { CreateCompanyUserForm } from './create-company-user-form';

interface CompanyFormData {
  name: string;
  short_name: string;
  address: string;
  subscription_plan_id: string;
  currency_id: string;
}

export const CreateCompanyWithUser: React.FC = () => {
  const router = useRouter();
  const createCompanyMutation = useCreateCompany();
  const { data: currencies, isLoading: isLoadingCurrencies } = useCurrencies();
  const { data: subscriptionPlans, isLoading: isLoadingSubscriptionPlans } = useSubscriptionPlans();
  
  const [activeStep, setActiveStep] = useState(0);
  const [createdCompany, setCreatedCompany] = useState<any>(null);
  
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    short_name: '',
    address: '',
    subscription_plan_id: '',
    currency_id: ''
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

  const handleCreateCompany = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Create company
      const companyResponse = await createCompanyMutation.mutateAsync(formData);
      
      // Create default store for the company
      const storeData = {
        name: `${formData.name} - Main Store`,
        address: formData.address,
        phone_number: '', // These can be updated later
        email: '', // These can be updated later
        company_id: companyResponse.id,
        is_active: "active",
        location: 'Main Location'
      };
      
      await inventoryApi.createStore(storeData);
      
      setCreatedCompany(companyResponse);
      setActiveStep(1); // Move to user creation step
    } catch (error) {
      console.error('Error creating company:', error);
    }
  };

  const handleUserCreationSuccess = () => {
    // Navigate back to companies list after successful creation
    setTimeout(() => {
      router.push(paths.superAdmin.companies);
    }, 1500);
  };

  const isLoading = isLoadingCurrencies || isLoadingSubscriptionPlans || createCompanyMutation.isPending;

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
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
            <Typography variant="h4">Create Company</Typography>
          </Stack>
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            <Step>
              <StepLabel>Company Information</StepLabel>
            </Step>
            <Step>
              <StepLabel>Create Admin User</StepLabel>
            </Step>
          </Stepper>
          
          {activeStep === 0 ? (
            <form onSubmit={handleCreateCompany}>
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
                        {isLoading ? 'Creating...' : 'Create Company & Continue'}
                      </Button>
                    </Grid>
                    
                    {createCompanyMutation.isError && (
                      <Grid item xs={12}>
                        <Alert severity="error">
                          Error creating company: {(createCompanyMutation.error as any)?.error || 'An error occurred'}
                        </Alert>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </form>
          ) : (
            <Box>
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Company Created Successfully
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    <strong>Name:</strong> {createdCompany?.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Short Name:</strong> {createdCompany?.short_name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>ID:</strong> {createdCompany?.id}
                  </Typography>
                </Box>
                <Alert severity="info" sx={{ mb: 3 }}>
                  Please create an admin user for this company below
                </Alert>
              </Paper>
              
              <CreateCompanyUserForm 
                companyId={createdCompany?.id} 
                onSuccess={handleUserCreationSuccess}
              />
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  color="inherit"
                  onClick={() => router.push(paths.superAdmin.companies)}
                >
                  Skip & Go to Companies
                </Button>
              </Box>
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
}; 