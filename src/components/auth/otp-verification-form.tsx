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
import { ShieldCheck } from '@phosphor-icons/react/dist/ssr';
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

        // Successful verification, save tokens and redirect
        login(response.access, response.refresh, response.role, email);
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
        <Typography variant="h4" sx={{ fontWeight: 700, textAlign: 'center' }}>
          Verify Your Account
        </Typography>
        <Typography color="text.secondary" variant="body1" sx={{ textAlign: 'center' }}>
          We've sent a 6-digit code to {email}
        </Typography>
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Controller
            control={control}
            name="otp"
            render={({ field }) => (
              <FormControl error={Boolean(errors.otp)} variant="filled">
                <InputLabel>6-digit OTP code</InputLabel>
                <OutlinedInput 
                  {...field} 
                  label="6-digit OTP code" 
                  type="text" 
                  inputMode="numeric"
                  startAdornment={
                    <ShieldCheck 
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
                {errors.otp ? <FormHelperText>{errors.otp.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          
          {errors.root ? <Alert color="error" severity="error" variant="filled">{errors.root.message}</Alert> : null}
          
          <Button 
            disabled={verifyOtpMutation.isPending} 
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
            {verifyOtpMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Verify'}
          </Button>
          
          <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
            <Button 
              onClick={handleResendOtp}
              disabled={countdown > 0 || isResending}
              variant="text" 
              color="primary"
              sx={{ 
                fontWeight: 600 
              }}
            >
              {isResending ? (
                <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
              ) : null}
              Resend OTP
            </Button>
            {countdown > 0 && (
              <Typography variant="body2" color="text.secondary">
                ({countdown}s)
              </Typography>
            )}
          </Stack>
          
          <Button 
            onClick={onBack}
            variant="text" 
            color="inherit"
            sx={{ 
              fontWeight: 500
            }}
          >
            Back to Login
          </Button>
        </Stack>
      </form>
    </Stack>
  );
} 