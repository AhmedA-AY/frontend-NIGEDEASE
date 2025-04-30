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
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { paths } from '@/paths';
import PaymentInEditModal from '@/components/admin/payments/PaymentInEditModal';
import DeleteConfirmationModal from '@/components/admin/product-manager/DeleteConfirmationModal';

export default function PaymentInPage(): React.JSX.Element {
  const [selectedPayments, setSelectedPayments] = React.useState<string[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [currentPayment, setCurrentPayment] = React.useState<any>(null);
  const [paymentToDelete, setPaymentToDelete] = React.useState<string | null>(null);
  
  // Mock payment data
  const payments = [
    { id: '1', date: '19-04-2025', customer: 'Example Customer', invoiceNo: 'INV-1', amount: 482.00, bank: 'Example Bank', paymentMethod: 'Credit Card' },
    { id: '2', date: '19-04-2025', customer: 'John Doe', invoiceNo: 'INV-2', amount: 150.00, bank: 'Another Bank', paymentMethod: 'Bank Transfer' },
    { id: '3', date: '19-04-2025', customer: 'Jane Smith', invoiceNo: 'INV-3', amount: 275.00, bank: 'Example Bank', paymentMethod: 'Cash' },
  ];

  // Calculate total amount
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedPayments(payments.map(payment => payment.id));
    } else {
      setSelectedPayments([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedPayments.includes(id)) {
      setSelectedPayments(selectedPayments.filter(paymentId => paymentId !== id));
    } else {
      setSelectedPayments([...selectedPayments, id]);
    }
  };

  const handleAddNewPayment = () => {
    setCurrentPayment({
      date: new Date().toISOString().split('T')[0],
      customer: '',
      invoiceNo: '',
      amount: 0,
      bank: '',
      paymentMethod: '',
      reference: '',
      note: ''
    });
    setIsPaymentModalOpen(true);
  };

  const handleEditPayment = (id: string) => {
    const paymentToEdit = payments.find(payment => payment.id === id);
    if (paymentToEdit) {
      setCurrentPayment({
        id: paymentToEdit.id,
        date: paymentToEdit.date,
        customer: paymentToEdit.customer,
        invoiceNo: paymentToEdit.invoiceNo,
        amount: paymentToEdit.amount,
        bank: paymentToEdit.bank,
        paymentMethod: paymentToEdit.paymentMethod,
        reference: '', // Would fetch in a real app
        note: ''       // Would fetch in a real app
      });
      setIsPaymentModalOpen(true);
    }
  };

  const handleDeletePayment = (id: string) => {
    setPaymentToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (paymentToDelete) {
      // In a real application, this would call an API to delete the payment
      console.log(`Deleted payment with ID: ${paymentToDelete}`);
      setIsDeleteModalOpen(false);
      setPaymentToDelete(null);
    }
  };

  const handleSavePayment = (paymentData: any) => {
    if (paymentData.id) {
      // Update existing payment
      console.log(`Updated payment: ${JSON.stringify(paymentData)}`);
    } else {
      // Add new payment
      console.log(`Added new payment: ${JSON.stringify(paymentData)}`);
    }
    setIsPaymentModalOpen(false);
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: paths.admin.dashboard },
    { label: 'Payments', url: paths.admin.payments },
    { label: 'Payment In', url: paths.admin.paymentIn },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>Payment In</Typography>
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
            onClick={handleAddNewPayment}
          >
            Add Payment
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <OutlinedInput
            placeholder="Search..."
            size="small"
            startAdornment={
              <InputAdornment position="start">
                <MagnifyingGlassIcon size={20} />
              </InputAdornment>
            }
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
            <MenuItem value="Example Customer">Example Customer</MenuItem>
            <MenuItem value="John Doe">John Doe</MenuItem>
            <MenuItem value="Jane Smith">Jane Smith</MenuItem>
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

      {/* Payments Table */}
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={payments.length > 0 && selectedPayments.length === payments.length}
                  indeterminate={selectedPayments.length > 0 && selectedPayments.length < payments.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Invoice No.</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Bank</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedPayments.includes(payment.id)}
                    onChange={() => handleSelectOne(payment.id)}
                  />
                </TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>{payment.customer}</TableCell>
                <TableCell>{payment.invoiceNo}</TableCell>
                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                <TableCell>{payment.bank}</TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton 
                      size="small" 
                      sx={{ 
                        bgcolor: '#0ea5e9', 
                        color: 'white',
                        '&:hover': { bgcolor: '#0284c7' }  
                      }}
                      onClick={() => handleEditPayment(payment.id)}
                    >
                      <PencilSimpleIcon size={18} />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      sx={{ 
                        bgcolor: '#ef4444', 
                        color: 'white',
                        '&:hover': { bgcolor: '#dc2626' }  
                      }}
                      onClick={() => handleDeletePayment(payment.id)}
                    >
                      <TrashIcon size={18} />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={4} sx={{ fontWeight: 'bold' }}>
                Total
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>${totalAmount.toFixed(2)}</TableCell>
              <TableCell colSpan={3}></TableCell>
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
      {isPaymentModalOpen && currentPayment && (
        <PaymentInEditModal
          open={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSave={handleSavePayment}
          payment={currentPayment}
          isNew={!currentPayment.id}
        />
      )}
      
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={paymentToDelete ? (payments.find(p => p.id === paymentToDelete)?.invoiceNo || '') : ''}
        itemType="Payment"
        dependentItems={0}
      />
    </Box>
  );
} 