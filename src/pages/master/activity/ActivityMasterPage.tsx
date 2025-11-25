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
  DialogActions,
  Chip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { fetchActivityMasterList, deleteActivityMaster, clearError, clearSuccess } from './slice/Activity.Slice';
import {
  selectActivityMasterLoading,
  selectActivityMasterError,
  selectActivityMasters,
  selectActivityMasterDeleteLoading,
  selectActivityMasterDeleteSuccess,
  selectActivityMasterDeleteError
} from './slice/Activity.Selector';

const ActivityMasterPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector(selectActivityMasterLoading);
  const error = useSelector(selectActivityMasterError);
  const activityMasters = useSelector(selectActivityMasters);
  const deleteLoading = useSelector(selectActivityMasterDeleteLoading);
  const deleteSuccess = useSelector(selectActivityMasterDeleteSuccess);
  const deleteError = useSelector(selectActivityMasterDeleteError);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    dispatch(fetchActivityMasterList());
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
      setSelectedActivity(null);
      dispatch(fetchActivityMasterList());
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
    navigate('/dashboard/master/activity/add');
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/master/activity/edit/${id}`);
  };

  const handleDelete = (id: string, name: string) => {
    setSelectedActivity({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedActivity) {
      await dispatch(deleteActivityMaster(selectedActivity.id));
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedActivity(null);
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'Weekly': return 'primary';
      case 'Fortnightly': return 'secondary';
      case 'Monthly': return 'success';
      case 'Half Yearly': return 'warning';
      case 'Annually': return 'error';
      case 'As Needed': return 'default';
      default: return 'default';
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'activityName',
      headerName: 'Activity Name',
      flex: 2,
      minWidth: 250,
    },
    {
      field: 'actName',
      headerName: 'Act Name',
      flex: 1.5,
      minWidth: 180,
    },
    {
      field: 'frequency',
      headerName: 'Frequency',
      flex: 1,
      minWidth: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Chip 
          label={params.value} 
          color={getFrequencyColor(params.value as string) as any}
          size="small"
        />
      ),
    },
    {
      field: 'dueDay',
      headerName: 'Due Day',
      flex: 0.7,
      minWidth: 100,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'gracePeriodDays',
      headerName: 'Grace Days',
      flex: 0.8,
      minWidth: 110,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'reminderDays',
      headerName: 'Reminder Days',
      flex: 1,
      minWidth: 130,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      minWidth: 200,
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
            onClick={() => handleDelete(params.row.id, params.row.activityName)}
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Activity Master
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage compliance activities and their schedules
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
          Add Activity
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`
        }}
      >
        <DataGrid
          rows={activityMasters || []}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 }
            }
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderColor: theme.palette.divider,
            },
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderColor: theme.palette.divider,
            },
            '& .MuiDataGrid-footerContainer': {
              borderColor: theme.palette.divider,
            }
          }}
        />
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete activity <strong>"{selectedActivity?.name}"</strong>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCancelDelete}
            variant="outlined"
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={deleteLoading}
            sx={{ textTransform: 'none' }}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

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
          {deleteSuccess ? 'Activity deleted successfully!' : (deleteError || error)}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ActivityMasterPage;
