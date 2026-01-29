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
  fetchCheckerTaskCount,
  fetchPendingCheckTasks,
  fetchApprovedCheckTasks,
  fetchRejectedCheckTasks,
  approveCheckTask,
  rejectCheckTask,
  clearTaskActionError,
} from "./checkerslice/CheckerDashboard.Slice";
import {
  selectCheckerTaskCounts,
  selectCheckerTaskActionsLoading,
  selectCheckerTaskActionsError,
  selectPendingCheckTasks,
  selectPendingCheckTasksLoading,
  selectPendingCheckTasksError,
  selectApprovedCheckTasks,
  selectApprovedCheckTasksLoading,
  selectApprovedCheckTasksError,
  selectRejectedCheckTasks,
  selectRejectedCheckTasksLoading,
  selectRejectedCheckTasksError,
} from "./checkerslice/CheckerDashboard.Selector";
import { selectUser } from "../login/slice/Login.selector";
import TaskMovementDialog from "../../components/common/TaskMovementDialog";

const CheckerDashboard: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const counts = useSelector(selectCheckerTaskCounts);
  const taskActionsLoading = useSelector(selectCheckerTaskActionsLoading);
  const taskActionsError = useSelector(selectCheckerTaskActionsError);
  const pendingCheckTasks = useSelector(selectPendingCheckTasks);
  const pendingCheckTasksLoading = useSelector(selectPendingCheckTasksLoading);
  const pendingCheckTasksError = useSelector(selectPendingCheckTasksError);
  const approvedCheckTasks = useSelector(selectApprovedCheckTasks);
  const approvedCheckTasksLoading = useSelector(
    selectApprovedCheckTasksLoading
  );
  const approvedCheckTasksError = useSelector(selectApprovedCheckTasksError);
  const rejectedCheckTasks = useSelector(selectRejectedCheckTasks);
  const rejectedCheckTasksLoading = useSelector(
    selectRejectedCheckTasksLoading
  );
  const rejectedCheckTasksError = useSelector(selectRejectedCheckTasksError);

  const [pendingCheckTasksOpen, setPendingCheckTasksOpen] = useState(false);
  const [approvedCheckTasksOpen, setApprovedCheckTasksOpen] = useState(false);
  const [rejectedCheckTasksOpen, setRejectedCheckTasksOpen] = useState(false);
  const [taskMovementDialogOpen, setTaskMovementDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [remark, setRemark] = useState("");

  const handlePendingCheckTasksClick = async () => {
    if (user?.id) {
      await dispatch(fetchPendingCheckTasks(user.id));
      setPendingCheckTasksOpen(true);
    }
  };

  const handleApprovedCheckTasksClick = async () => {
    if (user?.id) {
      await dispatch(fetchApprovedCheckTasks(user.id));
      setApprovedCheckTasksOpen(true);
    }
  };

  const handleRejectedCheckTasksClick = async () => {
    if (user?.id) {
      await dispatch(fetchRejectedCheckTasks(user.id));
      setRejectedCheckTasksOpen(true);
    }
  };

  const handleClosePendingCheckTasksDialog = () => {
    setPendingCheckTasksOpen(false);
    // Refresh dashboard counts when returning to dashboard
    if (user?.id) {
      dispatch(fetchCheckerTaskCount(user.id));
    }
  };

  const handleCloseApprovedCheckTasksDialog = () => {
    setApprovedCheckTasksOpen(false);
    // Refresh dashboard counts when returning to dashboard
    if (user?.id) {
      dispatch(fetchCheckerTaskCount(user.id));
    }
  };

  const handleCloseRejectedCheckTasksDialog = () => {
    setRejectedCheckTasksOpen(false);
    // Refresh dashboard counts when returning to dashboard
    if (user?.id) {
      dispatch(fetchCheckerTaskCount(user.id));
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
      await dispatch(approveCheckTask({ taskID: selectedTaskId, remark }));
      setApproveDialogOpen(false);
      setRemark("");
      setSelectedTaskId(null);
      // Refresh pending tasks grid after approval
      if (user?.id) {
        dispatch(fetchPendingCheckTasks(user.id));
      }
    }
  };

  const handleConfirmReject = async () => {
    if (selectedTaskId && remark.trim()) {
      await dispatch(rejectCheckTask({ taskID: selectedTaskId, remark }));
      setRejectDialogOpen(false);
      setRemark("");
      setSelectedTaskId(null);
      // Refresh pending tasks grid after rejection
      if (user?.id) {
        dispatch(fetchPendingCheckTasks(user.id));
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
      dispatch(fetchCheckerTaskCount(user.id));
    }
  }, [dispatch, user?.id]);

  const pendingCheckCount = counts?.pendingCount ?? 0;
  const approvedCount = counts?.approvedCount ?? 0;
  const rejectedCount = counts?.rejectedCount ?? 0;

  const stats = [
    {
      label: "Pending Check",
      value: pendingCheckCount.toString(),
      icon: <Assignment />,
      color: theme.palette.warning.main,
      onClick: handlePendingCheckTasksClick,
    },
    {
      label: "Approved",
      value: approvedCount.toString(),
      icon: <CheckCircle />,
      color: theme.palette.success.main,
      onClick: handleApprovedCheckTasksClick,
    },
    {
      label: "Rejected",
      value: rejectedCount.toString(),
      icon: <Cancel />,
      color: theme.palette.error.main,
      onClick: handleRejectedCheckTasksClick,
    },
  ];

  return (
    <Box>
      {!pendingCheckTasksOpen &&
        !approvedCheckTasksOpen &&
        !rejectedCheckTasksOpen ? (
        <>
          {/* Main Dashboard View */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Checker Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Verify and validate data entries
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: `0 4px 20px ${alpha(
                      theme.palette.common.black,
                      0.08
                    )}`,
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 8px 30px ${alpha(
                        theme.palette.common.black,
                        0.12
                      )}`,
                    },
                  }}
                  onClick={stat.onClick}
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
                Checker Role
              </Typography>
              <Typography variant="body1" paragraph>
                Review and verify data entries created by makers.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Review pending entries
                <br />
                • Approve or reject entries
                <br />• Provide feedback to makers
              </Typography>
            </CardContent>
          </Card>
        </>
      ) : pendingCheckTasksOpen ? (
        <>
          {/* Pending Check Tasks View */}
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
                Pending Check Tasks
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Review and verify pending tasks
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={handleClosePendingCheckTasksDialog}
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
            {pendingCheckTasksLoading ? (
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
                  Loading Pending Check Tasks...
                </Typography>
              </Box>
            ) : pendingCheckTasksError ? (
              <Box sx={{ p: 4 }}>
                <Alert severity="error">{pendingCheckTasksError}</Alert>
              </Box>
            ) : pendingCheckTasks.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 12 }}>
                <Assignment
                  sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No pending check tasks
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All tasks are completed or verified
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
                          Maker Name
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
                    {pendingCheckTasks.map((task, index) => (
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
                          <Typography variant="body2">
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
                          <Typography variant="body2">
                            {task.maker || "-"}
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
      ) : approvedCheckTasksOpen ? (
        <>
          {/* Approved Check Tasks View */}
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
                Approved Check Tasks
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View your approved tasks
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={handleCloseApprovedCheckTasksDialog}
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
            {approvedCheckTasksLoading ? (
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
                  Loading Approved Check Tasks...
                </Typography>
              </Box>
            ) : approvedCheckTasksError ? (
              <Box sx={{ p: 4 }}>
                <Alert severity="error">{approvedCheckTasksError}</Alert>
              </Box>
            ) : approvedCheckTasks.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 12 }}>
                <Assignment
                  sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No approved check tasks
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You don't have any approved check tasks yet
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
                    {approvedCheckTasks.map((task, index) => (
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
                          <Typography variant="body2">
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
      ) : rejectedCheckTasksOpen ? (
        <>
          {/* Rejected Check Tasks View */}
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
                Rejected Check Tasks
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View your rejected check tasks
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={handleCloseRejectedCheckTasksDialog}
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
            {rejectedCheckTasksLoading ? (
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
                  Loading Rejected Check Tasks...
                </Typography>
              </Box>
            ) : rejectedCheckTasksError ? (
              <Box sx={{ p: 4 }}>
                <Alert severity="error">{rejectedCheckTasksError}</Alert>
              </Box>
            ) : rejectedCheckTasks.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 12 }}>
                <Assignment
                  sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No rejected check tasks
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You don't have any rejected check tasks
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
                          Site Name
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Department
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Due Date
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rejectedCheckTasks.map((task, index) => (
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
                          <TableCell>
                            <Typography variant="body2">
                              {task.siteName || "-"}
                            </Typography>
                          </TableCell>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {task.dueDate
                              ? new Date(task.dueDate).toLocaleDateString()
                              : "-"}
                          </Typography>
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

      {/* Approve Check Task Dialog */}
      <Dialog
        open={approveDialogOpen}
        onClose={handleCloseApproveDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: "1.2rem" }}>
          Approve Check Task
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
            label="Approval Remarks"
            placeholder="Enter your remarks for approving this task..."
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

      {/* Reject Check Task Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={handleCloseRejectDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: "1.2rem" }}>
          Reject Check Task
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
      <TaskMovementDialog
        open={taskMovementDialogOpen}
        onClose={handleCloseTaskMovementDialog}
        task={selectedTask}
      />

    </Box>
  );
};

export default CheckerDashboard;
