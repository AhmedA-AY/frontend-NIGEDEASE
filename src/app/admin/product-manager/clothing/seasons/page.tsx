'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
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
import Alert from '@mui/material/Alert';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO } from 'date-fns';

import { PageHeading } from '@/components/page-heading';
import { Season, SeasonCreateData } from '@/services/api/clothings';
import { useSnackbar } from 'notistack';
import { useSeasons, useCreateSeason, useUpdateSeason, useDeleteSeason } from '@/hooks/use-clothings';
import { useStore } from '@/providers/store-provider';

export default function SeasonsPage(): React.JSX.Element {
  const { currentStore } = useStore();
  const { isLoading: isLoadingSeasons, data: seasons = [] } = useSeasons(currentStore?.id || '');
  const { mutate: createSeason, isPending: isCreating } = useCreateSeason();
  const { mutate: updateSeason, isPending: isUpdating } = useUpdateSeason();
  const { mutate: deleteSeason, isPending: isDeleting } = useDeleteSeason();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSeason, setCurrentSeason] = useState<Season | null>(null);
  const [newSeason, setNewSeason] = useState({
    name: '',
    description: '',
    start_date: format(new Date(), 'yyyy-MM-dd'),
    end_date: format(new Date(new Date().setMonth(new Date().getMonth() + 3)), 'yyyy-MM-dd')
  });
  
  const { enqueueSnackbar } = useSnackbar();
  const isLoading = !currentStore || isLoadingSeasons || isCreating || isUpdating || isDeleting;
  
  const handleOpenAddDialog = () => {
    if (!currentStore) {
      enqueueSnackbar('No store selected', { variant: 'error' });
      return;
    }
    
    setNewSeason({
      name: '',
      description: '',
      start_date: format(new Date(), 'yyyy-MM-dd'),
      end_date: format(new Date(new Date().setMonth(new Date().getMonth() + 3)), 'yyyy-MM-dd')
    });
    setIsAddDialogOpen(true);
  };
  
  const handleOpenEditDialog = (season: Season) => {
    setCurrentSeason(season);
    setNewSeason({
      name: season.name,
      description: season.description,
      start_date: season.start_date,
      end_date: season.end_date
    });
    setIsEditDialogOpen(true);
  };
  
  const handleOpenDeleteDialog = (season: Season) => {
    setCurrentSeason(season);
    setIsDeleteDialogOpen(true);
  };
  
  const handleAddSeason = () => {
    if (!currentStore) {
      enqueueSnackbar('No store selected', { variant: 'error' });
      return;
    }
    
    if (!newSeason.name) {
      enqueueSnackbar('Season name is required', { variant: 'error' });
      return;
    }
    
    const seasonData = {
      ...newSeason,
      store_id: currentStore.id
    };
    
    createSeason({ 
      storeId: currentStore.id, 
      data: seasonData 
    }, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        enqueueSnackbar('Season created successfully', { variant: 'success' });
      }
    });
  };
  
  const handleEditSeason = () => {
    if (!currentSeason || !currentStore) return;
    
    if (!newSeason.name) {
      enqueueSnackbar('Season name is required', { variant: 'error' });
      return;
    }
    
    const seasonData = {
      ...newSeason,
      store_id: currentStore.id
    };
    
    updateSeason({ 
      storeId: currentStore.id,
      id: currentSeason.id, 
      data: seasonData 
    }, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        enqueueSnackbar('Season updated successfully', { variant: 'success' });
      }
    });
  };
  
  const handleDeleteSeason = () => {
    if (!currentSeason || !currentStore) return;
    
    deleteSeason({ 
      storeId: currentStore.id, 
      id: currentSeason.id 
    }, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setCurrentSeason(null);
        enqueueSnackbar('Season deleted successfully', { variant: 'success' });
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSeason({ ...newSeason, [name]: value });
  };

  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      setNewSeason({ ...newSeason, start_date: format(date, 'yyyy-MM-dd') });
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      setNewSeason({ ...newSeason, end_date: format(date, 'yyyy-MM-dd') });
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <PageHeading 
            title="Seasons Management" 
            subtitle={currentStore ? `Store: ${currentStore.name}` : 'No store selected'}
            actions={
              <Button
                startIcon={<PlusIcon />}
                variant="contained"
                onClick={handleOpenAddDialog}
                disabled={isLoading || !currentStore}
              >
                Add Season
              </Button>
            }
          />
          
          <Card>
            <CardHeader title="Clothing Seasons" />
            <CardContent>
              {!currentStore ? (
                <Alert severity="warning">Please select a store to view seasons.</Alert>
              ) : isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : seasons.length === 0 ? (
                <Alert severity="info">
                  No seasons found for this store. Start by adding your first season.
                </Alert>
              ) : (
                <TableContainer component={Paper} elevation={0}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {seasons.map((season) => (
                        <TableRow
                          key={season.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {season.name}
                          </TableCell>
                          <TableCell>{season.description || '-'}</TableCell>
                          <TableCell>
                            {format(parseISO(season.start_date), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell>
                            {format(parseISO(season.end_date), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title="Edit">
                                <IconButton 
                                  edge="end" 
                                  size="small"
                                  onClick={() => handleOpenEditDialog(season)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton 
                                  edge="end" 
                                  size="small"
                                  onClick={() => handleOpenDeleteDialog(season)}
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
            </CardContent>
          </Card>
        </Stack>
      </Container>

      {/* Add Season Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Season</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="Season Name"
              type="text"
              fullWidth
              value={newSeason.name}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              id="description"
              name="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={newSeason.description}
              onChange={handleInputChange}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={parseISO(newSeason.start_date)}
                onChange={handleStartDateChange}
                slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
              />
              <DatePicker
                label="End Date"
                value={parseISO(newSeason.end_date)}
                onChange={handleEndDateChange}
                slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
              />
            </LocalizationProvider>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)} disabled={isCreating}>Cancel</Button>
          <Button 
            onClick={handleAddSeason} 
            variant="contained"
            disabled={isCreating}
          >
            {isCreating ? 'Adding...' : 'Add Season'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Season Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Season</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              id="edit-name"
              name="name"
              label="Season Name"
              type="text"
              fullWidth
              value={newSeason.name}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              id="edit-description"
              name="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={newSeason.description}
              onChange={handleInputChange}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={parseISO(newSeason.start_date)}
                onChange={handleStartDateChange}
                slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
              />
              <DatePicker
                label="End Date"
                value={parseISO(newSeason.end_date)}
                onChange={handleEndDateChange}
                slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
              />
            </LocalizationProvider>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)} disabled={isUpdating}>Cancel</Button>
          <Button 
            onClick={handleEditSeason} 
            variant="contained"
            disabled={isUpdating}
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Delete Season</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the season "{currentSeason?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>Cancel</Button>
          <Button 
            onClick={handleDeleteSeason} 
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