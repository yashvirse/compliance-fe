import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../../app/store';
import {
  Box,
  Button,
  Typography,
  Paper,
  useTheme,
  alpha,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { fetchActMasterList, deleteActMaster, clearError, clearSuccess } from './slice/Act.Slice';
import {
  selectActMasterLoading,
  selectActMasterError,
  selectActMasters,
  selectActMasterDeleteLoading,
  selectActMasterDeleteSuccess,
  selectActMasterDeleteError
} from './slice/Act.Selector';

const ActMasterPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector(selectActMasterLoading);
  const error = useSelector(selectActMasterError);
  const actMasters = useSelector(selectActMasters);
  const deleteLoading = useSelector(selectActMasterDeleteLoading);
  const deleteSuccess = useSelector(selectActMasterDeleteSuccess);
  const deleteError = useSelector(selectActMasterDeleteError);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedActMaster, setSelectedActMaster] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    dispatch(fetchActMasterList());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setShowSnackbar(true);
    }
  }, [error]);

  useEffect(() => {
    if (deleteSuccess) {
      setShowSnackbar(true);
      setDeleteDialogOpen(false);
      setSelectedActMaster(null);
      // Refresh the list
      dispatch(fetchActMasterList());
    }
  }, [deleteSuccess, dispatch]);

  useEffect(() => {
    if (deleteError) {
      setShowSnackbar(true);
    }
  }, [deleteError]);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    dispatch(clearError());
    dispatch(clearSuccess());
  };

  const handleAdd = () => {
    navigate('/dashboard/master/act/add');
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/master/act/edit/${id}`);
  };

  const handleDelete = (id: string, name: string) => {
    setSelectedActMaster({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedActMaster) {
      await dispatch(deleteActMaster(selectedActMaster.id));
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedActMaster(null);
  };

  const columns: GridColDef[] = [
    {
      field: 'actCode',
      headerName: 'Act Code',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'actName',
      headerName: 'Act Name',
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: 'actCategoryId',
      headerName: 'Category ID',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      minWidth: 250,
    },
    {
      field: 'companyDomain',
      headerName: 'Company Domain',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'createdDate',
      headerName: 'Created Date',
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => {
        const date = new Date(params.value as string);
        return date.toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 150,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Button
            size="small"
            onClick={() => handleEdit(params.row.id)}
            sx={{
              minWidth: 'auto',
              p: 0.5,
              color: theme.palette.primary.main,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              }
            }}
          >
            <EditIcon fontSize="small" />
          </Button>
          <Button
            size="small"
            onClick={() => handleDelete(params.row.id, params.row.actName)}
            sx={{
              minWidth: 'auto',
              p: 0.5,
              color: theme.palette.error.main,
              '&:hover': {
                bgcolor: alpha(theme.palette.error.main, 0.1),
              }
            }}
          >
            <DeleteIcon fontSize="small" />
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3 
      }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Act Master
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage act master data
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
            '&:hover': {
              boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`
            }
          }}
        >
          Add Act Master
        </Button>
      </Box>

      {/* Data Grid */}
      <Paper
        sx={{
          borderRadius: 3,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
          overflow: 'hidden'
        }}
      >
        <DataGrid
          rows={actMasters || []}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderBottom: `1px solid ${theme.palette.divider}`,
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              borderBottom: `2px solid ${theme.palette.primary.main}`,
              fontWeight: 600,
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            },
          }}
        />
      </Paper>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={deleteSuccess ? "success" : "error"}
          sx={{ width: '100%' }}
        >
          {deleteSuccess ? 'Act Master deleted successfully!' : (deleteError || error)}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the act master <strong>"{selectedActMaster?.name}"</strong>?
            <br />
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCancelDelete}
            variant="outlined"
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={deleteLoading}
            autoFocus
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActMasterPage;
