'use client';

import { useState, useEffect } from 'react';
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
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO } from 'date-fns';

import { PageHeading } from '@/components/page-heading';
import { Collection, CollectionCreateData, Season, clothingsApi } from '@/services/api/clothings';
import { companiesApi } from '@/services/api/companies';
import { useSnackbar } from 'notistack';
import { useCollections, useCreateCollection, useDeleteCollection, useUpdateCollection, useSeasons } from '@/hooks/use-clothings';
import { useCurrentUser } from '@/hooks/use-auth';

export default function CollectionsPage(): React.JSX.Element {
  const [currentStoreId, setCurrentStoreId] = useState<string>('');
  const { isLoading: isLoadingCollections, data: collections = [] } = useCollections(currentStoreId);
  const { isLoading: isLoadingSeasons, data: seasons = [] } = useSeasons(currentStoreId);
  const { mutate: createCollection, isPending: isCreating } = useCreateCollection();
  const { mutate: updateCollection, isPending: isUpdating } = useUpdateCollection();
  const { mutate: deleteCollection, isPending: isDeleting } = useDeleteCollection();
  
  const [openCollection, setOpenCollection] = useState<Collection | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newCollection, setNewCollection] = useState<any>({
    name: '',
    description: '',
    season_id: '',
    release_date: format(new Date(), 'yyyy-MM-dd')
  });
  
  const { userInfo } = useCurrentUser();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoadingStore, setIsLoadingStore] = useState(true);
  
  useEffect(() => {
    const fetchStoreId = async () => {
      try {
        // Get companies to find the user's company
        const companiesData = await companiesApi.getCompanies();
        const companyId = userInfo?.company_id || (companiesData.length > 0 ? companiesData[0].id : '');
        
        if (!companyId) {
          enqueueSnackbar('No company information found', { variant: 'error' });
          setIsLoadingStore(false);
          return;
        }
        
        // Get stores for the company
        const stores = await companiesApi.getStores(companyId);
        
        if (stores.length > 0) {
          const storeId = stores[0].id;
          setCurrentStoreId(storeId);
        } else {
          enqueueSnackbar('No stores found for your company', { variant: 'warning' });
        }
        setIsLoadingStore(false);
      } catch (error) {
        console.error('Error fetching store ID:', error);
        enqueueSnackbar('Failed to load store information', { variant: 'error' });
        setIsLoadingStore(false);
      }
    };
    
    fetchStoreId();
  }, [userInfo, enqueueSnackbar]);
  
  const isLoading = isLoadingStore || isLoadingCollections || isLoadingSeasons || isCreating || isUpdating || isDeleting;
  
  const handleOpenAddDialog = () => {
    // Reset form data
    setNewCollection({
      name: '',
      description: '',
      season_id: seasons.length > 0 ? seasons[0].id : '',
      release_date: format(new Date(), 'yyyy-MM-dd')
    });
    
    // Show warning if no seasons available
    if (seasons.length === 0) {
      enqueueSnackbar('Warning: No seasons available. You need to create a season first before creating a collection.', { variant: 'warning' });
    }
    
    setIsAddDialogOpen(true);
  };
  
  const handleOpenEditDialog = (collection: Collection) => {
    setOpenCollection(collection);
    setNewCollection({
      name: collection.name,
      description: collection.description,
      season_id: collection.season_id,
      release_date: collection.release_date
    });
    setIsEditDialogOpen(true);
  };
  
  const handleOpenDeleteDialog = (collection: Collection) => {
    setOpenCollection(collection);
    setIsDeleteDialogOpen(true);
  };
  
  const handleAddCollection = () => {
    if (!currentStoreId) {
      enqueueSnackbar('Store information is required', { variant: 'error' });
      return;
    }
    
    if (!newCollection.season_id) {
      enqueueSnackbar('Season is required. Please create a season first if none are available.', { variant: 'error' });
      return;
    }
    
    createCollection({ 
      storeId: currentStoreId, 
      data: newCollection 
    }, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
      }
    });
  };
  
  const handleEditCollection = () => {
    if (!openCollection || !currentStoreId) return;
    
    updateCollection({ 
      storeId: currentStoreId, 
      id: openCollection.id, 
      data: newCollection 
    }, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
      }
    });
  };
  
  const handleDeleteCollection = () => {
    if (!openCollection || !currentStoreId) return;
    
    deleteCollection({ 
      storeId: currentStoreId, 
      id: openCollection.id 
    }, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setOpenCollection(null);
      }
    });
  };

  const getSeasonName = (id: string) => {
    const season = seasons.find(s => s.id === id);
    return season ? season.name : 'Unknown Season';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCollection({ ...newCollection, [name]: value });
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setNewCollection({ ...newCollection, [name]: value });
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setNewCollection({
        ...newCollection,
        release_date: format(date, 'yyyy-MM-dd')
      });
    }
  };

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <PageHeading 
              title="Clothing Collections Management" 
              actions={
                <Button
                  startIcon={<PlusIcon />}
                  variant="contained"
                  onClick={handleOpenAddDialog}
                  disabled={isLoading}
                >
                  Add Collection
                </Button>
              }
            />
            <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
              <CardHeader title="Collections" />
              <CardContent>
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : collections.length === 0 ? (
                  <Alert severity="info">No collections found. Start by adding your first collection.</Alert>
                ) : (
                  <TableContainer component={Paper} elevation={0}>
                    <Table sx={{ minWidth: 650 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Season</TableCell>
                          <TableCell>Release Date</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {collections.map((collection) => (
                          <TableRow
                            key={collection.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell>{collection.name}</TableCell>
                            <TableCell>{collection.description || '-'}</TableCell>
                            <TableCell>{getSeasonName(collection.season_id)}</TableCell>
                            <TableCell>
                              {format(parseISO(collection.release_date), 'MMM dd, yyyy')}
                            </TableCell>
                            <TableCell align="right">
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Tooltip title="Edit">
                                  <IconButton 
                                    edge="end" 
                                    size="small"
                                    onClick={() => handleOpenEditDialog(collection)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton 
                                    edge="end" 
                                    size="small"
                                    onClick={() => handleOpenDeleteDialog(collection)}
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

      {/* Add Collection Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Collection</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="Collection Name"
              type="text"
              fullWidth
              value={newCollection.name || ''}
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
              value={newCollection.description || ''}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="season-select-label">Season</InputLabel>
              <Select
                labelId="season-select-label"
                id="season_id"
                name="season_id"
                value={newCollection.season_id || ''}
                label="Season"
                onChange={handleSelectChange}
                required
              >
                {seasons.map((season) => (
                  <MenuItem key={season.id} value={season.id}>
                    {season.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Release Date"
                value={newCollection.release_date ? parseISO(newCollection.release_date as string) : null}
                onChange={handleDateChange}
                slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
              />
            </LocalizationProvider>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)} disabled={isCreating}>Cancel</Button>
          <Button 
            onClick={handleAddCollection} 
            variant="contained"
            disabled={isCreating}
          >
            {isCreating ? 'Saving...' : 'Add Collection'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Collection Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Collection</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              id="edit-name"
              name="name"
              label="Collection Name"
              type="text"
              fullWidth
              value={newCollection.name || ''}
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
              value={newCollection.description || ''}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="edit-season-select-label">Season</InputLabel>
              <Select
                labelId="edit-season-select-label"
                id="edit-season_id"
                name="season_id"
                value={newCollection.season_id || ''}
                label="Season"
                onChange={handleSelectChange}
                required
              >
                {seasons.map((season) => (
                  <MenuItem key={season.id} value={season.id}>
                    {season.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Release Date"
                value={newCollection.release_date ? parseISO(newCollection.release_date as string) : null}
                onChange={handleDateChange}
                slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
              />
            </LocalizationProvider>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)} disabled={isUpdating}>Cancel</Button>
          <Button 
            onClick={handleEditCollection} 
            variant="contained"
            disabled={isUpdating}
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Delete Collection</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the collection "{openCollection?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>Cancel</Button>
          <Button 
            onClick={handleDeleteCollection} 
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