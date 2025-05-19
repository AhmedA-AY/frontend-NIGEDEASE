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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { paths } from '@/paths';
import ExpenseEditModal from '@/components/admin/expenses/ExpenseEditModal';
import DeleteConfirmationModal from '@/components/admin/product-manager/DeleteConfirmationModal';
import { useState, useEffect, useCallback } from 'react';
import { Expense, ExpenseCategory, ExpenseCreateData, financialsApi } from '@/services/api/financials';
import { TransactionPaymentMode, transactionsApi } from '@/services/api/transactions';
import { companiesApi, Currency, Company } from '@/services/api/companies';
import { useSnackbar } from 'notistack';
import { useCurrentUser } from '@/hooks/use-auth';

// Payment Mode Name Display component
const PaymentModeDisplay = ({ modeId, paymentModes }: { modeId: string, paymentModes: TransactionPaymentMode[] }) => {
  const mode = paymentModes.find(m => m.id === modeId);
  return <span>{mode ? mode.name : 'Unknown'}</span>;
};

// Currency Display component - optimized to use currencies from props
const CurrencyDisplay = ({ currencyId, currencies }: { currencyId: string, currencies: Currency[] }) => {
  const currency = currencies.find(c => c.id === currencyId);
  return <span>{currency ? currency.code : 'Unknown'}</span>;
};

