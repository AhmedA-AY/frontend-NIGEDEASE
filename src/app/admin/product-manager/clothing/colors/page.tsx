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

import { PageHeading } from '@/components/page-heading';
import { Color, ColorCreateData, ColorUpdateData } from '@/services/api/clothings';
import { useSnackbar } from 'notistack';
import { useColors, useCreateColor, useUpdateColor, useDeleteColor } from '@/hooks/use-clothings';

export default function ColorsPage(): React.JSX.Element {
  const { isLoading: isLoadingColors, data: colors = [] } = useColors();
  const { mutate: createColor, isPending: isCreating } = useCreateColor();
  const { mutate: updateColor, isPending: isUpdating } = useUpdateColor();
  const { mutate: deleteColor, isPending: isDeleting } = useDeleteColor();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [colorToDelete, setColorToDelete] = useState<Color | null>(null);
  const [currentColor, setCurrentColor] = useState<ColorCreateData>({
    name: '',
    color_code: '#3b82f6',
    is_active: true
  });

  const isLoading = isLoadingColors || isCreating || isUpdating || isDeleting;
  const { enqueueSnackbar } = useSnackbar();

  // Filter colors by search term
  const filteredColors = colors.filter(color => 
    color.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddDialog = () => {
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
    if (!currentColor.name) {
      enqueueSnackbar('Color name is required', { variant: 'error' });
      return;
    }

    createColor(currentColor, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        enqueueSnackbar('Color created successfully', { variant: 'success' });
      }
    });
  };

  const handleEditColor = (color: Color) => {
    if (!currentColor.name) {
      enqueueSnackbar('Color name is required', { variant: 'error' });
      return;
    }

    updateColor({ 
      id: color.id, 
      data: currentColor 
    }, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        enqueueSnackbar('Color updated successfully', { variant: 'success' });
      }
    });
  };

  const handleDeleteColor = () => {
    if (!colorToDelete) return;

    deleteColor(colorToDelete.id, {
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
    setCurrentColor(prev => ({ 
      ...prev, 
      [name]: name === 'is_active' ? checked : value 
    }));
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <PageHeading 
            title="Colors Management" 
            actions={
              <Button
                startIcon={<PlusIcon />}
                variant="contained"
                onClick={handleOpenAddDialog}
              >
                Add Color
              </Button>
            }
          />
          
          <Card>
            <Box sx={{ p: 2 }}>
              <TextField
                placeholder="Search colors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                variant="outlined"
                size="small"
              />
            </Box>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Color</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : filteredColors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        <Typography variant="body1">
                          No colors found. Add your first color.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredColors.map((color) => (
                      <TableRow key={color.id} hover>
                        <TableCell>
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: 1,
                              bgcolor: color.color_code,
                              border: '1px solid',
                              borderColor: 'divider'
                            }}
                          />
                        </TableCell>
                        <TableCell>{color.name}</TableCell>
                        <TableCell>{color.color_code}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              color: color.is_active ? 'success.main' : 'text.disabled'
                            }}
                          >
                            {color.is_active ? 'Active' : 'Inactive'}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit">
                            <IconButton onClick={() => handleOpenEditDialog(color)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton onClick={() => handleOpenDeleteDialog(color)} color="error">
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Stack>
      </Container>

      {/* Add Color Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Color</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Color Name"
              name="name"
              value={currentColor.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Color
              </Typography>
              <HexColorPicker color={currentColor.color_code} onChange={handleColorChange} />
              <TextField
                label="Color Code"
                name="color_code"
                value={currentColor.color_code}
                onChange={handleInputChange}
                fullWidth
                sx={{ mt: 2 }}
              />
            </Box>
            
            <FormControlLabel
              control={
                <Switch
                  name="is_active"
                  checked={currentColor.is_active}
                  onChange={handleInputChange}
                />
              }
              label="Active"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
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
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Color</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Color Name"
              name="name"
              value={currentColor.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Color
              </Typography>
              <HexColorPicker color={currentColor.color_code} onChange={handleColorChange} />
              <TextField
                label="Color Code"
                name="color_code"
                value={currentColor.color_code}
                onChange={handleInputChange}
                fullWidth
                sx={{ mt: 2 }}
              />
            </Box>
            
            <FormControlLabel
              control={
                <Switch
                  name="is_active"
                  checked={currentColor.is_active}
                  onChange={handleInputChange}
                />
              }
              label="Active"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => colorToDelete && handleEditColor(colorToDelete)} 
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
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
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