'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Pagination from '@mui/material/Pagination';
import { ChartLineUp as ChartLineUpIcon } from '@phosphor-icons/react/dist/ssr/ChartLineUp';
import { ShoppingBag as ShoppingBagIcon } from '@phosphor-icons/react/dist/ssr/ShoppingBag';
import { Tag as TagIcon } from '@phosphor-icons/react/dist/ssr/Tag';
import { Bank as BankIcon } from '@phosphor-icons/react/dist/ssr/Bank';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

export default function AdminDashboard(): React.JSX.Element {
  // Mock state for date range selection
  const [dateRange, setDateRange] = React.useState({
    startDate: '',
    endDate: '',
  });

  // Mock data for summary cards
  const summaryData = {
    totalSales: 33531.90,
    totalExpenses: 98.00,
    paymentSent: 14937.00,
    paymentReceived: 16428.44,
  };

  // Mock data for recent sales
  const recentSales = [
    { id: 'SALE-65', date: '19-04-2025', customer: 'Maverick Runte', status: 'Confirmed', amount: 1671.00, paid: 0.00 },
    { id: 'SALE-64', date: '29-04-2025', customer: 'Charles Rohan', status: 'Shipping', amount: 340.90, paid: 0.00 },
    { id: 'SALE-63', date: '26-04-2025', customer: 'Efrain Hermann', status: 'Processing', amount: 454.25, paid: 454.25 },
    { id: 'SALE-62', date: '25-04-2025', customer: 'Izaiah Bogisich MD', status: 'Shipping', amount: 494.00, paid: 0.00 },
    { id: 'SALE-61', date: '23-04-2025', customer: 'Corbin Hoppe Jr.', status: 'Confirmed', amount: 1064.35, paid: 1064.35 },
  ];

  // Mock data for stock alerts
  const stockAlerts = [
    { product: 'Furinno Office Computer Desk', quantity: 21, alert: 40 },
    { product: 'Infantino Flip Carrier', quantity: 38, alert: 70 },
    { product: 'Pampers Pants Girls and Boy', quantity: 25, alert: 25 },
    { product: 'Tostitos Rounds Salsa Cups Nacho', quantity: 7, alert: 70 },
    { product: "Welch's Fruit Snacks, Mixed Fruit, Gluten Free", quantity: 24, alert: 50 },
  ];

  // Mock data for top customers
  const topCustomers = [
    { name: 'Corbin Hoppe Jr.', amount: 7207.35, sales: 3 },
    { name: 'Jasper Lueilwitz', amount: 4944.00, sales: 1 },
    { name: 'Alexis Collins', amount: 4040.60, sales: 1 },
    { name: 'Dr. Sven Stamm Jr.', amount: 3448.00, sales: 1 },
    { name: 'Alex Mann Sr.', amount: 3308.96, sales: 2 },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Dashboard</Typography>
      
      {/* Date Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
          <input 
            type="text" 
            placeholder="Start Date"
            style={{ 
              border: 'none', 
              padding: '8px 12px',
              outline: 'none',
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>→</Box>
          <input 
            type="text" 
            placeholder="End Date"
            style={{ 
              border: 'none', 
              padding: '8px 12px',
              outline: 'none',
            }}
          />
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" size="small">Today</Button>
          <Button variant="outlined" size="small">Yesterday</Button>
          <Button variant="outlined" size="small">Last 7 Days</Button>
          <Button variant="outlined" size="small">This Month</Button>
          <Button variant="outlined" size="small">This Year</Button>
        </Stack>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ 
                bgcolor: '#4f46e5', 
                borderRadius: 1,
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <ChartLineUpIcon size={24} />
              </Box>
              <Box>
                <Typography variant="h5">${summaryData.totalSales.toFixed(2)}</Typography>
                <Typography variant="body2" color="text.secondary">Total Sales</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ 
                bgcolor: '#4f46e5', 
                borderRadius: 1,
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <ShoppingBagIcon size={24} />
              </Box>
              <Box>
                <Typography variant="h5">${summaryData.totalExpenses.toFixed(2)}</Typography>
                <Typography variant="body2" color="text.secondary">Total Expenses</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ 
                bgcolor: '#4f46e5', 
                borderRadius: 1,
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <TagIcon size={24} />
              </Box>
              <Box>
                <Typography variant="h5">${summaryData.paymentSent.toFixed(2)}</Typography>
                <Typography variant="body2" color="text.secondary">Payment Sent</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ 
                bgcolor: '#4f46e5', 
                borderRadius: 1,
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <BankIcon size={24} />
              </Box>
              <Box>
                <Typography variant="h5">${summaryData.paymentReceived.toFixed(2)}</Typography>
                <Typography variant="body2" color="text.secondary">Payment Received</Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Top Selling Product</Typography>
            </Box>
            {/* Placeholder for the pie chart */}
            <Box sx={{ 
              height: 300, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexDirection: 'column',
              bgcolor: '#f9fafb',
              borderRadius: 1,
              mb: 2
            }}>
              <Typography variant="body2" color="text.secondary">Pie chart visualization</Typography>
            </Box>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 12, height: 12, bgcolor: '#10b981', borderRadius: '50%', mr: 1 }}></Box>
                Acer Aspire Desktop
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 12, height: 12, bgcolor: '#6366f1', borderRadius: '50%', mr: 1 }}></Box>
                Dell Gaming Monitor
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 12, height: 12, bgcolor: '#f97316', borderRadius: '50%', mr: 1 }}></Box>
                Sony Bravia Google TV
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 12, height: 12, bgcolor: '#facc15', borderRadius: '50%', mr: 1 }}></Box>
                ZINUS Metal Box Spring Mattress
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 12, height: 12, bgcolor: '#f43f5e', borderRadius: '50%', mr: 1 }}></Box>
                ASUS Eye Care Display Monitor
              </Typography>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Sales & Purchases</Typography>
              <Button 
                endIcon={<ArrowRightIcon />} 
                sx={{ color: '#4f46e5', textTransform: 'none' }}
              >
                View All
              </Button>
            </Box>
            {/* Placeholder for the bar chart */}
            <Box sx={{ 
              height: 400, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: '#f9fafb',
              borderRadius: 1,
              mb: 1
            }}>
              <Typography variant="body2" color="text.secondary">Bar chart visualization for sales and purchases</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Stock History */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Recent Stock History</Typography>
          
          <Box sx={{ display: 'flex', mb: 2, borderBottom: '1px solid #e0e0e0' }}>
            <Button sx={{ py: 1, borderBottom: '2px solid #4f46e5', borderRadius: 0, color: '#4f46e5' }}>
              Sales
            </Button>
            <Button sx={{ py: 1, borderRadius: 0, color: 'text.secondary' }}>
              Purchases
            </Button>
            <Button sx={{ py: 1, borderRadius: 0, color: 'text.secondary' }}>
              Purchase Return / Dr. Note
            </Button>
            <Button sx={{ py: 1, borderRadius: 0, color: 'text.secondary' }}>
              Sales Return / Cr. Note
            </Button>
          </Box>

          <Box sx={{ display: 'flex', mb: 2 }}>
            <Box sx={{ width: '25%', p: 2, bgcolor: '#f0fdf4', borderRadius: 1, mr: 2 }}>
              <Typography variant="body2" color="text.secondary">Total Sales Items</Typography>
              <Typography variant="h4">293</Typography>
            </Box>
            <Box sx={{ width: '25%', p: 2, bgcolor: '#fff1f2', borderRadius: 1, mr: 2 }}>
              <Typography variant="body2" color="text.secondary">Total Sales Returns Items</Typography>
              <Typography variant="h4">206</Typography>
            </Box>
            <Box sx={{ width: '25%', p: 2, bgcolor: '#eff6ff', borderRadius: 1, mr: 2 }}>
              <Typography variant="body2" color="text.secondary">Total Purchase Items</Typography>
              <Typography variant="h4">435</Typography>
            </Box>
            <Box sx={{ width: '25%', p: 2, bgcolor: '#fffbeb', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">Total Purchase Returns Items</Typography>
              <Typography variant="h4">82</Typography>
            </Box>
          </Box>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"></TableCell>
                <TableCell>Invoice Number</TableCell>
                <TableCell>Sales Date</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Sales Status</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Paid Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentSales.map((sale) => (
                <TableRow key={sale.id} hover>
                  <TableCell padding="checkbox">
                    <Button size="small" sx={{ minWidth: 'auto', p: 0 }}>+</Button>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="primary">{sale.id}</Typography>
                  </TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar sx={{ width: 24, height: 24, bgcolor: '#e0e7ff' }}></Avatar>
                      <Typography variant="body2" color="primary">{sale.customer}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={sale.status} 
                      size="small" 
                      sx={{ 
                        bgcolor: 
                          sale.status === 'Confirmed' ? '#dcfce7' : 
                          sale.status === 'Shipping' ? '#f3e8ff' : 
                          '#ffedd5',
                        color: 
                          sale.status === 'Confirmed' ? '#15803d' : 
                          sale.status === 'Shipping' ? '#7e22ce' : 
                          '#c2410c',
                      }} 
                    />
                  </TableCell>
                  <TableCell>${sale.amount.toFixed(2)}</TableCell>
                  <TableCell>${sale.paid.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Typography variant="body2">Total: <strong>${recentSales.reduce((sum, sale) => sum + sale.amount, 0).toFixed(2)}</strong></Typography>
            <Pagination count={5} shape="rounded" />
          </Box>
        </Box>
      </Card>

      {/* Stock Alert and Top Customers */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Stock Alert</Typography>
              <Button 
                endIcon={<ArrowRightIcon />} 
                sx={{ color: '#4f46e5', textTransform: 'none' }}
              >
                View All
              </Button>
            </Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Quantity Alert</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stockAlerts.map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{item.product}</TableCell>
                    <TableCell>{item.quantity} pc</TableCell>
                    <TableCell>{item.alert} pc</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Top Customers</Typography>
              <Button 
                endIcon={<ArrowRightIcon />} 
                sx={{ color: '#4f46e5', textTransform: 'none' }}
              >
                View All
              </Button>
            </Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Total Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topCustomers.map((customer, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width: 24, height: 24, bgcolor: '#e0e7ff' }}></Avatar>
                        <Typography variant="body2" color="primary">{customer.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">${customer.amount.toFixed(2)}</Typography>
                      <Typography variant="caption" color="text.secondary">Total Sales: {customer.sales}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
      >
        <IconButton
          sx={{
            bgcolor: '#4f46e5',
            color: 'white',
            width: 56,
            height: 56,
            '&:hover': {
              bgcolor: '#4338ca',
            },
          }}
        >
          <PlusIcon size={24} />
        </IconButton>
      </Box>
    </Box>
  );
} 