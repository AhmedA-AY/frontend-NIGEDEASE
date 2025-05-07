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
    <Stack 
      spacing={4}
      sx={{ 
        animation: 'fadeIn 0.5s ease-out',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        }
      }}
    >
      <Stack spacing={1} alignItems="center">
        <Box 
          component="img"
          src="/assets/Neged.png"
          alt="NIGED-EASE Logo"
          sx={{
            mb: 2,
            width: 80,
            height: 80,
            borderRadius: '20%',
            objectFit: 'cover',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
            border: '4px solid rgba(255, 255, 255, 0.8)',
            padding: 0.5,
            animation: 'pulse 2s infinite ease-in-out',
            '@keyframes pulse': {
              '0%': { boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' },
              '50%': { boxShadow: '0 10px 25px rgba(20, 184, 166, 0.3)' },
              '100%': { boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }
            }
          }}
        />
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700, 
            textAlign: 'center',
            background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >
          Welcome Back
        </Typography>
        <Typography 
          color="text.secondary" 
          variant="body1" 
          sx={{ 
            textAlign: 'center',
            maxWidth: '85%',
            mx: 'auto',
            opacity: 0.8,
            animation: 'fadeIn 0.5s ease-out 0.3s both'
          }}
        >
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
                <InputLabel 
                  sx={{ 
                    '&.Mui-focused': { 
                      color: 'primary.main' 
                    } 
                  }}
                >
                  Email Address
                </InputLabel>
                <OutlinedInput 
                  {...field} 
                  label="Email Address" 
                  type="email" 
                  startAdornment={
                    <Envelope 
                      style={{ marginRight: 12 }} 
                      size={22} 
                      weight="duotone"
                      color="var(--mui-palette-primary-main)" 
                    />
                  }
                  sx={{ 
                    borderRadius: 2.5,
                    backgroundColor: 'background.paper',
                    transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'background.paper',
                      boxShadow: '0 0 0 1px rgba(99, 102, 241, 0.2)'
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.3)'
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.1)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main'
                    },
                    height: 56,
                    animation: 'fadeInUp 0.6s ease-out both',
                    '@keyframes fadeInUp': {
                      from: { opacity: 0, transform: 'translateY(10px)' },
                      to: { opacity: 1, transform: 'translateY(0)' }
                    }
                  }}
                />
                {errors.email ? 
                  <FormHelperText 
                    sx={{ 
                      animation: 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
                      '@keyframes shake': {
                        '10%, 90%': { transform: 'translateX(-1px)' },
                        '20%, 80%': { transform: 'translateX(2px)' },
                        '30%, 50%, 70%': { transform: 'translateX(-4px)' },
                        '40%, 60%': { transform: 'translateX(4px)' }
                      }
                    }}
                  >
                    {errors.email.message}
                  </FormHelperText> 
                : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)} variant="filled">
                <InputLabel
                  sx={{ 
                    '&.Mui-focused': { 
                      color: 'primary.main' 
                    } 
                  }}
                >
                  Password
                </InputLabel>
                <OutlinedInput
                  {...field}
                  startAdornment={
                    <Key 
                      style={{ marginRight: 12 }} 
                      size={22} 
                      weight="duotone"
                      color="var(--mui-palette-primary-main)" 
                    />
                  }
                  endAdornment={
                    showPassword ? (
                      <EyeIcon
                        cursor="pointer"
                        size={22}
                        weight="duotone"
                        onClick={(): void => {
                          setShowPassword(false);
                        }}
                        style={{ color: 'var(--mui-palette-primary-main)' }}
                      />
                    ) : (
                      <EyeSlashIcon
                        cursor="pointer"
                        size={22}
                        weight="duotone"
                        onClick={(): void => {
                          setShowPassword(true);
                        }}
                        style={{ color: 'var(--mui-palette-text-secondary)' }}
                      />
                    )
                  }
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  sx={{ 
                    borderRadius: 2.5,
                    backgroundColor: 'background.paper',
                    transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'background.paper',
                      boxShadow: '0 0 0 1px rgba(99, 102, 241, 0.2)'
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.3)'
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.1)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main'
                    },
                    height: 56,
                    animation: 'fadeInUp 0.6s ease-out 0.1s both',
                  }}
                />
                {errors.password ? 
                  <FormHelperText 
                    sx={{ 
                      animation: 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
                    }}
                  >
                    {errors.password.message}
                  </FormHelperText> 
                : null}
              </FormControl>
            )}
          />
          <Box 
            display="flex" 
            justifyContent="flex-end"
            sx={{ 
              animation: 'fadeInUp 0.6s ease-out 0.2s both',
            }}
          >
            <Link 
              component={RouterLink} 
              href={paths.auth.resetPassword} 
              variant="body2" 
              sx={{
                color: 'primary.main',
                fontWeight: 500,
                textDecoration: 'none',
                position: 'relative',
                '&:hover': {
                  textDecoration: 'none',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  width: '100%',
                  transform: 'scaleX(0)',
                  height: '2px',
                  bottom: -1,
                  left: 0,
                  backgroundColor: 'primary.main',
                  transformOrigin: 'bottom right',
                  transition: 'transform 0.3s ease-out'
                },
                '&:hover::after': {
                  transform: 'scaleX(1)',
                  transformOrigin: 'bottom left'
                }
              }}
            >
              Forgot password?
            </Link>
          </Box>
          {errors.root ? 
            <Alert 
              color="error" 
              severity="error" 
              variant="filled"
              sx={{ 
                borderRadius: 2,
                animation: 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
              }}
            >
              {errors.root.message}
            </Alert> 
          : null}
          <Button 
            disabled={loginMutation.isPending} 
            type="submit" 
            variant="contained" 
            fullWidth
            size="large"
            sx={{ 
              borderRadius: 2.5, 
              py: 1.5,
              fontWeight: 600,
              background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
              boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)',
              transition: 'all 0.3s ease',
              animation: 'fadeInUp 0.6s ease-out 0.3s both',
              position: 'relative',
              overflow: 'hidden',
              mt: 1,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'all 0.6s ease',
              },
              '&:hover': {
                boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)',
                transform: 'translateY(-2px)',
                '&::before': {
                  left: '100%',
                }
              },
              '&:active': {
                transform: 'translateY(0)',
                boxShadow: '0 5px 10px rgba(99, 102, 241, 0.2)',
              }
            }}
          >
            {loginMutation.isPending ? 
              <CircularProgress size={24} color="inherit" /> : 
              'Sign in'
            }
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
