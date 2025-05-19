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
import DeleteConfirmationModal from '@/components/admin/product-manager/DeleteConfirmationModal';
import { useState, useEffect, useCallback } from 'react';
import { Sale, Customer, SaleCreateData, SaleUpdateData, transactionsApi, TransactionPaymentMode } from '@/services/api/transactions';
import { inventoryApi, InventoryStore } from '@/services/api/inventory';
import { companiesApi, Company, Currency } from '@/services/api/companies';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { SelectChangeEvent } from '@mui/material/Select';
import { useCurrentUser } from '@/hooks/use-auth';
import { financialsApi } from '@/services/api/financials';
import { useSnackbar } from 'notistack';
import { useStore } from '@/contexts/store-context';

export default function SalesPage(): React.JSX.Element {
  const { selectedStore } = useStore();
  const { enqueueSnackbar } = useSnackbar();
  const [tabValue, setTabValue] = React.useState(0);
  const [selectedSales, setSelectedSales] = React.useState<string[]>([]);
  const [anchorElMap, setAnchorElMap] = React.useState<{ [key: string]: HTMLElement | null }>({});
  const [isSaleModalOpen, setIsSaleModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [currentSale, setCurrentSale] = React.useState<any>(null);
  const [saleToDelete, setSaleToDelete] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editModalLoading, setEditModalLoading] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stores, setStores] = useState<InventoryStore[]>([]);
  const [filteredStores, setFilteredStores] = useState<InventoryStore[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [paymentModes, setPaymentModes] = useState<TransactionPaymentMode[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [selectedSaleDetails, setSelectedSaleDetails] = useState<Sale | null>(null);
  
  // Get current user's company
  const { userInfo, isLoading: isLoadingUser } = useCurrentUser();
  
  // Fetch sales and customers
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [salesData, customersData, companiesData, storesData, currenciesData, paymentModesData] = await Promise.all([
        transactionsApi.getSales(),
        transactionsApi.getCustomers(),
        companiesApi.getCompanies(),
        inventoryApi.getStores(),
        companiesApi.getCurrencies(),
        transactionsApi.getPaymentModes()
      ]);
      
      setSales(salesData);
      setCustomers(customersData);
      setCompanies(companiesData);
      setStores(storesData);
      setCurrencies(currenciesData);
      setPaymentModes(paymentModesData);
      
      // Filter stores based on user's company
      if (userInfo?.company_id) {
        const storesForCompany = storesData.filter(store => 
          store.company && store.company.id === userInfo.company_id
        );
        setFilteredStores(storesForCompany);
      }
      
      console.log('Fetched data:', {
        companies: companiesData,
        stores: storesData,
        currencies: currenciesData,
        paymentModes: paymentModesData
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userInfo]);

  useEffect(() => {
    if (!isLoadingUser) {
      fetchData();
    }
  }, [fetchData, isLoadingUser]);

  // Filter stores when userInfo changes
  useEffect(() => {
    if (userInfo?.company_id && stores.length > 0) {
      const storesForCompany = stores.filter(store => 
        store.company && store.company.id === userInfo.company_id
      );
      setFilteredStores(storesForCompany);
    }
  }, [userInfo, stores]);

  // Filter sales by selected customer
  const filteredSales = selectedCustomer
    ? sales.filter(sale => sale.customer.id === selectedCustomer)
    : sales;
    
  // Further filter sales by user's company if available
  const companySales = userInfo?.company_id
    ? filteredSales.filter(sale => sale.company.id === userInfo.company_id)
    : filteredSales;

  // Calculate total amounts
  const totalAmount = companySales.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0);
  const totalPaid = 0; // Not available in the API directly
  const totalDue = totalAmount - totalPaid;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSelectedSaleDetails(null); // Reset selected sale details when changing tabs
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedSales(companySales.map(sale => sale.id));
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

  const handleCustomerChange = (event: SelectChangeEvent) => {
    setSelectedCustomer(event.target.value);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    setAnchorElMap({ ...anchorElMap, [id]: event.currentTarget });
  };

  const handleMenuClose = (id: string) => {
    setAnchorElMap({ ...anchorElMap, [id]: null });
  };

  const handleRowClick = (sale: Sale) => {
    setSelectedSaleDetails(sale);
    setTabValue(3); // Switch to a new tab for viewing sale details
  };

  const handleAddNewSale = () => {
    // Use the current user's company ID instead of the first company
    const userCompanyId = userInfo?.company_id || '';
    // Only get stores from user's company
    const defaultStoreId = filteredStores.length > 0 ? filteredStores[0].id : '';
    const defaultCurrencyId = currencies.length > 0 ? currencies[0].id : '';
    const defaultPaymentModeId = paymentModes.length > 0 ? paymentModes[0].id : '';
    
    setCurrentSale({
      customer: '',
      totalAmount: 0,
      is_credit: false,
      company_id: userCompanyId,
      store_id: defaultStoreId,
      currency_id: defaultCurrencyId,
      payment_mode_id: defaultPaymentModeId
    });
    setIsSaleModalOpen(true);
  };

  const handleEditSale = async (saleId: string) => {
    try {
      if (!selectedStore) {
        enqueueSnackbar('Please select a store', { variant: 'error' });
        return;
      }
      
      setEditModalLoading(true);
      const saleToEdit = await transactionsApi.getSale(saleId);
      const saleItems = await transactionsApi.getSaleItems(saleId);
      
      // Convert sale items to the format expected by the form
      const products = await Promise.all(
        saleItems.map(async (item) => {
          // Get product details
          let product;
          try {
            product = await inventoryApi.getProduct(selectedStore.id, item.product.id);
          } catch (err) {
            console.error(`Error fetching product ${item.product.id}:`, err);
            product = item.product;
          }
          
          return {
            id: item.product.id,
            name: product.name,
            quantity: parseInt(item.quantity),
            unitPrice: product.sale_price ? parseFloat(product.sale_price) : 0,
            discount: 0, // Not available from API, default to 0
            tax: 0, // Not available from API, default to 0
            subtotal: parseFloat(item.quantity) * (product.sale_price ? parseFloat(product.sale_price) : 0)
          };
        })
      );
      
      setCurrentSale({
        id: saleToEdit.id,
        customer: saleToEdit.customer.id,
        company_id: saleToEdit.company.id,
        store_id: saleToEdit.store.id,
        currency_id: saleToEdit.currency.id,
        payment_mode_id: saleToEdit.payment_mode.id,
        totalAmount: parseFloat(saleToEdit.total_amount),
        is_credit: saleToEdit.is_credit,
        products: products
      });
      
      setIsSaleModalOpen(true);
      handleMenuClose(saleId);
    } catch (error) {
      console.error('Error fetching sale items:', error);
      alert('Failed to fetch sale details. Please try again.');
    } finally {
      setEditModalLoading(false);
    }
  };

  const handleDeleteSale = (id: string) => {
    setSaleToDelete(id);
    setIsDeleteModalOpen(true);
    handleMenuClose(id);
  };

  const handleConfirmDelete = async () => {
    if (saleToDelete) {
      try {
        await transactionsApi.deleteSale(saleToDelete);
        console.log(`Deleted sale with ID: ${saleToDelete}`);
        // Refresh data
        fetchData();
        setIsDeleteModalOpen(false);
        setSaleToDelete(null);
      } catch (error) {
        console.error('Error deleting sale:', error);
      }
    }
  };

  const handleSaveSale = async (saleData: any) => {
    try {
      // Log data before creating/updating
      console.log('Sale data to save:', saleData);
      
      // Ensure company_id is set from userInfo
      const company_id = userInfo?.company_id || '';
      
      // Verify company_id is available
      if (!company_id) {
        alert("Company information is not available. Please refresh the page or log in again.");
        return;
      }
      
      // For other fields, use the form values or defaults
      const store_id = saleData.store_id || (filteredStores.length > 0 ? filteredStores[0].id : '');
      const currency_id = saleData.currency_id || (currencies.length > 0 ? currencies[0].id : '');
      const payment_mode_id = saleData.payment_mode_id || (paymentModes.length > 0 ? paymentModes[0].id : '');
      
      // Log IDs being used
      console.log('Using IDs:', {
        company_id,
        store_id,
        currency_id,
        payment_mode_id
      });
      
      // Convert product items to the format expected by the API
      const items = (saleData.products || []).map((product: {id: string; quantity: number}) => ({
        product_id: product.id,
        quantity: String(product.quantity) // Ensure quantity is a string
      }));
      
      // Make sure we have at least one item
      if (items.length === 0) {
        alert("You must add at least one product to create a sale.");
        return;
      }
      
      const salePayload: SaleCreateData = {
        company_id: company_id,
        store_id: store_id,
        customer_id: saleData.customer,
        total_amount: saleData.totalAmount.toString(),
        currency_id: currency_id,
        payment_mode_id: payment_mode_id,
        is_credit: Boolean(saleData.is_credit),
        items: items
      };

      // Show final payload
      console.log('Final sale payload:', salePayload);

      let responseData;
      
      if (saleData.id) {
        // Update existing sale
        responseData = await transactionsApi.updateSale(saleData.id, salePayload);
        console.log(`Updated sale: ${JSON.stringify(salePayload)}`);
      } else {
        // Add new sale
        responseData = await transactionsApi.createSale(salePayload);
        console.log(`Added new sale: ${JSON.stringify(salePayload)}`);
      }
      
      // Create receivable automatically
      if (responseData) {
        try {
          console.log('Creating receivable for sale:', responseData.id);
          
          const receivablePayload = {
            company: company_id,
            sale: responseData.id,
            amount: saleData.totalAmount.toString(),
            currency: currency_id
          };
          
          await financialsApi.createReceivable(receivablePayload);
          console.log('Receivable created successfully');
        } catch (receivableError) {
          console.error('Error creating receivable:', receivableError);
          alert("Sale was saved, but there was an error creating the receivable. Please create it manually.");
        }
      }
      
      // Refresh the data
      fetchData();
      setIsSaleModalOpen(false);
    } catch (error: any) {
      console.error('Error saving sale:', error);
      // Display the error details if available
      if (error.response && error.response.data) {
        console.error('API error details:', error.response.data);
        alert(`Error: ${JSON.stringify(error.response.data)}`);
      } else {
        alert("An error occurred while saving the sale.");
      }
    }
  };

  const fetchProductById = async (productId: string) => {
    try {
      if (!selectedStore) {
        console.error('No store selected');
        enqueueSnackbar('Please select a store', { variant: 'error' });
        return null;
      }
      
      const response = await inventoryApi.getProduct(selectedStore.id, productId);
      return response;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      return null;
    }
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
            value={selectedCustomer}
            onChange={handleCustomerChange}
            input={<OutlinedInput size="small" />}
            renderValue={(selected) => {
              if (!selected) {
                return <Typography color="text.secondary">Select Customer...</Typography>;
              }
              const customer = customers.find(c => c.id === selected);
              return customer ? customer.name : "";
            }}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Customers</MenuItem>
            {customers.map(customer => (
              <MenuItem key={customer.id} value={customer.id}>{customer.name}</MenuItem>
            ))}
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
          {selectedSaleDetails && (
            <Tab 
              label="Sale Details" 
              sx={{ 
                textTransform: 'none',
                minHeight: 48,
                borderBottom: tabValue === 3 ? '2px solid #0ea5e9' : 'none',
                '&.Mui-selected': { color: '#0ea5e9' }
              }} 
            />
          )}
        </Tabs>
      </Box>

      {/* Sales Table or Sale Details */}
      {tabValue === 3 && selectedSaleDetails ? (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Sale Details</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Invoice Number</Typography>
                <Typography variant="body1">{selectedSaleDetails.id}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Sale Date</Typography>
                <Typography variant="body1">
                  {new Date(selectedSaleDetails.created_at).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip 
                  label={selectedSaleDetails.is_credit ? 'Credit' : 'Confirmed'} 
                  size="small"
                  sx={{ 
                    bgcolor: selectedSaleDetails.is_credit ? 'warning.100' : 'success.100',
                    color: selectedSaleDetails.is_credit ? 'warning.main' : 'success.main',
                    fontWeight: 500
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Customer</Typography>
                <Typography variant="body1">{selectedSaleDetails.customer.name}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Contact Info</Typography>
                <Typography variant="body1">{selectedSaleDetails.customer.email}</Typography>
                <Typography variant="body1">{selectedSaleDetails.customer.phone}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Total Amount</Typography>
                <Typography variant="body1">${parseFloat(selectedSaleDetails.total_amount).toFixed(2)}</Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3 }}>
            <Button 
              variant="outlined" 
              onClick={() => setTabValue(0)}
              sx={{ mr: 1 }}
            >
              Back to Sales
            </Button>
            <Button 
              variant="contained" 
              onClick={() => handleEditSale(selectedSaleDetails.id)}
              sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
            >
              Edit Sale
            </Button>
          </Box>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={companySales.length > 0 && selectedSales.length === companySales.length}
                    indeterminate={selectedSales.length > 0 && selectedSales.length < companySales.length}
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={24} />
                    <Typography sx={{ ml: 2 }}>Loading sales...</Typography>
                  </TableCell>
                </TableRow>
              ) : companySales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                    <Typography>No sales found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                companySales.map(sale => {
                  const isSelected = selectedSales.includes(sale.id);
                  const isMenuOpen = Boolean(anchorElMap[sale.id]);
                  const formattedDate = new Date(sale.created_at).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }).replace(/\//g, '-');
                  
                  // Determine display status based on Sale properties
                  const displayStatus = sale.is_credit ? 'Credit' : 'Confirmed';
                  const displayPaymentStatus = sale.is_credit ? 'Unpaid' : 'Paid';
                  
                  return (
                    <TableRow 
                      hover 
                      key={sale.id}
                      selected={isSelected}
                      onClick={() => handleRowClick(sale)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                        <Checkbox 
                          checked={isSelected}
                          onChange={() => handleSelectOne(sale.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">{sale.id.substring(0, 8)}</Typography>
                      </TableCell>
                      <TableCell>{formattedDate}</TableCell>
                      <TableCell>{sale.customer.name}</TableCell>
                      <TableCell>
                        <Chip 
                          label={displayStatus} 
                          size="small"
                          sx={{ 
                            bgcolor: displayStatus === 'Credit' ? 'warning.100' : 'success.100',
                            color: displayStatus === 'Credit' ? 'warning.main' : 'success.main',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>${parseFloat(sale.total_amount).toFixed(2)}</TableCell>
                      <TableCell>$0.00</TableCell>
                      <TableCell>${parseFloat(sale.total_amount).toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={displayPaymentStatus} 
                          size="small"
                          sx={{ 
                            bgcolor: displayPaymentStatus === 'Unpaid' ? 'error.100' : 'success.100',
                            color: displayPaymentStatus === 'Unpaid' ? 'error.main' : 'success.main',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <IconButton 
                          size="small"
                          onClick={(event) => handleMenuOpen(event, sale.id)}
                        >
                          <DotsThreeIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorElMap[sale.id]}
                          open={isMenuOpen}
                          onClose={() => handleMenuClose(sale.id)}
                        >
                          <MenuItem onClick={() => handleEditSale(sale.id)}>Edit</MenuItem>
                          <MenuItem onClick={() => handleDeleteSale(sale.id)}>Delete</MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      )}

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
      
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete this sale?`}
      />
    </Box>
  );
} 