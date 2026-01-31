import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../app/store";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  useTheme,
  alpha,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import {
  CheckCircle,
  Assignment,
  Cancel,
  ThumbUp as ApproveIcon,
  ThumbDown as RejectIcon,
  Visibility as EyeIcon,
} from "@mui/icons-material";
import {
  fetchTaskCount,
  fetchPendingTasks,
  fetchApprovedTasks,
  fetchRejectedTasks,
  approveTask,
  rejectTask,
  clearTaskActionError,
  clearError,
} from "./makerslice/MakerDashboard.Slice";
import {
  selectTaskCounts,
  selectTaskActionsLoading,
  selectTaskActionsError,
  selectPendingTasks,
  selectPendingTasksLoading,
  selectPendingTasksError,
  selectApprovedTasks,
  selectApprovedTasksLoading,
  selectApprovedTasksError,
  selectRejectedTasks,
  selectRejectedTasksLoading,
  selectRejectedTasksError,
} from "./makerslice/MakerDashboard.Selector";
import { selectUser } from "../login/slice/Login.selector";
import TaskMovementDialog from "../../components/common/TaskMovementDialog";
import CommonDataTable from "../../components/common/CommonDataTable";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const MakerDashboard: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const counts = useSelector(selectTaskCounts);
  const taskActionsLoading = useSelector(selectTaskActionsLoading);
  const taskActionsError = useSelector(selectTaskActionsError);
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [allTasksLoading, setAllTasksLoading] = useState(false);
  const [allTasksError, setAllTasksError] = useState<string | null>(null);
  const pendingTasks = useSelector(selectPendingTasks);
  const pendingTasksLoading = useSelector(selectPendingTasksLoading);
  const pendingTasksError = useSelector(selectPendingTasksError);
  const approvedTasks = useSelector(selectApprovedTasks);
  const approvedTasksLoading = useSelector(selectApprovedTasksLoading);
  const approvedTasksError = useSelector(selectApprovedTasksError);
  const rejectedTasks = useSelector(selectRejectedTasks);
  const rejectedTasksLoading = useSelector(selectRejectedTasksLoading);
  const rejectedTasksError = useSelector(selectRejectedTasksError);

  // Column definitions for CommonDataTable
  const allTasksColumns: GridColDef[] = React.useMemo(
    () => [
      {
        field: "sno",
        headerName: "S.No.",
        width: 70,
        sortable: false,
        renderCell: (params) => {
          const page = params.api.state.pagination.paginationModel.page;
          const pageSize = params.api.state.pagination.paginationModel.pageSize;
          const rowIndex = params.api.getRowIndexRelativeToVisibleRows(
            params.id,
          );

          return page * pageSize + rowIndex + 1;
        },
      },
      { field: "siteName", headerName: "Site Name", flex: 1, minWidth: 160 },
      {
        field: "activityName",
        headerName: "Activity Name",
        flex: 1.2,
        minWidth: 400,
      },
      { field: "actName", headerName: "Act Name", flex: 1, minWidth: 180 },
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
              bgcolor: alpha(theme.palette.info.main, 0.1),
              color: theme.palette.info.main,
            }}
          />
        ),
      },
      {
        field: "dueDate",
        headerName: "Due Date",
        flex: 1,
        minWidth: 100,
        renderCell: (params) =>
          params.value ? new Date(params.value).toLocaleDateString() : "-",
      },
      {
        field: "status",
        headerName: "Status",
        flex: 0.8,
        minWidth: 120,
        renderCell: (params) => (
          <Chip
            label={params.value}
            size="small"
            color={
              params.value === "Approved"
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
        flex: 1.4,
        minWidth: 120,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => {
          const status = params.row.taskCurrentStatus;
          const isPending = status === "Pending";

          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "left",
                height: "100%",
                gap: 0.5,
              }}
            >
              {isPending && (
                <>
                  <Tooltip title="Approve Task" arrow>
                    <IconButton
                      size="small"
                      onClick={() => handleApproveClick(params.row.tblId)}
                      sx={{
                        color: theme.palette.success.main,
                        "&:hover": {
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                        },
                      }}
                    >
                      <ApproveIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Reject Task" arrow>
                    <IconButton
                      size="small"
                      onClick={() => handleRejectClick(params.row.tblId)}
                      sx={{
                        color: theme.palette.error.main,
                        "&:hover": {
                          bgcolor: alpha(theme.palette.error.main, 0.1),
                        },
                      }}
                    >
                      <RejectIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              )}
              <Tooltip title="View Task" arrow>
                <IconButton
                  size="small"
                  onClick={() => handleViewTaskMovement(params.row)}
                  sx={{
                    color: theme.palette.primary.main,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <EyeIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        },
      },
    ],
    [theme],
  );

  const pendingTasksColumns: GridColDef[] = React.useMemo(
    () => [
      {
        field: "sno",
        headerName: "S.No.",
        width: 70,
        sortable: false,
        renderCell: (params) => {
          const page = params.api.state.pagination.paginationModel.page;
          const pageSize = params.api.state.pagination.paginationModel.pageSize;
          const rowIndex = params.api.getRowIndexRelativeToVisibleRows(
            params.id,
          );

          return page * pageSize + rowIndex + 1;
        },
      },
      { field: "siteName", headerName: "Site Name", flex: 1, minWidth: 160 },
      {
        field: "activityName",
        headerName: "Activity Name",
        flex: 1.2,
        minWidth: 400,
      },
      { field: "actName", headerName: "Act Name", flex: 1, minWidth: 180 },
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
              bgcolor: alpha(theme.palette.info.main, 0.1),
              color: theme.palette.info.main,
            }}
          />
        ),
      },
      {
        field: "dueDate",
        headerName: "Due Date",
        flex: 1,
        minWidth: 100,
        renderCell: (params) =>
          params.value ? new Date(params.value).toLocaleDateString() : "-",
      },
      {
        field: "status",
        headerName: "Status",
        flex: 0.8,
        minWidth: 120,
        renderCell: () => (
          <Chip
            label="Pending"
            size="small"
            color="warning"
            sx={{ fontWeight: 600 }}
          />
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1.2,
        minWidth: 120,
        sortable: false,
        renderCell: (params) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "left",
              height: "100%",
              gap: 0.5,
            }}
          >
            {/* Approve */}
            <Tooltip title="Approve Task" arrow>
              <IconButton
                size="small"
                onClick={() => handleApproveClick(params.row.tblId)}
                sx={{
                  color: theme.palette.success.main,
                  "&:hover": {
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                  },
                }}
              >
                <ApproveIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Reject */}
            <Tooltip title="Reject Task" arrow>
              <IconButton
                size="small"
                onClick={() => handleRejectClick(params.row.tblId)}
                sx={{
                  color: theme.palette.error.main,
                  "&:hover": {
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                  },
                }}
              >
                <RejectIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="View Task" arrow>
              <IconButton
                size="small"
                onClick={() => handleViewTaskMovement(params.row)}
                sx={{
                  color: theme.palette.primary.main,
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <EyeIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [theme],
  );

  const approvedTasksColumns: GridColDef[] = React.useMemo(
    () => [
      {
        field: "sno",
        headerName: "S.No.",
        width: 70,
        sortable: false,
        renderCell: (params) => {
          const page = params.api.state.pagination.paginationModel.page;
          const pageSize = params.api.state.pagination.paginationModel.pageSize;
          const rowIndex = params.api.getRowIndexRelativeToVisibleRows(
            params.id,
          );

          return page * pageSize + rowIndex + 1;
        },
      },
      { field: "siteName", headerName: "Site Name", flex: 1, minWidth: 160 },
      {
        field: "activityName",
        headerName: "Activity Name",
        flex: 1.2,
        minWidth: 400,
      },
      { field: "actName", headerName: "Act Name", flex: 1, minWidth: 180 },
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
        renderCell: (params) =>
          params.value ? new Date(params.value).toLocaleDateString() : "-",
      },
      {
        field: "status",
        headerName: "Status",
        flex: 0.8,
        minWidth: 120,
        renderCell: () => (
          <Chip
            label="Approved"
            size="small"
            color="success"
            sx={{ fontWeight: 600 }}
          />
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 0.8,
        minWidth: 120,
        sortable: false,
        renderCell: (params) => (
          <Tooltip title="View Task" arrow>
            <Button
              size="small"
              variant="text"
              startIcon={<EyeIcon />}
              onClick={() => handleViewTaskMovement(params.row)}
              sx={{
                color: theme.palette.primary.main,
                textTransform: "none",
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            ></Button>
          </Tooltip>
        ),
      },
    ],
    [theme],
  );

  const rejectedTasksColumns: GridColDef[] = React.useMemo(
    () => [
      {
        field: "sno",
        headerName: "S.No.",
        width: 70,
        sortable: false,
        renderCell: (params) => {
          const page = params.api.state.pagination.paginationModel.page;
          const pageSize = params.api.state.pagination.paginationModel.pageSize;
          const rowIndex = params.api.getRowIndexRelativeToVisibleRows(
            params.id,
          );

          return page * pageSize + rowIndex + 1;
        },
      },
      { field: "siteName", headerName: "Site Name", flex: 1, minWidth: 160 },
      {
        field: "activityName",
        headerName: "Activity Name",
        flex: 1.2,
        minWidth: 400,
      },
      { field: "actName", headerName: "Act Name", flex: 1, minWidth: 180 },
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
              bgcolor: alpha(theme.palette.error.main, 0.1),
              color: theme.palette.error.main,
            }}
          />
        ),
      },
      {
        field: "dueDate",
        headerName: "Due Date",
        flex: 1,
        minWidth: 100,
        renderCell: (params) =>
          params.value ? new Date(params.value).toLocaleDateString() : "-",
      },
      {
        field: "status",
        headerName: "Status",
        flex: 0.8,
        minWidth: 120,
        renderCell: () => (
          <Chip
            label="Rejected"
            size="small"
            color="error"
            sx={{ fontWeight: 600 }}
          />
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 0.8,
        minWidth: 120,
        sortable: false,
        renderCell: (params) => (
          <Tooltip title="View Task" arrow>
            <Button
              size="small"
              variant="text"
              startIcon={<EyeIcon />}
              onClick={() => handleViewTaskMovement(params.row)}
              sx={{
                color: theme.palette.primary.main,
                textTransform: "none",
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            ></Button>
          </Tooltip>
        ),
      },
    ],
    [theme],
  );

  const [tasksOpen, setTasksOpen] = useState(false);
  const [pendingTasksOpen, setPendingTasksOpen] = useState(false);
  const [approvedTasksOpen, setApprovedTasksOpen] = useState(false);
  const [rejectedTasksOpen, setRejectedTasksOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [taskMovementDialogOpen, setTaskMovementDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [remark, setRemark] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // const handleTotalTasksClick = async () => {
  //   if (user?.id) {
  //     setTasksOpen(true);
  //   }
  // };
  // Total Tasks क्लिक हैंडलर को अपडेट करें
  const handleTotalTasksClick = async () => {
    if (!user?.id) return;

    setAllTasksLoading(true);
    setAllTasksError(null);
    setTasksOpen(true); // डायलॉग ओपन

    try {
      // तीनों API parallel में call करें
      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        dispatch(fetchPendingTasks(user.id)).unwrap(),
        dispatch(fetchApprovedTasks(user.id)).unwrap(),
        dispatch(fetchRejectedTasks(user.id)).unwrap(),
      ]);

      // सभी टास्क्स को combine करें और status ऐड करें ताकि टेबल में दिखे
      const combined = [
        ...pendingRes.map((t: any) => ({ ...t, status: "Pending" })),
        ...approvedRes.map((t: any) => ({ ...t, status: "Approved" })),
        ...rejectedRes.map((t: any) => ({ ...t, status: "Approved" })),
      ];

      setAllTasks(combined);
    } catch (err: any) {
      setAllTasksError(err.message || "Failed to load tasks");
    } finally {
      setAllTasksLoading(false);
    }
  };
  const handlePendingTasksClick = async () => {
    if (user?.id) {
      await dispatch(fetchPendingTasks(user.id));
      setPendingTasksOpen(true);
    }
  };

  const handleApprovedTasksClick = async () => {
    if (user?.id) {
      await dispatch(fetchApprovedTasks(user.id));
      setApprovedTasksOpen(true);
    }
  };

  const handleRejectedTasksClick = async () => {
    if (user?.id) {
      await dispatch(fetchRejectedTasks(user.id));
      setRejectedTasksOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setTasksOpen(false);
    dispatch(clearError());
    if (user?.id) {
      dispatch(fetchTaskCount(user.id));
    }
  };

  const handleClosePendingTasksDialog = () => {
    setPendingTasksOpen(false);
    if (user?.id) {
      dispatch(fetchTaskCount(user.id));
    }
  };

  const handleCloseApprovedTasksDialog = () => {
    setApprovedTasksOpen(false);
    if (user?.id) {
      dispatch(fetchTaskCount(user.id));
    }
  };

  const handleCloseRejectedTasksDialog = () => {
    setRejectedTasksOpen(false);
    if (user?.id) {
      dispatch(fetchTaskCount(user.id));
    }
  };

  const handleApproveClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setRemark("");
    setFile(null);
    setApproveDialogOpen(true);
  };

  const handleRejectClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setRemark("");
    setFile(null);
    setRejectDialogOpen(true);
  };

  const handleViewTaskMovement = (task: any) => {
    setSelectedTask(task);
    setTaskMovementDialogOpen(true);
  };

  const handleCloseTaskMovementDialog = () => {
    setTaskMovementDialogOpen(false);
    setSelectedTask(null);
  };

  const handleConfirmApprove = async () => {
    if (selectedTaskId && remark.trim() && file) {
      await dispatch(approveTask({ taskID: selectedTaskId, remark, file }));
      setApproveDialogOpen(false);
      setRemark("");
      setFile(null);
      setSelectedTaskId(null);
      // Refresh pending tasks grid after approval
      if (user?.id) {
        dispatch(fetchPendingTasks(user.id));
      }
    }
  };

  const handleConfirmReject = async () => {
    if (selectedTaskId && remark.trim() && file) {
      await dispatch(rejectTask({ taskID: selectedTaskId, remark, file }));
      setRejectDialogOpen(false);
      setRemark("");
      setFile(null);
      setSelectedTaskId(null);
      // Refresh pending tasks grid after rejection
      if (user?.id) {
        dispatch(fetchPendingTasks(user.id));
      }
    }
  };

  const handleCloseApproveDialog = () => {
    setApproveDialogOpen(false);
    setRemark("");
    setFile(null);
    setSelectedTaskId(null);
    dispatch(clearTaskActionError());
  };

  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
    setRemark("");
    setFile(null);
    setSelectedTaskId(null);
    dispatch(clearTaskActionError());
  };

  // Fetch dashboard counts when user is available
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTaskCount(user.id));
    }
  }, [dispatch, user?.id]);

  const pendingCount = counts?.pendingCount ?? 0;
  const approvedCount = counts?.approvedCount ?? 0;
  const rejectedCount = counts?.rejectedCount ?? 0;
  const totalCount = pendingCount + approvedCount + rejectedCount;

  const stats = [
    {
      label: "Total Tasks",
      value: totalCount.toString(),
      icon: <Assignment />,
      color: theme.palette.info.main,
      onClick: handleTotalTasksClick,
    },
    {
      label: "Pending Tasks",
      value: pendingCount.toString(),
      icon: <HourglassEmptyIcon />,
      color: theme.palette.warning.main,
      onClick: handlePendingTasksClick,
    },
    {
      label: "Approved Tasks",
      value: approvedCount.toString(),
      icon: <CheckCircle />,
      color: theme.palette.success.main,
      onClick: handleApprovedTasksClick,
    },
    {
      label: "Rejected Tasks",
      value: rejectedCount.toString(),
      icon: <Cancel />,
      color: theme.palette.error.main,
      onClick: handleRejectedTasksClick,
    },
  ];

  return (
    <Box>
      {!tasksOpen &&
      !pendingTasksOpen &&
      !approvedTasksOpen &&
      !rejectedTasksOpen ? (
        <>
          {/* Main Dashboard View */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Maker Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your assigned tasks
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: `0 4px 20px ${alpha(
                      theme.palette.common.black,
                      0.08,
                    )}`,
                    cursor:
                      stat.label === "Total Tasks" ||
                      stat.label === "Pending Tasks" ||
                      stat.label === "Approved Tasks" ||
                      stat.label === "Rejected Tasks"
                        ? "pointer"
                        : "default",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover":
                      stat.label === "Total Tasks" ||
                      stat.label === "Pending Tasks" ||
                      stat.label === "Approved Tasks" ||
                      stat.label === "Rejected Tasks"
                        ? {
                            transform: "translateY(-4px)",
                            boxShadow: `0 8px 30px ${alpha(
                              theme.palette.common.black,
                              0.12,
                            )}`,
                          }
                        : {},
                  }}
                  onClick={() => {
                    if (stat.label === "Total Tasks") handleTotalTasksClick();
                    if (stat.label === "Pending Tasks")
                      handlePendingTasksClick();
                    if (stat.label === "Approved Tasks")
                      handleApprovedTasksClick();
                    if (stat.label === "Rejected Tasks")
                      handleRejectedTasksClick();
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: alpha(stat.color, 0.1),
                          color: stat.color,
                          mr: 2,
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Box>
                        <Typography variant="h4" fontWeight={700}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stat.label}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Card
            sx={{
              mt: 3,
              borderRadius: 3,
              boxShadow: `0 4px 20px ${alpha(
                theme.palette.common.black,
                0.08,
              )}`,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Maker Role
              </Typography>
              <Typography variant="body1" paragraph>
                Create and submit data entries for verification.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • View assigned tasks
                <br />
                • Approve or reject tasks
                <br />• Add remarks for actions
              </Typography>
            </CardContent>
          </Card>
        </>
      ) : tasksOpen ? (
        <>
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                All Tasks ({totalCount})
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View all your pending, approved, and rejected tasks
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={["year", "month"]}
                  label="Select Month"
                  value={dayjs()}
                  // onChange={(newValue) => {
                  //   if (newValue) {
                  //     setCurrentMonth(newValue.toDate());
                  //   }
                  // }}
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
                  value={"All"}
                  // onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={handleCloseDialog}
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
                Back
              </Button>
            </Box>
          </Box>

          <Paper
            sx={{
              borderRadius: 3,
              boxShadow: `0 4px 20px ${alpha(
                theme.palette.common.black,
                0.08,
              )}`,
              overflow: "hidden",
            }}
          >
            {allTasksLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 400,
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <CircularProgress size={50} />
                <Typography variant="body1" color="text.secondary">
                  Loading all tasks...
                </Typography>
              </Box>
            ) : allTasksError ? (
              <Box sx={{ p: 4 }}>
                <Alert severity="error">{allTasksError}</Alert>
              </Box>
            ) : allTasks.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 12 }}>
                <Assignment
                  sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No tasks found
                </Typography>
              </Box>
            ) : (
              <CommonDataTable
                rows={allTasks}
                columns={allTasksColumns}
                loading={allTasksLoading}
                getRowId={(row) => row.tblId}
                autoHeight={true}
              />
            )}
          </Paper>
        </>
      ) : pendingTasksOpen ? (
        <>
          {/* Pending Tasks View */}
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Pending Tasks
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Review and take action on pending tasks
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={["year", "month"]}
                  label="Select Month"
                  value={dayjs()}
                  // onChange={(newValue) => {
                  //   if (newValue) {
                  //     setCurrentMonth(newValue.toDate());
                  //   }
                  // }}
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
                  value={"All"}
                  // onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={handleClosePendingTasksDialog}
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
                Back
              </Button>
            </Box>
          </Box>

          <Paper
            sx={{
              borderRadius: 3,
              boxShadow: `0 4px 20px ${alpha(
                theme.palette.common.black,
                0.08,
              )}`,
              overflow: "hidden",
            }}
          >
            {pendingTasksLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 400,
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <CircularProgress size={50} />
                <Typography variant="body1" color="text.secondary">
                  Loading Pending Tasks...
                </Typography>
              </Box>
            ) : pendingTasksError ? (
              <Box sx={{ p: 4 }}>
                <Alert severity="error">{pendingTasksError}</Alert>
              </Box>
            ) : pendingTasks.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 12 }}>
                <Assignment
                  sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No pending tasks
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All tasks are completed or approved
                </Typography>
              </Box>
            ) : (
              <CommonDataTable
                rows={pendingTasks}
                columns={pendingTasksColumns}
                loading={pendingTasksLoading}
                getRowId={(row) => row.tblId}
                autoHeight={true}
              />
            )}
          </Paper>
        </>
      ) : approvedTasksOpen ? (
        <>
          {/* Approved Tasks View */}
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Approved Tasks
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View your approved tasks
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={["year", "month"]}
                  label="Select Month"
                  value={dayjs()}
                  // onChange={(newValue) => {
                  //   if (newValue) {
                  //     setCurrentMonth(newValue.toDate());
                  //   }
                  // }}
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
                  value={"All"}
                  // onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={handleCloseApprovedTasksDialog}
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
                Back
              </Button>
            </Box>
          </Box>

          <Paper
            sx={{
              borderRadius: 3,
              boxShadow: `0 4px 20px ${alpha(
                theme.palette.common.black,
                0.08,
              )}`,
              overflow: "hidden",
            }}
          >
            {approvedTasksLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 400,
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <CircularProgress size={50} />
                <Typography variant="body1" color="text.secondary">
                  Loading Approved Tasks...
                </Typography>
              </Box>
            ) : approvedTasksError ? (
              <Box sx={{ p: 4 }}>
                <Alert severity="error">{approvedTasksError}</Alert>
              </Box>
            ) : approvedTasks.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 12 }}>
                <Assignment
                  sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No approved tasks
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You don't have any approved tasks yet
                </Typography>
              </Box>
            ) : (
              <CommonDataTable
                rows={approvedTasks}
                columns={approvedTasksColumns}
                loading={approvedTasksLoading}
                getRowId={(row) => row.tblId}
                autoHeight={true}
              />
            )}
          </Paper>
        </>
      ) : rejectedTasksOpen ? (
        <>
          {/* Rejected Tasks View */}
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Rejected Tasks
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View your rejected tasks
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={["year", "month"]}
                  label="Select Month"
                  value={dayjs()}
                  // onChange={(newValue) => {
                  //   if (newValue) {
                  //     setCurrentMonth(newValue.toDate());
                  //   }
                  // }}
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
                  value={"All"}
                  // onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={handleCloseRejectedTasksDialog}
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
                Back
              </Button>
            </Box>
          </Box>

          <Paper
            sx={{
              borderRadius: 3,
              boxShadow: `0 4px 20px ${alpha(
                theme.palette.common.black,
                0.08,
              )}`,
              overflow: "hidden",
            }}
          >
            {rejectedTasksLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 400,
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <CircularProgress size={50} />
                <Typography variant="body1" color="text.secondary">
                  Loading Rejected Tasks...
                </Typography>
              </Box>
            ) : rejectedTasksError ? (
              <Box sx={{ p: 4 }}>
                <Alert severity="error">{rejectedTasksError}</Alert>
              </Box>
            ) : rejectedTasks.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 12 }}>
                <Assignment
                  sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No rejected tasks
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You don't have any rejected tasks
                </Typography>
              </Box>
            ) : (
              <CommonDataTable
                rows={rejectedTasks}
                columns={rejectedTasksColumns}
                loading={rejectedTasksLoading}
                getRowId={(row) => row.tblId}
                autoHeight={true}
              />
            )}
          </Paper>
        </>
      ) : null}

      {/* Approve Task Dialog */}
      <Dialog
        open={approveDialogOpen}
        onClose={handleCloseApproveDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: "1.2rem" }}>
          Approve Task
        </DialogTitle>
        {taskActionsError && (
          <Box sx={{ px: 3, pt: 1 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {taskActionsError}
            </Alert>
          </Box>
        )}
        <DialogContent sx={{ py: 2 }}>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={4}
            label="Remark"
            placeholder="Enter your remark for approving this task..."
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            variant="outlined"
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            type="file"
            label="Attachment"
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 2 }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleCloseApproveDialog}
            disabled={taskActionsLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmApprove}
            variant="contained"
            color="success"
            disabled={taskActionsLoading || !remark.trim()}
            startIcon={
              taskActionsLoading ? (
                <CircularProgress size={20} />
              ) : (
                <ApproveIcon />
              )
            }
          >
            {taskActionsLoading ? "Approving..." : "Approve"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Task Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={handleCloseRejectDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: "1.2rem" }}>
          Reject Task
        </DialogTitle>
        {taskActionsError && (
          <Box sx={{ px: 3, pt: 1 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {taskActionsError}
            </Alert>
          </Box>
        )}
        <DialogContent sx={{ py: 2 }}>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={4}
            label="Rejection Reason"
            placeholder="Enter your reason for rejecting this task..."
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            variant="outlined"
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            type="file"
            label="Attachment"
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 2 }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleCloseRejectDialog}
            disabled={taskActionsLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmReject}
            variant="contained"
            color="error"
            disabled={taskActionsLoading || !remark.trim()}
            startIcon={
              taskActionsLoading ? (
                <CircularProgress size={20} />
              ) : (
                <RejectIcon />
              )
            }
          >
            {taskActionsLoading ? "Rejecting..." : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Task Movement Dialog */}
      <TaskMovementDialog
        open={taskMovementDialogOpen}
        onClose={handleCloseTaskMovementDialog}
        task={selectedTask}
      />
    </Box>
  );
};

export default MakerDashboard;
