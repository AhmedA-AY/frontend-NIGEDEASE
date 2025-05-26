'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Stack,
  Avatar,
  Button
} from '@mui/material';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { RecentSale } from '@/services/api/dashboard';
import { TFunction } from 'i18next';

interface RecentSalesProps {
  sales: RecentSale[];
  t: TFunction;
}

export function RecentSales({ sales, t }: RecentSalesProps) {
  // Ensure we have a valid array of sales
  const validSales = Array.isArray(sales) ? sales : [];

  // Generate initials from customer name
  const getInitials = (name: string | undefined): string => {
    if (!name) return 'N/A';
    
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Status chip style based on status
  const getStatusChipProps = (status: string) => {
    let color: 'success' | 'warning' | 'error' | 'info' | 'default' = 'default';
    let variant: 'filled' | 'outlined' = 'filled';
    
    switch (status.toLowerCase()) {
      case 'confirmed':
        color = 'success';
        break;
      case 'shipping':
      case 'processing':
        color = 'info';
        break;
      case 'credit':
        color = 'warning';
        break;
      case 'paid':
        color = 'success';
        break;
      default:
        color = 'default';
    }
    
    return { color, variant };
  };

  return (
    <Card>
      <CardHeader 
        title={t('overview.recent_sales')} 
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
        {validSales.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('overview.order')}</TableCell>
                <TableCell>{t('overview.customer')}</TableCell>
                <TableCell>{t('overview.date')}</TableCell>
                <TableCell>{t('overview.status')}</TableCell>
                <TableCell align="right">{t('overview.amount')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {validSales.map((sale, index) => {
                // Safely extract values
                const saleId = sale.id || `sale-${index}`;
                const customerName = sale.customer?.name || 'Unknown Customer';
                const saleDate = sale.date || 'N/A';
                const saleStatus = sale.status || 'Unknown';
                const saleAmount = typeof sale.amount === 'number' ? sale.amount : 0;
                const salePaid = typeof sale.paid === 'number' ? sale.paid : 0;
                
                const statusProps = getStatusChipProps(saleStatus);
                
                return (
                  <TableRow
                    key={saleId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography variant="body2" fontWeight="medium">
                        {saleId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', fontSize: '0.875rem' }}>
                          {getInitials(customerName)}
                        </Avatar>
                        <Typography variant="body2">{customerName}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{saleDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={saleStatus}
                        size="small"
                        color={statusProps.color}
                        variant={statusProps.variant}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="medium">
                        ${saleAmount.toFixed(2)}
                      </Typography>
                      {salePaid < saleAmount && (
                        <Typography variant="caption" color="text.secondary">
                          {t('overview.paid')}: ${salePaid.toFixed(2)}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
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