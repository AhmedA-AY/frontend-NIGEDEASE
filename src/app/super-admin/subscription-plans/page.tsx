'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';

import { useAdmin } from '@/contexts/admin-context';

const availableModules = [
  'POS',
  'Online Store',
  'Purchase Return',
  'Reports Download',
  'Sales Return',
  'Expense',
  'Stock Transfer',
  'Stock Adjustment',
  'Quotation/Estimate',
  'Reports',
];

export default function Page(): React.JSX.Element {
  const { subscriptionPlans, addSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan, loading, error } = useAdmin();
  
  // State
  const [selectedPlans, setSelectedPlans] = React.useState<string[]>([]);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [formState, setFormState] = React.useState({
    id: '',
    name: '',
    monthlyPrice: '',
    annualPrice: '',
    maxProducts: 0,
    modules: [] as string[],
  });
  const [successMessage, setSuccessMessage] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('plans');

  // Handlers
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedPlans(subscriptionPlans.map((plan) => plan.id));
    } else {
      setSelectedPlans([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedPlans.includes(id)) {
      setSelectedPlans(selectedPlans.filter((planId) => planId !== id));
    } else {
      setSelectedPlans([...selectedPlans, id]);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormState((prev) => ({
      ...prev,
      [name]: name === 'maxProducts' ? Number(value) : value,
    }));
  };

  const handleModulesChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const { value } = event.target;
    setFormState((prev) => ({
      ...prev,
      modules: value as string[],
    }));
  };

  const handleAddSubmit = () => {
    const { id, ...newPlan } = formState;
    addSubscriptionPlan(newPlan);
    setAddDialogOpen(false);
    setSuccessMessage('Subscription plan added successfully');
    resetForm();
  };

  const handleEditSubmit = () => {
    const { id, ...updates } = formState;
    updateSubscriptionPlan(id, updates);
    setEditDialogOpen(false);
    setSuccessMessage('Subscription plan updated successfully');
    resetForm();
  };

  const handleDeleteSubmit = () => {
    deleteSubscriptionPlan(formState.id);
    setDeleteDialogOpen(false);
    setSuccessMessage('Subscription plan deleted successfully');
    resetForm();
  };

  const resetForm = () => {
    setFormState({
      id: '',
      name: '',
      monthlyPrice: '',
      annualPrice: '',
      maxProducts: 0,
      modules: [],
    });
  };

  const handleEditClick = (id: string) => {
    const plan = subscriptionPlans.find((p) => p.id === id);
    if (plan) {
      setFormState(plan);
      setEditDialogOpen(true);
    }
  };

  const handleDeleteClick = (id: string) => {
    const plan = subscriptionPlans.find((p) => p.id === id);
    if (plan) {
      setFormState(plan);
      setDeleteDialogOpen(true);
    }
  };

  const closeSnackbar = () => {
    setSuccessMessage('');
  };
  
  const formatPrice = (price: string) => {
    // Convert string to number, remove non-numeric characters
    const numericValue = parseFloat(price.replace(/[^0-9.]/g, ''));
    
    // Format as currency
    return !isNaN(numericValue) 
      ? `$${numericValue.toFixed(2)}`
      : price;
  };

  return (
    <>
      <Box sx={{ py: 3 }}>
        <Typography variant="h4">Subscription Plans</Typography>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button 
          variant={activeTab === 'plans' ? 'contained' : 'outlined'} 
          onClick={() => setActiveTab('plans')}
        >
          Subscription Plans
        </Button>
        <Button 
          variant={activeTab === 'payment' ? 'contained' : 'outlined'} 
          onClick={() => setActiveTab('payment')}
        >
          Offline Payment Modes
        </Button>
        <Button 
          variant={activeTab === 'stripe' ? 'contained' : 'outlined'} 
          onClick={() => setActiveTab('stripe')}
        >
          Stripe
        </Button>
      </Box>

      {activeTab === 'plans' && (
        <Card>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              startIcon={<PlusIcon />}
              variant="contained"
              onClick={() => setAddDialogOpen(true)}
            >
              Add New Subscription Plan
            </Button>
          </Box>
          <Box sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={subscriptionPlans.length > 0 && selectedPlans.length === subscriptionPlans.length}
                      indeterminate={selectedPlans.length > 0 && selectedPlans.length < subscriptionPlans.length}
                      onChange={handleSelectAll}
                      aria-label="Select all plans"
                    />
                  </TableCell>
                  <TableCell>
                    Name
                  </TableCell>
                  <TableCell>
                    Pricing Details
                  </TableCell>
                  <TableCell>
                    Max Products
                  </TableCell>
                  <TableCell>
                    Enabled Modules
                  </TableCell>
                  <TableCell>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subscriptionPlans.map((plan) => (
                  <TableRow
                    hover
                    key={plan.id}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedPlans.includes(plan.id)}
                        onChange={() => handleSelectOne(plan.id)}
                        aria-label={`Select ${plan.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {plan.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={1}>
                        <Typography variant="body2">
                          Monthly Price: {plan.monthlyPrice}
                        </Typography>
                        <Typography variant="body2">
                          Annual Price: {plan.annualPrice}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {plan.maxProducts}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                        {plan.modules.map((module, index) => (
                          <Chip
                            key={index}
                            label={module}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          color="primary"
                          size="small"
                          startIcon={<PencilSimpleIcon />}
                          onClick={() => handleEditClick(plan.id)}
                        />
                        <Button
                          color="error"
                          size="small"
                          startIcon={<TrashIcon />}
                          onClick={() => handleDeleteClick(plan.id)}
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Card>
      )}

      {activeTab === 'payment' && (
        <Card>
          <CardContent>
            <Typography variant="h6">Offline Payment Settings</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, mb: 3 }}>
              Configure offline payment methods for subscription plans
            </Typography>
            <Typography>This feature is under development</Typography>
          </CardContent>
        </Card>
      )}

      {activeTab === 'stripe' && (
        <Card>
          <CardContent>
            <Typography variant="h6">Stripe Integration</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, mb: 3 }}>
              Configure Stripe payment gateway for subscription plans
            </Typography>
            <Typography>This feature is under development</Typography>
          </CardContent>
        </Card>
      )}

      {/* Add Subscription Plan Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Subscription Plan</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Plan Name"
                name="name"
                value={formState.name}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Monthly Price"
                name="monthlyPrice"
                value={formState.monthlyPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormState((prev) => ({
                    ...prev,
                    monthlyPrice: formatPrice(value),
                  }));
                }}
                InputProps={{
                  startAdornment: formState.monthlyPrice.startsWith('$') ? undefined : '$',
                }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Annual Price"
                name="annualPrice"
                value={formState.annualPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormState((prev) => ({
                    ...prev,
                    annualPrice: formatPrice(value),
                  }));
                }}
                InputProps={{
                  startAdornment: formState.annualPrice.startsWith('$') ? undefined : '$',
                }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Max Products"
                name="maxProducts"
                type="number"
                value={formState.maxProducts}
                onChange={handleFormChange}
                inputProps={{ min: 0 }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Enabled Modules</InputLabel>
                <Select
                  multiple
                  value={formState.modules}
                  onChange={handleModulesChange}
                  input={<OutlinedInput label="Enabled Modules" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {availableModules.map((module) => (
                    <MenuItem key={module} value={module}>
                      {module}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddSubmit} variant="contained" disabled={loading}>
            {loading ? 'Adding...' : 'Add Subscription Plan'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Subscription Plan Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Subscription Plan</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Plan Name"
                name="name"
                value={formState.name}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Monthly Price"
                name="monthlyPrice"
                value={formState.monthlyPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormState((prev) => ({
                    ...prev,
                    monthlyPrice: formatPrice(value),
                  }));
                }}
                InputProps={{
                  startAdornment: formState.monthlyPrice.startsWith('$') ? undefined : '$',
                }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Annual Price"
                name="annualPrice"
                value={formState.annualPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormState((prev) => ({
                    ...prev,
                    annualPrice: formatPrice(value),
                  }));
                }}
                InputProps={{
                  startAdornment: formState.annualPrice.startsWith('$') ? undefined : '$',
                }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Max Products"
                name="maxProducts"
                type="number"
                value={formState.maxProducts}
                onChange={handleFormChange}
                inputProps={{ min: 0 }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Enabled Modules</InputLabel>
                <Select
                  multiple
                  value={formState.modules}
                  onChange={handleModulesChange}
                  input={<OutlinedInput label="Enabled Modules" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {availableModules.map((module) => (
                    <MenuItem key={module} value={module}>
                      {module}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Subscription Plan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{formState.name}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteSubmit} color="error" variant="contained" disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success message */}
      <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
      
      {/* Error message */}
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000}>
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}
    </>
  );
} 