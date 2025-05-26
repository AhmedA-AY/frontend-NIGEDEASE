'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { paths } from '@/paths';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '@/hooks/use-auth';
import { inventoryApi, InventorySearchResult } from '@/services/api/inventory';
import { StockManagerGuard } from '@/components/auth/stock-manager-guard';

export default function StockManagerInventorySearchPage(): React.JSX.Element {
  const { userInfo } = useCurrentUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<InventorySearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchTerm.trim() || !userInfo?.company_id) return;

    setLoading(true);
    setError(null);

    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/proxy/inventory/companies/d27c0519-58c3-4ec4-a6af-59dc6666b401/product-search/${encodeURIComponent(searchTerm)}/`);
      if (!response.ok) {
        throw new Error(t('inventory_search.fetch_error'));
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('inventory_search.error_occurred'));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StockManagerGuard>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          {t('inventory_search.title')}
        </Typography>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <form onSubmit={handleSearch}>
              <TextField
                fullWidth
                placeholder={t('inventory_search.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <MagnifyingGlassIcon size={24} style={{ marginRight: 8, color: '#6B7280' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                    },
                  },
                }}
              />
            </form>
          </CardContent>
        </Card>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Card sx={{ mb: 4, bgcolor: 'error.light' }}>
            <CardContent>
              <Typography color="error">{error}</Typography>
            </CardContent>
          </Card>
        )}

        {!loading && !error && products.length > 0 && (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {product.description}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" color="primary">
                        {t('products.product_category')}: {product.product_category.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('products.product_unit')}: {product.product_unit.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('products.product_cost')}: {product.purchase_price}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('products.product_price')}: {product.sale_price}
                      </Typography>
                      
                      <Typography variant="subtitle2" color="primary" sx={{ mt: 2 }}>
                        {t('inventory_search.inventory_locations')}:
                      </Typography>
                      {product.inventory.map((item) => (
                        <Box key={item.store_id} sx={{ mt: 1, pl: 2, borderLeft: '2px solid #e0e0e0' }}>
                          <Typography variant="body2" color="text.secondary">
                            {t('common.store')}: {item.store_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t('stores.store_address')}: {item.store_location}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t('overview.quantity')}: {item.quantity}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && !error && products.length === 0 && searchTerm && (
          <Card>
            <CardContent>
              <Typography align="center" color="text.secondary">
                {t('inventory_search.no_products')}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </StockManagerGuard>
  );
} 