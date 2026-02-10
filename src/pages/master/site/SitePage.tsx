import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../../app/store";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  useTheme,
  alpha,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { fetchSiteList, deleteSite, clearError } from "./slice/Site.Slice";
import {
  selectSites,
  selectSiteLoading,
  selectSiteError,
} from "./slice/Site.Selector";

const SitePage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const sites = useSelector(selectSites);
  const loading = useSelector(selectSiteLoading);
  const error = useSelector(selectSiteError);

  // useEffect(() => {
  //   console.log("Sites from Redux:", sites);
  //   console.log("Loading:", loading);
  //   console.log("Error:", error);
  // }, [sites, loading, error]);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");

  useEffect(() => {
    dispatch(fetchSiteList());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity("error");
      setShowSnackbar(true);
    }
  }, [error]);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    dispatch(clearError());
  };

  const handleAdd = () => {
    navigate("/dashboard/master/site/add");
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/master/site/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    setSelectedSiteId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedSiteId) {
      try {
        await dispatch(deleteSite(selectedSiteId)).unwrap();
        // Close dialog and show success message
        setDeleteDialogOpen(false);
        setSelectedSiteId("");
        setSnackbarMessage("Site deleted successfully");
        setSnackbarSeverity("success");
        setShowSnackbar(true);
      } catch (error: any) {
        // Show error message if delete fails
        setSnackbarMessage(error || "Failed to delete site");
        setSnackbarSeverity("error");
        setShowSnackbar(true);
        // Close dialog anyway
        setDeleteDialogOpen(false);
        setSelectedSiteId("");
      }
    }
  };

  const columns: GridColDef[] = [
    {
      field: "sno",
      headerName: "S.No.",
      width: 70,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const index = sites.findIndex(
          (user) => user.siteId === params.row.siteId,
        );
        return index + 1;
      },
    },
    {
      field: "siteName",
      headerName: "Site Name",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "siteLocation",
      headerName: "Address",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "state",
      headerName: "State",
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: "country",
      headerName: "Country",
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "start",
            height: "100%", // 🔑 IMPORTANT
            width: "100%",
            gap: 1,
          }}
        >
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEdit(params.row.siteId)}
            title="Edit"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.siteId)}
            title="Delete"
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
            Site Master
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage company sites and locations
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Add Site
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ height: 500, width: "100%" }}>
          {error && (
            <Box sx={{ p: 2 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
          {sites && sites.length > 0 ? (
            <DataGrid
              rows={sites}
              columns={columns}
              getRowId={(row) => row.siteId}
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              loading={loading}
              sx={{
                border: "none",
                "& .MuiDataGrid-cell": {
                  borderBottom: `1px solid ${theme.palette.divider}`,
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  borderBottom: `2px solid ${theme.palette.primary.main}`,
                  fontWeight: 600,
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                },
              }}
            />
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography color="text.secondary">
                {loading ? "Loading sites..." : "No sites found"}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Site</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this site? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SitePage;
