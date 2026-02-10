import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../app/store";
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import {
  fetchDepartmentMasterList,
  deleteDepartmentMaster,
  clearError,
  clearSuccess,
} from "./slice/Department.Slice";
import {
  selectDepartmentMasterLoading,
  selectDepartmentMasterError,
  selectDepartmentMasters,
  selectDepartmentMasterDeleteLoading,
  selectDepartmentMasterDeleteSuccess,
  selectDepartmentMasterDeleteError,
} from "./slice/Department.Selector";

const DepartmentMasterPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector(selectDepartmentMasterLoading);
  const error = useSelector(selectDepartmentMasterError);
  const departmentMasters = useSelector(selectDepartmentMasters);
  const deleteLoading = useSelector(selectDepartmentMasterDeleteLoading);
  const deleteSuccess = useSelector(selectDepartmentMasterDeleteSuccess);
  const deleteError = useSelector(selectDepartmentMasterDeleteError);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDepartmentMaster, setSelectedDepartmentMaster] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchDepartmentMasterList());
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
      setSelectedDepartmentMaster(null);
      // Refresh the list
      dispatch(fetchDepartmentMasterList());
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
    navigate("/dashboard/master/department/add");
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/master/department/edit/${id}`);
  };

  const handleDelete = (id: string, name: string) => {
    setSelectedDepartmentMaster({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedDepartmentMaster) {
      await dispatch(deleteDepartmentMaster(selectedDepartmentMaster.id));
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedDepartmentMaster(null);
  };

  const columns: GridColDef[] = [
    {
      field: "serialNumber",
      headerName: "Sr. No.",
      flex: 0.5,
      minWidth: 80,
      renderCell: (params: GridRenderCellParams) => {
        const index = departmentMasters.findIndex(
          (row) => row.deptId === params.row.deptId,
        );
        return index + 1;
      },
    },
    {
      field: "departmentName",
      headerName: "Department Name",
      flex: 2,
      minWidth: 250,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 150,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%", // 🔑 IMPORTANT
            width: "100%",
            gap: 1,
          }}
        >
          <Button
            size="small"
            onClick={() => handleEdit(params.row.deptId)}
            sx={{
              minWidth: "auto",
              p: 0.5,
              color: theme.palette.primary.main,
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <EditIcon fontSize="small" />
          </Button>
          <Button
            size="small"
            onClick={() =>
              handleDelete(params.row.deptId, params.row.departmentName)
            }
            sx={{
              minWidth: "auto",
              p: 0.5,
              color: theme.palette.error.main,
              "&:hover": {
                bgcolor: alpha(theme.palette.error.main, 0.1),
              },
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Department Master
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
            "&:hover": {
              boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
            },
          }}
        >
          Add Department Master
        </Button>
      </Box>

      {/* Data Grid */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
        }}
      >
        <DataGrid
          rows={departmentMasters || []}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.deptId}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            border: "none",
            "& .MuiDataGrid-cell": {
              borderColor: theme.palette.divider,
            },
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderColor: theme.palette.divider,
            },
            "& .MuiDataGrid-footerContainer": {
              borderColor: theme.palette.divider,
            },
          }}
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningIcon color="warning" />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete department master{" "}
            <strong>"{selectedDepartmentMaster?.name}"</strong>? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCancelDelete}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={deleteLoading}
            sx={{ textTransform: "none" }}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={deleteSuccess ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {deleteSuccess
            ? "Department Master deleted successfully!"
            : deleteError || error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DepartmentMasterPage;
