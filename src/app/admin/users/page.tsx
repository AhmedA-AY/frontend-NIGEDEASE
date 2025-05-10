'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

import { paths } from '@/paths';
import { usersApi } from '@/services/api/users';
import { authApi, UserResponse, CreateUserData } from '@/services/api/auth';
import { useSnackbar } from 'notistack';
import { useCurrentUser } from '@/hooks/use-auth';

// User type definition for form data
type UserRole = 'super_admin' | 'admin' | 'salesman' | 'stock_manager' | string;
type UserFormData = Omit<CreateUserData, 'role'> & { 
  id?: string;
  role: UserRole;
};

// User form dialog component
function UserFormDialog({ 
  open, 
  onClose, 
  user, 
  companyId, 
  onSave 
}: { 
  open: boolean; 
  onClose: () => void; 
  user: Partial<CreateUserData & { id?: string; role?: string }> | null; 
  companyId: string; 
  onSave: (userData: UserFormData) => Promise<void>; 
}) {
  const [formData, setFormData] = useState<UserFormData>({
    company_id: companyId,
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'stock_manager',
    profile_image: ''
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        company_id: user.company_id || companyId,
        email: user.email || '',
        password: user.id ? '' : (user.password || ''), // Don't require password for edits
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        role: (user.role as UserRole) || 'stock_manager',
        profile_image: user.profile_image || ''
      });
    } else {
      setFormData({
        company_id: companyId,
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'stock_manager',
        profile_image: ''
      });
    }
    setErrors({});
  }, [user, companyId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.id && !formData.password) {
      newErrors.password = 'Password is required for new users';
    } else if (!formData.id && formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.first_name) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!formData.last_name) {
      newErrors.last_name = 'Last name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e: SelectChangeEvent) => {
    setFormData(prev => ({ ...prev, role: e.target.value as UserRole }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
      enqueueSnackbar('Failed to save user. Please try again.', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{user?.id ? 'Edit User' : 'Add New User'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleTextChange}
            fullWidth
            required
            error={!!errors.email}
            helperText={errors.email}
          />
          
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleTextChange}
            fullWidth
            required={!user?.id}
            error={!!errors.password}
            helperText={errors.password || (user?.id ? 'Leave blank to keep current password' : '')}
          />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleTextChange}
                fullWidth
                required
                error={!!errors.first_name}
                helperText={errors.first_name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleTextChange}
                fullWidth
                required
                error={!!errors.last_name}
                helperText={errors.last_name}
              />
            </Grid>
          </Grid>
          
          <FormControl fullWidth>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={formData.role}
              onChange={handleRoleChange}
              label="Role"
            >
              <MenuItem value="stock_manager">Stock Manager</MenuItem>
              <MenuItem value="salesman">Salesman</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Profile Image URL"
            name="profile_image"
            value={formData.profile_image}
            onChange={handleTextChange}
            fullWidth
            placeholder="https://example.com/image.jpg"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={saving}
          startIcon={saving ? <CircularProgress size={20} /> : null}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Delete confirmation dialog
function DeleteUserDialog({ 
  open, 
  onClose, 
  userId, 
  onDelete 
}: { 
  open: boolean; 
  onClose: () => void; 
  userId: string | null;
  onDelete: () => Promise<void>; 
}) {
  const [deleting, setDeleting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    if (!userId) return;
    
    setDeleting(true);
    try {
      await onDelete();
      enqueueSnackbar('User deleted successfully', { variant: 'success' });
      onClose();
    } catch (error) {
      console.error('Error deleting user:', error);
      enqueueSnackbar('Failed to delete user', { variant: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete User</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this user? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleDelete} 
          color="error" 
          disabled={deleting}
          startIcon={deleting ? <CircularProgress size={20} /> : null}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<(Partial<CreateUserData> & { id?: string; role?: string }) | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  
  const { enqueueSnackbar } = useSnackbar();
  const { userInfo } = useCurrentUser();
  
  // Fetch users data
  const fetchUsers = useCallback(async () => {
    if (!userInfo) {
      enqueueSnackbar('User profile not available. Please log in again.', { variant: 'error' });
      setIsLoading(false);
      return;
    }

    if (!userInfo.company_id) {
      enqueueSnackbar('Company information not available. Please log in again.', { variant: 'error' });
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Fetching users for company:', userInfo.company_id);
      
      // Use the company_id parameter to get users filtered by company on the backend
      const allUsers = await usersApi.getUsers(userInfo.company_id);
      console.log('Users retrieved:', allUsers.length);
      
      // Additional filter for stock_manager and salesman roles on the client side
      const filteredByRole = allUsers.filter(user => 
        user.role === 'stock_manager' || user.role === 'salesman'
      );
      console.log('Users after role filtering:', filteredByRole.length);
      
      setUsers(filteredByRole);
      
      // The filter effect will run after this to update filteredUsers
    } catch (error) {
      console.error('Error fetching users:', error);
      enqueueSnackbar('Failed to load users. Please try again.', { variant: 'error' });
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [userInfo, enqueueSnackbar]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  // Filter users based on search query and role filter
  const filterUsers = useCallback((userList: UserResponse[], query: string, role: string) => {
    let filtered = [...userList];
    
    // Apply search filter
    if (query) {
      const searchLower = query.toLowerCase();
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchLower) ||
        (user.first_name && user.first_name.toLowerCase().includes(searchLower)) ||
        (user.last_name && user.last_name.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply role filter
    if (role !== 'all') {
      filtered = filtered.filter(user => user.role === role);
    }
    
    setFilteredUsers(filtered);
  }, []);
  
  useEffect(() => {
    filterUsers(users, searchQuery, roleFilter);
    // Add debug logging to help troubleshoot the filter functionality
    console.log('Filter applied:', {
      totalUsers: users.length,
      filteredUsersCount: filteredUsers.length,
      searchQuery,
      roleFilter
    });
  }, [users, searchQuery, roleFilter, filterUsers]);
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  const handleRoleFilterChange = (event: SelectChangeEvent) => {
    setRoleFilter(event.target.value);
  };
  
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };
  
  const handleSelectOne = (id: string) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(userId => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };
  
  const handleAddUser = () => {
    setCurrentUser({
      company_id: userInfo?.company_id || '',
      role: 'stock_manager'
    });
    setUserFormOpen(true);
  };
  
  const handleEditUser = (user: UserResponse) => {
    // Cast the role to ensure type compatibility
    setCurrentUser({
      ...user,
      role: user.role as UserRole
    });
    setUserFormOpen(true);
  };
  
  const handleDeleteUser = (id: string) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const handleSaveUser = async (userData: UserFormData) => {
    try {
      // Create a new object without the password if it's empty
      const { password, ...userDataWithoutPassword } = userData;
      
      // Add company_id to the user data
      const userDataWithCompany = {
        ...(password ? { password } : {}),
        ...userDataWithoutPassword,
        company_id: userInfo?.company_id || '',
      };

      if (userData.id) {
        const { id, ...updateData } = userDataWithCompany;
        // Create a new object without the password if it's empty
        const dataToUpdate = { ...updateData };
        if (!password) {
          await usersApi.updateUser(id as string, dataToUpdate);
        } else {
          await usersApi.updateUser(id as string, dataToUpdate);
        }
        enqueueSnackbar('User updated successfully', { variant: 'success' });
      } else {
        // Create user
        await authApi.createUser(userDataWithCompany as CreateUserData);
        enqueueSnackbar('User created successfully', { variant: 'success' });
      }
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  };
  
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      await usersApi.deleteUser(userToDelete);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };
  
  // Get role display name
  const getRoleDisplay = (role: string) => {
    switch(role) {
      case 'stock_manager': return 'Stock Manager';
      case 'salesman': return 'Salesman';
      default: return role;
    }
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: paths.admin.dashboard },
    { label: 'Users', url: paths.admin.users },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>Users</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <Box component="span" sx={{ mx: 0.5 }}>-</Box>}
              <Typography 
                component="a" 
                href={item.url} 
                variant="body2" 
                color={index === breadcrumbItems.length - 1 ? 'text.primary' : 'inherit'}
                sx={{ textDecoration: 'none' }}
              >
                {item.label}
              </Typography>
            </React.Fragment>
          ))}
        </Box>
      </Box>

      <Card sx={{ mb: 3, p: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }}>
          <Button
            variant="contained"
            onClick={handleAddUser}
            startIcon={<PlusIcon />}
            sx={{ alignSelf: 'flex-start' }}
          >
            Add User
          </Button>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <OutlinedInput
              placeholder="Search users..."
              startAdornment={
                <InputAdornment position="start">
                  <MagnifyingGlassIcon />
                </InputAdornment>
              }
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{ width: { xs: '100%', sm: 240 } }}
            />
            
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="role-filter-label">Role</InputLabel>
              <Select
                labelId="role-filter-label"
                value={roleFilter}
                onChange={handleRoleFilterChange}
                label="Role"
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="stock_manager">Stock Manager</MenuItem>
                <MenuItem value="salesman">Salesman</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </Card>

      <Card>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                    indeterminate={selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectOne(user.id)}
                      />
                    </TableCell>
                    <TableCell>
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleDisplay(user.role)}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEditUser(user)}>
                        <PencilSimpleIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteUser(user.id)} color="error">
                        <TrashIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* User Form Dialog */}
      <UserFormDialog
        open={userFormOpen}
        onClose={() => setUserFormOpen(false)}
        user={currentUser}
        companyId={userInfo?.company_id || ''}
        onSave={handleSaveUser}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteUserDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        userId={userToDelete}
        onDelete={handleConfirmDelete}
      />
    </Box>
  );
} 