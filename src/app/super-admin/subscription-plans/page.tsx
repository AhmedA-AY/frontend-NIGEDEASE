'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  Grid,
  TablePagination,
  OutlinedInput,
  Chip,
  InputLabel
} from '@mui/material';
import { PencilSimple, Plus, Trash, MagnifyingGlass, Eye as Visibility } from '@phosphor-icons/react/dist/ssr';
import { z as zod } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { 
  useSubscriptionPlans, 
  useCreateSubscriptionPlan, 
  useUpdateSubscriptionPlan, 
  useDeleteSubscriptionPlan,
  usePatchSubscriptionPlan,
  SubscriptionPlanData
} from '@/hooks/use-companies';

const subscriptionPlanSchema = zod.object({
  id: zod.string().optional(),
  name: zod.string().min(1, 'Plan name is required').max(100, 'Plan name must be 100 characters or less'),
  description: zod.string().min(1, 'Description is required').max(500, 'Description must be 500 characters or less'),
  price: zod.string().min(1, 'Price is required').refine(val => !isNaN(Number(val)), { message: 'Price must be a valid number' }),
  billing_cycle: zod.enum(['monthly', 'yearly'], { required_error: 'Billing cycle is required' }),
  features: zod.string().min(1, 'Features are required').max(1000, 'Features must be 1000 characters or less'),
  is_active: zod.boolean(),
  storage_limit_gb: zod.number().min(1, 'Storage limit must be at least 1GB'),
  duration_in_months: zod.number().min(1, 'Duration must be at least 1 month'),
  max_products: zod.number().min(1, 'Max products must be at least 1'),
  max_stores: zod.number().min(1, 'Max stores must be at least 1'),
  max_customers: zod.number().min(1, 'Max customers must be at least 1')
});

type SubscriptionPlanFormValues = zod.infer<typeof subscriptionPlanSchema>;

