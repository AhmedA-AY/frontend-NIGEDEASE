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
import { companiesApi, Company, CompanyCreateData } from '@/services/api/companies';
import { CreateCompanyUserForm } from './create-company-user-form';
import { usersApi } from '@/services/api/users';

interface CompanyFormData {
  name: string;
  short_name: string;
  address: string;
  description: string;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCompany, setCreatedCompany] = useState<any>(null);
  
  const [companyFormData, setCompanyFormData] = useState<CompanyFormData>({
    name: '',
    short_name: '',
    address: '',
    description: '',
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

  const [userData, setUserData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'admin'
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [userFormData, setUserFormData] = useState<any>(null);

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

  // New handler for user form data
  const handleUserFormChange = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUserFormSubmit = (userData: any) => {
    // Simply store the user data for later
    setUserFormData(userData);
    
    // Move to the next step
    setActiveStep(activeStep + 1);
  };

  const validateCompanyForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!companyFormData.name.trim()) {
      errors.name = 'Company name is required';
    } else if (companyFormData.name.length > 100) {
      errors.name = 'Company name must be 100 characters or less';
    }
    
    if (!companyFormData.short_name.trim()) {
      errors.short_name = 'Short name is required';
    } else if (companyFormData.short_name.length > 20) {
      errors.short_name = 'Short name must be 20 characters or less';
    }
    
    if (!companyFormData.address.trim()) {
      errors.address = 'Address is required';
    } else if (companyFormData.address.length > 200) {
      errors.address = 'Address must be 200 characters or less';
    }
    
    if (!companyFormData.subscription_plan_id) {
      errors.subscription_plan_id = 'Subscription plan is required';
    }
    
    if (!companyFormData.currency_id) {
      errors.currency_id = 'Currency is required';
    }
    
    if (companyFormData.description && companyFormData.description.length > 500) {
      errors.description = 'Description must be 500 characters or less';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStoreForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!storeFormData.name.trim()) {
      errors.name = 'Store name is required';
    } else if (storeFormData.name.length > 100) {
      errors.name = 'Store name must be 100 characters or less';
    }
    
    if (!storeFormData.address.trim()) {
      errors.address = 'Address is required';
    } else if (storeFormData.address.length > 200) {
      errors.address = 'Address must be 200 characters or less';
    }
    
    if (!storeFormData.phone_number.trim()) {
      errors.phone_number = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{7,15}$/.test(storeFormData.phone_number)) {
      errors.phone_number = 'Enter a valid phone number';
    }
    
    if (!storeFormData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(storeFormData.email)) {
      errors.email = 'Enter a valid email address';
    }
    
    if (!storeFormData.location.trim()) {
      errors.location = 'Location is required';
    } else if (storeFormData.location.length > 100) {
      errors.location = 'Location must be 100 characters or less';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinueToStore = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateCompanyForm()) {
      return;
    }
    
    // Move to store creation step
    setActiveStep(1);
  };

  const handleContinueToUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateStoreForm()) {
      return;
    }
    
    // Move to user creation step
    setActiveStep(2);
  };

  const handleCreateAll = async (userData: any) => {
    try {
      setIsSubmitting(true);
      
      // Use stored user data if available, or fall back to the userData parameter
      const finalUserData = userFormData || userData;
      
      // 1. Create company
      const companyData: CompanyCreateData = {
        name: companyFormData.name.trim(),
        description: companyFormData.description?.trim() || companyFormData.short_name.trim(),
        subscription_plan: companyFormData.subscription_plan_id,
      };
      
      const companyResponse = await createCompanyMutation.mutateAsync(companyData);
      
      // 2. Create store
      const storeData = {
        name: storeFormData.name.trim(),
        address: storeFormData.address.trim(),
        phone_number: storeFormData.phone_number.trim(),
        email: storeFormData.email.trim(),
        location: storeFormData.location.trim(),
        company_id: companyResponse.id,
        is_active: storeFormData.is_active as "active" | "inactive"
      };
      
      await inventoryApi.createStore(storeData);
      
      // 3. Create user
      // Use the usersApi directly to create a user
      await usersApi.createUser({
        ...finalUserData,
        company_id: companyResponse.id
      });
      
      // Show success message
      setSuccessMessage('Company, store and user created successfully');
      
      // Redirect to companies list
      setTimeout(() => {
        router.push(paths.superAdmin.companies);
      }, 1500);
    } catch (error: any) {
      console.error('Error creating company resources:', error);
      setFormErrors({
        ...formErrors,
        submit: error?.response?.data?.detail || error?.message || 'Failed to create company'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [successMessage, setSuccessMessage] = useState('');

  const isLoading = isLoadingCurrencies || isLoadingSubscriptionPlans || createCompanyMutation.isPending || isSubmitting;

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
          
          {/* Global error message */}
          {formErrors.submit && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formErrors.submit}
            </Alert>
          )}

          {/* Success message */}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}
          
          {activeStep === 0 ? (
            <form onSubmit={handleContinueToStore}>
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
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        onChange={handleCompanyFormChange}
                        value={companyFormData.description}
                        error={!!formErrors.description}
                        helperText={formErrors.description}
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
                        {isLoading ? 'Processing...' : 'Continue'}
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </form>
          ) : activeStep === 1 ? (
            <form onSubmit={handleContinueToUser}>
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
                    
                    <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        size="large"
                        onClick={() => setActiveStep(0)}
                        variant="outlined"
                      >
                        Back
                      </Button>
                      <Button
                        size="large"
                        type="submit"
                        variant="contained"
                      >
                        Continue
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
                  Finalize Company Creation
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    <strong>Company Name:</strong> {companyFormData.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Store Name:</strong> {storeFormData.name}
                  </Typography>
                </Box>
                <Alert severity="info" sx={{ mb: 3 }}>
                  Create an admin user to complete company setup. All information will be saved when you click "Create Company".
                </Alert>
              </Paper>
              
              <CreateCompanyUserForm
                onSuccess={activeStep === 2 ? handleCreateAll : handleUserFormSubmit}
                isSubmitting={isSubmitting}
                formMode={activeStep === 2 ? 'submit' : 'collect'}
                buttonText={activeStep === 2 ? 'Create Company' : 'Continue'}
                companyId={undefined}
              />
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  color="inherit"
                  onClick={() => setActiveStep(1)}
                  variant="outlined"
                >
                  Back
                </Button>
              </Box>
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
}; 