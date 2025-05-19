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
import DeleteConfirmationModal from '@/components/admin/product-manager/DeleteConfirmationModal';
import { useState, useEffect, useCallback } from 'react';
import { Purchase, Supplier, PurchaseCreateData, PurchaseUpdateData, transactionsApi, TransactionPaymentMode } from '@/services/api/transactions';
import { inventoryApi, InventoryStore } from '@/services/api/inventory';
import { companiesApi, Company, Currency } from '@/services/api/companies';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { SelectChangeEvent } from '@mui/material/Select';
import { useCurrentUser } from '@/hooks/use-auth';
import { financialsApi } from '@/services/api/financials';

export default function PurchasesPage(): React.JSX.Element {
  const [tabValue, setTabValue] = React.useState(0);
  const [selectedPurchases, setSelectedPurchases] = React.useState<string[]>([]);
  const [anchorElMap, setAnchorElMap] = React.useState<{ [key: string]: HTMLElement | null }>({});
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [currentPurchase, setCurrentPurchase] = React.useState<any>(null);
  const [purchaseToDelete, setPurchaseToDelete] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stores, setStores] = useState<InventoryStore[]>([]);
  const [filteredStores, setFilteredStores] = useState<InventoryStore[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [paymentModes, setPaymentModes] = useState<TransactionPaymentMode[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [selectedPurchaseDetails, setSelectedPurchaseDetails] = useState<Purchase | null>(null);
  
  // Get current user's company
  const { userInfo, isLoading: isLoadingUser } = useCurrentUser();
  
  // Fetch purchases and suppliers
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        purchasesData, 
        suppliersData, 
        companiesData, 
        storesData, 
        currenciesData, 
        paymentModesData
      ] = await Promise.all([
        transactionsApi.getPurchases(),
        transactionsApi.getSuppliers(),
        companiesApi.getCompanies(),
        inventoryApi.getStores(),
        companiesApi.getCurrencies(),
        transactionsApi.getPaymentModes()
      ]);
      
      setPurchases(purchasesData);
      setSuppliers(suppliersData);
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

  // Filter purchases by selected supplier
  const filteredPurchases = selectedSupplier
    ? purchases.filter(purchase => purchase.supplier.id === selectedSupplier)
    : purchases;
    
  // Further filter purchases by user's company if available
  const companyPurchases = userInfo?.company_id
    ? filteredPurchases.filter(purchase => purchase.company.id === userInfo.company_id)
    : filteredPurchases;

  // Calculate total amounts
  const totalAmount = companyPurchases.reduce((sum, purchase) => sum + parseFloat(purchase.total_amount), 0);
  const totalPaid = 0; // Not available in the API directly
  const totalDue = totalAmount - totalPaid;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSelectedPurchaseDetails(null); // Reset selected purchase details when changing tabs
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedPurchases(companyPurchases.map(purchase => purchase.id));
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

  const handleSupplierChange = (event: SelectChangeEvent) => {
    setSelectedSupplier(event.target.value);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    setAnchorElMap({ ...anchorElMap, [id]: event.currentTarget });
  };

  const handleMenuClose = (id: string) => {
    setAnchorElMap({ ...anchorElMap, [id]: null });
  };

  const handleRowClick = (purchase: Purchase) => {
    setSelectedPurchaseDetails(purchase);
    setTabValue(3); // Switch to a new tab for viewing purchase details
  };

  const handleAddNewPurchase = () => {
    // Use the current user's company ID instead of the first company
    const userCompanyId = userInfo?.company_id || '';
    // Only get stores from user's company
    const defaultStoreId = filteredStores.length > 0 ? filteredStores[0].id : '';
    const defaultCurrencyId = currencies.length > 0 ? currencies[0].id : '';
    const defaultPaymentModeId = paymentModes.length > 0 ? paymentModes[0].id : '';
    
    setCurrentPurchase({
      date: new Date().toISOString().split('T')[0],
      supplier: '',
      status: 'Ordered',
      products: [],
      totalAmount: 0,
      paidAmount: 0,
      dueAmount: 0,
      paymentStatus: 'Unpaid',
      company_id: userCompanyId,
      store_id: defaultStoreId,
      currency_id: defaultCurrencyId,
      payment_mode_id: defaultPaymentModeId,
      is_credit: false
    });
    setIsPurchaseModalOpen(true);
  };

  const handleEditPurchase = async (id: string) => {
    const purchaseToEdit = purchases.find(purchase => purchase.id === id);
    if (purchaseToEdit) {
      // Show loading indicator
      setIsLoading(true);
      
      try {
        // Fetch purchase items for this purchase
        const purchaseItems = await transactionsApi.getPurchaseItems(id);
        
        // Convert purchase items to the format expected by the form
        const products = await Promise.all(
          purchaseItems.map(async (item) => {
            // Get product details
            let product;
            try {
              product = await inventoryApi.getProduct(item.product.id);
            } catch (err) {
              console.error(`Error fetching product ${item.product.id}:`, err);
              product = item.product;
            }
            
            return {
              id: item.product.id,
              name: product.name,
              quantity: parseInt(item.quantity),
              unitPrice: product.purchase_price ? parseFloat(product.purchase_price) : 0,
              discount: 0, // Not available from API, default to 0
              tax: 0, // Not available from API, default to 0
              subtotal: parseFloat(item.quantity) * (product.purchase_price ? parseFloat(product.purchase_price) : 0)
            };
          })
        );
        
        // Convert the purchase data to the format expected by the modal
        setCurrentPurchase({
          id: purchaseToEdit.id,
          date: new Date(purchaseToEdit.created_at).toISOString().split('T')[0],
          supplier: purchaseToEdit.supplier.id,
          status: purchaseToEdit.is_credit ? 'Credit' : 'Paid',
          products: products,
          totalAmount: parseFloat(purchaseToEdit.total_amount),
          paidAmount: 0, // Not available directly
          dueAmount: parseFloat(purchaseToEdit.total_amount), // Assuming full amount is due
          paymentStatus: purchaseToEdit.is_credit ? 'Unpaid' : 'Paid',
          company_id: purchaseToEdit.company.id,
          store_id: purchaseToEdit.store.id,
          currency_id: purchaseToEdit.currency.id,
          payment_mode_id: purchaseToEdit.payment_mode.id,
          is_credit: purchaseToEdit.is_credit
        });
        
        setIsPurchaseModalOpen(true);
        handleMenuClose(id);
      } catch (error) {
        console.error('Error fetching purchase items:', error);
        alert('Failed to fetch purchase details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeletePurchase = (id: string) => {
    setPurchaseToDelete(id);
    setIsDeleteModalOpen(true);
    handleMenuClose(id);
  };

  const handleConfirmDelete = async () => {
    if (purchaseToDelete) {
      try {
        await transactionsApi.deletePurchase(purchaseToDelete);
        console.log(`Deleted purchase with ID: ${purchaseToDelete}`);
        // Refresh data
        fetchData();
        setIsDeleteModalOpen(false);
        setPurchaseToDelete(null);
      } catch (error) {
        console.error('Error deleting purchase:', error);
      }
    }
  };

  const handleSavePurchase = async (purchaseData: any) => {
    try {
      // Check if company_id is available
      if (!userInfo || !userInfo.company_id) {
        alert("Company information is not available. Please refresh the page or log in again.");
        return;
      }
      
      // Log data before creating/updating
      console.log('Purchase data to save:', purchaseData);
      
      // Use the user's company ID
      const company_id = userInfo.company_id;
      // For other fields, use the form values or defaults
      const store_id = purchaseData.store_id || (filteredStores.length > 0 ? filteredStores[0].id : '');
      const currency_id = purchaseData.currency_id || (currencies.length > 0 ? currencies[0].id : '');
      const payment_mode_id = purchaseData.payment_mode_id || (paymentModes.length > 0 ? paymentModes[0].id : '');
      
      // Log IDs being used
      console.log('Using IDs:', {
        company_id,
        store_id,
        currency_id,
        payment_mode_id
      });
      
      // Verify required IDs are present
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
      
      const purchasePayload: PurchaseCreateData = {
        company_id: company_id,
        store_id: store_id,
        supplier_id: purchaseData.supplier,
        total_amount: purchaseData.totalAmount.toString(),
        currency_id: currency_id,
        payment_mode_id: payment_mode_id,
        is_credit: purchaseData.status === 'Credit',
        items: items
      };

      // Show final payload
      console.log('Final purchase payload:', purchasePayload);

      let responseData;
      
      if (purchaseData.id) {
        // Update existing purchase
        responseData = await transactionsApi.updatePurchase(purchaseData.id, purchasePayload);
        console.log(`Updated purchase: ${JSON.stringify(purchasePayload)}`);
      } else {
        // Add new purchase
        responseData = await transactionsApi.createPurchase(purchasePayload);
        console.log(`Added new purchase: ${JSON.stringify(purchasePayload)}`);
      }
      
      // Create payable automatically
      if (responseData && responseData.id) {
        try {
          console.log('Creating payable for purchase:', responseData.id);
          
          const payablePayload = {
            company: company_id,
            purchase: responseData.id,
            amount: purchaseData.totalAmount.toString(),
            currency: currency_id
          };
          
          console.log('Payable payload:', payablePayload);
          
          await financialsApi.createPayable(payablePayload);
          console.log('Payable created successfully');
        } catch (payableError) {
          console.error('Error creating payable:', payableError);
          // Still consider the purchase successful, just show an error about the payable
          alert("Purchase was saved, but there was an error creating the payable. Please create it manually.");
        }
      } else {
        console.error('Purchase response missing ID:', responseData);
        alert("Purchase was saved but there was an issue with the response. Payable was not created.");
      }
      
      // Refresh the data
      fetchData();
      setIsPurchaseModalOpen(false);
    } catch (error: any) {
      console.error('Error saving purchase:', error);
      // Display the error details if available
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
            value={selectedSupplier}
            onChange={handleSupplierChange}
            input={<OutlinedInput size="small" />}
            renderValue={(selected) => {
              if (!selected) {
                return <Typography color="text.secondary">Select Supplier...</Typography>;
              }
              const supplier = suppliers.find(s => s.id === selected);
              return supplier ? supplier.name : "";
            }}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Suppliers</MenuItem>
            {suppliers.map(supplier => (
              <MenuItem key={supplier.id} value={supplier.id}>{supplier.name}</MenuItem>
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
          {selectedPurchaseDetails && (
            <Tab 
              label="Purchase Details" 
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

      {/* Purchases Table or Purchase Details */}
      {tabValue === 3 && selectedPurchaseDetails ? (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Purchase Details</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Invoice Number</Typography>
                <Typography variant="body1">{selectedPurchaseDetails.id}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Purchase Date</Typography>
                <Typography variant="body1">
                  {new Date(selectedPurchaseDetails.created_at).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip 
                  label={selectedPurchaseDetails.is_credit ? 'Credit' : 'Paid'} 
                  size="small"
                  sx={{ 
                    bgcolor: selectedPurchaseDetails.is_credit ? 'warning.100' : 'success.100',
                    color: selectedPurchaseDetails.is_credit ? 'warning.main' : 'success.main',
                    fontWeight: 500
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Supplier</Typography>
                <Typography variant="body1">{selectedPurchaseDetails.supplier.name}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Contact Info</Typography>
                <Typography variant="body1">{selectedPurchaseDetails.supplier.email}</Typography>
                <Typography variant="body1">{selectedPurchaseDetails.supplier.phone}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Total Amount</Typography>
                <Typography variant="body1">${parseFloat(selectedPurchaseDetails.total_amount).toFixed(2)}</Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3 }}>
            <Button 
              variant="outlined" 
              onClick={() => setTabValue(0)}
              sx={{ mr: 1 }}
            >
              Back to Purchases
            </Button>
            <Button 
              variant="contained" 
              onClick={() => handleEditPurchase(selectedPurchaseDetails.id)}
              sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
            >
              Edit Purchase
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
                    checked={companyPurchases.length > 0 && selectedPurchases.length === companyPurchases.length}
                    indeterminate={selectedPurchases.length > 0 && selectedPurchases.length < companyPurchases.length}
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={24} />
                    <Typography sx={{ ml: 2 }}>Loading purchases...</Typography>
                  </TableCell>
                </TableRow>
              ) : companyPurchases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                    <Typography>No purchases found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                companyPurchases.map(purchase => {
                  const isSelected = selectedPurchases.includes(purchase.id);
                  const isMenuOpen = Boolean(anchorElMap[purchase.id]);
                  const formattedDate = new Date(purchase.created_at).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }).replace(/\//g, '-');
                  
                  const displayStatus = purchase.is_credit ? 'Credit' : 'Paid';
                  const displayPaymentStatus = purchase.is_credit ? 'Unpaid' : 'Paid';
                  
                  return (
                    <TableRow 
                      hover 
                      key={purchase.id}
                      selected={isSelected}
                      onClick={() => handleRowClick(purchase)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                        <Checkbox 
                          checked={isSelected}
                          onChange={() => handleSelectOne(purchase.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">{purchase.id.substring(0, 8)}</Typography>
                      </TableCell>
                      <TableCell>{formattedDate}</TableCell>
                      <TableCell>{purchase.supplier.name}</TableCell>
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
                      <TableCell>${parseFloat(purchase.total_amount).toFixed(2)}</TableCell>
                      <TableCell>$0.00</TableCell>
                      <TableCell>${parseFloat(purchase.total_amount).toFixed(2)}</TableCell>
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
                          onClick={(event) => handleMenuOpen(event, purchase.id)}
                        >
                          <DotsThreeIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorElMap[purchase.id]}
                          open={isMenuOpen}
                          onClose={() => handleMenuClose(purchase.id)}
                        >
                          <MenuItem onClick={() => handleEditPurchase(purchase.id)}>Edit</MenuItem>
                          <MenuItem onClick={() => handleDeletePurchase(purchase.id)}>Delete</MenuItem>
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
      {isPurchaseModalOpen && currentPurchase && (
        <PurchaseEditModal
          open={isPurchaseModalOpen}
          onClose={() => setIsPurchaseModalOpen(false)}
          onSave={handleSavePurchase}
          purchase={currentPurchase}
          isNew={!currentPurchase.id}
        />
      )}
      
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete this purchase?`}
      />
    </Box>
  );
} 