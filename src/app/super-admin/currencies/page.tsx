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
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { PencilSimple, Plus, Trash } from '@phosphor-icons/react/dist/ssr';
import { z as zod } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCurrencies, useCreateCurrency, useUpdateCurrency, useDeleteCurrency, usePatchCurrency } from '@/hooks/use-companies';

const currencySchema = zod.object({
  id: zod.string().optional(),
  name: zod.string().min(1, 'Currency name is required'),
  code: zod.string().min(2, 'Currency code is required').max(3, 'Currency code must be 2-3 characters')
});

type CurrencyFormValues = zod.infer<typeof currencySchema>;

export default function CurrenciesPage(): React.JSX.Element {
  const { data: currencies, isLoading: isLoadingCurrencies, error: currenciesError } = useCurrencies();
  const createCurrencyMutation = useCreateCurrency();
  const updateCurrencyMutation = useUpdateCurrency();
  const deleteCurrencyMutation = useDeleteCurrency();
  const patchCurrencyMutation = usePatchCurrency();
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const defaultValues: CurrencyFormValues = {
    name: '',
    code: '',
  };
  
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<CurrencyFormValues>({
    resolver: zodResolver(currencySchema),
    defaultValues
  });
  
  const isLoading = isLoadingCurrencies || 
    createCurrencyMutation.isPending || 
    updateCurrencyMutation.isPending || 
    deleteCurrencyMutation.isPending ||
    patchCurrencyMutation.isPending;
  
  const handleCreateDialogOpen = () => {
    reset(defaultValues);
    setCreateDialogOpen(true);
  };
  
  const handleEditDialogOpen = (currency: any) => {
    setValue('id', currency.id);
    setValue('name', currency.name);
    setValue('code', currency.code);
    setEditDialogOpen(true);
  };
  
  const handleDeleteDialogOpen = (currency: any) => {
    setValue('id', currency.id);
    setValue('name', currency.name);
    setValue('code', currency.code);
    setDeleteDialogOpen(true);
  };
  
  const handleCreateSubmit = async (data: CurrencyFormValues) => {
    try {
      await createCurrencyMutation.mutateAsync({
        name: data.name,
        code: data.code
      });
      setCreateDialogOpen(false);
      setSuccessMessage('Currency created successfully');
      reset(defaultValues);
    } catch (error) {
      console.error('Error creating currency:', error);
    }
  };
  
  const handleEditSubmit = async (data: CurrencyFormValues) => {
    try {
      if (data.id) {
        await updateCurrencyMutation.mutateAsync({
          id: data.id,
          data: {
            name: data.name,
            code: data.code
          }
        });
        setEditDialogOpen(false);
        setSuccessMessage('Currency updated successfully');
        reset(defaultValues);
      }
    } catch (error) {
      console.error('Error updating currency:', error);
    }
  };
  
  const handleDeleteSubmit = async () => {
    try {
      const id = control._formValues.id;
      if (id) {
        await deleteCurrencyMutation.mutateAsync(id);
        setDeleteDialogOpen(false);
        setSuccessMessage('Currency deleted successfully');
        reset(defaultValues);
      }
    } catch (error) {
      console.error('Error deleting currency:', error);
    }
  };
  
  // Quick edit for currency code using PATCH
  const handleQuickCodeUpdate = async (id: string, newCode: string) => {
    try {
      await patchCurrencyMutation.mutateAsync({
        id,
        data: { code: newCode }
      });
      setSuccessMessage('Currency code updated successfully');
    } catch (error) {
      console.error('Error updating currency code:', error);
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
                Currencies
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage system currencies
              </Typography>
            </Stack>
            <Button
              startIcon={<Plus />}
              variant="contained"
              onClick={handleCreateDialogOpen}
            >
              Add Currency
            </Button>
          </Stack>
          
          {currenciesError && (
            <Alert severity="error">{(currenciesError as any)?.message || 'Failed to load currencies'}</Alert>
          )}
          
          {createCurrencyMutation.isError && (
            <Alert severity="error">{(createCurrencyMutation.error as any)?.message || 'Failed to create currency'}</Alert>
          )}
          
          {updateCurrencyMutation.isError && (
            <Alert severity="error">{(updateCurrencyMutation.error as any)?.message || 'Failed to update currency'}</Alert>
          )}
          
          {deleteCurrencyMutation.isError && (
            <Alert severity="error">{(deleteCurrencyMutation.error as any)?.message || 'Failed to delete currency'}</Alert>
          )}
          
          {patchCurrencyMutation.isError && (
            <Alert severity="error">{(patchCurrencyMutation.error as any)?.message || 'Failed to update currency'}</Alert>
          )}
          
          <Card>
            <CardContent>
              {isLoadingCurrencies ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Currency Name</TableCell>
                        <TableCell>Code</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currencies?.map((currency) => (
                        <TableRow key={currency.id}>
                          <TableCell>{currency.name}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <TextField
                                size="small"
                                defaultValue={currency.code}
                                inputProps={{
                                  maxLength: 3,
                                  style: { textTransform: 'uppercase' }
                                }}
                                onBlur={(e) => {
                                  const newCode = e.target.value.toUpperCase();
                                  if (newCode !== currency.code) {
                                    handleQuickCodeUpdate(currency.id, newCode);
                                  }
                                }}
                                sx={{ maxWidth: 80 }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              color="primary"
                              onClick={() => handleEditDialogOpen(currency)}
                            >
                              <PencilSimple />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteDialogOpen(currency)}
                            >
                              <Trash />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      {currencies?.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            No currencies found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
          
          {/* Create Dialog */}
          <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
            <form onSubmit={handleSubmit(handleCreateSubmit)}>
              <DialogTitle>Add Currency</DialogTitle>
              <Divider />
              <DialogContent sx={{ pt: 2 }}>
                <Stack spacing={3} sx={{ minWidth: 400 }}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Currency Name"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        fullWidth
                        required
                      />
                    )}
                  />
                  <Controller
                    name="code"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Currency Code"
                        error={!!errors.code}
                        helperText={errors.code?.message}
                        fullWidth
                        required
                      />
                    )}
                  />
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                <Button 
                  type="submit" 
                  variant="contained"
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Create'}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
          
          {/* Edit Dialog */}
          <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
            <form onSubmit={handleSubmit(handleEditSubmit)}>
              <DialogTitle>Edit Currency</DialogTitle>
              <Divider />
              <DialogContent sx={{ pt: 2 }}>
                <Stack spacing={3} sx={{ minWidth: 400 }}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Currency Name"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        fullWidth
                        required
                      />
                    )}
                  />
                  <Controller
                    name="code"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Currency Code"
                        error={!!errors.code}
                        helperText={errors.code?.message}
                        fullWidth
                        required
                      />
                    )}
                  />
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                <Button 
                  type="submit" 
                  variant="contained"
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Update'}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
          
          {/* Delete Dialog */}
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>Delete Currency</DialogTitle>
            <Divider />
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete the currency "{control._formValues.name}"?
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