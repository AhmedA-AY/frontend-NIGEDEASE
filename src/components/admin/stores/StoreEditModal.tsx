import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import { InventoryStore } from '@/services/api/inventory';

interface StoreEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (storeData: any) => Promise<void>;
  store?: InventoryStore;
}

export default function StoreEditModal({ open, onClose, onSave, store }: StoreEditModalProps): React.JSX.Element {
  const [formData, setFormData] = React.useState({
    id: store?.id || '',
    name: store?.name || '',
    location: store?.location || '',
    is_active: store?.is_active === 'active'
  });
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Reset form when modal opens or store changes
  React.useEffect(() => {
    if (open) {
      setFormData({
        id: store?.id || '',
        name: store?.name || '',
        location: store?.location || '',
        is_active: store?.is_active === 'active'
      });
    }
  }, [open, store]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, is_active: e.target.checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave({
        ...formData,
        is_active: formData.is_active ? 'active' : 'inactive'
      });
      onClose();
    } catch (error) {
      console.error('Error saving store:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{store ? 'Edit Store' : 'Add New Store'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Store Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              fullWidth
              placeholder="City, Country"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={handleSwitchChange}
                  name="is_active"
                  color="primary"
                />
              }
              label={formData.is_active ? 'Active' : 'Inactive'}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!formData.name || !formData.location || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : store ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 