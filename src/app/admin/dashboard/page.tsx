'use client';

import * as React from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { CircularProgress, Paper } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useCurrentUser } from '@/hooks/use-auth';
import { useStore } from '@/contexts/store-context';
import { format as formatDate } from 'date-fns';

// Import the @phosphor-icons
import { Storefront } from '@phosphor-icons/react/dist/ssr/Storefront';
import { Money } from '@phosphor-icons/react/dist/ssr/Money';
import { Package } from '@phosphor-icons/react/dist/ssr/Package';
import { ShoppingCart } from '@phosphor-icons/react/dist/ssr/ShoppingCart';

export default function AdminDashboardPage() {
  const { userInfo } = useCurrentUser();
  const { selectedStore, stores } = useStore();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState({
    totalSales: 0,
    totalExpenses: 0,
    paymentReceived: 0,
    paymentSent: 0
  });
  const [selectedPeriod, setSelectedPeriod] = React.useState<'today' | 'week' | 'month' | 'year'>('month');
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);

  const handlePeriodChange = (period: 'today' | 'week' | 'month' | 'year') => {
    setSelectedPeriod(period);
    fetchData(period);
  };

  const handleRetry = () => {
    fetchData(selectedPeriod);
  };

  const fetchData = React.useCallback(async (period: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data based on period
      setStats({
        totalSales: Math.random() * 10000 + 5000,
        totalExpenses: Math.random() * 5000 + 2000,
        paymentReceived: Math.random() * 8000 + 4000,
        paymentSent: Math.random() * 4000 + 1000
      });
      
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData(selectedPeriod);
  }, [fetchData, selectedPeriod]);

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 'calc(100vh - 100px)' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ my: 5, textAlign: 'center' }}>
          <Typography variant="h5" color="error">{error}</Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={handleRetry}
          >
            Retry
          </Button>
        </Box>
      </Container>
    );
  }

  const today = new Date();
  const formattedDate = formatDate(today, 'EEEE, MMMM d, yyyy');

  return (
    <Container>
      <Box sx={{ py: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Welcome back, {userInfo?.first_name || 'Admin'}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {formattedDate}
            </Typography>
          </Box>

          {selectedStore && (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                backgroundColor: 'rgba(14, 165, 233, 0.1)', 
                border: '1px solid rgba(14, 165, 233, 0.3)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Storefront size={24} weight="duotone" style={{ color: "#0ea5e9" }} />
              <Typography variant="subtitle1">
                Currently managing: <strong>{selectedStore.name}</strong> ({selectedStore.location})
              </Typography>
            </Paper>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Today's Sales" 
                value="$2,500" 
                change="+12.5%" 
                positive={true}
                icon={<Money size={24} />} 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Products" 
                value="145" 
                change="+3.2%" 
                positive={true}
                icon={<Package size={24} />} 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Orders" 
                value="24" 
                change="+6.8%" 
                positive={true}
                icon={<ShoppingCart size={24} />} 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Stores" 
                value={String(stores?.length || 0)}
                change="" 
                positive={true}
                icon={<Storefront size={24} />} 
              />
            </Grid>
          </Grid>

          {/* Other dashboard content */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4">
              Dashboard
            </Typography>
            <Box>
              {lastUpdated && (
                <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </Typography>
              )}
              <Button 
                variant="outlined" 
                size="small" 
                onClick={handleRetry}
                disabled={isLoading}
                startIcon={isLoading ? null : <RefreshIcon />}
              >
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </Box>
          </Box>

          {/* Statistics summary cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: 'primary.lighter', 
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center' 
                  }}>
                    <TrendingUpIcon color="primary" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Sales
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 0.5 }}>
                      ${stats.totalSales.toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </Container>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
}

function StatCard({ title, value, change, positive, icon }: StatCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography color="text.secondary" variant="subtitle2">
            {title}
          </Typography>
          <Box sx={{ 
            bgcolor: 'rgba(99, 102, 241, 0.1)', 
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main'
          }}>
            {icon}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap' }}>
          <Typography variant="h4" sx={{ mr: 1 }}>
            {value}
          </Typography>
          {change && (
            <Typography 
              color={positive ? 'success.main' : 'error.main'} 
              variant="subtitle2"
              sx={{ fontWeight: 500 }}
            >
              {change}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
} 