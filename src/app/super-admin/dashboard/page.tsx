'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Buildings as BuildingsIcon } from '@phosphor-icons/react/dist/ssr/Buildings';
import { Prohibit as ProhibitIcon } from '@phosphor-icons/react/dist/ssr/Prohibit';
import { FileLock as FileLockIcon } from '@phosphor-icons/react/dist/ssr/FileLock';
import { Check as CheckIcon } from '@phosphor-icons/react/dist/ssr/Check';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';

import { useAdmin } from '@/contexts/admin-context';
import { paths } from '@/paths';

export default function Page(): React.JSX.Element {
  const { companies } = useAdmin();
  const router = useRouter();

  const activeCompanies = companies.filter(c => c.status === 'active');
  const inactiveCompanies = companies.filter(c => c.status === 'inactive');
  const expiredCompanies = companies.filter(c => c.status === 'expired');

  return (
    <>
      <Box sx={{ py: 3 }}>
        <Typography variant="h4">Dashboard</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} lg={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                backgroundColor: 'primary.100',
                width: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                mr: 2
              }}>
                <BellIcon fontSize="var(--icon-fontSize-lg)" color="var(--mui-palette-primary-main)" />
              </Box>
              <Stack>
                <Typography variant="h4">{companies.length}</Typography>
                <Typography color="textSecondary" variant="body2">
                  Total Companies
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid xs={12} sm={6} lg={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                backgroundColor: 'success.100',
                width: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                mr: 2
              }}>
                <BuildingsIcon fontSize="var(--icon-fontSize-lg)" color="var(--mui-palette-success-main)" />
              </Box>
              <Stack>
                <Typography variant="h4">{activeCompanies.length}</Typography>
                <Typography color="textSecondary" variant="body2">
                  Active Companies
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid xs={12} sm={6} lg={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                backgroundColor: 'warning.100',
                width: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                mr: 2
              }}>
                <ProhibitIcon fontSize="var(--icon-fontSize-lg)" color="var(--mui-palette-warning-main)" />
              </Box>
              <Stack>
                <Typography variant="h4">{inactiveCompanies.length}</Typography>
                <Typography color="textSecondary" variant="body2">
                  Inactive Companies
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid xs={12} sm={6} lg={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                backgroundColor: 'error.100',
                width: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                mr: 2
              }}>
                <FileLockIcon fontSize="var(--icon-fontSize-lg)" color="var(--mui-palette-error-main)" />
              </Box>
              <Stack>
                <Typography variant="h4">{expiredCompanies.length}</Typography>
                <Typography color="textSecondary" variant="body2">
                  License Expired
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Recently Registered Companies</Typography>
        <Button
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
          onClick={() => router.push(paths.superAdmin.companies)}
        >
          View All
        </Button>
      </Box>

      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company Logo</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Company Email</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Subscription Plan</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>
                  <Box
                    component="img"
                    src="/assets/logo.svg"
                    alt="Company Logo"
                    sx={{ height: 40, width: 'auto' }}
                  />
                </TableCell>
                <TableCell>
                  {company.name}
                </TableCell>
                <TableCell>
                  {company.email}
                </TableCell>
                <TableCell>
                  <Stack spacing={0.5}>
                    <Typography variant="body2">
                      Verified: {company.verified ? 
                        <CheckIcon color="success" /> : 
                        <XIcon color="error" />
                      }
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
                  {company.subscriptionPlan}
                  <Button 
                    size="small" 
                    variant="outlined" 
                    sx={{ ml: 1 }}
                    onClick={() => router.push(`${paths.superAdmin.companies}/${company.id}/edit`)}
                  >
                    Change
                  </Button>
                </TableCell>
                <TableCell>
                  <Chip 
                    color={
                      company.status === 'active' ? 'success' 
                      : company.status === 'inactive' ? 'warning' 
                      : 'error'
                    }
                    size="small"
                    label={
                      company.status === 'active' ? 'Active' 
                      : company.status === 'inactive' ? 'Inactive' 
                      : 'Expired'
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
} 