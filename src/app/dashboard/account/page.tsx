'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';
import { AccountInfo } from '@/components/dashboard/account/account-info';
import { UpdatePasswordForm } from '@/components/dashboard/settings/update-password-form';
import { useCurrentUser } from '@/hooks/use-auth';

export default function Page(): React.JSX.Element {
  const { userInfo, isLoading, error } = useCurrentUser();

  React.useEffect(() => {
    // Update document title dynamically since we can't use static metadata
    document.title = "My Profile | Dashboard";
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error">
          Error loading profile information. Please try again later.
        </Alert>
      </Box>
    );
  }

  return (
    <Stack spacing={4}>
      <div>
        <Typography variant="h4">My Profile</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Manage your account information and password
        </Typography>
      </div>
      
      <Grid container spacing={3}>
        <Grid lg={4} md={6} xs={12}>
          <AccountInfo user={userInfo} />
        </Grid>
        <Grid lg={8} md={6} xs={12}>
          <AccountDetailsForm userInfo={userInfo} />
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        <Grid lg={12} xs={12}>
          <UpdatePasswordForm />
        </Grid>
      </Grid>
    </Stack>
  );
}
