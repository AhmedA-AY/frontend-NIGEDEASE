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
import FormControlLabel from '@mui/material/FormControlLabel';
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
import { Check as CheckIcon } from '@phosphor-icons/react/dist/ssr/Check';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';

import { useAdmin } from '@/contexts/admin-context';

export default function Page(): React.JSX.Element {
  const { companies, subscriptionPlans, addCompany, updateCompany, deleteCompany, loading, error } = useAdmin();
  
  // State
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCompanies, setSelectedCompanies] = React.useState<string[]>([]);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [formState, setFormState] = React.useState({
    id: '',
    name: '',
    email: '',
    verified: false,
    registerDate: new Date().toISOString().split('T')[0],
    users: 1,
    subscriptionPlan: 'Trial (monthly)',
    status: 'active' as 'active' | 'inactive' | 'expired',
  });
  const [successMessage, setSuccessMessage] = React.useState('');

  // Filter companies based on search query
  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedCompanies(filteredCompanies.map((company) => company.id));
    } else {
      setSelectedCompanies([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedCompanies.includes(id)) {
      setSelectedCompanies(selectedCompanies.filter((companyId) => companyId !== id));
    } else {
      setSelectedCompanies([...selectedCompanies, id]);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }> | SelectChangeEvent) => {
    const { name, value, checked } = e.target as HTMLInputElement;
    setFormState((prev) => ({
      ...prev,
      [name]: name === 'verified' ? checked : value,
    }));
  };

  const handleAddSubmit = () => {
    const { id, ...newCompany } = formState;
    addCompany(newCompany);
    setAddDialogOpen(false);
    setSuccessMessage('Company added successfully');
    resetForm();
  };

  const handleEditSubmit = () => {
    const { id, ...updates } = formState;
    updateCompany(id, updates);
    setEditDialogOpen(false);
    setSuccessMessage('Company updated successfully');
    resetForm();
  };

  const handleDeleteSubmit = () => {
    deleteCompany(formState.id);
    setDeleteDialogOpen(false);
    setSuccessMessage('Company deleted successfully');
    resetForm();
  };

  const resetForm = () => {
    setFormState({
      id: '',
      name: '',
      email: '',
      verified: false,
      registerDate: new Date().toISOString().split('T')[0],
      users: 1,
      subscriptionPlan: 'Trial (monthly)',
      status: 'active' as 'active' | 'inactive' | 'expired',
    });
  };

  const handleEditClick = (id: string) => {
    const company = companies.find((c) => c.id === id);
    if (company) {
      setFormState({
        ...company,
        status: company.status || 'active',
      });
      setEditDialogOpen(true);
    }
  };

  const handleDeleteClick = (id: string) => {
    const company = companies.find((c) => c.id === id);
    if (company) {
      setFormState({
        ...company,
        status: company.status || 'active',
      });
      setDeleteDialogOpen(true);
    }
  };

  const closeSnackbar = () => {
    setSuccessMessage('');
  };

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>Companies</Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
          <Box sx={{ 
            backgroundColor: '#f9e8e8', 
            p: 2, 
            borderRadius: 1, 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box component="span" sx={{ mr: 1 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M11.25 10.5V6.75C11.25 6.55109 11.329 6.36032 11.4697 6.21967C11.6103 6.07902 11.8011 6 12 6C12.1989 6 12.3897 6.07902 12.5303 6.21967C12.671 6.36032 12.75 6.55109 12.75 6.75V10.5C12.75 10.6989 12.671 10.8897 12.5303 11.0303C12.3897 11.171 12.1989 11.25 12 11.25C11.8011 11.25 11.6103 11.171 11.4697 11.0303C11.329 10.8897 11.25 10.6989 11.25 10.5ZM12 13.5C11.7033 13.5 11.4133 13.588 11.1666 13.7528C10.92 13.9176 10.7277 14.1519 10.6142 14.426C10.5007 14.7001 10.4709 15.0017 10.5288 15.2926C10.5867 15.5836 10.7296 15.8509 10.9393 16.0607C11.1491 16.2704 11.4164 16.4133 11.7074 16.4712C11.9983 16.5291 12.2999 16.4993 12.574 16.3858C12.8481 16.2723 13.0824 16.08 13.2472 15.8334C13.412 15.5867 13.5 15.2967 13.5 15C13.5 14.8011 13.4602 14.6045 13.3836 14.426C13.307 14.2476 13.195 14.092 13.0607 13.9697C12.9263 13.8473 12.7679 13.7514 12.5962 13.6882C12.4246 13.625 12.2428 13.5962 12.0627 13.6035C11.8825 13.6109 11.7051 13.6543 11.5409 13.731C11.3767 13.8077 11.2293 13.9163 11.1074 14.0506C10.9855 14.1849 10.8915 14.342 10.8308 14.5121C10.7701 14.6822 10.7438 14.8618 10.7539 15.0414C10.7641 15.221 10.8105 15.3965 10.8902 15.5579C10.9698 15.7193 11.0813 15.8632 11.2179 15.9811C11.3546 16.099 11.5136 16.1887 11.6843 16.2448C11.855 16.3009 12.0343 16.3222 12.2125 16.3071C12.3907 16.292 12.5634 16.2408 12.7212 16.1566C12.8791 16.0724 13.0186 15.9567 13.1312 15.8165C13.2438 15.6763 13.3274 15.5145 13.3772 15.3421C13.4269 15.1696 13.4418 14.9896 13.4209 14.8122C13.4 14.6348 13.3438 14.4637 13.2552 14.3082C13.1666 14.1528 13.0471 14.0162 12.9038 13.907C12.7605 13.7979 12.5962 13.7184 12.4221 13.673C12.248 13.6276 12.0672 13.6173 11.8888 13.6427C11.7104 13.668 11.5376 13.7285 11.3799 13.8213C11.2221 13.9141 11.0824 14.0374 10.9695 14.1838C10.8565 14.3302 10.7724 14.4966 10.7223 14.6714C10.6721 14.8462 10.6569 15.0269 10.6773 15.2054L12 15ZM21 11.25H16.5V6.75C16.5 5.75544 16.1049 4.80161 15.4016 4.09835C14.6984 3.39509 13.7446 3 12.75 3H11.25C10.2554 3 9.30161 3.39509 8.59835 4.09835C7.89509 4.80161 7.5 5.75544 7.5 6.75V11.25H3C2.80109 11.25 2.61032 11.329 2.46967 11.4697C2.32902 11.6103 2.25 11.8011 2.25 12C2.25 12.1989 2.32902 12.3897 2.46967 12.5303C2.61032 12.671 2.80109 12.75 3 12.75H7.5V17.25C7.5 18.2446 7.89509 19.1984 8.59835 19.9017C9.30161 20.6049 10.2554 21 11.25 21H12.75C13.7446 21 14.6984 20.6049 15.4016 19.9017C16.1049 19.1984 16.5 18.2446 16.5 17.25V12.75H21C21.1989 12.75 21.3897 12.671 21.5303 12.5303C21.671 12.3897 21.75 12.1989 21.75 12C21.75 11.8011 21.671 11.6103 21.5303 11.4697C21.3897 11.329 21.1989 11.25 21 11.25ZM15 17.25C15 17.8467 14.7629 18.419 14.341 18.841C13.919 19.2629 13.3467 19.5 12.75 19.5H11.25C10.6533 19.5 10.081 19.2629 9.65901 18.841C9.23705 18.419 9 17.8467 9 17.25V6.75C9 6.15326 9.23705 5.58097 9.65901 5.15901C10.081 4.73705 10.6533 4.5 11.25 4.5H12.75C13.3467 4.5 13.919 4.73705 14.341 5.15901C14.7629 5.58097 15 6.15326 15 6.75V17.25Z" fill="#e32c2c"/>
                </svg>
              </Box>
              <Typography>Email setting not configured</Typography>
            </Box>
            <Button variant="outlined" size="small">Configure</Button>
          </Box>
        </Box>

        <Card>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
            <TextField 
              placeholder="Search..."
              size="small"
              sx={{ width: 300 }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              startIcon={<PlusIcon />}
              variant="contained"
              onClick={() => setAddDialogOpen(true)}
            >
              Add New Company
            </Button>
          </Box>
          <Box sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox 
                      checked={filteredCompanies.length > 0 && selectedCompanies.length === filteredCompanies.length}
                      indeterminate={selectedCompanies.length > 0 && selectedCompanies.length < filteredCompanies.length}
                      onChange={handleSelectAll}
                      aria-label="Select all companies"
                    />
                  </TableCell>
                  <TableCell>
                    Company Name
                  </TableCell>
                  <TableCell>
                    Company Email
                  </TableCell>
                  <TableCell>
                    Details
                  </TableCell>
                  <TableCell>
                    Subscription Plan
                  </TableCell>
                  <TableCell>
                    Status
                  </TableCell>
                  <TableCell>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow
                    hover
                    key={company.id}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox 
                        checked={selectedCompanies.includes(company.id)}
                        onChange={() => handleSelectOne(company.id)}
                        aria-label={`Select ${company.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {company.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {company.email}
                    </TableCell>
                    <TableCell>
                      <Stack spacing={1}>
                        <Typography variant="body2">
                          Verified: {company.verified ? (
                            <CheckIcon color="success" />
                          ) : (
                            <XIcon color="error" />
                          )}
                        </Typography>
                        <Typography variant="body2">
                          Register Date: {company.registerDate}
                        </Typography>
                        <Typography variant="body2">
                          Total Users: {company.users}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {company.subscriptionPlan}
                        <Button 
                          size="small" 
                          variant="outlined"
                          onClick={() => handleEditClick(company.id)}
                        >
                          Change
                        </Button>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ 
                        backgroundColor: company.status === 'active' ? '#e8f8ed' : company.status === 'inactive' ? '#fff4e5' : '#feeef0',
                        color: company.status === 'active' ? '#1ea659' : company.status === 'inactive' ? '#f79009' : '#e32c2c',
                        display: 'flex',
                        alignItems: 'center',
                        px: 1,
                        py: 0.5,
                        borderRadius: 5,
                        width: 'fit-content'
                      }}>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          backgroundColor: company.status === 'active' ? '#1ea659' : company.status === 'inactive' ? '#f79009' : '#e32c2c',
                          mr: 0.5
                        }} />
                        {company.status === 'active' 
                          ? 'Active' 
                          : company.status === 'inactive' 
                            ? 'Inactive' 
                            : 'Expired'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          sx={{ minWidth: 'unset', p: 1 }}
                          variant="contained"
                          color="primary"
                          onClick={() => handleEditClick(company.id)}
                        >
                          <PencilSimpleIcon size={18} />
                        </Button>
                        <Button
                          size="small"
                          sx={{ minWidth: 'unset', p: 1 }}
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteClick(company.id)}
                        >
                          <TrashIcon size={18} />
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Card>
      </Box>

      {/* Add Company Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Company</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                name="name"
                value={formState.name}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formState.verified}
                    onChange={handleFormChange}
                    name="verified"
                  />
                }
                label="Verified"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Register Date"
                name="registerDate"
                type="date"
                value={formState.registerDate}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Users"
                name="users"
                type="number"
                value={formState.users}
                onChange={handleFormChange}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Subscription Plan</InputLabel>
                <Select
                  name="subscriptionPlan"
                  value={formState.subscriptionPlan}
                  onChange={handleFormChange}
                  label="Subscription Plan"
                >
                  <MenuItem value="Trial (monthly)">Trial (monthly)</MenuItem>
                  {subscriptionPlans.map((plan) => (
                    <MenuItem key={plan.id} value={plan.name}>
                      {plan.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formState.status}
                  onChange={handleFormChange}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddSubmit} variant="contained" disabled={loading}>
            {loading ? 'Adding...' : 'Add Company'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Company Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Company</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                name="name"
                value={formState.name}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formState.verified}
                    onChange={handleFormChange}
                    name="verified"
                  />
                }
                label="Verified"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Register Date"
                name="registerDate"
                type="date"
                value={formState.registerDate}
                onChange={handleFormChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Users"
                name="users"
                type="number"
                value={formState.users}
                onChange={handleFormChange}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Subscription Plan</InputLabel>
                <Select
                  name="subscriptionPlan"
                  value={formState.subscriptionPlan}
                  onChange={handleFormChange}
                  label="Subscription Plan"
                >
                  <MenuItem value="Trial (monthly)">Trial (monthly)</MenuItem>
                  {subscriptionPlans.map((plan) => (
                    <MenuItem key={plan.id} value={plan.name}>
                      {plan.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formState.status}
                  onChange={handleFormChange}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
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
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Company</DialogTitle>
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