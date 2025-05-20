'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CircularProgress, 
  Divider,
  Grid,
  Paper,
  Chip
} from '@mui/material';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { inventoryApi } from '@/services/api/inventory';
import { useSnackbar } from 'notistack';
import { paths } from '@/paths';

export default function StoreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = React.useState(true);
  const [store, setStore] = React.useState<any>(null);
  const storeId = params.id as string;

  React.useEffect(() => {
    const fetchStore = async () => {
      if (!storeId) return;
      
      try {
        setIsLoading(true);
        const storeData = await inventoryApi.getStore(storeId);
        setStore(storeData);
      } catch (error) {
        console.error('Error fetching store:', error);
        enqueueSnackbar('Failed to fetch store details', { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStore();
  }, [storeId, enqueueSnackbar]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!store) {
    return (
      <Box>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            variant="outlined"
            startIcon={<ArrowLeftIcon weight="bold" />}
            onClick={() => router.push(paths.admin.stores)}
          >
            Back to Stores
          </Button>
        </Box>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error">Store not found</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined"
          startIcon={<ArrowLeftIcon weight="bold" />}
          onClick={() => router.push(paths.admin.stores)}
        >
          Back to Stores
        </Button>
        <Chip 
          label={store.is_active === 'active' ? 'Active' : 'Inactive'} 
          color={store.is_active === 'active' ? 'success' : 'default'}
        />
      </Box>

      <Typography variant="h4" sx={{ mb: 3 }}>{store.name}</Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Store Details</Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Location</Typography>
              <Typography variant="body1">{store.location || 'Not specified'}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Address</Typography>
              <Typography variant="body1">{store.address || 'Not specified'}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Email</Typography>
              <Typography variant="body1">{store.email || 'Not specified'}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
              <Typography variant="body1">{store.phone_number || 'Not specified'}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Created At</Typography>
              <Typography variant="body1">
                {new Date(store.created_at).toLocaleDateString()}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Last Updated</Typography>
              <Typography variant="body1">
                {new Date(store.updated_at).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => {
            // Implement edit functionality
            router.push(`/admin/stores?edit=${store.id}`);
          }}
        >
          Edit Store
        </Button>
        <Button 
          variant="outlined" 
          color="error"
          onClick={() => {
            // Implement delete functionality 
            router.push(`/admin/stores?delete=${store.id}`);
          }}
        >
          Delete Store
        </Button>
      </Box>
    </Box>
  );
} 