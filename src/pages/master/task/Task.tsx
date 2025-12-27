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
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  selectTaskError,
  selectTaskList,
  selectTaskLoading,
} from "./Task.selector";
import { fetchAssignedTasks } from "./Task.slice";
import { Visibility as EyeIcon } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const Task: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [taskMovementDialogOpen, setTaskMovementDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const tasks = useSelector(selectTaskList);
  const loading = useSelector(selectTaskLoading);
  const error = useSelector(selectTaskError);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");

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
  // Task movement Deatils
  const handleViewTaskMovement = (task: any) => {
    setSelectedTask(task);
    setTaskMovementDialogOpen(true);
  };

  const handleCloseTaskMovementDialog = () => {
    setTaskMovementDialogOpen(false);
    setSelectedTask(null);
  };
  const columns: GridColDef[] = [
    {
      field: "sno",
      headerName: "S.No.",
      width: 80,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const index = tasks.findIndex(
          (task) => task.tblId === params.row.tblId
        );
        return index + 1;
      },
    },
    {
      field: "siteName",
      headerName: "Site Name",
      width: 160,
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
      minWidth: 100,
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
      minWidth: 100,
      renderCell: (params: GridRenderCellParams) => {
        if (!params.value) return "-";
        const date = new Date(params.value as string);
        return date.toLocaleDateString("en-GB");
      },
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
              : params.value === "Rejected"
              ? "error"
              : "warning"
          }
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const task = params.row;
        return (
          <Button
            size="small"
            variant="text"
            startIcon={<EyeIcon />}
            onClick={() => handleViewTaskMovement(task)}
            sx={{
              color: theme.palette.primary.main,
              textTransform: "none",
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            View
          </Button>
        );
      },
    },
  ];
  const filteredTasks = (tasks || []).filter((task) => {
    if (!task.reminderDate) return false;

    const due = new Date(task.reminderDate);
    const monthMatch =
      due.getMonth() === currentMonth.getMonth() &&
      due.getFullYear() === currentMonth.getFullYear();

    const statusMatch =
      statusFilter === "All" || task.taskCurrentStatus === statusFilter;

    return monthMatch && statusMatch;
  });

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Task List
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Assigned tasks overview
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={["year", "month"]}
              label="Select Month"
              value={dayjs(currentMonth)}
              onChange={(newValue) => {
                if (newValue) {
                  setCurrentMonth(newValue.toDate());
                }
              }}
              slotProps={{
                textField: {
                  size: "small",
                },
              }}
            />
          </LocalizationProvider>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Paper
        sx={{
          borderRadius: 3,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={filteredTasks}
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
      <Dialog
        open={taskMovementDialogOpen}
        onClose={handleCloseTaskMovementDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: "1.3rem", pb: 1 }}>
          Task Movement Details
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          {selectedTask && (
            <Box>
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 2,
                }}
              >
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Activity Information
                </Typography>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Activity Name
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedTask.activityName}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Act Name
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedTask.actName}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Department
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedTask.departmentName}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Due Date
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedTask.dueDate
                        ? new Date(selectedTask.dueDate).toLocaleDateString()
                        : "-"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Site Name
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedTask.siteName || "-"}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Typography
                variant="subtitle2"
                fontWeight={600}
                gutterBottom
                sx={{ mt: 3, mb: 2 }}
              >
                Task Movement History
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {selectedTask.details && selectedTask.details.length > 0 ? (
                  selectedTask.details.map((detail: any, index: number) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        bgcolor: alpha(
                          detail.status === "Approved"
                            ? theme.palette.success.main
                            : detail.status === "Rejected"
                            ? theme.palette.error.main
                            : theme.palette.warning.main,
                          0.05
                        ),
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "start",
                          mb: 1,
                        }}
                      >
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {detail.userName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {index === 0
                              ? "Maker"
                              : index === 1
                              ? "Checker"
                              : "Reviewer"}
                          </Typography>
                        </Box>
                        <Chip
                          label={detail.status}
                          size="small"
                          color={
                            detail.status === "Approved"
                              ? "success"
                              : detail.status === "Rejected"
                              ? "error"
                              : "warning"
                          }
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(150px, 1fr))",
                          gap: 2,
                          my: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{ mb: 0.5 }}
                          >
                            In Date
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {detail.inDate &&
                            detail.inDate !== "0001-01-01T00:00:00Z"
                              ? new Date(detail.inDate).toLocaleDateString()
                              : "-"}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{ mb: 0.5 }}
                          >
                            Out Date
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {detail.outDate &&
                            detail.outDate !== "0001-01-01T00:00:00Z"
                              ? new Date(detail.outDate).toLocaleDateString()
                              : "-"}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{ mb: 0.5 }}
                          >
                            P.TAT (Days)
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {detail.pTat || 0}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{ mb: 0.5 }}
                          >
                            A.TAT (Days)
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {detail.aTat || 0}
                          </Typography>
                        </Box>
                      </Box>

                      {detail.remarks && (
                        <Box
                          sx={{
                            mt: 2,
                            pt: 2,
                            borderTop: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{ mb: 0.5 }}
                          >
                            Remarks
                          </Typography>
                          <Typography variant="body2">
                            {detail.remarks}
                          </Typography>
                        </Box>
                      )}

                      {detail.rejectionRemark && (
                        <Box
                          sx={{
                            mt: 2,
                            pt: 2,
                            borderTop: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="error"
                            display="block"
                            sx={{ mb: 0.5, fontWeight: 600 }}
                          >
                            Rejection Remark
                          </Typography>
                          <Typography variant="body2" color="error">
                            {detail.rejectionRemark}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 4 }}
                  >
                    No movement details available
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseTaskMovementDialog} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Task;
