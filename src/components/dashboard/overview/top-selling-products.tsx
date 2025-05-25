'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  LinearProgress,
  Button
} from '@mui/material';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { TopSellingProduct } from '@/services/api/dashboard';
import { TFunction } from 'i18next';

interface TopSellingProductsProps {
  products: TopSellingProduct[];
  t: TFunction;
}

export function TopSellingProducts({ products, t }: TopSellingProductsProps) {
  return (
    <Card>
      <CardHeader 
        title={t('overview.top_selling_products')} 
        action={
          <Button
            color="inherit"
            endIcon={<ArrowRight size={16} />}
            size="small"
            variant="text"
          >
            {t('overview.view_all')}
          </Button>
        }
      />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        {products.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('overview.product')}</TableCell>
                <TableCell align="right">{t('overview.quantity')}</TableCell>
                <TableCell align="right">{t('overview.amount')}</TableCell>
                <TableCell align="right">%</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {product.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">{product.quantity}</TableCell>
                  <TableCell align="right">${product.amount.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                      <Typography variant="body2">{product.percentage}%</Typography>
                      <Box sx={{ width: '100%', mt: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={product.percentage}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'background.neutral',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              bgcolor: (theme) => {
                                if (product.percentage >= 60) return theme.palette.success.main;
                                if (product.percentage >= 30) return theme.palette.warning.main;
                                return theme.palette.error.main;
                              },
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('overview.no_data')}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
} 