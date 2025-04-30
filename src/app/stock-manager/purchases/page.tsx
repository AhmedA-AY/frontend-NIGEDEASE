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
import PurchaseEditModal from '@/components/admin/purchases/PurchaseEditModal';

export default function PurchasesPage(): React.JSX.Element {
  const [tabValue, setTabValue] = React.useState(0);
  const [selectedPurchases, setSelectedPurchases] = React.useState<string[]>([]);
  const [anchorElMap, setAnchorElMap] = React.useState<{ [key: string]: HTMLElement | null }>({});
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = React.useState(false);
  const [currentPurchase, setCurrentPurchase] = React.useState<any>(null);
  
  // Mock purchases data
  const purchases = [
    { id: 'PUR-32', date: '18-04-2025', supplier: 'Lang, Wolff and Zemlak', status: 'Pending', totalAmount: 433.00, paidAmount: 0.00, dueAmount: 433.00, paymentStatus: 'Unpaid' },
    { id: 'PUR-31', date: '24-04-2025', supplier: 'Cruickshank-Turcotte', status: 'Received', totalAmount: 336.00, paidAmount: 40.00, dueAmount: 296.00, paymentStatus: 'Partially Paid' },
    { id: 'PUR-30', date: '24-04-2025', supplier: 'Hahn and Sons', status: 'Pending', totalAmount: 3067.00, paidAmount: 0.00, dueAmount: 3067.00, paymentStatus: 'Unpaid' },
    { id: 'PUR-29', date: '28-04-2025', supplier: 'Mohr Ltd', status: 'Ordered', totalAmount: 6757.00, paidAmount: 0.00, dueAmount: 6757.00, paymentStatus: 'Unpaid' },
    { id: 'PUR-28', date: '26-04-2025', supplier: 'Lakin-Beatty', status: 'Pending', totalAmount: 156.00, paidAmount: 146.00, dueAmount: 10.00, paymentStatus: 'Partially Paid' },
    { id: 'PUR-27', date: '17-04-2025', supplier: 'Johnson Ltd', status: 'Pending', totalAmount: 1342.00, paidAmount: 1342.00, dueAmount: 0.00, paymentStatus: 'Paid' },
    { id: 'PUR-26', date: '23-04-2025', supplier: 'Carroll Inc', status: 'Ordered', totalAmount: 217.00, paidAmount: 217.00, dueAmount: 0.00, paymentStatus: 'Paid' },
    { id: 'PUR-25', date: '19-04-2025', supplier: 'Mayert-Schmeler', status: 'Ordered', totalAmount: 484.00, paidAmount: 0.00, dueAmount: 484.00, paymentStatus: 'Unpaid' },
    { id: 'PUR-24', date: '21-04-2025', supplier: 'Miller, Marks and Kub', status: 'Pending', totalAmount: 43.00, paidAmount: 43.00, dueAmount: 0.00, paymentStatus: 'Paid' },
    { id: 'PUR-23', date: '23-04-2025', supplier: 'Rutherford-Harvey', status: 'Received', totalAmount: 412.00, paidAmount: 0.00, dueAmount: 412.00, paymentStatus: 'Unpaid' },
  ];

  // Calculate total amounts
  const totalAmount = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
  const totalPaid = purchases.reduce((sum, purchase) => sum + purchase.paidAmount, 0);
  const totalDue = purchases.reduce((sum, purchase) => sum + purchase.dueAmount, 0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedPurchases(purchases.map(purchase => purchase.id));
    } else {
      setSelectedPurchases([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedPurchases.includes(id)) {
      setSelectedPurchases(selectedPurchases.filter(purchaseId => purchaseId !== id));
    } else {
      setSelectedPurchases([...selectedPurchases, id]);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    setAnchorElMap({ ...anchorElMap, [id]: event.currentTarget });
  };

  const handleMenuClose = (id: string) => {
    setAnchorElMap({ ...anchorElMap, [id]: null });
  };

  const handleAddNewPurchase = () => {
    setCurrentPurchase({
      date: new Date().toISOString().split('T')[0],
      supplier: '',
      status: 'Ordered',
      products: [],
      totalAmount: 0,
      paidAmount: 0,
      dueAmount: 0,
      paymentStatus: 'Unpaid'
    });
    setIsPurchaseModalOpen(true);
  };

  const handleEditPurchase = (id: string) => {
    const purchaseToEdit = purchases.find(purchase => purchase.id === id);
    if (purchaseToEdit) {
      setCurrentPurchase(purchaseToEdit);
      setIsPurchaseModalOpen(true);
      handleMenuClose(id);
    }
  };

  const handleSavePurchase = (purchaseData: any) => {
    if (purchaseData.id) {
      // Update existing purchase
      console.log(`Updated purchase: ${JSON.stringify(purchaseData)}`);
    } else {
      // Add new purchase
      console.log(`Added new purchase: ${JSON.stringify(purchaseData)}`);
    }
    setIsPurchaseModalOpen(false);
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: paths.admin.dashboard },
    { label: 'Purchases', url: paths.admin.purchases },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>Purchases</Typography>
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
            onClick={handleAddNewPurchase}
          >
            Add New Purchase
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
                return <Typography color="text.secondary">Select Supplier...</Typography>;
              }
              return selected;
            }}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Suppliers</MenuItem>
            <MenuItem value="Johnson Ltd">Johnson Ltd</MenuItem>
            <MenuItem value="Lakin-Beatty">Lakin-Beatty</MenuItem>
            <MenuItem value="Cruickshank-Turcotte">Cruickshank-Turcotte</MenuItem>
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

      {/* Purchase Type Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="purchase type tabs">
          <Tab 
            label="All Purchases" 
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

      {/* Purchases Table */}
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={purchases.length > 0 && selectedPurchases.length === purchases.length}
                  indeterminate={selectedPurchases.length > 0 && selectedPurchases.length < purchases.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Invoice Number</TableCell>
              <TableCell>Purchase Date</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Purchase Status</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Paid Amount</TableCell>
              <TableCell>Due Amount</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchases.map((purchase) => (
              <TableRow key={purchase.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedPurchases.includes(purchase.id)}
                    onChange={() => handleSelectOne(purchase.id)}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button size="small" sx={{ minWidth: 'auto', p: 0, mr: 1, color: 'text.secondary' }}>+</Button>
                    <Typography variant="body2" color="primary">
                      {purchase.id}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{purchase.date}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ width: 24, height: 24, bgcolor: '#e0e7ff' }}></Avatar>
                    <Typography variant="body2" color="primary">
                      {purchase.supplier}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={purchase.status} 
                    size="small" 
                    sx={{ 
                      bgcolor: 
                        purchase.status === 'Received' ? '#dcfce7' : 
                        purchase.status === 'Ordered' ? '#e0f2fe' : 
                        '#fef9c3',
                      color: 
                        purchase.status === 'Received' ? '#15803d' : 
                        purchase.status === 'Ordered' ? '#0284c7' : 
                        '#ca8a04',
                    }} 
                  />
                </TableCell>
                <TableCell>${purchase.totalAmount.toFixed(2)}</TableCell>
                <TableCell>${purchase.paidAmount.toFixed(2)}</TableCell>
                <TableCell>${purchase.dueAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip 
                    label={purchase.paymentStatus} 
                    size="small" 
                    sx={{ 
                      bgcolor: 
                        purchase.paymentStatus === 'Paid' ? '#dcfce7' : 
                        purchase.paymentStatus === 'Partially Paid' ? '#fef9c3' : 
                        '#fee2e2',
                      color: 
                        purchase.paymentStatus === 'Paid' ? '#15803d' : 
                        purchase.paymentStatus === 'Partially Paid' ? '#ca8a04' : 
                        '#dc2626',
                    }} 
                  />
                </TableCell>
                <TableCell>
                  <IconButton 
                    size="small" 
                    onClick={(e) => handleMenuOpen(e, purchase.id)}
                  >
                    <DotsThreeIcon size={20} />
                  </IconButton>
                  <Menu
                    anchorEl={anchorElMap[purchase.id]}
                    open={Boolean(anchorElMap[purchase.id])}
                    onClose={() => handleMenuClose(purchase.id)}
                  >
                    <MenuItem onClick={() => {alert(`View purchase details: ${purchase.id}`); handleMenuClose(purchase.id);}}>View Details</MenuItem>
                    <MenuItem onClick={() => handleEditPurchase(purchase.id)}>Edit</MenuItem>
                    <MenuItem onClick={() => {alert(`Print invoice: ${purchase.id}`); handleMenuClose(purchase.id);}}>Print Invoice</MenuItem>
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
      {isPurchaseModalOpen && currentPurchase && (
        <PurchaseEditModal
          open={isPurchaseModalOpen}
          onClose={() => setIsPurchaseModalOpen(false)}
          onSave={handleSavePurchase}
          purchase={currentPurchase}
          isNew={!currentPurchase.id}
        />
      )}
    </Box>
  );
} 