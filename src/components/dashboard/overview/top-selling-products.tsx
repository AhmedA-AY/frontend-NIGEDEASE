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
  LinearProgress
} from '@mui/material';
import { TopSellingProduct } from '@/services/api/dashboard';

interface TopSellingProductsProps {
  products: TopSellingProduct[];
}

export function TopSellingProducts({ products }: TopSellingProductsProps) {
  return (
    <Card>
      <CardHeader title="Top Selling Products" />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Amount</TableCell>
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
      </CardContent>
    </Card>
  );
} 