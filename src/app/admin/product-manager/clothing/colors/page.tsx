'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PencilSimple as EditIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { TrashSimple as DeleteIcon } from '@phosphor-icons/react/dist/ssr/TrashSimple';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { HexColorPicker } from 'react-colorful';
import Alert from '@mui/material/Alert';

import { PageHeading } from '@/components/page-heading';
import { Color, ColorCreateData, ColorUpdateData } from '@/services/api/clothings';
import { useSnackbar } from 'notistack';
import { useColors, useCreateColor, useUpdateColor, useDeleteColor } from '@/hooks/use-clothings';
import { useStore } from '@/providers/store-provider';

export default function ColorsPage(): React.JSX.Element {
  const { currentStore } = useStore();
  const { isLoading: isLoadingColors, data: colors = [] } = useColors(currentStore?.id || '');
  const { mutate: createColor, isPending: isCreating } = useCreateColor();
  const { mutate: updateColor, isPending: isUpdating } = useUpdateColor();
  const { mutate: deleteColor, isPending: isDeleting } = useDeleteColor();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [colorToDelete, setColorToDelete] = useState<Color | null>(null);
  const [currentColor, setCurrentColor] = useState({
    name: '',
    color_code: '#3b82f6',
    is_active: true
  });

  const { enqueueSnackbar } = useSnackbar();
  const isLoading = !currentStore || isLoadingColors || isCreating || isUpdating || isDeleting;

  // Filter colors by search term
  const filteredColors = colors.filter(color => 
    color.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddDialog = () => {
    if (!currentStore) {
      enqueueSnackbar('No store selected', { variant: 'error' });
      return;
    }
    
    setCurrentColor({
      name: '',
      color_code: '#3b82f6',
      is_active: true
    });
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (color: Color) => {
    setCurrentColor({
      name: color.name,
      color_code: color.color_code,
      is_active: color.is_active
    });
    setIsEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (color: Color) => {
    setColorToDelete(color);
    setIsDeleteDialogOpen(true);
  };

  const handleAddColor = () => {
    if (!currentStore) {
      enqueueSnackbar('No store selected', { variant: 'error' });
      return;
    }

    if (!currentColor.name) {
      enqueueSnackbar('Color name is required', { variant: 'error' });
      return;
    }

    const colorData = {
      ...currentColor,
      store_id: currentStore.id
    };

    createColor({ 
      storeId: currentStore.id, 
      data: colorData 
    }, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        enqueueSnackbar('Color created successfully', { variant: 'success' });
      }
    });
  };

  const handleEditColor = (color: Color) => {
    if (!currentStore) {
      enqueueSnackbar('No store selected', { variant: 'error' });
      return;
    }

    if (!currentColor.name) {
      enqueueSnackbar('Color name is required', { variant: 'error' });
      return;
    }

    const colorData = {
      ...currentColor,
      store_id: currentStore.id
    };

    updateColor({ 
      storeId: currentStore.id,
      id: color.id, 
      data: colorData 
    }, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        enqueueSnackbar('Color updated successfully', { variant: 'success' });
      }
    });
  };

  const handleDeleteColor = () => {
    if (!colorToDelete || !currentStore) return;

    deleteColor({ 
      storeId: currentStore.id, 
      id: colorToDelete.id 
    }, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setColorToDelete(null);
        enqueueSnackbar('Color deleted successfully', { variant: 'success' });
      }
    });
  };

  const handleColorChange = (newColor: string) => {
    setCurrentColor(prev => ({ ...prev, color_code: newColor }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    
    // Handle checkbox differently
    if (name === 'is_active') {
      setCurrentColor(prev => ({ ...prev, [name]: checked }));
    } else {
      setCurrentColor(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
            <PageHeading 
              title="Colors" 
              subtitle={currentStore ? `Store: ${currentStore.name}` : 'No store selected'}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                size="small"
                placeholder="Search colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: { xs: '100%', sm: 240 } }}
              />
              <Button
                startIcon={<PlusIcon />}
                variant="contained"
                onClick={handleOpenAddDialog}
                disabled={isLoading || !currentStore}
              >
                Add Color
              </Button>
            </Stack>
          </Stack>

          <Card>
            {!currentStore ? (
              <Alert severity="warning" sx={{ m: 2 }}>
                Please select a store to view colors.
              </Alert>
            ) : isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : filteredColors.length === 0 ? (
              <Box sx={{ p: 3 }}>
                <Typography>No colors found for this store.</Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Color</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Hex Code</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredColors.map((color) => (
                      <TableRow key={color.id}>
                        <TableCell>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: 1,
                              bgcolor: color.color_code,
                              border: '1px solid',
                              borderColor: 'divider',
                            }}
                          />
                        </TableCell>
                        <TableCell>{color.name}</TableCell>
                        <TableCell>{color.color_code}</TableCell>
                        <TableCell>
                          {color.is_active ? (
                            <Typography variant="body2" color="success.main">
                              Active
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="error.main">
                              Inactive
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Edit">
                              <IconButton 
                                edge="end" 
                                size="small"
                                onClick={() => handleOpenEditDialog(color)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton 
                                edge="end" 
                                size="small"
                                onClick={() => handleOpenDeleteDialog(color)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        </Stack>
      </Container>

      {/* Add Color Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add New Color</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="Color Name"
              type="text"
              fullWidth
              value={currentColor.name}
              onChange={handleInputChange}
              required
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Typography variant="subtitle2">Select Color</Typography>
              <HexColorPicker color={currentColor.color_code} onChange={handleColorChange} />
              <TextField
                margin="dense"
                id="color_code"
                name="color_code"
                label="Color Hex Code"
                type="text"
                fullWidth
                value={currentColor.color_code}
                onChange={handleInputChange}
                sx={{ mt: 2 }}
              />
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={currentColor.is_active}
                  onChange={handleInputChange}
                  name="is_active"
                />
              }
              label="Active"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)} disabled={isCreating}>Cancel</Button>
          <Button 
            onClick={handleAddColor} 
            variant="contained"
            disabled={isCreating}
          >
            {isCreating ? 'Adding...' : 'Add Color'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Color Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Color</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="Color Name"
              type="text"
              fullWidth
              value={currentColor.name}
              onChange={handleInputChange}
              required
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Typography variant="subtitle2">Select Color</Typography>
              <HexColorPicker color={currentColor.color_code} onChange={handleColorChange} />
              <TextField
                margin="dense"
                id="color_code"
                name="color_code"
                label="Color Hex Code"
                type="text"
                fullWidth
                value={currentColor.color_code}
                onChange={handleInputChange}
                sx={{ mt: 2 }}
              />
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={currentColor.is_active}
                  onChange={handleInputChange}
                  name="is_active"
                />
              }
              label="Active"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)} disabled={isUpdating}>Cancel</Button>
          <Button 
            onClick={() => handleEditColor(colorToDelete!)} 
            variant="contained"
            disabled={isUpdating}
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Delete Color</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the color "{colorToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>Cancel</Button>
          <Button 
            onClick={handleDeleteColor} 
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 