// @ts-nocheck

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

interface StoreFormData {
  name: string;
  address: string;
  phone_number: string;
  email: string;
  location: string;
  is_active: "active" | "inactive";
}

export const CreateCompanyWithUser: React.FC = () => {
  const router = useRouter();
  const createCompanyMutation = useCreateCompany();
  const { data: currencies, isLoading: isLoadingCurrencies } = useCurrencies();
  const { data: subscriptionPlans, isLoading: isLoadingSubscriptionPlans } = useSubscriptionPlans();
  
  const [activeStep, setActiveStep] = useState(0);
  const [createdCompany, setCreatedCompany] = useState<any>(null);
  
  const [companyFormData, setCompanyFormData] = useState<CompanyFormData>({
    name: '',
    short_name: '',
    address: '',
    subscription_plan_id: '',
    currency_id: ''
  });

  const [storeFormData, setStoreFormData] = useState<StoreFormData>({
    name: '',
    address: '',
    phone_number: '',
    email: '',
    location: '',
    is_active: "active"
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleCompanyFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setCompanyFormData({
        ...companyFormData,
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

  const handleStoreFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setStoreFormData({
        ...storeFormData,
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

  const validateCompanyForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!companyFormData.name.trim()) {
      errors.name = 'Company name is required';
    }
    
    if (!companyFormData.short_name.trim()) {
      errors.short_name = 'Short name is required';
    }
    
    if (!companyFormData.address.trim()) {
      errors.address = 'Address is required';
    }
    
    if (!companyFormData.subscription_plan_id) {
      errors.subscription_plan_id = 'Subscription plan is required';
    }
    
    if (!companyFormData.currency_id) {
      errors.currency_id = 'Currency is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStoreForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!storeFormData.name.trim()) {
      errors.name = 'Store name is required';
    }
    
    if (!storeFormData.address.trim()) {
      errors.address = 'Address is required';
    }
    
    if (!storeFormData.phone_number.trim()) {
      errors.phone_number = 'Phone number is required';
    }
    
    if (!storeFormData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(storeFormData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!storeFormData.location.trim()) {
      errors.location = 'Location is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateCompany = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateCompanyForm()) {
      return;
    }
    
    try {
      const companyResponse = await createCompanyMutation.mutateAsync(companyFormData);
      setCreatedCompany(companyResponse);
      setActiveStep(1); // Move to store creation step
    } catch (error) {
      console.error('Error creating company:', error);
    }
  };

  const handleCreateStore = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateStoreForm()) {
      return;
    }
    
    try {
      const storeData = {
        ...storeFormData,
        company_id: createdCompany.id,
        is_active: storeFormData.is_active as "active" | "inactive"
      };
      
      await inventoryApi.createStore(storeData);
      setActiveStep(2); // Move to user creation step
    } catch (error) {
      console.error('Error creating store:', error);
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
              <StepLabel>Create Store</StepLabel>
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
                        onChange={handleCompanyFormChange}
                        required
                        value={companyFormData.name}
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
                        onChange={handleCompanyFormChange}
                        required
                        value={companyFormData.short_name}
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
                        onChange={handleCompanyFormChange}
                        required
                        value={companyFormData.address}
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
                        onChange={handleCompanyFormChange}
                        required
                        select
                        value={companyFormData.subscription_plan_id}
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
                        onChange={handleCompanyFormChange}
                        required
                        select
                        value={companyFormData.currency_id}
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
          ) : activeStep === 1 ? (
            <form onSubmit={handleCreateStore}>
              <Card>
                <CardHeader title="Create Store" />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Store Name"
                        name="name"
                        onChange={handleStoreFormChange}
                        required
                        value={storeFormData.name}
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        onChange={handleStoreFormChange}
                        required
                        value={storeFormData.address}
                        error={!!formErrors.address}
                        helperText={formErrors.address}
                        multiline
                        rows={2}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        onChange={handleStoreFormChange}
                        required
                        value={storeFormData.location}
                        error={!!formErrors.location}
                        helperText={formErrors.location}
                        placeholder="City, State, Country"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone_number"
                        onChange={handleStoreFormChange}
                        required
                        value={storeFormData.phone_number}
                        error={!!formErrors.phone_number}
                        helperText={formErrors.phone_number}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        onChange={handleStoreFormChange}
                        required
                        value={storeFormData.email}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Button
                        size="large"
                        type="submit"
                        variant="contained"
                      >
                        Create Store & Continue
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </form>
          ) : (
            <Box>
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Company and Store Created Successfully
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    <strong>Company Name:</strong> {createdCompany?.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Company ID:</strong> {createdCompany?.id}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Store Name:</strong> {storeFormData.name}
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