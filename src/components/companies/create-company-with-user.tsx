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
  Paper,
  Avatar
} from '@mui/material';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { useMutation } from '@tanstack/react-query';

import { useCurrencies, useSubscriptionPlans } from '@/hooks/super-admin/use-companies';
import { inventoryApi } from '@/services/api/inventory';
import { paths } from '@/paths';
import { companiesApi, CompanyCreateData } from '@/services/api/companies';
import { useCreateUser } from '@/hooks/super-admin/use-users';
import { extractErrorMessage } from '@/utils/api-error';
import ErrorMessage from '@/components/common/error-message';
import { ImageUpload } from '@/components/common/image-upload';

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

interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  profile_image: string;
}

export const CreateCompanyWithUser: React.FC = () => {
  const router = useRouter();
  const { data: currencies, isLoading: isLoadingCurrencies } = useCurrencies();
  const { data: subscriptionPlans, isLoading: isLoadingSubscriptionPlans } = useSubscriptionPlans();
  
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const [userFormData, setUserFormData] = useState<UserFormData>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    profile_image: ''
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Define mutations using TanStack Query
  const createCompanyMutation = useMutation({
    mutationFn: (data: CompanyCreateData) => companiesApi.createCompany(data),
    onError: (error: any) => {
      console.error('Error creating company:', error);
      setFormErrors({
        ...formErrors,
        submit: extractErrorMessage(error) || 'Failed to create company'
      });
    }
  });

  const createStoreMutation = useMutation({
    mutationFn: (data: any) => inventoryApi.createStore(data),
    onError: (error: any) => {
      console.error('Error creating store:', error);
      setFormErrors({
        ...formErrors,
        submit: extractErrorMessage(error) || 'Failed to create store'
      });
    }
  });

  const createUserMutation = useCreateUser();

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

  const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserFormData({
      ...userFormData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
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

  const validateUserForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!userFormData.first_name.trim()) {
      errors.first_name = 'First name is required';
    }
    
    if (!userFormData.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }
    
    if (!userFormData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userFormData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!userFormData.password) {
      errors.password = 'Password is required';
    } else if (userFormData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }
    
    if (!userFormData.confirm_password) {
      errors.confirm_password = 'Please confirm your password';
    } else if (userFormData.password !== userFormData.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (activeStep === 0 && validateCompanyForm()) {
      setActiveStep(1);
    } else if (activeStep === 1 && validateStoreForm()) {
      setActiveStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateUserForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Step 1: Create company
      const companyData: CompanyCreateData = {
        name: companyFormData.name.trim(),
        description: companyFormData.description?.trim() || companyFormData.short_name.trim(),
        subscription_plan: companyFormData.subscription_plan_id,
      };
      
      const companyResponse = await createCompanyMutation.mutateAsync(companyData);
      
      // Step 2: Create store
      const storeData = {
        name: storeFormData.name.trim(),
        address: storeFormData.address.trim(),
        phone_number: storeFormData.phone_number.trim(),
        email: storeFormData.email.trim(),
        location: storeFormData.location.trim(),
        company_id: companyResponse.id,
        is_active: storeFormData.is_active as "active" | "inactive"
      };
      
      await createStoreMutation.mutateAsync(storeData);
      
      // Step 3: Create user
      await createUserMutation.mutateAsync({
        first_name: userFormData.first_name,
        last_name: userFormData.last_name,
        email: userFormData.email,
        password: userFormData.password,
        profile_image: userFormData.profile_image,
        company_id: companyResponse.id,
        role: 'admin',
      });
      
      // Navigate to companies list after successful creation
      setTimeout(() => {
        router.push(paths.superAdmin.companies);
      }, 1500);
      
    } catch (error: any) {
      console.error('Error in company creation process:', error);
      setFormErrors({
        ...formErrors,
        submit: extractErrorMessage(error) || 'Failed to complete the company creation process'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isLoadingCurrencies || isLoadingSubscriptionPlans || isSubmitting;

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
            <ErrorMessage 
              error={new Error(formErrors.submit)}
              title="Creation Failed"
              onRetry={() => setFormErrors({...formErrors, submit: ''})}
            />
          )}
          
          {activeStep === 0 ? (
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
                      variant="contained"
                      onClick={handleNextStep}
                      disabled={isLoading}
                    >
                      Next Step
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ) : activeStep === 1 ? (
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
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        color="inherit"
                        onClick={() => setActiveStep(0)}
                      >
                        Back
                      </Button>
                      <Button
                        size="large"
                        variant="contained"
                        onClick={handleNextStep}
                      >
                        Next Step
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader title="Create Admin User" />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      <ImageUpload
                        initialImage={userFormData.profile_image}
                        onImageChange={(url) => {
                          setUserFormData({
                            ...userFormData,
                            profile_image: url || ''
                          });
                        }}
                        bucket="app-images"
                        folder={`company-${companyFormData.short_name.toLowerCase().replace(/\s+/g, '-')}`}
                        label="Upload Profile Picture"
                        width={150}
                        height={150}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="first_name"
                        onChange={handleUserFormChange}
                        required
                        value={userFormData.first_name}
                        error={!!formErrors.first_name}
                        helperText={formErrors.first_name}
                        disabled={isSubmitting}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="last_name"
                        onChange={handleUserFormChange}
                        required
                        value={userFormData.last_name}
                        error={!!formErrors.last_name}
                        helperText={formErrors.last_name}
                        disabled={isSubmitting}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        onChange={handleUserFormChange}
                        required
                        value={userFormData.email}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                        disabled={isSubmitting}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        onChange={handleUserFormChange}
                        required
                        value={userFormData.password}
                        error={!!formErrors.password}
                        helperText={formErrors.password}
                        disabled={isSubmitting}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Confirm Password"
                        name="confirm_password"
                        type="password"
                        onChange={handleUserFormChange}
                        required
                        value={userFormData.confirm_password}
                        error={!!formErrors.confirm_password}
                        helperText={formErrors.confirm_password}
                        disabled={isSubmitting}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          color="inherit"
                          onClick={() => setActiveStep(1)}
                          disabled={isSubmitting}
                        >
                          Back
                        </Button>
                        <Button
                          size="large"
                          type="submit"
                          variant="contained"
                          disabled={isSubmitting}
                          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                          {isSubmitting ? 'Creating Company...' : 'Complete Setup'}
                        </Button>
                      </Box>
                    </Grid>
                    
                    {createUserMutation.isSuccess && (
                      <Grid item xs={12}>
                        <Alert severity="success">
                          Company, store, and admin user created successfully!
                        </Alert>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </form>
          )}
        </Stack>
      </Container>
    </Box>
  );
}; 