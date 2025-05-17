'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { UserInfo } from '@/hooks/use-auth';

interface AccountInfoProps {
  user: UserInfo | null;
}

export function AccountInfo({ user }: AccountInfoProps): React.JSX.Element {
  const displayName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Loading...';
  const email = user?.email || '';
  const role = user?.role || '';
  
  // Format role for display
  const getRoleDisplay = (role: string) => {
    switch(role) {
      case 'super_admin': return 'Super Admin';
      case 'admin': return 'Admin';
      case 'stock_manager': return 'Stock Manager';
      case 'salesman': return 'Salesman';
      default: return role;
    }
  };

  return (
    <Card>
      <CardHeader title="Profile Information" />
      <Divider />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar 
                src={user?.profile_image || undefined} 
                sx={{ height: '80px', width: '80px' }}
              >
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </Avatar>
            </Box>
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {displayName}
            </Typography>
            <Typography color="text.secondary" variant="body2" gutterBottom>
              {email}
            </Typography>
            <Typography color="primary" variant="body2" sx={{ mb: 1 }}>
              {getRoleDisplay(role)}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" size="small">
                Update Profile Photo
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
