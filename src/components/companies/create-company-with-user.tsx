'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
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
  Avatar,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  SelectChangeEvent
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
  const { t } = useTranslation(['super-admin', 'common']);
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

  const handleCompanyFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
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

  const handleStoreFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
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
      errors.name = t('companies.name_required');
    } else if (companyFormData.name.length > 100) {
      errors.name = t('companies.name_too_long');
    }
    
    if (!companyFormData.short_name.trim()) {
      errors.short_name = t('companies.short_name_required');
    } else if (companyFormData.short_name.length > 20) {
      errors.short_name = t('companies.short_name_too_long');
    }
    
    if (!companyFormData.address.trim()) {
      errors.address = t('common.address_required');
    } else if (companyFormData.address.length > 200) {
      errors.address = t('common.address_too_long');
    }
    
    if (!companyFormData.subscription_plan_id) {
      errors.subscription_plan_id = t('companies.subscription_plan_required');
    }
    
    if (!companyFormData.currency_id) {
      errors.currency_id = t('companies.currency_required');
    }
    
    if (companyFormData.description && companyFormData.description.length > 500) {
      errors.description = t('common.description_too_long');
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStoreForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!storeFormData.name.trim()) {
      errors.name = t('companies.store_name_required');
    } else if (storeFormData.name.length > 100) {
      errors.name = t('companies.store_name_too_long');
    }
    
    if (!storeFormData.address.trim()) {
      errors.address = t('common.address_required');
    } else if (storeFormData.address.length > 200) {
      errors.address = t('common.address_too_long');
    }
    
    if (!storeFormData.phone_number.trim()) {
      errors.phone_number = t('common.phone_required');
    } else if (!/^\+?[\d\s-]{7,15}$/.test(storeFormData.phone_number)) {
      errors.phone_number = t('common.invalid_phone');
    }
    
    if (!storeFormData.email.trim()) {
      errors.email = t('common.email_required');
    } else if (!/\S+@\S+\.\S+/.test(storeFormData.email)) {
      errors.email = t('common.invalid_email');
    }
    
    if (!storeFormData.location.trim()) {
      errors.location = t('common.location_required');
    } else if (storeFormData.location.length > 100) {
      errors.location = t('common.location_too_long');
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateUserForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!userFormData.first_name.trim()) {
      errors.first_name = t('common.first_name_required');
    }
    
    if (!userFormData.last_name.trim()) {
      errors.last_name = t('common.last_name_required');
    }
    
    if (!userFormData.email.trim()) {
      errors.email = t('common.email_required');
    } else if (!/\S+@\S+\.\S+/.test(userFormData.email)) {
      errors.email = t('common.invalid_email');
    }
    
    if (!userFormData.password) {
      errors.password = t('common.password_required');
    } else if (userFormData.password.length < 8) {
      errors.password = t('common.password_too_short');
    }
    
    if (!userFormData.confirm_password) {
      errors.confirm_password = t('common.confirm_password_required');
    } else if (userFormData.password !== userFormData.confirm_password) {
      errors.confirm_password = t('common.passwords_dont_match');
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

  const steps = [
    t('companies.create_company'),
    t('companies.create_store'),
    t('companies.create_admin')
  ];

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
              {t('common.back_to_companies')}
            </Button>
            <Typography variant="h4">{t('companies.create_company')}</Typography>
          </Stack>
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {/* Global error message */}
          {formErrors.submit && (
            <ErrorMessage 
              error={new Error(formErrors.submit)}
              title={t('companies.creation_failed')}
              onRetry={() => setFormErrors({...formErrors, submit: ''})}
            />
          )}
          
          {activeStep === 0 ? (
            <Card>
              <CardHeader title={t('companies.company_details')} />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('companies.company_name')}
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
                      label={t('companies.short_name')}
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
                      label={t('common.address')}
                      name="address"
                      onChange={handleCompanyFormChange}
                      required
                      value={companyFormData.address}
                      error={!!formErrors.address}
                      helperText={formErrors.address}
                      multiline
                      rows={2}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('common.description')}
                      name="description"
                      onChange={handleCompanyFormChange}
                      value={companyFormData.description}
                      error={!!formErrors.description}
                      helperText={formErrors.description}
                      multiline
                      rows={3}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required error={!!formErrors.subscription_plan_id}>
                      <InputLabel id="subscription-plan-label">{t('subscription_plans.title')}</InputLabel>
                      <Select
                        labelId="subscription-plan-label"
                        name="subscription_plan_id"
                        value={companyFormData.subscription_plan_id}
                        onChange={handleCompanyFormChange as (event: SelectChangeEvent<string>) => void}
                        label={t('subscription_plans.title')}
                      >
                        {isLoadingSubscriptionPlans ? (
                          <MenuItem value="" disabled>
                            <CircularProgress size={20} />
                          </MenuItem>
                        ) : (
                          subscriptionPlans?.map((plan) => (
                            <MenuItem key={plan.id} value={plan.id}>
                              {plan.name} - {plan.billing_cycle} ({plan.price})
                            </MenuItem>
                          ))
                        )}
                      </Select>
                      {formErrors.subscription_plan_id && (
                        <FormHelperText>{formErrors.subscription_plan_id}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required error={!!formErrors.currency_id}>
                      <InputLabel id="currency-label">{t('currencies.title')}</InputLabel>
                      <Select
                        labelId="currency-label"
                        name="currency_id"
                        value={companyFormData.currency_id}
                        onChange={handleCompanyFormChange as (event: SelectChangeEvent<string>) => void}
                        label={t('currencies.title')}
                      >
                        {isLoadingCurrencies ? (
                          <MenuItem value="" disabled>
                            <CircularProgress size={20} />
                          </MenuItem>
                        ) : (
                          currencies?.map((currency) => (
                            <MenuItem key={currency.id} value={currency.id}>
                              {currency.name} ({currency.code})
                            </MenuItem>
                          ))
                        )}
                      </Select>
                      {formErrors.currency_id && (
                        <FormHelperText>{formErrors.currency_id}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      size="large"
                      variant="contained"
                      onClick={handleNextStep}
                      disabled={isLoading}
                    >
                      {t('common.next_step')}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ) : activeStep === 1 ? (
            <Card>
              <CardHeader title={t('companies.create_store')} />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('companies.store_name')}
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
                      label={t('common.address')}
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
                      label={t('common.location')}
                      name="location"
                      onChange={handleStoreFormChange}
                      required
                      value={storeFormData.location}
                      error={!!formErrors.location}
                      helperText={formErrors.location}
                      placeholder={t('common.location_placeholder')}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('common.phone')}
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
                      label={t('common.email')}
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
                        {t('common.back')}
                      </Button>
                      <Button
                        size="large"
                        variant="contained"
                        onClick={handleNextStep}
                      >
                        {t('common.next_step')}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader title={t('companies.create_admin')} />
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
                        label={t('common.upload_profile_picture')}
                        width={150}
                        height={150}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label={t('common.first_name')}
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
                        label={t('common.last_name')}
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
                        label={t('common.email')}
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
                        label={t('common.password')}
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
                        label={t('common.confirm_password')}
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
                          {t('common.back')}
                        </Button>
                        <Button
                          size="large"
                          type="submit"
                          variant="contained"
                          disabled={isSubmitting}
                          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                          {isSubmitting ? t('companies.creating_company') : t('companies.complete_setup')}
                        </Button>
                      </Box>
                    </Grid>
                    
                    {createUserMutation.isSuccess && (
                      <Grid item xs={12}>
                        <Alert severity="success">
                          {t('companies.creation_success')}
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