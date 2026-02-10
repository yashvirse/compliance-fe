import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../app/store";
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  useTheme,
  alpha,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  // Visibility as ViewIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  fetchCompanyList,
  deleteCompany,
  clearSuccess,
} from "./slice/Company.Slice";
import {
  selectCompanies,
  selectCompanyFetchLoading,
  selectCompanyFetchError,
  selectCompanyDeleteLoading,
  selectCompanyDeleteSuccess,
  selectCompanyDeleteError,
} from "./slice/Company.Selector";

const CompanyPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Redux selectors
  const companies = useSelector(selectCompanies);
  const loading = useSelector(selectCompanyFetchLoading);
  const error = useSelector(selectCompanyFetchError);
  const deleteLoading = useSelector(selectCompanyDeleteLoading);
  const deleteSuccess = useSelector(selectCompanyDeleteSuccess);
  const deleteError = useSelector(selectCompanyDeleteError);

  // Local state for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  // Fetch companies on mount
  useEffect(() => {
    dispatch(fetchCompanyList());
  }, [dispatch]);

  // Handle delete success/error
  useEffect(() => {
    if (deleteSuccess) {
      setShowSnackbar(true);
      setDeleteDialogOpen(false);
      setCompanyToDelete(null);
      setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
    }
  }, [deleteSuccess, dispatch]);

  useEffect(() => {
    if (deleteError) {
      setShowSnackbar(true);
    }
  }, [deleteError]);

  const handleAdd = () => {
    navigate("/dashboard/master/company/add");
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/master/company/edit/${id}`);
  };

  const handleDeleteClick = (id: string, name: string) => {
    setCompanyToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (companyToDelete) {
      await dispatch(deleteCompany(companyToDelete.id));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCompanyToDelete(null);
  };

  // const handleView = (id: string) => {
  //   console.log("View Company:", id);
  // };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  const columns: GridColDef[] = [
    {
      field: "serialNumber",
      headerName: "Sr. No.",
      flex: 0.5,
      minWidth: 40,
      renderCell: (params: GridRenderCellParams) => {
        const index = companies.findIndex((row) => row.cid === params.row.cid);
        return index + 1;
      },
    },
    {
      field: "companyName",
      headerName: "Company Name",
      width: 300,
      flex: 1,
    },
    {
      field: "companyType",
      headerName: "Company Type",
      width: 150,
      valueFormatter: (value) => {
        // Format the company type to be more readable
        const typeMap: Record<string, string> = {
          private_limited: "Private Limited",
          public_limited: "Public Limited",
          partnership: "Partnership",
          sole_proprietorship: "Sole Proprietorship",
          llp: "LLP",
        };
        return typeMap[value] || value;
      },
    },
    {
      field: "companyCurrency",
      headerName: "Currency",
      width: 80,
    },
    {
      field: "paN_No",
      headerName: "PAN No",
      width: 100,
    },
    {
      field: "plan_type",
      headerName: "Plan Type",
      width: 130,
      valueFormatter: (value) => {
        const planMap: Record<string, string> = {
          basic: "Basic",
          professional: "Professional",
          enterprise: "Enterprise",
          custom: "Custom",
        };
        return planMap[value] || value;
      },
    },
    {
      field: "companyIsActive",
      headerName: "Status",
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          color={params.value ? "success" : "default"}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            height: "100%", // 🔑 IMPORTANT
            width: "100%",
            gap: 1,
          }}
        >
          {/* <IconButton
            size="small"
            onClick={() => handleView(params.row.cid)}
            sx={{
              color: theme.palette.info.main,
              "&:hover": { bgcolor: alpha(theme.palette.info.main, 0.1) },
            }}
          >
            <ViewIcon fontSize="small" />
          </IconButton> */}
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row.cid)}
            sx={{
              color: theme.palette.primary.main,
              "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.1) },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() =>
              handleDeleteClick(params.row.cid, params.row.companyName)
            }
            sx={{
              color: theme.palette.error.main,
              "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.1) },
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
            Company Management
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
            py: 1.5,
            fontWeight: 600,
            boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
            "&:hover": {
              boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
            },
          }}
        >
          Add Company
        </Button>
      </Box>

      <Paper
        sx={{
          borderRadius: 3,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
          overflow: "hidden",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 10,
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="error" gutterBottom>
              Error Loading Companies
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {error}
            </Typography>
            <Button
              variant="contained"
              onClick={() => dispatch(fetchCompanyList())}
              sx={{ mt: 2 }}
            >
              Retry
            </Button>
          </Box>
        ) : (
          <DataGrid
            rows={companies}
            columns={columns}
            getRowId={(row) => row.cid}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection
            disableRowSelectionOnClick
            sx={{
              border: "none",
              "& .MuiDataGrid-cell": {
                borderColor: theme.palette.grey[200],
              },
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: theme.palette.grey[50],
                fontWeight: 600,
              },
            }}
          />
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle
          id="delete-dialog-title"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: theme.palette.error.main,
          }}
        >
          <WarningIcon />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the company{" "}
            <strong>"{companyToDelete?.name}"</strong>?
            <br />
            <br />
            This action cannot be undone and will permanently remove all company
            data.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={deleteLoading}
            sx={{ borderRadius: 2 }}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={deleteError ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {deleteError || "Company deleted successfully!"}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CompanyPage;
