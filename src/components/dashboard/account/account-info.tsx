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

const user = {
  name: 'Sofia Rivers',
  avatar: '/assets/profile.jpeg',
  jobTitle: 'Senior Developer',
  country: 'USA',
  city: 'Los Angeles',
  timezone: 'GTM-7',
} as const;

export function AccountInfo(): React.JSX.Element {
  return (
    <Card>
      <CardHeader title="Account info" />
      <Divider />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar src={user.avatar} sx={{ height: '80px', width: '80px' }} />
            </Box>
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="subtitle2" gutterBottom>
              {user.name}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {user.city} {user.country}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {user.timezone}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button>Upload avatar</Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
