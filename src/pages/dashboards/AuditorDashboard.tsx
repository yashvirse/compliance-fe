import React, { useEffect, useState } from "react";
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
  MenuItem,
  Select,
} from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import {
  CheckCircle,
  Assessment,
  Cancel,
  Assignment,
  Visibility as EyeIcon,
  ThumbUp as ApproveIcon,
  ThumbDown as RejectIcon,
} from "@mui/icons-material";
import {
  fetchTaskCount,
  fetchPendingTasks,
  fetchApprovedTasks, // ये actions आपको slice में add करने होंगे
  fetchRejectedTasks, // ये actions आपको slice में add करने होंगे
  clearError,
  clearPendingTasksError,
  approveCheckTask,
  rejectCheckTask,
} from "./auditorslice/AuditorDashboard.Slice";
import {
  selectTaskCounts,
  selectAuditorDashboardLoading,
  selectAuditorDashboardError,
  selectPendingTasks,
  selectPendingTasksLoading,
  selectPendingTasksError,
  selectApprovedTasks, // selectors add करने होंगे
  selectApprovedTasksLoading,
  selectApprovedTasksError,
  selectRejectedTasks,
  selectRejectedTasksLoading,
  selectRejectedTasksError,
} from "./auditorslice/AuditorDashboard.Selector";
import { selectUser } from "../login/slice/Login.selector";
import CommonDataTable from "../../components/common/CommonDataTable";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const AuditorDashboard: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);

  const counts = useSelector(selectTaskCounts);
  const loading = useSelector(selectAuditorDashboardLoading);
  const error = useSelector(selectAuditorDashboardError);
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [allTasksLoading, setAllTasksLoading] = useState(false);
  const [allTasksError, setAllTasksError] = useState<string | null>(null);
  const [tasksOpen, setTasksOpen] = useState(false);
  const pendingTasks = useSelector(selectPendingTasks);
  const pendingTasksLoading = useSelector(selectPendingTasksLoading);
  const pendingTasksError = useSelector(selectPendingTasksError);

  const approvedTasks = useSelector(selectApprovedTasks);
  const approvedTasksLoading = useSelector(selectApprovedTasksLoading);
  const approvedTasksError = useSelector(selectApprovedTasksError);

  const rejectedTasks = useSelector(selectRejectedTasks);
  const rejectedTasksLoading = useSelector(selectRejectedTasksLoading);
  const rejectedTasksError = useSelector(selectRejectedTasksError);

  const [pendingTasksOpen, setPendingTasksOpen] = useState(false);
  const [approvedTasksOpen, setApprovedTasksOpen] = useState(false);
  const [rejectedTasksOpen, setRejectedTasksOpen] = useState(false);
  const [taskMovementDialogOpen, setTaskMovementDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  // Approve & Reject Dialog States
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [remark, setRemark] = useState("");
  const [file, setFile] = useState<File | null>(null);

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
  // const handleCloseDialog = () => {
  //   setTasksOpen(false);
  //   dispatch(clearError());
  //   if (user?.id) {
  //     dispatch(fetchTaskCount(user.id));
  //   }
  // };
  // const handleClosePending = () => {
  //   setPendingTasksOpen(false);
  //   if (user?.id) dispatch(fetchTaskCount(user.id));
  // };

  // const handleCloseApproved = () => {
  //   setApprovedTasksOpen(false);
  //   if (user?.id) dispatch(fetchTaskCount(user.id));
  // };

  // const handleCloseRejected = () => {
  //   setRejectedTasksOpen(false);
  //   if (user?.id) dispatch(fetchTaskCount(user.id));
  // };

  const handleViewTaskMovement = (task: any) => {
    setSelectedTask(task);
    setTaskMovementDialogOpen(true);
  };

  const handleCloseTaskMovementDialog = () => {
    setTaskMovementDialogOpen(false);
    setSelectedTask(null);
  };
  // Approve & Reject Handlers HR
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
  const handleCloseApproveDialog = () => {
    setApproveDialogOpen(false);
    setSelectedTaskId(null);
    setRemark("");
    setFile(null);
  };

  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
    setSelectedTaskId(null);
    setRemark("");
    setFile(null);
  };
  const handleConfirmApprove = async () => {
    if (selectedTaskId && remark.trim() && file) {
      await dispatch(
        approveCheckTask({ taskID: selectedTaskId, remark, file }),
      );
      setApproveDialogOpen(false);
      setRemark("");
      setFile(null);
      setSelectedTaskId(null);
      if (user?.id) {
        dispatch(fetchPendingTasks(user.id));
        dispatch(fetchTaskCount(user.id));
      }
    }
  };

  const handleConfirmReject = async () => {
    if (selectedTaskId && remark.trim() && file) {
      await dispatch(rejectCheckTask({ taskID: selectedTaskId, remark, file }));
      setRejectDialogOpen(false);
      setRemark("");
      setFile(null);
      setSelectedTaskId(null);
      if (user?.id) {
        dispatch(fetchPendingTasks(user.id));
        dispatch(fetchTaskCount(user.id));
      }
    }
  };
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTaskCount(user.id));
    }
  }, [dispatch, user?.id]);
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
      label: "Pending Task",
      value: pendingCount.toString(),
      icon: <Assessment />,
      color: theme.palette.warning.main,
      onClick: handlePendingTasksClick,
    },
    {
      label: "Approved Task",
      value: approvedCount.toString(),
      icon: <CheckCircle />,
      color: theme.palette.success.main,
      onClick: handleApprovedTasksClick,
    },
    {
      label: "Rejected Task",
      value: rejectedCount.toString(),
      icon: <Cancel />,
      color: theme.palette.error.main,
      onClick: handleRejectedTasksClick,
    },
  ];

  // Column definitions for CommonDataTable
  const allTasksColumns: GridColDef[] = React.useMemo(
    () => [
      {
        field: "sno",
        headerName: "S.No.",
        width: 70,
        sortable: false,
        filterable: false,
        align: "left",
        headerAlign: "left",
        renderCell: (params) =>
          params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
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
        width: 60,
        sortable: false,
        filterable: false,
        align: "left",
        headerAlign: "left",
        renderCell: (params) =>
          params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
      },
      { field: "siteName", headerName: "Site Name", flex: 1, minWidth: 100 },
      {
        field: "activityName",
        headerName: "Activity Name",
        flex: 1.2,
        minWidth: 250,
      },
      { field: "actName", headerName: "Act Name", flex: 1, minWidth: 100 },
      {
        field: "departmentName",
        headerName: "Department",
        flex: 1,
        minWidth: 120,
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
        minWidth: 80,
        renderCell: (params) =>
          params.value ? new Date(params.value).toLocaleDateString() : "-",
      },
      {
        field: "status",
        headerName: "Status",
        flex: 0.8,
        minWidth: 100,
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

            {/* View */}
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
        filterable: false,
        align: "left",
        headerAlign: "left",
        renderCell: (params) =>
          params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
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
        filterable: false,
        align: "left",
        headerAlign: "left",
        renderCell: (params) =>
          params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
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

  return (
    <Box>
      {!tasksOpen &&
      !pendingTasksOpen &&
      !approvedTasksOpen &&
      !rejectedTasksOpen ? (
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Auditor Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Review and manage tasks
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => dispatch(clearError())}
            >
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
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
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: `0 8px 30px ${alpha(
                          theme.palette.common.black,
                          0.12,
                        )}`,
                      },
                    }}
                    onClick={stat.onClick}
                  >
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
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
          )}

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
                Auditor Role
              </Typography>
              <Typography variant="body1" paragraph>
                Review and approve or reject submitted tasks based on compliance
                requirements.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • View pending review tasks
                <br />
                • Approve compliant tasks
                <br />
                • Reject non-compliant tasks
                <br />• Provide feedback on rejections
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
        /* ---------- Pending Tasks View ---------- */
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
                <Alert
                  severity="error"
                  onClose={() => dispatch(clearPendingTasksError())}
                >
                  {pendingTasksError}
                </Alert>
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
                  All tasks have been reviewed
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
        /* ---------- Approved Tasks View ---------- */
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
        /* ---------- Rejected Tasks View ---------- */
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
      {/* Approve Dialog */}
      <Dialog
        open={approveDialogOpen}
        onClose={handleCloseApproveDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Approve Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={4}
            label="Approval Remarks"
            placeholder="Enter your remarks..."
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
        <DialogActions>
          <Button onClick={handleCloseApproveDialog}>Cancel</Button>
          <Button
            onClick={handleConfirmApprove}
            variant="contained"
            color="success"
            disabled={!remark.trim()}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={handleCloseRejectDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Reject Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={4}
            label="Rejection Reason"
            placeholder="Enter reason for rejection..."
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
        <DialogActions>
          <Button onClick={handleCloseRejectDialog}>Cancel</Button>
          <Button
            onClick={handleConfirmReject}
            variant="contained"
            color="error"
            disabled={!remark.trim()}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
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
                          0.05,
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

export default AuditorDashboard;
