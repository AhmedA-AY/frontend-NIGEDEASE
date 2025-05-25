'use client';

import React from 'react';
import {
  Avatar,
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
  Stack,
  Button
} from '@mui/material';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { TopCustomer } from '@/services/api/dashboard';
import { TFunction } from 'i18next';

interface TopCustomersProps {
  customers: TopCustomer[];
  t: TFunction;
}

export function TopCustomers({ customers, t }: TopCustomersProps) {
  // Generate initials from customer name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Generate random color based on customer id
  const getAvatarColor = (id: string) => {
    const colors = [
      'primary.light',
      'secondary.light',
      'error.light',
      'warning.light',
      'info.light',
      'success.light',
    ];
    // Use the customer ID to pick a color (just for consistent coloring)
    const colorIndex = id.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  };

  return (
    <Card>
      <CardHeader 
        title={t('overview.top_customers')} 
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
        {customers.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('overview.customer')}</TableCell>
                <TableCell align="right">{t('overview.amount')}</TableCell>
                <TableCell align="right">{t('overview.sales')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow
                  key={customer.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: getAvatarColor(customer.id),
                          fontSize: '0.875rem'
                        }}
                      >
                        {getInitials(customer.name)}
                      </Avatar>
                      <Typography variant="body2" fontWeight="medium">
                        {customer.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="medium">
                      ${customer.amount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {customer.salesCount} {customer.salesCount === 1 ? 'sale' : 'sales'}
                    </Typography>
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