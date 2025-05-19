// @ts-nocheck
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
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { paths } from '@/paths';
import ExpenseEditModal from '@/components/admin/expenses/ExpenseEditModal';
import { ExpenseCategory } from '@/services/api/financials';

export default function ExpensesPage(): React.JSX.Element {
  const [selectedExpenses, setSelectedExpenses] = React.useState<number[]>([]);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = React.useState(false);
  const [currentExpense, setCurrentExpense] = React.useState<any>(null);
  
  // Mock expenses data
  const expenses = [
    { id: 1, category: 'Travel', amount: 48.00, date: '26-04-2025', user: 'Salesman' },
    { id: 2, category: 'Utilities', amount: 50.00, date: '26-04-2025', user: 'Mafalda Bahringer DDS' },
    { id: 3, category: 'Office Supplies', amount: 125.50, date: '24-04-2025', user: 'Admin User' },
    { id: 4, category: 'Marketing', amount: 350.00, date: '22-04-2025', user: 'Salesman' },
    { id: 5, category: 'Rent', amount: 1200.00, date: '20-04-2025', user: 'Admin User' },
    { id: 6, category: 'Insurance', amount: 480.75, date: '18-04-2025', user: 'Mafalda Bahringer DDS' },
    { id: 7, category: 'Salaries', amount: 2500.00, date: '15-04-2025', user: 'Admin User' },
    { id: 8, category: 'Repairs', amount: 175.25, date: '10-04-2025', user: 'Salesman' },
  ];

  // Calculate total amount
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Add mock categories
  const categories = [
    { id: '1', company: 'company1', name: 'Travel', description: 'Travel expenses', created_at: '2023-01-01', updated_at: '2023-01-01' },
    { id: '2', company: 'company1', name: 'Utilities', description: 'Utility bills', created_at: '2023-01-01', updated_at: '2023-01-01' },
    { id: '3', company: 'company1', name: 'Office Supplies', description: 'Office supplies and equipment', created_at: '2023-01-01', updated_at: '2023-01-01' },
    { id: '4', company: 'company1', name: 'Marketing', description: 'Marketing and advertising', created_at: '2023-01-01', updated_at: '2023-01-01' },
  ];

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedExpenses(expenses.map(expense => expense.id));
    } else {
      setSelectedExpenses([]);
    }
  };

  const handleSelectOne = (id: number) => {
    if (selectedExpenses.includes(id)) {
      setSelectedExpenses(selectedExpenses.filter(expenseId => expenseId !== id));
    } else {
      setSelectedExpenses([...selectedExpenses, id]);
    }
  };

  const handleAddNewExpense = () => {
    setCurrentExpense({
      category: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      user: '',
      description: '',
      reference: ''
    });
    setIsExpenseModalOpen(true);
  };

  const handleEditExpense = (id: number) => {
    const expenseToEdit = expenses.find(expense => expense.id === id);
    if (expenseToEdit) {
      setCurrentExpense(expenseToEdit);
      setIsExpenseModalOpen(true);
    }
  };

  const handleSaveExpense = (expenseData: any) => {
    if (expenseData.id) {
      // Update existing expense
      console.log(`Updated expense: ${JSON.stringify(expenseData)}`);
    } else {
      // Add new expense
      console.log(`Added new expense: ${JSON.stringify(expenseData)}`);
    }
    setIsExpenseModalOpen(false);
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
        <Box>
          <Button 
            variant="contained" 
            startIcon={<PlusIcon weight="bold" />}
            sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
            onClick={handleAddNewExpense}
          >
            Add New Expense
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
            <MenuItem value="Travel">Travel</MenuItem>
            <MenuItem value="Utilities">Utilities</MenuItem>
            <MenuItem value="Office Supplies">Office Supplies</MenuItem>
            <MenuItem value="Marketing">Marketing</MenuItem>
            <MenuItem value="Rent">Rent</MenuItem>
            <MenuItem value="Salaries">Salaries</MenuItem>
            <MenuItem value="Repairs">Repairs</MenuItem>
            <MenuItem value="Insurance">Insurance</MenuItem>
          </Select>
          <Select
            displayEmpty
            value=""
            input={<OutlinedInput size="small" />}
            renderValue={(selected) => {
              if (!selected) {
                return <Typography color="text.secondary">Select User...</Typography>;
              }
              return selected;
            }}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Users</MenuItem>
            <MenuItem value="Salesman">Salesman</MenuItem>
            <MenuItem value="Mafalda Bahringer DDS">Mafalda Bahringer DDS</MenuItem>
            <MenuItem value="Admin User">Admin User</MenuItem>
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
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedExpenses.includes(expense.id)}
                    onChange={() => handleSelectOne(expense.id)}
                  />
                </TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>${expense.amount.toFixed(2)}</TableCell>
                <TableCell>{expense.date}</TableCell>
                <TableCell>{expense.user}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton 
                      size="small" 
                      sx={{ 
                        bgcolor: '#0ea5e9', 
                        color: 'white',
                        '&:hover': { bgcolor: '#0284c7' }  
                      }}
                      onClick={() => handleEditExpense(expense.id)}
                    >
                      <PencilSimpleIcon size={18} />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={1} sx={{ fontWeight: 'bold' }}>
                Total
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>${totalAmount.toFixed(2)}</TableCell>
              <TableCell colSpan={4}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <Button size="small" sx={{ minWidth: 'auto', p: 0 }}>&lt;</Button>
              <Button 
                size="small" 
                sx={{ 
                  minWidth: 24, 
                  height: 24, 
                  p: 0, 
                  mx: 0.5, 
                  border: '1px solid #0ea5e9', 
                  borderRadius: 1,
                  color: '#0ea5e9' 
                }}
              >
                1
              </Button>
              <Button size="small" sx={{ minWidth: 'auto', p: 0 }}>&gt;</Button>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              10 / page <Box component="span" sx={{ ml: 0.5, cursor: 'pointer' }}>▼</Box>
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Modals */}
      {isExpenseModalOpen && currentExpense && (
        <ExpenseEditModal
          open={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          onSave={handleSaveExpense}
          expense={currentExpense}
          categories={categories}
        />
      )}
    </Box>
  );
} 