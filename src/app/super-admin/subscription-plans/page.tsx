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
  Select
} from '@mui/material';
import { PencilSimple, Plus, Trash } from '@phosphor-icons/react/dist/ssr';
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
  storage_limit_gb: zod.number().min(1, 'Storage limit is required')
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
  const [successMessage, setSuccessMessage] = useState('');
  
  const defaultValues: SubscriptionPlanFormValues = {
    name: '',
    description: '',
    price: '',
    billing_cycle: 'monthly',
    features: '',
    is_active: true,
    storage_limit_gb: 10
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
    setEditDialogOpen(true);
  };
  
  const handleDeleteDialogOpen = (plan: any) => {
    setValue('id', plan.id);
    setValue('name', plan.name);
    setDeleteDialogOpen(true);
  };
  
  const handleCreateSubmit = async (data: SubscriptionPlanFormValues) => {
    try {
      const { id, ...planData } = data;
      await createPlanMutation.mutateAsync(planData as SubscriptionPlanData);
      setCreateDialogOpen(false);
      setSuccessMessage('Subscription plan created successfully');
      reset(defaultValues);
    } catch (error) {
      console.error('Error creating subscription plan:', error);
    }
  };
  
  const handleEditSubmit = async (data: SubscriptionPlanFormValues) => {
    try {
      if (data.id) {
        const { id, ...planData } = data;
        await updatePlanMutation.mutateAsync({
          id,
          data: planData as SubscriptionPlanData
        });
    setEditDialogOpen(false);
    setSuccessMessage('Subscription plan updated successfully');
        reset(defaultValues);
      }
    } catch (error) {
      console.error('Error updating subscription plan:', error);
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

  const handleToggleStatus = async (plan: any) => {
    try {
      await patchPlanMutation.mutateAsync({
        id: plan.id,
        data: { is_active: !plan.is_active }
      });
      setSuccessMessage(`Plan ${plan.name} ${!plan.is_active ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling plan status:', error);
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
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                      {subscriptionPlans?.map((plan) => (
                        <TableRow key={plan.id}>
                          <TableCell>{plan.name}</TableCell>
                          <TableCell>{plan.price}</TableCell>
                    <TableCell>
                            {plan.billing_cycle === 'monthly' ? 'Monthly' : 'Yearly'}
                    </TableCell>
                          <TableCell>{plan.storage_limit_gb}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Switch
                                checked={plan.is_active}
                                onChange={() => handleToggleStatus(plan)}
                                color="success"
                                size="small"
                              />
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
                      {subscriptionPlans?.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            No subscription plans found
                          </TableCell>
                        </TableRow>
                      )}
              </TableBody>
            </Table>
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
                        render={({ field: { onChange, value, ...field } }) => (
              <TextField
                            {...field}
                            label="Storage Limit (GB)"
                            type="number"
                            value={value}
                            onChange={(e) => onChange(Number(e.target.value))}
                            error={!!errors.storage_limit_gb}
                            helperText={errors.storage_limit_gb?.message}
                fullWidth
                required
                            inputProps={{ min: 1 }}
                          />
                        )}
                      />
                      
                      <Controller
                        name="is_active"
                        control={control}
                        render={({ field: { value, onChange, ...field } }) => (
              <FormControl fullWidth>
                            <Typography variant="body2" gutterBottom>
                              Status
                            </Typography>
                            <FormControlLabel
                              control={
                                <Switch
                                  {...field}
                                  checked={value}
                                  onChange={(e) => onChange(e.target.checked)}
                                />
                              }
                              label={value ? "Active" : "Inactive"}
                            />
                          </FormControl>
                        )}
                      />
                    </Box>
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
        </Stack>
      </Container>
    </Box>
  );
} 