'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { ShieldCheck, ArrowLeft, EnvelopeSimple } from '@phosphor-icons/react/dist/ssr';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { useVerifyOtp, useResendOtp } from '@/hooks/use-auth-queries';
import { useAuth } from '@/providers/auth-provider';

const schema = zod.object({
  otp: zod.string()
    .min(6, { message: 'OTP must be 6 digits' })
    .max(6, { message: 'OTP must be 6 digits' })
    .regex(/^\d{6}$/, { message: 'OTP must contain only digits' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { otp: '' } satisfies Values;

interface OtpVerificationFormProps {
  email: string;
  onBack: () => void;
}

export function OtpVerificationForm({ email, onBack }: OtpVerificationFormProps): React.JSX.Element {
  const { login } = useAuth();
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();

  const [countdown, setCountdown] = React.useState<number>(60);
  const [isResending, setIsResending] = React.useState<boolean>(false);

  // Countdown timer for resend OTP
  React.useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [countdown]);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      try {
        const response = await verifyOtpMutation.mutateAsync({
          email,
          otp: values.otp,
        });

        // Log the role for debugging
        console.log('User role:', response.role);
        
        // If the user is a salesman or stock manager and has an assigned store
        if ((response.role === 'salesman' || response.role === 'stock_manager') && response.assigned_store) {
          console.log('Assigned store:', response.assigned_store);
          // Successful verification, save tokens and redirect with the assigned store
          login(response.access, response.refresh, response.role, email, response.assigned_store);
        } else {
          // For other roles or cases without assigned store
          login(response.access, response.refresh, response.role, email);
        }
      } catch (error: any) {
        const errorMessage = error?.error || 'Invalid OTP. Please try again.';
        setError('root', { type: 'server', message: errorMessage });
      }
    },
    [email, login, setError, verifyOtpMutation]
  );

  const handleResendOtp = React.useCallback(async () => {
    if (countdown > 0 || isResending) return;

    setIsResending(true);
    
    try {
      await resendOtpMutation.mutateAsync({ email });
      // Reset countdown
      setCountdown(60);
    } catch (error: any) {
      const errorMessage = error?.error || 'Failed to resend OTP. Please try again.';
      setError('root', { type: 'server', message: errorMessage });
    } finally {
      setIsResending(false);
    }
  }, [countdown, email, isResending, resendOtpMutation, setError]);

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
      <Stack spacing={2} alignItems="center">
        <Box 
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, rgba(20, 184, 166, 0.1), rgba(99, 102, 241, 0.1))',
            mb: 2,
            position: 'relative',
            animation: 'pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
            '@keyframes pulse-ring': {
              '0%': {
                transform: 'scale(0.95)',
                boxShadow: '0 0 0 0 rgba(99, 102, 241, 0.4)'
              },
              '70%': {
                transform: 'scale(1)',
                boxShadow: '0 0 0 15px rgba(99, 102, 241, 0)'
              },
              '100%': {
                transform: 'scale(0.95)',
                boxShadow: '0 0 0 0 rgba(99, 102, 241, 0)'
              }
            }
          }}
        >
          <ShieldCheck 
            size={56} 
            weight="duotone" 
            color="var(--mui-palette-primary-main)" 
          />
        </Box>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            textAlign: 'center',
            background: 'linear-gradient(90deg, #14B8A6 0%, #6366F1 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Verify Your Account
        </Typography>
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
            animation: 'fadeIn 0.5s ease-out 0.2s both',
          }}
        >
          <EnvelopeSimple 
            size={20} 
            weight="duotone" 
            style={{ 
              marginRight: 8,
              color: 'var(--mui-palette-text-secondary)'
            }}
          />
          <Typography 
            color="text.secondary" 
            variant="body1" 
            sx={{ 
              textAlign: 'center',
              fontWeight: 500,
            }}
          >
            {email}
          </Typography>
        </Box>
        <Typography 
          color="text.secondary" 
          variant="body2" 
          sx={{ 
            textAlign: 'center',
            opacity: 0.8,
            animation: 'fadeIn 0.5s ease-out 0.3s both',
            maxWidth: '90%',
            mx: 'auto'
          }}
        >
          We've sent a 6-digit verification code to your email.
          Please enter it below to verify your account.
        </Typography>
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Controller
            control={control}
            name="otp"
            render={({ field }) => (
              <FormControl error={Boolean(errors.otp)} variant="filled">
                <InputLabel 
                  sx={{ 
                    '&.Mui-focused': { 
                      color: 'primary.main' 
                    } 
                  }}
                >
                  6-digit verification code
                </InputLabel>
                <OutlinedInput 
                  {...field} 
                  label="6-digit verification code" 
                  type="text" 
                  inputMode="numeric"
                  placeholder="• • • • • •"
                  startAdornment={
                    <ShieldCheck 
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
                    fontSize: '1.1rem',
                    letterSpacing: 2,
                    textAlign: 'center',
                    '& input': {
                      textAlign: 'center'
                    },
                    animation: 'fadeInUp 0.6s ease-out both',
                    '@keyframes fadeInUp': {
                      from: { opacity: 0, transform: 'translateY(10px)' },
                      to: { opacity: 1, transform: 'translateY(0)' }
                    }
                  }}
                  inputProps={{
                    maxLength: 6,
                    style: { textAlign: 'center', letterSpacing: '0.5em' }
                  }}
                />
                {errors.otp ? 
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
                    {errors.otp.message}
                  </FormHelperText> 
                : null}
              </FormControl>
            )}
          />
          
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
            disabled={verifyOtpMutation.isPending} 
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
              animation: 'fadeInUp 0.6s ease-out 0.2s both',
              position: 'relative',
              overflow: 'hidden',
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
            {verifyOtpMutation.isPending ? 
              <CircularProgress size={24} color="inherit" /> : 
              'Verify & Continue'
            }
          </Button>
          
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              animation: 'fadeIn 0.8s ease-out 0.3s both',
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
              {countdown > 0 ? (
                <>Didn't receive the code? You can resend in <b>{countdown}s</b></>
              ) : (
                "Didn't receive the code? Try resending it"
              )}
            </Typography>
            
            <Button 
              onClick={handleResendOtp}
              disabled={countdown > 0 || isResending}
              variant="outlined" 
              color="primary"
              startIcon={isResending && <CircularProgress size={16} color="inherit" />}
              sx={{ 
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                borderColor: countdown > 0 ? 'rgba(0, 0, 0, 0.1)' : 'primary.main',
                color: countdown > 0 ? 'text.disabled' : 'primary.main',
                transition: 'all 0.3s ease',
                '&:enabled:hover': {
                  transform: 'translateY(-2px)',
                  backgroundColor: 'rgba(99, 102, 241, 0.05)',
                  borderColor: 'primary.main',
                  boxShadow: '0 4px 8px rgba(99, 102, 241, 0.2)'
                }
              }}
            >
              Resend Verification Code
            </Button>
          </Box>
          
          <Button 
            onClick={onBack}
            variant="text" 
            color="inherit"
            startIcon={<ArrowLeft weight="bold" />}
            sx={{ 
              fontWeight: 500,
              mt: 2,
              alignSelf: 'center',
              transition: 'all 0.3s ease',
              animation: 'fadeIn 0.8s ease-out 0.4s both',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                transform: 'translateX(-3px)'
              }
            }}
          >
            Back to Login
          </Button>
        </Stack>
      </form>
    </Stack>
  );
} 