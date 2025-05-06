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
  Chip
} from '@mui/material';
import { StockAlert } from '@/services/api/dashboard';

interface StockAlertsProps {
  alerts: StockAlert[];
}

export function StockAlerts({ alerts }: StockAlertsProps) {
  // Get stock status based on quantity vs alertThreshold
  const getStockStatus = (quantity: number, alertThreshold: number) => {
    const ratio = quantity / alertThreshold;
    
    if (ratio <= 0.25) {
      return { label: 'Critical', color: 'error' as const };
    } else if (ratio <= 0.5) {
      return { label: 'Low', color: 'warning' as const };
    } else if (ratio <= 1) {
      return { label: 'Warning', color: 'info' as const };
    } else {
      return { label: 'Normal', color: 'success' as const };
    }
  };

  return (
    <Card>
      <CardHeader title="Stock Alerts" />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Alert Threshold</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alerts.map((alert) => {
              const status = getStockStatus(alert.quantity, alert.alertThreshold);
              return (
                <TableRow
                  key={alert.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Typography variant="body2" fontWeight="medium">
                      {alert.product.name}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{alert.quantity} pcs</TableCell>
                  <TableCell align="right">{alert.alertThreshold} pcs</TableCell>
                  <TableCell align="right">
                    <Chip
                      label={status.label}
                      size="small"
                      color={status.color}
                      variant="filled"
                    />
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