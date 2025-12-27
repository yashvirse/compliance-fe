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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  CheckCircle,
  Assignment,
  Cancel,
  Close as CloseIcon,
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
  clearError,
  clearTaskActionError,
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
    // Refresh dashboard counts when returning to dashboard
    if (user?.id) {
      dispatch(fetchTaskCount(user.id));
    }
  };

  const handleClosePendingTasksDialog = () => {
    setPendingTasksOpen(false);
    // Refresh dashboard counts when returning to dashboard
    if (user?.id) {
      dispatch(fetchTaskCount(user.id));
    }
  };

  const handleCloseApprovedTasksDialog = () => {
    setApprovedTasksOpen(false);
    // Refresh dashboard counts when returning to dashboard
    if (user?.id) {
      dispatch(fetchTaskCount(user.id));
    }
  };

  const handleCloseRejectedTasksDialog = () => {
    setRejectedTasksOpen(false);
    // Refresh dashboard counts when returning to dashboard
    if (user?.id) {
      dispatch(fetchTaskCount(user.id));
    }
  };

  const handleApproveClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setRemark("");
    setApproveDialogOpen(true);
  };

  const handleRejectClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setRemark("");
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
    if (selectedTaskId && remark.trim()) {
      await dispatch(approveTask({ taskID: selectedTaskId, remark }));
      setApproveDialogOpen(false);
      setRemark("");
      setSelectedTaskId(null);
      // Refresh pending tasks grid after approval
      if (user?.id) {
        dispatch(fetchPendingTasks(user.id));
      }
    }
  };

  const handleConfirmReject = async () => {
    if (selectedTaskId && remark.trim()) {
      await dispatch(rejectTask({ taskID: selectedTaskId, remark }));
      setRejectDialogOpen(false);
      setRemark("");
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
    setSelectedTaskId(null);
    dispatch(clearTaskActionError());
  };

  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
    setRemark("");
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
      label: "Pending",
      value: pendingCount.toString(),
      icon: <Assignment />,
      color: theme.palette.warning.main,
      onClick: handlePendingTasksClick,
    },
    {
      label: "Approved",
      value: approvedCount.toString(),
      icon: <CheckCircle />,
      color: theme.palette.success.main,
      onClick: handleApprovedTasksClick,
    },
    {
      label: "Rejected",
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
                      0.08
                    )}`,
                    cursor:
                      stat.label === "Total Tasks" ||
                      stat.label === "Pending" ||
                      stat.label === "Approved" ||
                      stat.label === "Rejected"
                        ? "pointer"
                        : "default",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover":
                      stat.label === "Total Tasks" ||
                      stat.label === "Pending" ||
                      stat.label === "Approved" ||
                      stat.label === "Rejected"
                        ? {
                            transform: "translateY(-4px)",
                            boxShadow: `0 8px 30px ${alpha(
                              theme.palette.common.black,
                              0.12
                            )}`,
                          }
                        : {},
                  }}
                  onClick={() => {
                    if (stat.label === "Total Tasks") handleTotalTasksClick();
                    if (stat.label === "Pending") handlePendingTasksClick();
                    if (stat.label === "Approved") handleApprovedTasksClick();
                    if (stat.label === "Rejected") handleRejectedTasksClick();
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
                0.08
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
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={handleCloseDialog}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
              }}
            >
              Back to Dashboard
            </Button>
          </Box>

          <Paper
            sx={{
              borderRadius: 3,
              boxShadow: `0 4px 20px ${alpha(
                theme.palette.common.black,
                0.08
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
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}
                    >
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Activity Name
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Act Name
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Department
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Site Name
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Due Date
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Status
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="subtitle2" fontWeight={600}>
                          Actions
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allTasks.map((task, index) => (
                      <TableRow key={task.tblId || index} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {task.activityName}
                          </Typography>
                          {task.description && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mt: 0.5 }}
                            >
                              {task.description}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {task.actName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={task.departmentName}
                            size="small"
                            sx={{
                              bgcolor: alpha(theme.palette.info.main, 0.1),
                              color: theme.palette.info.main,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {task.siteName || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {task.dueDate
                              ? new Date(task.dueDate).toLocaleDateString()
                              : "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={task.status}
                            size="small"
                            color={
                              task.status === "Approved"
                                ? "success"
                                : task.status === "Rejected"
                                ? "error"
                                : "warning"
                            }
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {task.status === "Pending" ? (
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                justifyContent: "center",
                              }}
                            >
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                startIcon={<ApproveIcon />}
                                onClick={() => handleApproveClick(task.tblId)}
                              >
                                Approve
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                color="error"
                                startIcon={<RejectIcon />}
                                onClick={() => handleRejectClick(task.tblId)}
                              >
                                Reject
                              </Button>
                            </Box>
                          ) : task.status === "Approved" ? (
                            <Button
                              size="small"
                              variant="text"
                              startIcon={<EyeIcon />}
                              onClick={() => handleViewTaskMovement(task)}
                            >
                              View
                            </Button>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              -
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={handleClosePendingTasksDialog}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
              }}
            >
              Back to Dashboard
            </Button>
          </Box>

          <Paper
            sx={{
              borderRadius: 3,
              boxShadow: `0 4px 20px ${alpha(
                theme.palette.common.black,
                0.08
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
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}
                    >
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Activity Name
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Act Name
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Department
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Site Name
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Due Date
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Typography variant="subtitle2" fontWeight={600}>
                          Actions
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingTasks.map((task, index) => (
                      <TableRow
                        key={task.tblId || index}
                        hover
                        sx={{ "&:last-child td": { borderBottom: 0 } }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {task.activityName}
                          </Typography>
                          {task.description && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mt: 0.5 }}
                            >
                              {task.description}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {task.actName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={task.departmentName}
                            size="small"
                            sx={{
                              bgcolor: alpha(theme.palette.info.main, 0.1),
                              color: theme.palette.info.main,
                              fontWeight: 500,
                              borderRadius: 2,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {task.siteName || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {task.dueDate
                              ? new Date(task.dueDate).toLocaleDateString()
                              : "-"}
                          </Typography>
                        </TableCell>

                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              justifyContent: "center",
                            }}
                          >
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              startIcon={<ApproveIcon />}
                              sx={{
                                borderRadius: 1.5,
                                textTransform: "none",
                                fontWeight: 600,
                                px: 2,
                                py: 1,
                              }}
                              onClick={() => handleApproveClick(task.tblId)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              startIcon={<RejectIcon />}
                              sx={{
                                borderRadius: 1.5,
                                textTransform: "none",
                                fontWeight: 600,
                                px: 2,
                                py: 1,
                              }}
                              onClick={() => handleRejectClick(task.tblId)}
                            >
                              Reject
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={handleCloseApprovedTasksDialog}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
              }}
            >
              Back to Dashboard
            </Button>
          </Box>

          <Paper
            sx={{
              borderRadius: 3,
              boxShadow: `0 4px 20px ${alpha(
                theme.palette.common.black,
                0.08
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
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}
                    >
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Activity Name
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Act Name
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Department
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Site Name
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Due Date
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Typography variant="subtitle2" fontWeight={600}>
                          Actions
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {approvedTasks.map((task, index) => (
                      <TableRow
                        key={task.tblId || index}
                        hover
                        sx={{ "&:last-child td": { borderBottom: 0 } }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {task.activityName}
                          </Typography>
                          {task.description && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mt: 0.5 }}
                            >
                              {task.description}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {task.actName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={task.departmentName}
                            size="small"
                            sx={{
                              bgcolor: alpha(theme.palette.success.main, 0.1),
                              color: theme.palette.success.main,
                              fontWeight: 500,
                              borderRadius: 2,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {task.siteName || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {task.dueDate
                              ? new Date(task.dueDate).toLocaleDateString()
                              : "-"}
                          </Typography>
                        </TableCell>

                        <TableCell align="center">
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={handleCloseRejectedTasksDialog}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
              }}
            >
              Back to Dashboard
            </Button>
          </Box>

          <Paper
            sx={{
              borderRadius: 3,
              boxShadow: `0 4px 20px ${alpha(
                theme.palette.common.black,
                0.08
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
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{ bgcolor: alpha(theme.palette.error.main, 0.05) }}
                    >
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Activity Name
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Act Name
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Department
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Site Name
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Due Date
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="subtitle2" fontWeight={600}>
                          Actions
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rejectedTasks.map((task, index) => (
                      <TableRow
                        key={task.tblId || index}
                        hover
                        sx={{ "&:last-child td": { borderBottom: 0 } }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {task.activityName}
                          </Typography>
                          {task.description && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block", mt: 0.5 }}
                            >
                              {task.description}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {task.actName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={task.departmentName}
                            size="small"
                            sx={{
                              bgcolor: alpha(theme.palette.error.main, 0.1),
                              color: theme.palette.error.main,
                              fontWeight: 500,
                              borderRadius: 2,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {task.siteName || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {task.dueDate
                              ? new Date(task.dueDate).toLocaleDateString()
                              : "-"}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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

export default MakerDashboard;
