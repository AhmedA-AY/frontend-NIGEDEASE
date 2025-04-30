'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { DotsThree as DotsThreeIcon } from '@phosphor-icons/react/dist/ssr/DotsThree';
import { paths } from '@/paths';
import SaleEditModal from '@/components/admin/sales/SaleEditModal';

export default function SalesPage(): React.JSX.Element {
  const [tabValue, setTabValue] = React.useState(0);
  const [selectedSales, setSelectedSales] = React.useState<string[]>([]);
  const [anchorElMap, setAnchorElMap] = React.useState<{ [key: string]: HTMLElement | null }>({});
  const [isSaleModalOpen, setIsSaleModalOpen] = React.useState(false);
  const [currentSale, setCurrentSale] = React.useState<any>(null);
  
  // Mock sales data
  const sales = [
    { id: 'SALE-65', date: '19-04-2025', customer: 'Maverick Runte', status: 'Confirmed', totalAmount: 1671.00, paidAmount: 0.00, dueAmount: 1671.00, paymentStatus: 'Unpaid' },
    { id: 'SALE-64', date: '29-04-2025', customer: 'Charles Rohan', status: 'Shipping', totalAmount: 340.90, paidAmount: 0.00, dueAmount: 340.90, paymentStatus: 'Unpaid' },
    { id: 'SALE-63', date: '26-04-2025', customer: 'Efrain Hermann', status: 'Processing', totalAmount: 454.25, paidAmount: 454.25, dueAmount: 0.00, paymentStatus: 'Paid' },
    { id: 'SALE-62', date: '25-04-2025', customer: 'Izaiah Bogisich MD', status: 'Shipping', totalAmount: 494.00, paidAmount: 0.00, dueAmount: 494.00, paymentStatus: 'Unpaid' },
    { id: 'SALE-61', date: '23-04-2025', customer: 'Corbin Hoppe Jr.', status: 'Confirmed', totalAmount: 1064.35, paidAmount: 1064.35, dueAmount: 0.00, paymentStatus: 'Paid' },
    { id: 'SALE-60', date: '20-04-2025', customer: 'Corbin Hoppe Jr.', status: 'Shipping', totalAmount: 893.00, paidAmount: 0.00, dueAmount: 893.00, paymentStatus: 'Unpaid' },
    { id: 'SALE-59', date: '23-04-2025', customer: 'Ulices Gorczany', status: 'Shipping', totalAmount: 705.00, paidAmount: 348.00, dueAmount: 357.00, paymentStatus: 'Partially Paid' },
    { id: 'SALE-58', date: '20-04-2025', customer: 'Charles Rohan', status: 'Processing', totalAmount: 978.00, paidAmount: 0.00, dueAmount: 978.00, paymentStatus: 'Unpaid' },
    { id: 'SALE-57', date: '16-04-2025', customer: 'Corbin Hoppe Jr.', status: 'Delivered', totalAmount: 5250.00, paidAmount: 3272.00, dueAmount: 1978.00, paymentStatus: 'Partially Paid' },
    { id: 'SALE-56', date: '19-04-2025', customer: 'Joesph Kulas', status: 'Confirmed', totalAmount: 64.00, paidAmount: 0.00, dueAmount: 64.00, paymentStatus: 'Unpaid' },
  ];

  // Calculate total amounts
  const totalAmount = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalPaid = sales.reduce((sum, sale) => sum + sale.paidAmount, 0);
  const totalDue = sales.reduce((sum, sale) => sum + sale.dueAmount, 0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedSales(sales.map(sale => sale.id));
    } else {
      setSelectedSales([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedSales.includes(id)) {
      setSelectedSales(selectedSales.filter(saleId => saleId !== id));
    } else {
      setSelectedSales([...selectedSales, id]);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    setAnchorElMap({ ...anchorElMap, [id]: event.currentTarget });
  };

  const handleMenuClose = (id: string) => {
    setAnchorElMap({ ...anchorElMap, [id]: null });
  };

  const handleAddNewSale = () => {
    setCurrentSale({
      date: new Date().toISOString().split('T')[0],
      customer: '',
      status: 'Processing',
      products: [],
      totalAmount: 0,
      paidAmount: 0,
      dueAmount: 0,
      paymentStatus: 'Unpaid'
    });
    setIsSaleModalOpen(true);
  };

  const handleEditSale = (id: string) => {
    const saleToEdit = sales.find(sale => sale.id === id);
    if (saleToEdit) {
      setCurrentSale({
        id: saleToEdit.id,
        date: saleToEdit.date,
        customer: saleToEdit.customer,
        status: saleToEdit.status,
        products: [],
        totalAmount: saleToEdit.totalAmount,
        paidAmount: saleToEdit.paidAmount,
        dueAmount: saleToEdit.dueAmount,
        paymentStatus: saleToEdit.paymentStatus
      });
      setIsSaleModalOpen(true);
      handleMenuClose(id);
    }
  };

  const handleSaveSale = (saleData: any) => {
    if (saleData.id) {
      // Update existing sale
      console.log(`Updated sale: ${JSON.stringify(saleData)}`);
    } else {
      // Add new sale
      console.log(`Added new sale: ${JSON.stringify(saleData)}`);
    }
    setIsSaleModalOpen(false);
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: paths.admin.dashboard },
    { label: 'Sales', url: paths.admin.sales },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>Sales</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <Box component="span" sx={{ mx: 0.5 }}>-</Box>}
              <Typography 
                component="a" 
                href={item.url} 
                variant="body2" 
                color={index === breadcrumbItems.length - 1 ? 'text.primary' : 'inherit'}
                sx={{ textDecoration: 'none' }}
              >
                {item.label}
              </Typography>
            </React.Fragment>
          ))}
        </Box>
      </Box>

      {/* Action Buttons and Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Button 
            variant="contained" 
            startIcon={<PlusIcon weight="bold" />}
            sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
            onClick={handleAddNewSale}
          >
            Add New Sales
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            placeholder="Search By Invoice..."
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MagnifyingGlassIcon size={20} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 200 }}
          />
          <Select
            displayEmpty
            value=""
            input={<OutlinedInput size="small" />}
            renderValue={(selected) => {
              if (!selected) {
                return <Typography color="text.secondary">Select Customer...</Typography>;
              }
              return selected;
            }}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Customers</MenuItem>
            <MenuItem value="Maverick Runte">Maverick Runte</MenuItem>
            <MenuItem value="Charles Rohan">Charles Rohan</MenuItem>
            <MenuItem value="Efrain Hermann">Efrain Hermann</MenuItem>
          </Select>
          <Box sx={{ 
            display: 'flex', 
            border: '1px solid #e0e0e0', 
            borderRadius: 1, 
            overflow: 'hidden',
            alignItems: 'center',
          }}>
            <input 
              type="text" 
              placeholder="Start Date"
              style={{ 
                border: 'none', 
                padding: '8px 12px',
                outline: 'none',
                width: 80
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
                width: 80
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Sale Type Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="sale type tabs">
          <Tab 
            label="All Sales" 
            sx={{ 
              textTransform: 'none',
              minHeight: 48,
              color: tabValue === 0 ? '#0ea5e9' : 'text.primary',
              '&.Mui-selected': { color: '#0ea5e9' },
              borderBottom: tabValue === 0 ? '2px solid #0ea5e9' : 'none',
            }} 
          />
          <Tab 
            label="Unpaid" 
            sx={{ 
              textTransform: 'none',
              minHeight: 48,
              borderBottom: tabValue === 1 ? '2px solid #0ea5e9' : 'none',
              '&.Mui-selected': { color: '#0ea5e9' }
            }} 
          />
          <Tab 
            label="Paid" 
            sx={{ 
              textTransform: 'none',
              minHeight: 48,
              borderBottom: tabValue === 2 ? '2px solid #0ea5e9' : 'none',
              '&.Mui-selected': { color: '#0ea5e9' }
            }} 
          />
        </Tabs>
      </Box>

      {/* Sales Table */}
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={sales.length > 0 && selectedSales.length === sales.length}
                  indeterminate={selectedSales.length > 0 && selectedSales.length < sales.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Invoice Number</TableCell>
              <TableCell>Sales Date</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Sales Status</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Paid Amount</TableCell>
              <TableCell>Due Amount</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedSales.includes(sale.id)}
                    onChange={() => handleSelectOne(sale.id)}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button size="small" sx={{ minWidth: 'auto', p: 0, mr: 1, color: 'text.secondary' }}>+</Button>
                    <Typography variant="body2" color="primary">
                      {sale.id}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{sale.date}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ width: 24, height: 24, bgcolor: '#e0e7ff' }}></Avatar>
                    <Typography variant="body2" color="primary">
                      {sale.customer}
                    </Typography>
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
                        sale.status === 'Processing' ? '#ffedd5' : 
                        '#e0f2fe',
                      color: 
                        sale.status === 'Confirmed' ? '#15803d' : 
                        sale.status === 'Shipping' ? '#7e22ce' : 
                        sale.status === 'Processing' ? '#c2410c' : 
                        '#0284c7',
                    }} 
                  />
                </TableCell>
                <TableCell>${sale.totalAmount.toFixed(2)}</TableCell>
                <TableCell>${sale.paidAmount.toFixed(2)}</TableCell>
                <TableCell>${sale.dueAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip 
                    label={sale.paymentStatus} 
                    size="small" 
                    sx={{ 
                      bgcolor: 
                        sale.paymentStatus === 'Paid' ? '#dcfce7' : 
                        sale.paymentStatus === 'Partially Paid' ? '#fef9c3' : 
                        '#fee2e2',
                      color: 
                        sale.paymentStatus === 'Paid' ? '#15803d' : 
                        sale.paymentStatus === 'Partially Paid' ? '#ca8a04' : 
                        '#dc2626',
                    }} 
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={(event) => handleMenuOpen(event, sale.id)}
                  >
                    <DotsThreeIcon size={20} />
                  </IconButton>
                  <Menu
                    anchorEl={anchorElMap[sale.id]}
                    open={Boolean(anchorElMap[sale.id])}
                    onClose={() => handleMenuClose(sale.id)}
                  >
                    <MenuItem onClick={() => handleEditSale(sale.id)}>Edit</MenuItem>
                    <MenuItem onClick={() => {alert(`View sale details: ${sale.id}`); handleMenuClose(sale.id);}}>View Details</MenuItem>
                    <MenuItem onClick={() => {alert(`Print invoice: ${sale.id}`); handleMenuClose(sale.id);}}>Print Invoice</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={5} align="right" sx={{ fontWeight: 'bold' }}>
                Total
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>${totalAmount.toFixed(2)}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>${totalPaid.toFixed(2)}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>${totalDue.toFixed(2)}</TableCell>
              <TableCell colSpan={2}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

      {/* Modals */}
      {isSaleModalOpen && currentSale && (
        <SaleEditModal
          open={isSaleModalOpen}
          onClose={() => setIsSaleModalOpen(false)}
          onSave={handleSaveSale}
          sale={currentSale}
          isNew={!currentSale.id}
        />
      )}
    </Box>
  );
} 