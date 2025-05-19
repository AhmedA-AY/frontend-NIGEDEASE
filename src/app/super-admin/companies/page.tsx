// @ts-nocheck
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

import { useCompanies } from '@/hooks/use-companies';
import { paths } from '@/paths';

export default function CompaniesPage(): React.JSX.Element {
  const router = useRouter();
  const { data: companies, isLoading, error, refetch } = useCompanies();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate pagination
  const paginatedCompanies = companies
    ? companies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

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
          <Card>
            <Box sx={{ position: 'relative' }}>
              {isLoading && (
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
                    <TableCell>Short Name</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Subscription Plan</TableCell>
                    <TableCell>Currency</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                  {paginatedCompanies.map((company) => {
                    return (
                      <TableRow key={company.id} hover>
                    <TableCell>
                          <Typography variant="subtitle2">{company.name}</Typography>
                    </TableCell>
                        <TableCell>{company.short_name}</TableCell>
                        <TableCell>{company.address}</TableCell>
                    <TableCell>
                          <Chip 
                            label={company.subscription_plan.name} 
                            color={company.subscription_plan.is_active ? 'success' : 'default'} 
                            size="small"
                          />
                    </TableCell>
                        <TableCell>{company.currency.name} ({company.currency.code})</TableCell>
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
                          No companies found
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
                count={companies?.length || 0}
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