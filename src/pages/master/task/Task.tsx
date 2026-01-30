import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../app/store";
import {
  Box,
  Typography,
  useTheme,
  alpha,
  Chip,
  Snackbar,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
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
import TaskMovementDialog from "../../../components/common/TaskMovementDialog";
import CommonDataTable from "../../../components/common/CommonDataTable";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

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
      width: 70,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const index = tasks.findIndex(
          (task) => task.tblId === params.row.tblId,
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
      minWidth: 400,
    },
    {
      field: "actName",
      headerName: "Act Name",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "departmentName",
      headerName: "Department",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: alpha(theme.palette.success.main, 0.1),
            color: theme.palette.success.main,
          }}
        />
      ),
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
      field: "taskCurrentStatus",
      headerName: "Status",
      width: 120,
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
      width: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const task = params.row;
        return (
          <Tooltip title="View Task" arrow>
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
            ></Button>
          </Tooltip>
        );
      },
    },
  ];
  const filteredTasks = (tasks || []).filter((task) => {
    if (!task.dueDate) return false;

    const due = new Date(task.dueDate);
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

      <CommonDataTable
        rows={filteredTasks}
        columns={columns}
        getRowId={(row) => row.tblId}
        loading={loading}
        noRowsMessage="No assigned tasks found for the selected criteria"
      />

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
      <TaskMovementDialog
        open={taskMovementDialogOpen}
        onClose={handleCloseTaskMovementDialog}
        task={selectedTask}
      />
    </Box>
  );
};

export default Task;
