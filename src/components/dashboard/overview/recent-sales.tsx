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
  Avatar
} from '@mui/material';
import { RecentSale } from '@/services/api/dashboard';

interface RecentSalesProps {
  sales: RecentSale[];
}

export function RecentSales({ sales }: RecentSalesProps) {
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
      <CardHeader title="Recent Sales" />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Amount</TableCell>
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
                        Paid: ${sale.paid.toFixed(2)}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 