export default function SubscriptionPlansPage(): React.JSX.Element {
  const { t, i18n } = useTranslation('super-admin');
  
  // Add safeTranslate function
  const safeTranslate = (key: string, fallback: string) => {
    const result = t(key);
    return result === key ? fallback : result;
  };
  
  const { data: subscriptionPlans, isLoading: isLoadingPlans, error: plansError } = useSubscriptionPlans();
  const createPlanMutation = useCreateSubscriptionPlan();
  const updatePlanMutation = useUpdateSubscriptionPlan();
  const deletePlanMutation = useDeleteSubscriptionPlan();
  const patchPlanMutation = usePatchSubscriptionPlan();
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const defaultValues: SubscriptionPlanFormValues = {
    name: '',
    description: '',
    price: '',
    billing_cycle: 'monthly',
    features: '',
    is_active: true,
    storage_limit_gb: 10,
    duration_in_months: 1,
    max_products: 100,
    max_stores: 5,
    max_customers: 10
  };
  
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<SubscriptionPlanFormValues>({
    resolver: zodResolver(subscriptionPlanSchema),
    defaultValues
  });
  
  const isLoading = isLoadingPlans || 
    createPlanMutation.isPending || 
    updatePlanMutation.isPending || 
    deletePlanMutation.isPending ||
    patchPlanMutation.isPending;
  
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Filter subscription plans based on search query
  const filteredPlans = React.useMemo(() => {
    if (!subscriptionPlans) return [];
    
    if (!searchQuery) return subscriptionPlans;
    
    const query = searchQuery.toLowerCase();
    return subscriptionPlans.filter(plan => 
      plan.name.toLowerCase().includes(query) || 
      plan.description.toLowerCase().includes(query) ||
      String(plan.price).includes(query)
    );
  }, [subscriptionPlans, searchQuery]);

  // Calculate pagination
  const paginatedPlans = filteredPlans
    ? filteredPlans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset to first page when searching
  };
  
  const handleCreateDialogOpen = () => {
    reset(defaultValues);
    setCreateDialogOpen(true);
  };
  
  const handleEditDialogOpen = (plan: any) => {
    setValue('id', plan.id);
    setValue('name', plan.name);
    setValue('description', plan.description);
    setValue('price', plan.price);
    setValue('billing_cycle', plan.billing_cycle);
    setValue('features', plan.features);
    setValue('is_active', plan.is_active);
    setValue('storage_limit_gb', plan.storage_limit_gb);
    setValue('duration_in_months', plan.duration_in_months || 1);
    setValue('max_products', plan.max_products || 100);
    setValue('max_stores', plan.max_stores || 5);
    setValue('max_customers', plan.max_customers || 10);
    setEditDialogOpen(true);
  };
  
  const handleDeleteDialogOpen = (plan: any) => {
    setValue('id', plan.id);
    setValue('name', plan.name);
    setDeleteDialogOpen(true);
  };
  
  const handleViewDetails = (plan: any) => {
    setSelectedPlan(plan);
    setDetailsDialogOpen(true);
  };
  
  const handleCreateSubmit = async (data: SubscriptionPlanFormValues) => {
    try {
      const { id, ...planData } = data;
      
      // Format the data to match API expectations - ensure all numeric fields are numbers
      const formattedData = {
        ...planData,
        // Ensure numeric fields are sent as proper data types
        storage_limit_gb: Number(planData.storage_limit_gb),
        price: String(planData.price),
        duration_in_months: Number(planData.duration_in_months || 1),
        max_products: Number(planData.max_products || 100),
        max_stores: Number(planData.max_stores || 5),
        max_customers: Number(planData.max_customers || 10),
        features: String(planData.features),
        is_active: Boolean(planData.is_active)
      };
      
      await createPlanMutation.mutateAsync(formattedData as SubscriptionPlanData);
      setCreateDialogOpen(false);
      setSuccessMessage('Subscription plan created successfully');
      reset(defaultValues);
    } catch (error: any) {
      console.error('Error creating subscription plan:', error);
      const errorMessage = error?.response?.data?.detail || 
                          error?.message || 
                          'Failed to create subscription plan';
      setSuccessMessage('');
      // Use the Snackbar system instead of alert for consistent UX
      setSuccessMessage(`Error: ${errorMessage}`);
    }
  };
  
  const handleEditSubmit = async (data: SubscriptionPlanFormValues) => {
    try {
      if (data.id) {
        const { id, ...planData } = data;
        
        // Get the current plan data to compare
        const currentPlan = subscriptionPlans?.find(p => p.id === id);
        if (!currentPlan) {
          throw new Error("Couldn't find the current plan data");
        }
        
        // Compare and only include changed fields to minimize data sent
        const changedFields: Record<string, any> = {};
        
        // Check each field for changes
        if (planData.name !== currentPlan.name) changedFields.name = planData.name;
        if (planData.description !== currentPlan.description) changedFields.description = planData.description;
        if (planData.price !== currentPlan.price) changedFields.price = planData.price;
        if (planData.billing_cycle !== currentPlan.billing_cycle) changedFields.billing_cycle = planData.billing_cycle;
        if (planData.features !== currentPlan.features) changedFields.features = planData.features;
        if (planData.is_active !== currentPlan.is_active) changedFields.is_active = planData.is_active;
        
        // For numeric fields, compare and convert if changed
        if (planData.storage_limit_gb !== currentPlan.storage_limit_gb) 
          changedFields.storage_limit_gb = Number(planData.storage_limit_gb);
        
        if (planData.duration_in_months !== currentPlan.duration_in_months) 
          changedFields.duration_in_months = Number(planData.duration_in_months || 1);
        
        if (planData.max_products !== currentPlan.max_products) 
          changedFields.max_products = Number(planData.max_products || 100);
        
        if (planData.max_stores !== currentPlan.max_stores) 
          changedFields.max_stores = Number(planData.max_stores || 5);
        
        if (planData.max_customers !== currentPlan.max_customers) 
          changedFields.max_customers = Number(planData.max_customers || 10);
          
        console.log('Sending only changed fields:', changedFields);
        
        // Try PUT with all data first (if any field changed)
        if (Object.keys(changedFields).length > 0) {
          try {
            // First try with PUT and all data
            await updatePlanMutation.mutateAsync({
              id,
              data: {
                ...planData,
                storage_limit_gb: Number(planData.storage_limit_gb),
                price: String(planData.price),
                duration_in_months: Number(planData.duration_in_months || 1),
                max_products: Number(planData.max_products || 100),
                max_stores: Number(planData.max_stores || 5),
                max_customers: Number(planData.max_customers || 10),
                features: String(planData.features),
                is_active: Boolean(planData.is_active)
              } as SubscriptionPlanData
            });
          } catch (putError) {
            console.error('PUT request failed, trying PATCH with only changed fields:', putError);
            // If PUT fails, try with PATCH and only changed fields
            await patchPlanMutation.mutateAsync({
              id,
              data: changedFields
            });
          }
          
          setEditDialogOpen(false);
          setSuccessMessage('Subscription plan updated successfully');
          reset(defaultValues);
        } else {
          // No changes detected
          setEditDialogOpen(false);
          setSuccessMessage('No changes were made to the subscription plan');
          reset(defaultValues);
        }
      }
    } catch (error: any) {
      console.error('Error updating subscription plan:', error);
      // Log more detailed error information
      console.error('Error response data:', error?.response?.data);
      console.error('Error status:', error?.response?.status);
      const errorMessage = error?.response?.data?.detail || 
                          error?.message || 
                          'Failed to update subscription plan';
      setSuccessMessage('');
      alert(`Error: ${errorMessage}`);
    }
  };
  
  const handleDeleteSubmit = async () => {
    try {
      const id = control._formValues.id;
      if (id) {
        await deletePlanMutation.mutateAsync(id);
        setDeleteDialogOpen(false);
        setSuccessMessage('Subscription plan deleted successfully');
        reset(defaultValues);
      }
    } catch (error) {
      console.error('Error deleting subscription plan:', error);
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h4">
              {safeTranslate('subscription_plans.title', 'Subscription Plans')}
              </Typography>
            <Button
              startIcon={<Plus />}
              variant="contained"
              onClick={handleCreateDialogOpen}
            >
              {safeTranslate('subscription_plans.add', 'Add Plan')}
            </Button>
          </Stack>
          
          {successMessage && (
            <Alert 
              severity={successMessage.startsWith('Error') ? 'error' : 'success'}
              onClose={() => setSuccessMessage('')}
            >
              {successMessage}
            </Alert>
          )}
          
          <Card>
            <Stack
              direction="row"
              spacing={2}
              sx={{ p: 2 }}
            >
              <OutlinedInput
                fullWidth
                placeholder={safeTranslate('subscription_plans.search', 'Search subscription plans')}
                startAdornment={
                  <InputAdornment position="start">
                    <MagnifyingGlass size={20} />
                  </InputAdornment>
                }
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ maxWidth: 500 }}
              />
            </Stack>
            
            <Divider />
            
            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
            )}
            
            {plansError && !isLoading && (
              <Box sx={{ p: 3 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                  {safeTranslate('subscription_plans.error_loading', 'Failed to load subscription plans')}
                </Alert>
              </Box>
            )}
            
            {!isLoading && !plansError && (
              <Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{safeTranslate('subscription_plans.plan_name', 'Plan Name')}</TableCell>
                        <TableCell>{safeTranslate('subscription_plans.price', 'Price')}</TableCell>
                        <TableCell>{safeTranslate('subscription_plans.billing_cycle', 'Billing Cycle')}</TableCell>
                        <TableCell>{safeTranslate('subscription_plans.storage', 'Storage (GB)')}</TableCell>
                        <TableCell>{safeTranslate('subscription_plans.status', 'Status')}</TableCell>
                        <TableCell align="right">{safeTranslate('common.actions', 'Actions')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedPlans.length > 0 ? (
                        paginatedPlans.map((plan) => (
                        <TableRow key={plan.id}>
                          <TableCell>{plan.name}</TableCell>
                          <TableCell>{plan.price}</TableCell>
                          <TableCell>
                              {safeTranslate(`subscription_plans.${plan.billing_cycle}`, plan.billing_cycle === 'monthly' ? 'Monthly' : 'Yearly')}
                          </TableCell>
                            <TableCell>{plan.storage_limit_gb}</TableCell>
                          <TableCell>
                              <Chip 
                                label={plan.is_active ? safeTranslate('common.active', 'Active') : safeTranslate('common.inactive', 'Inactive')} 
                                color={plan.is_active ? 'success' : 'default'} 
                                size="small"
                              />
                          </TableCell>
                          <TableCell align="right">
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <IconButton
                              onClick={() => handleViewDetails(plan)}
                              size="small"
                            >
                                  <Visibility />
                            </IconButton>
                            <IconButton
                              onClick={() => handleEditDialogOpen(plan)}
                                  size="small"
                            >
                              <PencilSimple />
                            </IconButton>
                            <IconButton
                                  onClick={() => handleDeleteDialogOpen(plan)}
                                  size="small"
                              color="error"
                            >
                              <Trash />
                            </IconButton>
                              </Stack>
                          </TableCell>
                        </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            {searchQuery 
                              ? safeTranslate('subscription_plans.no_results', 'No subscription plans match your search')
                              : safeTranslate('subscription_plans.no_plans', 'No subscription plans found')}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                  <TablePagination
                    component="div"
                  count={filteredPlans.length}
                  page={page}
                    onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  labelRowsPerPage={safeTranslate('common.rows_per_page', 'Rows per page:')}
                />
              </Box>
            )}
          </Card>
        </Stack>
      </Container>
      
      {/* Dialog components will remain unchanged for now */}
          
      {/* Create Subscription Plan Dialog */}
      <Dialog 
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <form onSubmit={handleSubmit(handleCreateSubmit)}>
          <DialogTitle>{safeTranslate('subscription_plans.create_title', 'Create Subscription Plan')}</DialogTitle>
          <Divider />
          <DialogContent sx={{ pt: 2 }}>
            <Stack spacing={3}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={safeTranslate('subscription_plans.form.name', 'Plan Name')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    fullWidth
                    required
                  />
                )}
              />
              
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={safeTranslate('subscription_plans.form.description', 'Description')}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    fullWidth
                    multiline
                    rows={3}
                    required
                  />
                )}
              />
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={safeTranslate('subscription_plans.form.price', 'Price')}
                      error={!!errors.price}
                      helperText={errors.price?.message}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  )}
                />
                
                <Controller
                  name="billing_cycle"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.billing_cycle}>
                      <InputLabel id="billing-cycle-label">
                        {safeTranslate('subscription_plans.form.billing_cycle', 'Billing Cycle')}
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="billing-cycle-label"
                        label={safeTranslate('subscription_plans.form.billing_cycle', 'Billing Cycle')}
                      >
                        <MenuItem value="monthly">{safeTranslate('subscription_plans.monthly', 'Monthly')}</MenuItem>
                        <MenuItem value="yearly">{safeTranslate('subscription_plans.yearly', 'Yearly')}</MenuItem>
                      </Select>
                      {errors.billing_cycle && (
                        <FormHelperText error>{errors.billing_cycle.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Box>
              
              <Controller
                name="features"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={safeTranslate('subscription_plans.form.features', 'Features')}
                    error={!!errors.features}
                    helperText={errors.features?.message || safeTranslate('subscription_plans.form.features_helper', 'Enter features separated by commas')}
                    fullWidth
                    multiline
                    rows={3}
                    required
                  />
                )}
              />
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name="storage_limit_gb"
                  control={control}
                  render={({ field: { onChange, value, ...rest } }) => (
                    <TextField
                      {...rest}
                      value={value}
                      onChange={(e) => onChange(Number(e.target.value))}
                      label={safeTranslate('subscription_plans.form.storage_limit', 'Storage Limit (GB)')}
                      type="number"
                      error={!!errors.storage_limit_gb}
                      helperText={errors.storage_limit_gb?.message}
                      fullWidth
                      required
                    />
                  )}
                />
                
                <Controller
                  name="duration_in_months"
                  control={control}
                  render={({ field: { onChange, value, ...rest } }) => (
                    <TextField
                      {...rest}
                      value={value}
                      onChange={(e) => onChange(Number(e.target.value))}
                      label={safeTranslate('subscription_plans.form.duration', 'Duration (months)')}
                      type="number"
                      error={!!errors.duration_in_months}
                      helperText={errors.duration_in_months?.message}
                      fullWidth
                    />
                  )}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name="max_products"
                  control={control}
                  render={({ field: { onChange, value, ...rest } }) => (
                    <TextField
                      {...rest}
                      value={value}
                      onChange={(e) => onChange(Number(e.target.value))}
                      label={safeTranslate('subscription_plans.form.max_products', 'Max Products')}
                      type="number"
                      error={!!errors.max_products}
                      helperText={errors.max_products?.message}
                      fullWidth
                    />
                  )}
                />
                
                <Controller
                  name="max_stores"
                  control={control}
                  render={({ field: { onChange, value, ...rest } }) => (
                    <TextField
                      {...rest}
                      value={value}
                      onChange={(e) => onChange(Number(e.target.value))}
                      label={safeTranslate('subscription_plans.form.max_stores', 'Max Stores')}
                      type="number"
                      error={!!errors.max_stores}
                      helperText={errors.max_stores?.message}
                      fullWidth
                    />
                  )}
                />
                
                <Controller
                  name="max_customers"
                  control={control}
                  render={({ field: { onChange, value, ...rest } }) => (
                    <TextField
                      {...rest}
                      value={value}
                      onChange={(e) => onChange(Number(e.target.value))}
                      label={safeTranslate('subscription_plans.form.max_customers', 'Max Customers')}
                      type="number"
                      error={!!errors.max_customers}
                      helperText={errors.max_customers?.message}
                      fullWidth
                    />
                  )}
                />
              </Box>
              
              <Controller
                name="is_active"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                        {...field}
                      />
                    }
                    label={safeTranslate('subscription_plans.form.is_active', 'Active')}
                  />
                )}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setCreateDialogOpen(false)}
            >
              {safeTranslate('common.cancel', 'Cancel')}
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : safeTranslate('common.create', 'Create')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Subscription Plan Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <form onSubmit={handleSubmit(handleEditSubmit)}>
          <DialogTitle>{safeTranslate('subscription_plans.edit_title', 'Edit Subscription Plan')}</DialogTitle>
          <Divider />
          <DialogContent sx={{ pt: 2 }}>
            <Stack spacing={3}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={safeTranslate('subscription_plans.form.name', 'Plan Name')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    fullWidth
                    required
                  />
                )}
              />
              
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={safeTranslate('subscription_plans.form.description', 'Description')}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    fullWidth
                    multiline
                    rows={3}
                    required
                  />
                )}
              />
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={safeTranslate('subscription_plans.form.price', 'Price')}
                      error={!!errors.price}
                      helperText={errors.price?.message}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  )}
                />
                
                <Controller
                  name="billing_cycle"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.billing_cycle}>
                      <InputLabel id="billing-cycle-label-edit">
                        {safeTranslate('subscription_plans.form.billing_cycle', 'Billing Cycle')}
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="billing-cycle-label-edit"
                        label={safeTranslate('subscription_plans.form.billing_cycle', 'Billing Cycle')}
                      >
                        <MenuItem value="monthly">{safeTranslate('subscription_plans.monthly', 'Monthly')}</MenuItem>
                        <MenuItem value="yearly">{safeTranslate('subscription_plans.yearly', 'Yearly')}</MenuItem>
                      </Select>
                      {errors.billing_cycle && (
                        <FormHelperText error>{errors.billing_cycle.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Box>
              
              <Controller
                name="features"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={safeTranslate('subscription_plans.form.features', 'Features')}
                    error={!!errors.features}
                    helperText={errors.features?.message || safeTranslate('subscription_plans.form.features_helper', 'Enter features separated by commas')}
                    fullWidth
                    multiline
                    rows={3}
                    required
                  />
                )}
              />
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name="storage_limit_gb"
                  control={control}
                  render={({ field: { onChange, value, ...rest } }) => (
                    <TextField
                      {...rest}
                      value={value}
                      onChange={(e) => onChange(Number(e.target.value))}
                      label={safeTranslate('subscription_plans.form.storage_limit', 'Storage Limit (GB)')}
                      type="number"
                      error={!!errors.storage_limit_gb}
                      helperText={errors.storage_limit_gb?.message}
                      fullWidth
                      required
                    />
                  )}
                />
                
                <Controller
                  name="duration_in_months"
                  control={control}
                  render={({ field: { onChange, value, ...rest } }) => (
                    <TextField
                      {...rest}
                      value={value}
                      onChange={(e) => onChange(Number(e.target.value))}
                      label={safeTranslate('subscription_plans.form.duration', 'Duration (months)')}
                      type="number"
                      error={!!errors.duration_in_months}
                      helperText={errors.duration_in_months?.message}
                      fullWidth
                    />
                  )}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name="max_products"
                  control={control}
                  render={({ field: { onChange, value, ...rest } }) => (
                    <TextField
                      {...rest}
                      value={value}
                      onChange={(e) => onChange(Number(e.target.value))}
                      label={safeTranslate('subscription_plans.form.max_products', 'Max Products')}
                      type="number"
                      error={!!errors.max_products}
                      helperText={errors.max_products?.message}
                      fullWidth
                    />
                  )}
                />
                
                <Controller
                  name="max_stores"
                  control={control}
                  render={({ field: { onChange, value, ...rest } }) => (
                    <TextField
                      {...rest}
                      value={value}
                      onChange={(e) => onChange(Number(e.target.value))}
                      label={safeTranslate('subscription_plans.form.max_stores', 'Max Stores')}
                      type="number"
                      error={!!errors.max_stores}
                      helperText={errors.max_stores?.message}
                      fullWidth
                    />
                  )}
                />
                
                <Controller
                  name="max_customers"
                  control={control}
                  render={({ field: { onChange, value, ...rest } }) => (
                    <TextField
                      {...rest}
                      value={value}
                      onChange={(e) => onChange(Number(e.target.value))}
                      label={safeTranslate('subscription_plans.form.max_customers', 'Max Customers')}
                      type="number"
                      error={!!errors.max_customers}
                      helperText={errors.max_customers?.message}
                      fullWidth
                    />
                  )}
                />
              </Box>
              
              <Controller
                name="is_active"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                        {...field}
                      />
                    }
                    label={safeTranslate('subscription_plans.form.is_active', 'Active')}
                  />
                )}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setEditDialogOpen(false)}
            >
              {safeTranslate('common.cancel', 'Cancel')}
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : safeTranslate('common.update', 'Update')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Subscription Plan Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>{safeTranslate('subscription_plans.delete_title', 'Delete Subscription Plan')}</DialogTitle>
            <DialogContent>
              <DialogContentText>
            {safeTranslate('subscription_plans.delete_confirmation', 'Are you sure you want to delete this subscription plan?')}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>{safeTranslate('common.cancel', 'Cancel')}</Button>
              <Button 
                onClick={handleDeleteSubmit} 
                color="error"
                disabled={isLoading}
              >
            {isLoading ? <CircularProgress size={24} /> : safeTranslate('common.delete', 'Delete')}
              </Button>
            </DialogActions>
          </Dialog>

      {/* Details Subscription Plan Dialog */}
          <Dialog 
            open={detailsDialogOpen} 
            onClose={() => setDetailsDialogOpen(false)}
            maxWidth="md"
            fullWidth
          >
            {selectedPlan && (
              <>
                <DialogTitle>
              {safeTranslate('subscription_plans.details_title', 'Subscription Plan Details')}
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ pt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        {selectedPlan.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {selectedPlan.description}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    
                    <Grid item xs={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                    {safeTranslate('subscription_plans.columns.price', 'Price')}
                      </Typography>
                      <Typography variant="body1">
                        ${selectedPlan.price}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                    {safeTranslate('subscription_plans.columns.billing_cycle', 'Billing Cycle')}
                      </Typography>
                      <Typography variant="body1">
                    {safeTranslate(`subscription_plans.${selectedPlan.billing_cycle}`, selectedPlan.billing_cycle === 'monthly' ? 'Monthly' : 'Yearly')}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                    {safeTranslate('subscription_plans.columns.storage', 'Storage (GB)')}
                      </Typography>
                      <Typography variant="body1">
                        {selectedPlan.storage_limit_gb} GB
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                    {safeTranslate('subscription_plans.columns.max_products', 'Max Products')}
                      </Typography>
                      <Typography variant="body1">
                        {selectedPlan.max_products}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                    {safeTranslate('subscription_plans.columns.max_stores', 'Max Stores')}
                      </Typography>
                      <Typography variant="body1">
                        {selectedPlan.max_stores}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                    {safeTranslate('subscription_plans.columns.max_customers', 'Max Customers')}
                      </Typography>
                      <Typography variant="body1">
                        {selectedPlan.max_customers}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} md={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                    {safeTranslate('subscription_plans.columns.status', 'Status')}
                      </Typography>
                      <Typography variant="body1">
                    {selectedPlan.is_active ? safeTranslate('common.active', 'Active') : safeTranslate('common.inactive', 'Inactive')}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                    {safeTranslate('subscription_plans.columns.features', 'Features')}
                      </Typography>
                      {typeof selectedPlan.features === 'string' && selectedPlan.features.split(',').map((feature: string, index: number) => (
                        <Typography key={index} variant="body2" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Box
                            component="span"
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: 'primary.main',
                              display: 'inline-block',
                              mr: 1.5
                            }}
                          />
                          {feature.trim()}
                        </Typography>
                      ))}
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setDetailsDialogOpen(false)}>
                {safeTranslate('common.close', 'Close')}
                  </Button>
                  <Button 
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      setDetailsDialogOpen(false);
                      handleEditDialogOpen(selectedPlan);
                    }}
                  >
                {safeTranslate('subscription_plans.edit_plan', 'Edit Plan')}
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>
    </Box>
  );
} 