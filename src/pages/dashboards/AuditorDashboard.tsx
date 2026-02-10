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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Tooltip,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
} from "@mui/material";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  CheckCircle,
  Assessment,
  Cancel,
  Assignment,
  Visibility as EyeIcon,
  ThumbUp as ApproveIcon,
  ThumbDown as RejectIcon,
} from "@mui/icons-material";

// Redux
import {
  fetchTaskCount,
  clearError,
  approveCheckTask,
  rejectCheckTask,
  fetchAssignedTasks,
} from "./auditorslice/AuditorDashboard.Slice";
import {
  selectTaskCounts,
  selectAssignedTasks,
} from "./auditorslice/AuditorDashboard.Selector";
import { selectUser } from "../login/slice/Login.selector";

// Components & Common
import CommonDataTable from "../../components/common/CommonDataTable";
import {
  LoadingState,
  EmptyState,
  ErrorState,
  TaskMovementDialog,
} from "../../components/common";

// ✨ Utilities & Hooks
import { useDashboardTasks } from "../../hooks/useDashboardTasks";
import { createDepartmentChipColumn } from "../../utils/gridColumns.utils.tsx";

// Date Picker
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AuditorDashboard: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);

  // ✨ Consolidated state management using custom hook
  const {
    data: dashboardData,
    loading,
    error,
  } = useDashboardTasks({
    selectPending: selectAssignedTasks,
    selectApproved: selectAssignedTasks,
    selectRejected: selectAssignedTasks,
    selectPendingLoading: (state) =>
      (state as any).auditorDashboard?.pendingTasksLoading || false,
    selectApprovedLoading: (state) =>
      (state as any).auditorDashboard?.approvedTasksLoading || false,
    selectRejectedLoading: (state) =>
      (state as any).auditorDashboard?.rejectedTasksLoading || false,
    selectCounts: selectTaskCounts,
  });

  // ✨ Extract data from consolidated state
  const counts = dashboardData?.counts || {};
  const pendingTasks = dashboardData?.pending || [];
  const approvedTasks = dashboardData?.approved || [];
  const rejectedTasks = dashboardData?.rejected || [];

  // UI Navigation States
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [allTasksLoading, setAllTasksLoading] = useState(false);
  const [allTasksError, setAllTasksError] = useState<string | null>(null);
  const [tasksOpen, setTasksOpen] = useState(false);
  const [pendingTasksOpen, setPendingTasksOpen] = useState(false);
  const [approvedTasksOpen, setApprovedTasksOpen] = useState(false);
  const [rejectedTasksOpen, setRejectedTasksOpen] = useState(false);
  const [taskMovementDialogOpen, setTaskMovementDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  // Dialog States
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [remark, setRemark] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState<string>("Pending");

  const getFromDateISO = (date: Date) => {
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return lastDayOfMonth.toISOString();
  };
  const fromDate = getFromDateISO(currentMonth);

  useEffect(() => {
    if (pendingTasksOpen) {
      handlePendingTasksClick();
    }
  }, [currentMonth]);

  const handlePendingTasksClick = async () => {
    if (user?.id) {
      await dispatch(
        fetchAssignedTasks({
          userID: user.id,
          fromDate,
          userStatus: "Pending",
        }),
      );
      setPendingTasksOpen(true);
    }
  };

  useEffect(() => {
    if (approvedTasksOpen) {
      handleApprovedTasksClick();
    }
  }, [currentMonth]);

  const handleApprovedTasksClick = async () => {
    if (user?.id) {
      await dispatch(
        fetchAssignedTasks({
          userID: user.id,
          fromDate,
          userStatus: "Approved",
        }),
      );
      setApprovedTasksOpen(true);
    }
  };

  useEffect(() => {
    if (rejectedTasksOpen) {
      handleRejectedTasksClick();
    }
  }, [currentMonth]);

  const handleRejectedTasksClick = async () => {
    if (user?.id) {
      await dispatch(
        fetchAssignedTasks({
          userID: user.id,
          fromDate,
          userStatus: "Rejected",
        }),
      );
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

  const handleClosePending = () => {
    setPendingTasksOpen(false);
    if (user?.id) dispatch(fetchTaskCount(user.id));
  };

  const handleCloseApproved = () => {
    setApprovedTasksOpen(false);
    if (user?.id) dispatch(fetchTaskCount(user.id));
  };

  const handleCloseRejected = () => {
    setRejectedTasksOpen(false);
    if (user?.id) dispatch(fetchTaskCount(user.id));
  };

  const handleViewTaskMovement = (tblId: string) => {
    setSelectedTask(tblId);
    setTaskMovementDialogOpen(true);
  };

  const handleCloseTaskMovementDialog = () => {
    setTaskMovementDialogOpen(false);
    setSelectedTask(null);
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
      const payload = {
        taskID: selectedTaskId,
        remark,
        file,
      };
      try {
        await dispatch(approveCheckTask(payload) as any).unwrap();
        setApproveDialogOpen(false);
        setRemark("");
        setFile(null);
        setSelectedTaskId(null);
        if (user?.id) {
          const fromDate = getFromDateISO(currentMonth);

          dispatch(
            fetchAssignedTasks({
              userID: user.id,
              fromDate,
              userStatus: "Pending",
            }),
          );
        }
      } catch (err) {
        console.error("Approve failed:", err);
      }
    }
  };

  const handleConfirmReject = async () => {
    if (selectedTaskId && remark.trim() && file) {
      const payload = {
        taskID: selectedTaskId,
        remark,
        file,
      };
      try {
        await dispatch(rejectCheckTask(payload) as any).unwrap();
        setRejectDialogOpen(false);
        setRemark("");
        setFile(null);
        setSelectedTaskId(null);
        if (user?.id) {
          const fromDate = getFromDateISO(currentMonth);

          dispatch(
            fetchAssignedTasks({
              userID: user.id,
              fromDate,
              userStatus: "Pending",
            }),
          );
        }
      } catch (err) {
        console.error("Reject failed:", err);
      }
    }
  };
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTaskCount(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (tasksOpen) {
      handleTotalTasksClick();
    }
  }, [currentMonth, statusFilter]);

  const handleTotalTasksClick = async () => {
    if (!user?.id) return;

    setAllTasksLoading(true);
    setAllTasksError(null);
    setTasksOpen(true); // डायलॉग ओपन

    try {
      const res = await dispatch(
        fetchAssignedTasks({
          userID: user.id,
          fromDate,
          userStatus: statusFilter, // Pending / Approved / Rejected / All
        }),
      ).unwrap();

      setAllTasks(res.result || []);
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
  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case "Weekly":
        return "primary";
      case "Fortnightly":
        return "secondary";
      case "Monthly":
        return "success";
      case "Half Yearly":
        return "warning";
      case "Annually":
        return "error";
      case "As Needed":
        return "default";
      default:
        return "default";
    }
  };
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
        flex: 1,
        minWidth: 600,
        valueGetter: (_value, row) => {
          if (!row.actName) return row.activityName;
          return `${row.actName} - ${row.activityName}`;
        },
        sortable: true,
        filterable: true,
      },
      createDepartmentChipColumn(theme, "info"),
      {
        field: "frequency",
        headerName: "Frequency",
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
        field: "dueDate",
        headerName: "Due Date",
        flex: 1,
        minWidth: 100,
        renderCell: (params) =>
          params.value ? new Date(params.value).toLocaleDateString() : "-",
      },
      {
        field: "userStatus",
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
          const status = params.row.userStatus;
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
                  onClick={() => handleViewTaskMovement(params.row.tblId)}
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
      { field: "siteName", headerName: "Site Name", flex: 1, minWidth: 100 },
      {
        field: "activityName",
        headerName: "Activity Name",
        flex: 1,
        minWidth: 600,
        valueGetter: (_value, row) => {
          if (!row.actName) return row.activityName;
          return `${row.actName} - ${row.activityName}`;
        },
        sortable: true,
        filterable: true,
      },
      createDepartmentChipColumn(theme, "info"),
      {
        field: "frequency",
        headerName: "Frequency",
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
        field: "dueDate",
        headerName: "Due Date",
        flex: 1,
        minWidth: 80,
        renderCell: (params) =>
          params.value ? new Date(params.value).toLocaleDateString() : "-",
      },
      {
        field: "userStatus",
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

            {/* View (LAST) */}
            <Tooltip title="View Task" arrow>
              <IconButton
                size="small"
                onClick={() => handleViewTaskMovement(params.row.tblId)}
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
        flex: 1,
        minWidth: 600,
        valueGetter: (_value, row) => {
          if (!row.actName) return row.activityName;
          return `${row.actName} - ${row.activityName}`;
        },
        sortable: true,
        filterable: true,
      },
      createDepartmentChipColumn(theme, "success"),
      {
        field: "frequency",
        headerName: "Frequency",
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
        field: "dueDate",
        headerName: "Due Date",
        flex: 1,
        minWidth: 100,
        renderCell: (params) =>
          params.value ? new Date(params.value).toLocaleDateString() : "-",
      },
      {
        field: "userStatus",
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
        flex: 0.8,
        minWidth: 120,
        sortable: false,
        renderCell: (params) => (
          <Tooltip title="View Task" arrow>
            <Button
              size="small"
              variant="text"
              startIcon={<EyeIcon />}
              onClick={() => handleViewTaskMovement(params.row.tblId)}
              sx={{
                color: theme.palette.primary.main,
                textTransform: "none",
                "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.1) },
              }}
            />
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
        flex: 1,
        minWidth: 600,
        valueGetter: (_value, row) => {
          if (!row.actName) return row.activityName;
          return `${row.actName} - ${row.activityName}`;
        },
        sortable: true,
        filterable: true,
      },
      createDepartmentChipColumn(theme, "error"),
      {
        field: "frequency",
        headerName: "Frequency",
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
        field: "dueDate",
        headerName: "Due Date",
        flex: 1,
        minWidth: 100,
        renderCell: (params) =>
          params.value ? new Date(params.value).toLocaleDateString() : "-",
      },
      {
        field: "userStatus",
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
        flex: 0.8,
        minWidth: 120,
        sortable: false,
        renderCell: (params) => (
          <Tooltip title="View Task" arrow>
            <Button
              size="small"
              variant="text"
              startIcon={<EyeIcon />}
              onClick={() => handleViewTaskMovement(params.row.tblId)}
              sx={{
                color: theme.palette.primary.main,
                textTransform: "none",
                "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.1) },
              }}
            />
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
          </Box>

          {error?.overall && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => dispatch(clearError())}
            >
              {error.overall}
            </Alert>
          )}

          {loading.overall ? (
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
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {" "}
                <DatePicker
                  views={["year", "month"]}
                  label="Select Month"
                  value={dayjs(currentMonth)}
                  onChange={(newValue) => {
                    if (newValue) {
                      setCurrentMonth(newValue.toDate());
                    }
                  }}
                  slotProps={{ textField: { size: "small" } }}
                />{" "}
              </LocalizationProvider>

              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
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
              <LoadingState message="Loading all tasks..." minHeight={400} />
            ) : allTasksError ? (
              <ErrorState
                error={allTasksError}
                onRetry={handleTotalTasksClick}
              />
            ) : allTasks.length === 0 ? (
              <EmptyState
                icon={<Assignment />}
                title="No Tasks Found"
                minHeight={400}
              />
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
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {" "}
                <DatePicker
                  views={["year", "month"]}
                  label="Select Month"
                  value={dayjs(currentMonth)}
                  onChange={(newValue) => {
                    if (newValue) {
                      setCurrentMonth(newValue.toDate());
                    }
                  }}
                  slotProps={{ textField: { size: "small" } }}
                />{" "}
              </LocalizationProvider>
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={handleClosePending}
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
            {loading.pending ? (
              <LoadingState
                message="Loading Pending Tasks..."
                minHeight={400}
              />
            ) : error.pending ? (
              <ErrorState
                error={error.pending}
                onRetry={() =>
                  user?.id &&
                  dispatch(
                    fetchAssignedTasks({
                      userID: user.id,
                      fromDate,
                      userStatus: "Pending",
                    }),
                  )
                }
              />
            ) : pendingTasks.length === 0 ? (
              <EmptyState
                icon={<Assignment />}
                title="No Pending Tasks"
                message="All tasks have been reviewed"
                minHeight={400}
              />
            ) : (
              <CommonDataTable
                rows={pendingTasks}
                columns={pendingTasksColumns}
                loading={loading.pending}
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
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {" "}
                <DatePicker
                  views={["year", "month"]}
                  label="Select Month"
                  value={dayjs(currentMonth)}
                  onChange={(newValue) => {
                    if (newValue) {
                      setCurrentMonth(newValue.toDate());
                    }
                  }}
                  slotProps={{ textField: { size: "small" } }}
                />{" "}
              </LocalizationProvider>
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={handleCloseApproved}
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
            {loading.approved ? (
              <LoadingState
                message="Loading Approved Tasks..."
                minHeight={400}
              />
            ) : error.approved ? (
              <ErrorState
                error={error.approved}
                onRetry={() =>
                  user?.id &&
                  dispatch(
                    fetchAssignedTasks({
                      userID: user.id,
                      fromDate,
                      userStatus: "Approved",
                    }),
                  )
                }
              />
            ) : approvedTasks.length === 0 ? (
              <EmptyState
                icon={<Assignment />}
                title="No Approved Tasks"
                minHeight={400}
              />
            ) : (
              <CommonDataTable
                rows={approvedTasks}
                columns={approvedTasksColumns}
                loading={loading.approved}
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
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {" "}
                <DatePicker
                  views={["year", "month"]}
                  label="Select Month"
                  value={dayjs(currentMonth)}
                  onChange={(newValue) => {
                    if (newValue) {
                      setCurrentMonth(newValue.toDate());
                    }
                  }}
                  slotProps={{ textField: { size: "small" } }}
                />{" "}
              </LocalizationProvider>
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={handleCloseRejected}
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
            {loading.rejected ? (
              <LoadingState
                message="Loading Rejected Tasks..."
                minHeight={400}
              />
            ) : error.rejected ? (
              <ErrorState
                error={error.rejected}
                onRetry={() =>
                  user?.id &&
                  dispatch(
                    fetchAssignedTasks({
                      userID: user.id,
                      fromDate,
                      userStatus: "Rejected",
                    }),
                  )
                }
              />
            ) : rejectedTasks.length === 0 ? (
              <EmptyState
                icon={<Assignment />}
                title="No Rejected Tasks"
                minHeight={400}
              />
            ) : (
              <CommonDataTable
                rows={rejectedTasks}
                columns={rejectedTasksColumns}
                loading={loading.rejected}
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
            label="Attachment (Optional)"
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
            label="Attachment (Optional)"
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
      <TaskMovementDialog
        open={taskMovementDialogOpen}
        onClose={handleCloseTaskMovementDialog}
        tblId={selectedTask}
      />
    </Box>
  );
};

export default AuditorDashboard;
