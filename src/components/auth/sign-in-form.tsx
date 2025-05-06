'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Envelope, Key } from '@phosphor-icons/react/dist/ssr';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { useLogin } from '@/hooks/use-auth-queries';
import { useAuth } from '@/providers/auth-provider';
import { OtpVerificationForm } from './otp-verification-form';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email(),
  password: zod.string().min(1, { message: 'Password is required' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { email: '', password: '' } satisfies Values;

export function SignInForm(): React.JSX.Element {
  const router = useRouter();
  const { saveEmail } = useAuth();
  const loginMutation = useLogin();

  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showOtpForm, setShowOtpForm] = React.useState<boolean>(false);
  const [userEmail, setUserEmail] = React.useState<string>('');

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      try {
        await loginMutation.mutateAsync({
          email: values.email,
          password: values.password,
        });

        // Store email for OTP verification
        setUserEmail(values.email);
        saveEmail(values.email);
        
        // Show OTP verification form
        setShowOtpForm(true);
      } catch (error: any) {
        const errorMessage = error?.error || 'Invalid credentials. Please try again.';
        setError('root', { type: 'server', message: errorMessage });
      }
    },
    [loginMutation, saveEmail, setError]
  );

  // Function to go back to login form from OTP verification
  const handleBackToLogin = React.useCallback(() => {
    setShowOtpForm(false);
  }, []);

  // If OTP form is visible, show it instead of login form
  if (showOtpForm) {
    return <OtpVerificationForm email={userEmail} onBack={handleBackToLogin} />;
  }

  return (
    <Stack spacing={4}>
      <Stack spacing={1} alignItems="center">
        <Box 
          component="img"
          src="/assets/Neged.png"
          alt="NIGED-EASE Logo"
          sx={{
            mb: 2,
            width: 80,
            height: 80,
            borderRadius: '50%',
            objectFit: 'cover',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Typography variant="h3" sx={{ fontWeight: 700, textAlign: 'center' }}>
          Welcome to NIGED-EASE
        </Typography>
        <Typography color="text.secondary" variant="body1" sx={{ textAlign: 'center' }}>
          Sign in to access your account and manage your business
        </Typography>
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)} variant="filled">
                <InputLabel>Email Address</InputLabel>
                <OutlinedInput 
                  {...field} 
                  label="Email Address" 
                  type="email" 
                  startAdornment={
                    <Envelope 
                      style={{ marginRight: 8 }} 
                      size={20} 
                      color="var(--mui-palette-primary-main)" 
                    />
                  }
                  sx={{ 
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                    '&:hover': {
                      backgroundColor: 'background.paper',
                    }
                  }}
                />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)} variant="filled">
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  {...field}
                  startAdornment={
                    <Key 
                      style={{ marginRight: 8 }} 
                      size={20} 
                      color="var(--mui-palette-primary-main)" 
                    />
                  }
                  endAdornment={
                    showPassword ? (
                      <EyeIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(false);
                        }}
                      />
                    ) : (
                      <EyeSlashIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(true);
                        }}
                      />
                    )
                  }
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  sx={{ 
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                    '&:hover': {
                      backgroundColor: 'background.paper',
                    }
                  }}
                />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Box display="flex" justifyContent="flex-end">
            <Link component={RouterLink} href={paths.auth.resetPassword} variant="body2" color="primary.main">
              Forgot password?
            </Link>
          </Box>
          {errors.root ? <Alert color="error" severity="error" variant="filled">{errors.root.message}</Alert> : null}
          <Button 
            disabled={loginMutation.isPending} 
            type="submit" 
            variant="contained" 
            fullWidth
            size="large"
            sx={{ 
              borderRadius: 2, 
              py: 1.5,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
          >
            {loginMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Sign in'}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
