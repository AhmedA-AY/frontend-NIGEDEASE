'use client';

import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Checkbox,
  IconButton,
  Paper,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { TrashSimple as TrashSimpleIcon } from '@phosphor-icons/react/dist/ssr/TrashSimple';
import { format } from 'date-fns';
import { Expense, ExpenseCategory } from '@/services/api/financials';
import { PaymentMode } from '@/services/api/transactions';
import { Currency } from '@/services/api/companies';

interface ExpenseTableProps {
  expenses: Expense[];
  categories: ExpenseCategory[];
  paymentModes: PaymentMode[];
  currencies: Currency[];
  selectedExpenses: string[];
  isLoading: boolean;
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectOne: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseTable({
  expenses,
  categories,
  paymentModes,
  currencies,
  selectedExpenses,
  isLoading,
  onSelectAll,
  onSelectOne,
  onEdit,
  onDelete
}: ExpenseTableProps) {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (expenses.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No expenses found. Create your first expense.
        </Typography>
      </Box>
    );
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const getPaymentModeName = (modeId: string) => {
    const mode = paymentModes.find(m => m.id === modeId);
    return mode ? mode.name : 'Unknown';
  };

  const getCurrencyCode = (currencyId: string) => {
    const currency = currencies.find(c => c.id === currencyId);
    return currency ? currency.code : 'Unknown';
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={selectedExpenses.length === expenses.length && expenses.length > 0}
                indeterminate={selectedExpenses.length > 0 && selectedExpenses.length < expenses.length}
                onChange={onSelectAll}
              />
            </TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Payment Mode</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.map((expense) => {
            const isSelected = selectedExpenses.includes(expense.id);
            
            return (
              <TableRow hover key={expense.id} selected={isSelected}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isSelected}
                    onChange={() => onSelectOne(expense.id)}
                  />
                </TableCell>
                <TableCell>
                  {format(new Date(expense.created_at), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>{getCategoryName(expense.expense_category)}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>
                  {expense.amount} {getCurrencyCode(expense.currency)}
                </TableCell>
                <TableCell>{getPaymentModeName(expense.payment_mode)}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => onEdit(expense.id)}
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    <PencilSimpleIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => onDelete(expense.id)}
                    size="small"
                  >
                    <TrashSimpleIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
} 