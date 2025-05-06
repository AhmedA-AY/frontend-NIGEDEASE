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
  Stack
} from '@mui/material';
import { TopCustomer } from '@/services/api/dashboard';

interface TopCustomersProps {
  customers: TopCustomer[];
}

export function TopCustomers({ customers }: TopCustomersProps) {
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
      <CardHeader title="Top Customers" />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Sales</TableCell>
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
      </CardContent>
    </Card>
  );
} 