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
import { useCurrentUser } from '@/hooks/use-auth';
import { transactionsApi } from '@/services/api/transactions';
import { financialsApi } from '@/services/api/financials';

export default function PurchasesPage(): React.JSX.Element {
  const [tabValue, setTabValue] = React.useState(0);
  const [selectedPurchases, setSelectedPurchases] = React.useState<string[]>([]);
  const [anchorElMap, setAnchorElMap] = React.useState<{ [key: string]: HTMLElement | null }>({});
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = React.useState(false);
  const [currentPurchase, setCurrentPurchase] = React.useState<any>(null);
  const { userInfo } = useCurrentUser();
  
  // Mock data for stores, currencies, and payment modes
  const filteredStores = React.useMemo(() => [{ id: 'store1', name: 'Main Store' }], []);
  const currencies = React.useMemo(() => [{ id: 'curr1', name: 'USD' }], []);
  const paymentModes = React.useMemo(() => [{ id: 'pm1', name: 'Cash' }], []);
  
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
  
  const fetchPurchases = React.useCallback(() => {
    // Placeholder for actual API call
    console.log('Fetching purchases...');
    // In a real app, this would make an API call to get the purchases
  }, []);

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

  const handleSavePurchase = async (purchaseData: any) => {
    try {
      // Check if user info is available
      if (!userInfo || !userInfo.company_id) {
        alert("Company information is not available. Please refresh the page or log in again.");
        return;
      }
      
      // Log data before creating/updating
      console.log('Purchase data to save:', purchaseData);
      
      // Use the user's company ID
      const company_id = userInfo.company_id;
      // For store, currency, and payment mode, use form values or defaults
      const store_id = purchaseData.store_id || (filteredStores.length > 0 ? filteredStores[0].id : '');
      const currency_id = purchaseData.currency_id || (currencies.length > 0 ? currencies[0].id : '');
      const payment_mode_id = purchaseData.payment_mode_id || (paymentModes.length > 0 ? paymentModes[0].id : '');
      
      // Validate required fields
      if (!store_id || !currency_id || !payment_mode_id || !purchaseData.supplier) {
        alert("Missing required information. Please ensure all fields are filled.");
        return;
      }
      
      // Convert product items to the format expected by the API
      const items = (purchaseData.products || []).map((product: {id: string; quantity: number}) => ({
        product_id: product.id,
        quantity: String(product.quantity) // Ensure quantity is a string
      }));
      
      // Make sure we have at least one item
      if (items.length === 0) {
        alert("You must add at least one product to create a purchase.");
        return;
      }
      
      const purchasePayload = {
        company_id: company_id,
        store_id: store_id,
        supplier_id: purchaseData.supplier,
        total_amount: purchaseData.totalAmount.toString(),
        currency_id: currency_id,
        payment_mode_id: payment_mode_id,
        is_credit: purchaseData.status === 'Credit',
        items: items
      };

      console.log('Final purchase payload:', purchasePayload);
      
      let responseData;
      if (purchaseData.id) {
        // Update existing purchase
        responseData = await transactionsApi.updatePurchase(store_id, purchaseData.id, purchasePayload);
        console.log(`Updated purchase: ${JSON.stringify(purchasePayload)}`);
        alert("Purchase updated successfully");
      } else {
        // Add new purchase
        responseData = await transactionsApi.createPurchase(store_id, purchasePayload);
        console.log(`Added new purchase: ${JSON.stringify(purchasePayload)}`);
        
        // Create payable automatically if purchase creation was successful
        if (responseData && responseData.id) {
          try {
            const payablePayload = {
              store_id: store_id,
              purchase: responseData.id,
              amount: purchaseData.totalAmount.toString(),
              currency: currency_id
            };
            
            await financialsApi.createPayable(store_id, payablePayload);
            console.log('Payable created successfully');
          } catch (payableError) {
            console.error('Error creating payable:', payableError);
            alert("Purchase was saved, but there was an error creating the payable. Please create it manually.");
          }
        }
        
        alert("Purchase added successfully");
      }
      
      // Refresh purchases
      fetchPurchases();
      setIsPurchaseModalOpen(false);
    } catch (error: any) {
      console.error('Error saving purchase:', error);
      if (error.response && error.response.data) {
        console.error('API error details:', error.response.data);
        alert(`Error: ${JSON.stringify(error.response.data)}`);
      } else {
        alert("An error occurred while saving the purchase.");
      }
    }
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