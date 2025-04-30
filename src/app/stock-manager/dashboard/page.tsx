'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { ChartLineUp as ChartLineUpIcon } from '@phosphor-icons/react/dist/ssr/ChartLineUp';
import { CurrencyDollar as CurrencyDollarIcon } from '@phosphor-icons/react/dist/ssr/CurrencyDollar';
import { ShoppingBag as ShoppingBagIcon } from '@phosphor-icons/react/dist/ssr/ShoppingBag';
import { Bank as BankIcon } from '@phosphor-icons/react/dist/ssr/Bank';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';

export default function DashboardPage(): React.JSX.Element {
  // Sample dashboard data
  const dashboardStats = [
    {
      id: 'suppliers',
      title: 'Total Suppliers',
      value: '24',
      change: '+2.5%',
      changeType: 'positive',
      icon: <UsersIcon size={24} />,
      iconColor: '#0ea5e9',
    },
    {
      id: 'purchases',
      title: 'Total Purchases',
      value: '$54,325',
      change: '+15.3%',
      changeType: 'positive',
      icon: <ShoppingBagIcon size={24} />,
      iconColor: '#22c55e',
    },
    {
      id: 'expenses',
      title: 'Total Expenses',
      value: '$12,458',
      change: '+2.1%',
      changeType: 'positive',
      icon: <BankIcon size={24} />,
      iconColor: '#f59e0b',
    },
    {
      id: 'payments',
      title: 'Total Payments',
      value: '$38,952',
      change: '-4.2%',
      changeType: 'negative',
      icon: <CurrencyDollarIcon size={24} />,
      iconColor: '#ef4444',
    },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4">Stock Manager Dashboard</Typography>
        </Box>
        
        <Grid container spacing={3}>
          {/* Dashboard Summary Cards */}
          {dashboardStats.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        alignItems: 'center',
                        bgcolor: `${stat.iconColor}20`,
                        borderRadius: '50%',
                        color: stat.iconColor,
                        display: 'flex',
                        height: 40,
                        justifyContent: 'center',
                        width: 40,
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Box sx={{ ml: 2 }}>
                      <Typography color="text.secondary" variant="body2">
                        {stat.title}
                      </Typography>
                      <Typography variant="h6">{stat.value}</Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography
                      color={stat.changeType === 'positive' ? 'success.main' : 'error.main'}
                      variant="body2"
                    >
                      {stat.change}
                    </Typography>
                    <Typography color="text.secondary" variant="caption">
                      Since last month
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
          
          {/* Additional content can be added here */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  As a Stock Manager, you can manage suppliers, purchases, expenses, and process payments. You can also access reports to monitor business performance.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 