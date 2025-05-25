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
  // Generate initials from customer name
  const getInitials = (name: string): string => {
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
        {sales.length > 0 ? (
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
              {sales.map((sale) => {
                const statusProps = getStatusChipProps(sale.status);
                return (
                  <TableRow
                    key={sale.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography variant="body2" fontWeight="medium">
                        {sale.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', fontSize: '0.875rem' }}>
                          {getInitials(sale.customer.name)}
                        </Avatar>
                        <Typography variant="body2">{sale.customer.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>
                      <Chip
                        label={sale.status}
                        size="small"
                        color={statusProps.color}
                        variant={statusProps.variant}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="medium">
                        ${sale.amount.toFixed(2)}
                      </Typography>
                      {sale.paid < sale.amount && (
                        <Typography variant="caption" color="text.secondary">
                          {t('overview.paid')}: ${sale.paid.toFixed(2)}
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