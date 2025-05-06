'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import {
  Button,
  TextField,
  FormControl,
  FormLabel,
  FormHelperText,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  MenuItem,
  Select,
  Paper
} from '@mui/material';
import { useCreateUser } from '@/hooks/use-auth-queries';

const schema = zod.object({
  email: zod.string().email('Valid email is required'),
  password: zod.string().min(8, 'Password must be at least 8 characters'),
  first_name: zod.string().min(1, 'First name is required'),
  last_name: zod.string().min(1, 'Last name is required'),
  role: zod.enum(['admin', 'salesman', 'stock_manager'], { 
    required_error: 'Role is required' 
  }),
});

type FormValues = zod.infer<typeof schema>;

interface CreateCompanyUserFormProps {
  companyId: string;
  onSuccess?: (userData: any) => void;
}

export const CreateCompanyUserForm: React.FC<CreateCompanyUserFormProps> = ({ 
  companyId,
  onSuccess 
}) => {
  const [success, setSuccess] = useState<string | null>(null);
  
  const createUserMutation = useCreateUser();
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      role: 'admin'
    }
  });
  
  const onSubmit = async (data: FormValues) => {
    try {
      const response = await createUserMutation.mutateAsync({
        company_id: companyId,
        ...data
      });
      
      setSuccess('User created successfully');
      reset();
      
      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };
  
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create Company Admin User
      </Typography>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <FormControl error={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <TextField
                  {...field}
                  type="email"
                  placeholder="admin@example.com"
                  fullWidth
                  error={!!errors.email}
                />
                {errors.email && (
                  <FormHelperText error>{errors.email.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
          
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <FormControl error={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <TextField
                  {...field}
                  type="password"
                  placeholder="••••••••"
                  fullWidth
                  error={!!errors.password}
                />
                {errors.password && (
                  <FormHelperText error>{errors.password.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Controller
              name="first_name"
              control={control}
              render={({ field }) => (
                <FormControl error={!!errors.first_name} sx={{ flex: 1 }}>
                  <FormLabel>First Name</FormLabel>
                  <TextField
                    {...field}
                    fullWidth
                    error={!!errors.first_name}
                  />
                  {errors.first_name && (
                    <FormHelperText error>{errors.first_name.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
            
            <Controller
              name="last_name"
              control={control}
              render={({ field }) => (
                <FormControl error={!!errors.last_name} sx={{ flex: 1 }}>
                  <FormLabel>Last Name</FormLabel>
                  <TextField
                    {...field}
                    fullWidth
                    error={!!errors.last_name}
                  />
                  {errors.last_name && (
                    <FormHelperText error>{errors.last_name.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Box>
          
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <FormControl error={!!errors.role}>
                <FormLabel>Role</FormLabel>
                <Select {...field} fullWidth>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="salesman">Salesman</MenuItem>
                  <MenuItem value="stock_manager">Stock Manager</MenuItem>
                </Select>
                {errors.role && (
                  <FormHelperText error>{errors.role.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
          
          {success && (
            <Alert severity="success" onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          )}
          
          {createUserMutation.isError && (
            <Alert severity="error">
              {createUserMutation.error?.error || 'Failed to create user. Please try again.'}
            </Alert>
          )}
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={createUserMutation.isPending}
            startIcon={createUserMutation.isPending ? <CircularProgress size={20} color="inherit" /> : null}
          >
            Create User
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}; 