export default function ExpensesPage(): React.JSX.Element {
  const [selectedExpenses, setSelectedExpenses] = React.useState<string[]>([]);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [currentExpense, setCurrentExpense] = React.useState<Partial<ExpenseCreateData> & { id?: string }>({
    expense_category: '',
    amount: '',
    description: '',
    currency: '',
    payment_mode: '',
  });
  const [expenseToDelete, setExpenseToDelete] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [paymentModes, setPaymentModes] = useState<TransactionPaymentMode[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const { userInfo } = useCurrentUser();
  const { enqueueSnackbar } = useSnackbar();
  
  // Fetch expenses, categories, and currencies
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [expensesData, categoriesData, currenciesData, modesData, companiesData] = await Promise.all([
        financialsApi.getExpenses(),
        financialsApi.getExpenseCategories(),
        companiesApi.getCurrencies(),
        transactionsApi.getPaymentModes(),
        companiesApi.getCompanies()
      ]);
      setExpenses(expensesData);
      setCategories(categoriesData);
      setCurrencies(currenciesData);
      setPaymentModes(modesData);
      setCompanies(companiesData);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      enqueueSnackbar('Failed to load expenses', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate total amount
  const totalAmount = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedExpenses(expenses.map(expense => expense.id));
    } else {
      setSelectedExpenses([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedExpenses.includes(id)) {
      setSelectedExpenses(selectedExpenses.filter(expenseId => expenseId !== id));
    } else {
      setSelectedExpenses([...selectedExpenses, id]);
    }
  };

  const handleAddNewExpense = () => {
    console.log('handleAddNewExpense called');
    console.log('Currencies available:', currencies);
    console.log('Companies available:', companies);
    
    // Use the first company if userInfo is not available
    const companyId = userInfo?.company_id || (companies.length > 0 ? companies[0].id : '');
    
    if (!companyId) {
      console.log('No company ID available');
      enqueueSnackbar('Unable to add expense: Company data not available.', { variant: 'error' });
      return;
    }
    
    setCurrentExpense({
      company: companyId,
      expense_category: '',
      amount: '',
      description: '',
      currency: currencies.length > 0 ? currencies[0].id : '', 
      payment_mode: '',
    });
    
    console.log('currentExpense set with company ID:', companyId);
    
    setIsExpenseModalOpen(true);
  };

  const handleEditExpense = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    if (expense) {
      setCurrentExpense(expense);
      setIsExpenseModalOpen(true);
    } else {
      enqueueSnackbar('Expense not found', { variant: 'error' });
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenseToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (expenseToDelete) {
      try {
        await financialsApi.deleteExpense(expenseToDelete);
        enqueueSnackbar('Expense deleted successfully', { variant: 'success' });
        fetchData();
        setIsDeleteModalOpen(false);
        setExpenseToDelete(null);
      } catch (error: any) {
        console.error('Error deleting expense:', error);
        enqueueSnackbar('Failed to delete expense', { variant: 'error' });
      }
    }
  };

  const handleSaveExpense = async (expenseData: ExpenseCreateData & { id?: string }) => {
    console.log('handleSaveExpense called with data:', expenseData);
    try {
      if (expenseData.id) {
        // Update existing expense
        console.log('Updating expense with ID:', expenseData.id);
        await financialsApi.updateExpense(expenseData.id, expenseData);
        enqueueSnackbar('Expense updated successfully', { variant: 'success' });
      } else {
        // Add new expense - company ID is now properly set in the modal component
        console.log('Creating new expense with data:', expenseData);
        await financialsApi.createExpense(expenseData);
        enqueueSnackbar('Expense added successfully', { variant: 'success' });
      }
      fetchData();
      setIsExpenseModalOpen(false);
    } catch (error: any) {
      console.error('Error saving expense:', error);
      console.log('Error response:', error.response);
      if (error.response && error.response.data) {
        // Display backend validation errors
        console.log('Backend validation errors:', error.response.data);
        enqueueSnackbar(JSON.stringify(error.response.data), { variant: 'error' });
      } else {
        enqueueSnackbar('Failed to save expense', { variant: 'error' });
      }
    }
  };

  // Find category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: paths.admin.dashboard },
    { label: 'Expenses', url: paths.admin.expenses },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>Expenses</Typography>
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
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="contained" 
            startIcon={<PlusIcon weight="bold" />}
            sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
            onClick={handleAddNewExpense}
            disabled={isLoading || currencies.length === 0 || (companies.length === 0 && !userInfo)}
          >
            Add New Expense
          </Button>
          <Button
            variant="outlined"
            href={paths.admin.expenseCategories}
          >
            Manage Categories
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Select
            displayEmpty
            value=""
            input={<OutlinedInput size="small" />}
            renderValue={(selected) => {
              if (!selected) {
                return <Typography color="text.secondary">Select Category...</Typography>;
              }
              return selected;
            }}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map(category => (
              <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
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
                width: 100
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
                width: 100
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Expenses Table */}
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={expenses.length > 0 && selectedExpenses.length === expenses.length}
                  indeterminate={selectedExpenses.length > 0 && selectedExpenses.length < expenses.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Expense Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Payment Mode</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} />
                  <Typography sx={{ ml: 2 }}>Loading expenses...</Typography>
                </TableCell>
              </TableRow>
            ) : expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography>No expenses found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense) => {
                const isSelected = selectedExpenses.includes(expense.id);
                const formattedDate = new Date(expense.created_at).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                }).replace(/\//g, '-');
                
                return (
                  <TableRow 
                    hover 
                    key={expense.id}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox 
                        checked={isSelected}
                        onChange={() => handleSelectOne(expense.id)}
                      />
                    </TableCell>
                    <TableCell>{getCategoryName(expense.expense_category)}</TableCell>
                    <TableCell>${parseFloat(expense.amount).toLocaleString()}</TableCell>
                    <TableCell>{formattedDate}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell><CurrencyDisplay currencyId={expense.currency} currencies={currencies} /></TableCell>
                    <TableCell><PaymentModeDisplay modeId={expense.payment_mode} paymentModes={paymentModes} /></TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditExpense(expense.id)}
                          sx={{ color: 'primary.main' }}
                        >
                          <PencilSimpleIcon size={20} />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteExpense(expense.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <TrashIcon size={20} />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
            <TableRow>
              <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>
                Total
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>${totalAmount.toLocaleString()}</TableCell>
              <TableCell colSpan={5}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <Pagination count={1} color="primary" />
        </Box>
      </Card>

      {/* Expense Edit Modal */}
      <ExpenseEditModal
        open={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSave={handleSaveExpense}
        expense={currentExpense}
        categories={categories}
      />
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
      />
    </Box>
  );
} 