'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { WarningCircle as WarningCircleIcon } from '@phosphor-icons/react/dist/ssr/WarningCircle';

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: string;
  dependentItems?: number;
}

export default function DeleteConfirmationModal({
  open,
  onClose,
  onConfirm,
  itemName,
  itemType,
  dependentItems = 0
}: DeleteConfirmationModalProps): React.JSX.Element {
  const hasDependentItems = dependentItems > 0;
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningCircleIcon size={28} weight="bold" style={{ color: '#ef4444', marginRight: '8px' }} />
          Delete {itemType}
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Are you sure you want to delete <strong>{itemName}</strong>?
        </DialogContentText>
        
        {hasDependentItems && (
          <Box sx={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            borderRadius: 1, 
            p: 2, 
            mb: 2 
          }}>
            <Typography variant="subtitle2" sx={{ color: '#ef4444' }}>
              Cannot delete this {itemType.toLowerCase()}
            </Typography>
            <Typography variant="body2" sx={{ color: '#ef4444', mt: 0.5 }}>
              This {itemType.toLowerCase()} is currently associated with {dependentItems} {dependentItems === 1 ? 'product' : 'products'}.
              Please remove these associations before deleting.
            </Typography>
          </Box>
        )}
        
        {!hasDependentItems && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            This action cannot be undone.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          disabled={hasDependentItems}
          sx={{ 
            bgcolor: '#ef4444', 
            color: 'white', 
            '&:hover': { bgcolor: '#dc2626' },
            '&.Mui-disabled': { 
              bgcolor: 'rgba(239, 68, 68, 0.3)', 
              color: 'white' 
            } 
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
} 