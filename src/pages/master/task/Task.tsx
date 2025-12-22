import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../app/store";
import {
  Box,
  Typography,
  Paper,
  useTheme,
  alpha,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  selectTaskError,
  selectTaskList,
  selectTaskLoading,
} from "./Task.selector";
import { fetchAssignedTasks } from "./Task.slice";

const Task: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const tasks = useSelector(selectTaskList);
  const loading = useSelector(selectTaskLoading);
  const error = useSelector(selectTaskError);

  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    dispatch(fetchAssignedTasks());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setShowSnackbar(true);
    }
  }, [error]);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const columns: GridColDef[] = [
    {
      field: "sno",
      headerName: "S.No.",
      width: 70,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const index = tasks.findIndex(
          (task) => task.tblId === params.row.tblId
        );
        return index + 1;
      },
    },
    {
      field: "activityName",
      headerName: "Activity Name",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "actName",
      headerName: "Act Name",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) return "-";
        const date = new Date(params.value as string);
        return date.toLocaleDateString("en-GB");
      },
    },
    {
      field: "gracePeriodDate",
      headerName: "Grace Period Date",
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) return "-";
        const date = new Date(params.value as string);
        return date.toLocaleDateString("en-GB");
      },
    },
    {
      field: "reminderDate",
      headerName: "Reminder Date",
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) return "-";
        const date = new Date(params.value as string);
        return date.toLocaleDateString("en-GB");
      },
    },
    {
      field: "siteName",
      headerName: "Site Name",
      width: 160,
    },
    {
      field: "taskCurrentStatus",
      headerName: "Status",
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          size="small"
          color={
            params.value === "Completed"
              ? "success"
              : params.value === "Pending"
              ? "warning"
              : params.value === "Rejected"
              ? "error"
              : "default"
          }
        />
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Task List
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Assigned tasks overview
        </Typography>
      </Box>

      <Paper
        sx={{
          borderRadius: 3,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={tasks || []}
          columns={columns}
          getRowId={(row) => row.tblId}
          loading={loading}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
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
      </Paper>

      {/* Error Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Task;
