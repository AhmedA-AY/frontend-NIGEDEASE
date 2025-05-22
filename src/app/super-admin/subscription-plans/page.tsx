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
  TablePagination
} from '@mui/material';
import { PencilSimple, Plus, Trash, MagnifyingGlass } from '@phosphor-icons/react/dist/ssr';
import { z as zod } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
  name: zod.string().min(1, 'Plan name is required'),
  description: zod.string().min(1, 'Description is required'),
  price: zod.string().min(1, 'Price is required'),
  billing_cycle: zod.enum(['monthly', 'yearly'], { required_error: 'Billing cycle is required' }),
  features: zod.string().min(1, 'Features are required'),
  is_active: zod.boolean(),
  storage_limit_gb: zod.number().min(1, 'Storage limit is required'),
  duration_in_months: zod.number().optional(),
  max_products: zod.number().optional(),
  max_stores: zod.number().optional(),
  max_customers: zod.number().optional()
});

type SubscriptionPlanFormValues = zod.infer<typeof subscriptionPlanSchema>;

export default function SubscriptionPlansPage(): React.JSX.Element {
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
      
      console.log('Sending data to create subscription plan:', formattedData);
      
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
      alert(`Error: ${errorMessage}`);
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
    <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={4}
          >
            <Stack spacing={1}>
              <Typography variant="h4">
          Subscription Plans
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage system subscription plans
              </Typography>
            </Stack>
            <Button
              startIcon={<Plus />}
              variant="contained"
              onClick={handleCreateDialogOpen}
            >
              Add Plan
            </Button>
          </Stack>
          
          {/* Search field */}
          <TextField
            fullWidth
            placeholder="Search plans by name, description or price..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MagnifyingGlass />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          
          {plansError && (
            <Alert severity="error">{(plansError as any)?.message || 'Failed to load subscription plans'}</Alert>
          )}
          
          {createPlanMutation.isError && (
            <Alert severity="error">{(createPlanMutation.error as any)?.message || 'Failed to create subscription plan'}</Alert>
          )}
          
          {updatePlanMutation.isError && (
            <Alert severity="error">{(updatePlanMutation.error as any)?.message || 'Failed to update subscription plan'}</Alert>
          )}
          
          {deletePlanMutation.isError && (
            <Alert severity="error">{(deletePlanMutation.error as any)?.message || 'Failed to delete subscription plan'}</Alert>
          )}
          
          {patchPlanMutation.isError && (
            <Alert severity="error">{(patchPlanMutation.error as any)?.message || 'Failed to update subscription plan status'}</Alert>
          )}
          
          <Card>
            <CardContent>
              {isLoadingPlans ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Billing Cycle</TableCell>
                        <TableCell>Storage (GB)</TableCell>
                        <TableCell>Max Products</TableCell>
                        <TableCell>Max Stores</TableCell>
                        <TableCell>Max Customers</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedPlans?.map((plan) => (
                        <TableRow key={plan.id}>
                          <TableCell>{plan.name}</TableCell>
                          <TableCell>{plan.price}</TableCell>
                          <TableCell>
                            {plan.billing_cycle === 'monthly' ? 'Monthly' : 'Yearly'}
                          </TableCell>
                          <TableCell>{plan.storage_limit_gb || 0}</TableCell>
                          <TableCell>{plan.max_products || 0}</TableCell>
                          <TableCell>{plan.max_stores || 0}</TableCell>
                          <TableCell>{plan.max_customers || 0}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Box
                                sx={{
                                  backgroundColor: plan.is_active ? 'success.light' : 'error.light',
                                  borderRadius: 1,
                                  color: 'white',
                                  display: 'inline-block',
                                  px: 1,
                                  py: 0.5
                                }}
                              >
                                {plan.is_active ? 'Active' : 'Inactive'}
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              color="info"
                              onClick={() => handleViewDetails(plan)}
                              size="small"
                              sx={{ mr: 1 }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M228,128c0,4.4-3.8,8-7.9,8a8.3,8.3,0,0,1-8.1-8,84,84,0,0,0-168,0,8.3,8.3,0,0,1-8.1,8c-4.1,0-7.9-3.6-7.9-8a100,100,0,0,1,200,0Zm-100,60a60,60,0,1,0-60-60A60.1,60.1,0,0,0,128,188Zm0-92a32,32,0,1,0,32,32A32,32,0,0,0,128,96Z"></path>
                              </svg>
                            </IconButton>
                            <IconButton
                              color="primary"
                              onClick={() => handleEditDialogOpen(plan)}
                            >
                              <PencilSimple />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteDialogOpen(plan)}
                            >
                              <Trash />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      {paginatedPlans?.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={9} align="center">
                            {searchQuery 
                              ? 'No subscription plans found matching your search' 
                              : 'No subscription plans found'}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <TablePagination
                    component="div"
                    count={filteredPlans?.length || 0}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                  />
                </TableContainer>
              )}
            </CardContent>
          </Card>
          
          {/* Create/Edit Dialog Form */}
          {(createDialogOpen || editDialogOpen) && (
            <Dialog 
              open={createDialogOpen || editDialogOpen} 
              onClose={() => createDialogOpen ? setCreateDialogOpen(false) : setEditDialogOpen(false)}
              maxWidth="md"
              fullWidth
            >
              <form onSubmit={handleSubmit(createDialogOpen ? handleCreateSubmit : handleEditSubmit)}>
                <DialogTitle>
                  {createDialogOpen ? 'Create Subscription Plan' : 'Edit Subscription Plan'}
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ pt: 2 }}>
                  <Stack spacing={3}>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
              <TextField
                          {...field}
                          label="Plan Name"
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
                          label="Description"
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
                            label="Price"
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
                            <Typography variant="body2" gutterBottom>
                              Billing Cycle
                            </Typography>
                            <Select {...field}>
                              <MenuItem value="monthly">Monthly</MenuItem>
                              <MenuItem value="yearly">Yearly</MenuItem>
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
                          label="Features (comma separated)"
                          error={!!errors.features}
                          helperText={errors.features?.message || "Enter features separated by commas (e.g. 'Feature 1, Feature 2')"}
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
                            label="Storage Limit (GB)"
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
                            label="Duration (months)"
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
                            label="Max Products"
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
                            label="Max Stores"
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
                            label="Max Customers"
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
                        <FormControl fullWidth>
                          <Typography variant="body2" gutterBottom>
                            Status
                          </Typography>
                          <Box
                            sx={{
                              backgroundColor: value ? 'success.light' : 'error.light',
                              borderRadius: 1,
                              color: 'white',
                              display: 'inline-block',
                              px: 2,
                              py: 1,
                              mt: 1
                            }}
                          >
                            {value ? 'Active' : 'Inactive'}
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            Status cannot be changed once a plan is created
                          </Typography>
                        </FormControl>
                      )}
                    />
                  </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                  <Button
                    onClick={() => createDialogOpen ? setCreateDialogOpen(false) : setEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained"
                    disabled={isLoading}
                  >
                    {isLoading ? <CircularProgress size={24} /> : (createDialogOpen ? 'Create' : 'Update')}
          </Button>
        </DialogActions>
              </form>
      </Dialog>
          )}

          {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Subscription Plan</DialogTitle>
            <Divider />
        <DialogContent>
          <DialogContentText>
                Are you sure you want to delete the subscription plan "{control._formValues.name}"?
                This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleDeleteSubmit} 
                color="error"
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

          {/* Success Message */}
          <Snackbar
            open={!!successMessage}
            autoHideDuration={6000}
            onClose={() => setSuccessMessage('')}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={() => setSuccessMessage('')} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Details Dialog */}
      <Dialog 
        open={detailsDialogOpen} 
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedPlan && (
          <>
            <DialogTitle>
              Subscription Plan Details
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
                    Price
                  </Typography>
                  <Typography variant="body1">
                    ${selectedPlan.price}
                  </Typography>
                </Grid>
                
                <Grid item xs={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Billing Cycle
                  </Typography>
                  <Typography variant="body1">
                    {selectedPlan.billing_cycle === 'monthly' ? 'Monthly' : 'Yearly'}
                  </Typography>
                </Grid>
                
                <Grid item xs={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography variant="body1">
                    {selectedPlan.duration_in_months} month{selectedPlan.duration_in_months !== 1 ? 's' : ''}
                  </Typography>
                </Grid>
                
                <Grid item xs={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Storage Limit
                  </Typography>
                  <Typography variant="body1">
                    {selectedPlan.storage_limit_gb} GB
                  </Typography>
                </Grid>
                
                <Grid item xs={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Max Products
                  </Typography>
                  <Typography variant="body1">
                    {selectedPlan.max_products}
                  </Typography>
                </Grid>
                
                <Grid item xs={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Max Stores
                  </Typography>
                  <Typography variant="body1">
                    {selectedPlan.max_stores}
                  </Typography>
                </Grid>
                
                <Grid item xs={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Max Customers
                  </Typography>
                  <Typography variant="body1">
                    {selectedPlan.max_customers}
                  </Typography>
                </Grid>
                
                <Grid item xs={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: selectedPlan.is_active ? 'success.light' : 'error.light',
                      borderRadius: 1,
                      color: 'white',
                      display: 'inline-block',
                      px: 1.5,
                      py: 0.5,
                      mt: 0.5
                    }}
                  >
                    {selectedPlan.is_active ? 'Active' : 'Inactive'}
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Features
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
                
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created At
                  </Typography>
                  <Typography variant="body2">
                    {new Date(selectedPlan.created_at).toLocaleString()}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body2">
                    {new Date(selectedPlan.updated_at).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsDialogOpen(false)}>
                Close
              </Button>
              <Button 
                color="primary"
                variant="contained"
                onClick={() => {
                  setDetailsDialogOpen(false);
                  handleEditDialogOpen(selectedPlan);
                }}
              >
                Edit Plan
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
        </Stack>
      </Container>
    </Box>
  );
} 