import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../../../app/store';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  useTheme,
  alpha,
  Button,
  Chip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { fetchUserList, deleteUser, clearError } from './slice/CustomerAdminUser.Slice';
import {
  selectUsers,
  selectUserLoading,
  selectUserError
} from './slice/CustomerAdminUser.Selector';

const CustomerAdminUserPage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const users = useSelector(selectUsers);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  useEffect(() => {
    dispatch(fetchUserList());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
      setShowSnackbar(true);
    }
  }, [error]);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    dispatch(clearError());
  };

  const handleAdd = () => {
    navigate('/dashboard/master/customeradminuser/add');
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/master/customeradminuser/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    setSelectedUserId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteUser(selectedUserId)).unwrap();
      setSnackbarMessage('User deleted successfully');
      setSnackbarSeverity('success');
      setShowSnackbar(true);
      setDeleteDialogOpen(false);
      setSelectedUserId('');
    } catch (err) {
      setSnackbarMessage(error || 'Failed to delete user');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedUserId('');
  };

  const handleView = (id: string) => {
    console.log('View User:', id);
    // TODO: Implement view functionality
  };

  const columns: GridColDef[] = [
    { 
      field: 'sno', 
      headerName: 'S.No.', 
      width: 70,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const index = users.findIndex(user => user.userID === params.row.userID);
        return index + 1;
      }
    },
    { 
      field: 'userName', 
      headerName: 'Name', 
      width: 200,
      flex: 1
    },
    { 
      field: 'userEmail', 
      headerName: 'Email', 
      width: 250,
      flex: 1
    },
    { 
      field: 'userMobile', 
      headerName: 'Mobile', 
      width: 150
    },
    { 
      field: 'userRole', 
      headerName: 'Role', 
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Chip 
          label={params.value} 
          size="small"
          color="primary"
          variant="outlined"
        />
      )
    },
    { 
      field: 'companyDomain', 
      headerName: 'Company Domain', 
      width: 180
    },
    { 
      field: 'isActive', 
      headerName: 'Status', 
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Chip 
          label={params.value ? 'Active' : 'Inactive'}
          size="small"
          color={params.value ? 'success' : 'default'}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => handleView(params.row.userID)}
            sx={{
              color: theme.palette.info.main,
              '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.1) }
            }}
          >
            <ViewIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row.userID)}
            sx={{
              color: theme.palette.primary.main,
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row.userID)}
            sx={{
              color: theme.palette.error.main,
              '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) }
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all users in the system
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
            py: 1.5,
            fontWeight: 600,
            boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
            '&:hover': {
              boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`
            }
          }}
        >
          Add User
        </Button>
      </Box>

      <Paper
        sx={{
          borderRadius: 3,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
          overflow: 'hidden'
        }}
      >
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row.userID}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderColor: theme.palette.grey[200]
            },
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: theme.palette.grey[50],
              fontWeight: 600
            }
          }}
        />
      </Paper>

      {/* Error Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleDeleteCancel}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{ textTransform: 'none' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerAdminUserPage;
