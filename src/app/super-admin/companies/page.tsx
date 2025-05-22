'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import Chip from '@mui/material/Chip';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Pencil as PencilIcon } from '@phosphor-icons/react/dist/ssr/Pencil';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { ArrowsCounterClockwise as RefreshIcon } from '@phosphor-icons/react/dist/ssr/ArrowsCounterClockwise';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

import { useCompanies, useSubscriptionPlans } from '@/hooks/use-companies';
import { paths } from '@/paths';

export default function CompaniesPage(): React.JSX.Element {
  const router = useRouter();
  const { data: companies, isLoading, error, refetch } = useCompanies();
  const { data: subscriptionPlans, isLoading: isLoadingPlans } = useSubscriptionPlans();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  // Filter companies based on search query
  const filteredCompanies = React.useMemo(() => {
    if (!companies) return [];
    
    if (!searchQuery) return companies;
    
    const query = searchQuery.toLowerCase();
    return companies.filter(company => 
      company.name.toLowerCase().includes(query) || 
      company.description.toLowerCase().includes(query)
    );
  }, [companies, searchQuery]);

  // Calculate pagination
  const paginatedCompanies = filteredCompanies
    ? filteredCompanies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

  // Function to get subscription plan name by id
  const getSubscriptionPlanName = (planId: string | null) => {
    if (!planId) return null;
    
    const plan = subscriptionPlans?.find(plan => plan.id === planId);
    return plan ? plan.name : planId;
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" spacing={4}>
            <Stack spacing={1}>
              <Typography variant="h4">Companies</Typography>
              <Stack alignItems="center" direction="row" spacing={1}>
                <Typography color="text.secondary" variant="subtitle2">
                  Manage all registered companies
                </Typography>
              </Stack>
            </Stack>
            <div>
              <Button
                onClick={() => router.push(paths.superAdmin.companies + '/create')}
                startIcon={
                  <SvgIcon>
                    <PlusIcon />
                  </SvgIcon>
                }
                variant="contained"
              >
                Add Company
              </Button>
            </div>
          </Stack>

          {/* Search field */}
          <TextField
            fullWidth
            placeholder="Search companies by name or description..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MagnifyingGlassIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <Card>
            <Box sx={{ position: 'relative' }}>
              {(isLoading || isLoadingPlans) && (
                <Box
                  sx={{
            display: 'flex', 
                    justifyContent: 'center',
            alignItems: 'center',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    zIndex: 1,
                  }}
                >
                  <CircularProgress />
              </Box>
              )}
              
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ m: 2 }}
                  action={
                    <IconButton onClick={() => refetch()}>
                      <RefreshIcon />
                    </IconButton>
                  }
                >
                  Error loading companies: {error.message}
                </Alert>
              )}

              <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Subscription Plan</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                  {paginatedCompanies.map((company) => {
                    const planName = getSubscriptionPlanName(company.subscription_plan);
                    
                    return (
                      <TableRow key={company.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2">{company.name}</Typography>
                        </TableCell>
                        <TableCell>{company.description}</TableCell>
                        <TableCell>
                          {planName ? (
                            <Chip 
                              label={planName} 
                              color="primary" 
                              size="small"
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No plan
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={company.is_active ? 'Active' : 'Inactive'} 
                            color={company.is_active ? 'success' : 'default'} 
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {format(new Date(company.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Edit company">
                              <IconButton 
                                onClick={() => router.push(`${paths.superAdmin.companies}/${company.id}/edit`)}
                                size="small"
                              >
                                <PencilIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete company">
                              <IconButton 
                                onClick={() => router.push(`${paths.superAdmin.companies}/${company.id}/delete`)}
                                size="small" 
                                color="error"
                              >
                                <TrashIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  
                  {paginatedCompanies.length === 0 && !isLoading && !error && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        <Typography variant="subtitle1" color="text.secondary">
                          {searchQuery ? 'No companies found matching your search' : 'No companies found'}
                        </Typography>
                        <Button
                          onClick={() => router.push(paths.superAdmin.companies + '/create')}
                          startIcon={<PlusIcon />}
                          sx={{ mt: 2 }}
                        >
                          Add Company
                        </Button>
                    </TableCell>
                  </TableRow>
                  )}
              </TableBody>
            </Table>
              
              <TablePagination
                component="div"
                count={filteredCompanies?.length || 0}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </Box>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
} 