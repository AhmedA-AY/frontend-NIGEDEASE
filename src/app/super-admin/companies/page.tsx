'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  IconButton,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Tabs,
  Tab,
  Unstable_Grid2 as Grid,
  CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import ErrorMessage from '@/components/common/error-message';
import { CompaniesList } from '@/components/companies/companies-list';
import { paths } from '@/paths';
import { useCompanies } from '@/hooks/super-admin/use-companies';

const Page = () => {
  const { t, i18n } = useTranslation(['super-admin', 'common']);
  const [tabValue, setTabValue] = useState(0);
  const { data: companies = [], isLoading, error, refetch } = useCompanies();
  
  const activeCompanies = companies.filter((company) => company.is_active);
  const inactiveCompanies = companies.filter((company) => !company.is_active);
  
  const safeTranslate = (key: string, fallback: string) => {
    const result = t(key);
    return result === key ? fallback : result;
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <Stack direction="row" justifyContent="space-between" spacing={4}>
            <Stack spacing={1}>
              <Typography variant="h4">
                {safeTranslate('companies.title', 'Companies')}
              </Typography>
              <Stack alignItems="center" direction="row" spacing={1}>
                <Button
                  color="inherit"
                  component={Link}
                  href={paths.superAdmin.dashboard}
                  size="small"
                >
                  {safeTranslate('dashboard.title', 'Dashboard')}
                </Button>
                <Box
                  sx={{
                    backgroundColor: 'text.primary',
                    borderRadius: '50%',
                    height: 4,
                    width: 4
                  }}
                />
                <Typography color="text.secondary" variant="body2">
                  {safeTranslate('companies.title', 'Companies')}
                </Typography>
              </Stack>
            </Stack>
            <Button
              component={Link}
              href={`${paths.superAdmin.companies}/create`}
              startIcon={
                <SvgIcon>
                  <PlusIcon />
                </SvgIcon>
              }
              variant="contained"
            >
              {safeTranslate('companies.add', 'Add Company')}
            </Button>
          </Stack>
          
          <Card>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
            >
              <Tab label={safeTranslate('companies.all', 'All')} />
              <Tab label={safeTranslate('companies.active', 'Active')} />
              <Tab label={safeTranslate('companies.inactive', 'Inactive')} />
            </Tabs>
            
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box sx={{ p: 3 }}>
                <ErrorMessage 
                  error={error} 
                  title={safeTranslate('companies.failed_to_load', 'Failed to load companies')} 
                  onRetry={refetch} 
                />
              </Box>
            ) : (
              <Box>
                {tabValue === 0 && <CompaniesList companies={companies} />}
                {tabValue === 1 && <CompaniesList companies={activeCompanies} />}
                {tabValue === 2 && <CompaniesList companies={inactiveCompanies} />}
              </Box>
            )}
          </Card>
        </Stack>
      </Container>
    </Box>
  );
};

export default Page; 