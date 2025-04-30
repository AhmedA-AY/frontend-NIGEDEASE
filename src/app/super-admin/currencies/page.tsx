'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
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

export default function Page(): React.JSX.Element {
  const { currencies, addCurrency, updateCurrency, deleteCurrency, loading, error } = useAdmin();
  
  // State
  const [selectedCurrencies, setSelectedCurrencies] = React.useState<string[]>([]);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [formState, setFormState] = React.useState({
    id: '',
    name: '',
    symbol: '',
    position: 'front',
    code: '',
  });
  const [successMessage, setSuccessMessage] = React.useState('');

  // Handlers
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedCurrencies(currencies.map((currency) => currency.id));
    } else {
      setSelectedCurrencies([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedCurrencies.includes(id)) {
      setSelectedCurrencies(selectedCurrencies.filter((currencyId) => currencyId !== id));
    } else {
      setSelectedCurrencies([...selectedCurrencies, id]);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }> | SelectChangeEvent) => {
    const { name, value, checked } = e.target as HTMLInputElement;
    setFormState((prev) => ({
      ...prev,
      [name]: name === 'active' ? checked : value,
    }));
  };

  const handleAddSubmit = () => {
    const { id, ...newCurrency } = formState;
    addCurrency(newCurrency);
    setAddDialogOpen(false);
    setSuccessMessage('Currency added successfully');
    resetForm();
  };

  const handleEditSubmit = () => {
    const { id, ...updates } = formState;
    updateCurrency(id, updates);
    setEditDialogOpen(false);
    setSuccessMessage('Currency updated successfully');
    resetForm();
  };

  const handleDeleteSubmit = () => {
    deleteCurrency(formState.id);
    setDeleteDialogOpen(false);
    setSuccessMessage('Currency deleted successfully');
    resetForm();
  };

  const resetForm = () => {
    setFormState({
      id: '',
      name: '',
      symbol: '',
      position: 'front',
      code: '',
    });
  };

  const handleEditClick = (id: string) => {
    const currency = currencies.find((c) => c.id === id);
    if (currency) {
      setFormState(currency);
      setEditDialogOpen(true);
    }
  };

  const handleDeleteClick = (id: string) => {
    const currency = currencies.find((c) => c.id === id);
    if (currency) {
      setFormState(currency);
      setDeleteDialogOpen(true);
    }
  };

  const closeSnackbar = () => {
    setSuccessMessage('');
  };

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Box sx={{ py: 3 }}>
          <Typography variant="h4">Currencies</Typography>
        </Box>
        
        <Card>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              startIcon={<PlusIcon />}
              variant="contained"
              onClick={() => setAddDialogOpen(true)}
            >
              Add New Currency
            </Button>
          </Box>
          <Box sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox 
                      checked={currencies.length > 0 && selectedCurrencies.length === currencies.length}
                      indeterminate={selectedCurrencies.length > 0 && selectedCurrencies.length < currencies.length}
                      onChange={handleSelectAll}
                      aria-label="Select all currencies"
                    />
                  </TableCell>
                  <TableCell>
                    Currency Name
                  </TableCell>
                  <TableCell>
                    Currency Symbol
                  </TableCell>
                  <TableCell>
                    Currency Position
                  </TableCell>
                  <TableCell>
                    Currency Code
                  </TableCell>
                  <TableCell>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currencies.map((currency) => (
                  <TableRow
                    hover
                    key={currency.id}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedCurrencies.includes(currency.id)}
                        onChange={() => handleSelectOne(currency.id)}
                        aria-label={`Select ${currency.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {currency.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {currency.symbol}
                    </TableCell>
                    <TableCell>
                      {currency.position === 'front' ? 'Before Amount' : 'After Amount'}
                    </TableCell>
                    <TableCell>
                      {currency.code}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          color="primary"
                          size="small"
                          startIcon={<PencilSimpleIcon />}
                          onClick={() => handleEditClick(currency.id)}
                        />
                        <Button
                          color="error"
                          size="small"
                          startIcon={<TrashIcon />}
                          onClick={() => handleDeleteClick(currency.id)}
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Card>
      </Box>

      {/* Add Currency Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Currency</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Currency Name"
                name="name"
                value={formState.name}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Currency Symbol"
                name="symbol"
                value={formState.symbol}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Currency Position</InputLabel>
                <Select
                  name="position"
                  value={formState.position}
                  onChange={handleFormChange}
                  label="Currency Position"
                >
                  <MenuItem value="front">Before Amount</MenuItem>
                  <MenuItem value="back">After Amount</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Currency Code"
                name="code"
                value={formState.code}
                onChange={handleFormChange}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddSubmit} variant="contained" disabled={loading}>
            {loading ? 'Adding...' : 'Add Currency'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Currency Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Currency</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Currency Name"
                name="name"
                value={formState.name}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Currency Symbol"
                name="symbol"
                value={formState.symbol}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Currency Position</InputLabel>
                <Select
                  name="position"
                  value={formState.position}
                  onChange={handleFormChange}
                  label="Currency Position"
                >
                  <MenuItem value="front">Before Amount</MenuItem>
                  <MenuItem value="back">After Amount</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Currency Code"
                name="code"
                value={formState.code}
                onChange={handleFormChange}
                required
              />
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
        <DialogTitle>Delete Currency</DialogTitle>
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