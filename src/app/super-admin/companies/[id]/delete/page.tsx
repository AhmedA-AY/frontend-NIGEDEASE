'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { WarningCircle as WarningCircleIcon } from '@phosphor-icons/react/dist/ssr/WarningCircle';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

import { useDeleteCompany, useCompany } from '@/hooks/use-companies';
import { paths } from '@/paths';

export default function CompanyDeletePage({ params }: { params: { id: string } }): React.JSX.Element {
  const router = useRouter();
  const { id } = params;
  const { data: company, isLoading: isLoadingCompany } = useCompany(id);
  const deleteCompanyMutation = useDeleteCompany();
  
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      await deleteCompanyMutation.mutateAsync(id);
      
      // Navigate back to companies list after successful deletion
      router.push(paths.superAdmin.companies);
    } catch (error) {
      console.error('Error deleting company:', error);
      setIsDeleting(false);
    }
  };

  const isLoading = isLoadingCompany || deleteCompanyMutation.isPending;

  // Show loading state while company data is being fetched
  if (isLoadingCompany) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show error if company is not found
  if (!company && !isLoadingCompany) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
        flexDirection="column"
        gap={2}
      >
        <Alert severity="error">Company not found</Alert>
        <Button
          color="primary"
          variant="contained"
          onClick={() => router.push(paths.superAdmin.companies)}
        >
          Back to Companies
        </Button>
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Button
              color="inherit"
              startIcon={<ArrowLeftIcon />}
              onClick={() => router.push(paths.superAdmin.companies)}
            >
              Back to Companies
            </Button>
            <Typography variant="h4">Delete Company</Typography>
          </Stack>
          
          <Card>
            <CardHeader 
              title="Confirm Deletion" 
              titleTypographyProps={{ color: 'error' }}
              avatar={<WarningCircleIcon size={28} weight="fill" color="red" />}
            />
            <CardContent>
              <Alert severity="warning" sx={{ mb: 3 }}>
                This action cannot be undone. This will permanently delete the company and all associated data.
              </Alert>
              
              <Typography variant="h6" gutterBottom>
                Company Details
              </Typography>
              
              <Stack spacing={2} sx={{ mb: 3 }}>
                <Box display="flex" flexDirection="row">
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ minWidth: 200 }}>
                    Company Name:
                  </Typography>
                  <Typography variant="body1">{company?.name}</Typography>
                </Box>
                
                <Box display="flex" flexDirection="row">
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ minWidth: 200 }}>
                    Short Name:
                  </Typography>
                  <Typography variant="body1">{company?.short_name}</Typography>
                </Box>
                
                <Box display="flex" flexDirection="row">
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ minWidth: 200 }}>
                    Address:
                  </Typography>
                  <Typography variant="body1">{company?.address}</Typography>
                </Box>
                
                <Box display="flex" flexDirection="row">
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ minWidth: 200 }}>
                    Subscription Plan:
                  </Typography>
                  <Typography variant="body1">
                    {company?.subscription_plan.name} ({company?.subscription_plan.billing_cycle})
                  </Typography>
                </Box>
                
                <Box display="flex" flexDirection="row">
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ minWidth: 200 }}>
                    Currency:
                  </Typography>
                  <Typography variant="body1">
                    {company?.currency.name} ({company?.currency.code})
                  </Typography>
                </Box>
                
                <Box display="flex" flexDirection="row">
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ minWidth: 200 }}>
                    Created:
                  </Typography>
                  <Typography variant="body1">
                    {company?.created_at ? format(new Date(company.created_at), 'PPP') : ''}
                  </Typography>
                </Box>
              </Stack>
              
              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="body1" color="error" sx={{ mb: 3, fontWeight: 'bold' }}>
                Are you absolutely sure you want to delete this company?
              </Typography>
              
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  onClick={() => router.push(paths.superAdmin.companies)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete Company'}
                </Button>
              </Stack>
              
              {deleteCompanyMutation.isError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Error deleting company: {(deleteCompanyMutation.error as Error).message}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
} 