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
import { useCurrentUser } from '@/hooks/use-auth';

export default function SeasonsPage(): React.JSX.Element {
  const { isLoading: isLoadingSeasons, data: seasons = [] } = useSeasons();
  const { mutate: createSeason, isPending: isCreating } = useCreateSeason();
  const { mutate: updateSeason, isPending: isUpdating } = useUpdateSeason();
  const { mutate: deleteSeason, isPending: isDeleting } = useDeleteSeason();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSeason, setCurrentSeason] = useState<Season | null>(null);
  const [newSeason, setNewSeason] = useState<Partial<SeasonCreateData>>({
    name: '',
    description: '',
    start_date: format(new Date(), 'yyyy-MM-dd'),
    end_date: format(new Date(new Date().setMonth(new Date().getMonth() + 3)), 'yyyy-MM-dd')
  });
  
  const { userInfo } = useCurrentUser();
  const { enqueueSnackbar } = useSnackbar();
  
  const isLoading = isLoadingSeasons || isCreating || isUpdating || isDeleting;
  
  const handleOpenAddDialog = () => {
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
    if (!userInfo?.company_id) {
      enqueueSnackbar('Company information is required', { variant: 'error' });
      return;
    }
    
    if (!newSeason.name) {
      enqueueSnackbar('Season name is required', { variant: 'error' });
      return;
    }
    
    const createData = {
      ...newSeason,
      company_id: userInfo.company_id
    } as SeasonCreateData;
    
    createSeason(createData, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        enqueueSnackbar('Season created successfully', { variant: 'success' });
      }
    });
  };
  
  const handleEditSeason = () => {
    if (!currentSeason) return;
    
    if (!newSeason.name) {
      enqueueSnackbar('Season name is required', { variant: 'error' });
      return;
    }
    
    const updateData = {
      ...newSeason,
      company_id: currentSeason.company_id
    } as SeasonCreateData;
    
    updateSeason({ id: currentSeason.id, data: updateData }, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        enqueueSnackbar('Season updated successfully', { variant: 'success' });
      }
    });
  };
  
  const handleDeleteSeason = () => {
    if (!currentSeason) return;
    
    deleteSeason(currentSeason.id, {
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
    <>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <PageHeading 
              title="Clothing Seasons Management" 
              actions={
                <Button
                  startIcon={<PlusIcon />}
                  variant="contained"
                  onClick={handleOpenAddDialog}
                  disabled={isLoading}
                >
                  Add Season
                </Button>
              }
            />
            <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
              <CardHeader title="Seasons" />
              <CardContent>
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : seasons.length === 0 ? (
                  <Alert severity="info">No seasons found. Start by adding your first season.</Alert>
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
                            <TableCell>{season.name}</TableCell>
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
      </Box>

      {/* Add Season Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Season</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="Season Name"
              type="text"
              fullWidth
              value={newSeason.name || ''}
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
              value={newSeason.description || ''}
              onChange={handleInputChange}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={newSeason.start_date ? parseISO(newSeason.start_date as string) : null}
                onChange={handleStartDateChange}
                slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
              />
              <DatePicker
                label="End Date"
                value={newSeason.end_date ? parseISO(newSeason.end_date as string) : null}
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
            {isCreating ? 'Saving...' : 'Add Season'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Season Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Season</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              id="edit-name"
              name="name"
              label="Season Name"
              type="text"
              fullWidth
              value={newSeason.name || ''}
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
              value={newSeason.description || ''}
              onChange={handleInputChange}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={newSeason.start_date ? parseISO(newSeason.start_date as string) : null}
                onChange={handleStartDateChange}
                slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
              />
              <DatePicker
                label="End Date"
                value={newSeason.end_date ? parseISO(newSeason.end_date as string) : null}
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
    </>
  );
} 