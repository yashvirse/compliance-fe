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
} from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import {
  CheckCircle,
  Assessment,
  Cancel,
  Close as CloseIcon,
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

const AuditorDashboard: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);

  const counts = useSelector(selectTaskCounts);
  const loading = useSelector(selectAuditorDashboardLoading);
  const error = useSelector(selectAuditorDashboardError);

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
    setApproveDialogOpen(true);
  };

  const handleRejectClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setRemark("");
    setRejectDialogOpen(true);
  };
  const handleCloseApproveDialog = () => {
    setApproveDialogOpen(false);
    setSelectedTaskId(null);
    setRemark("");
  };

  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
    setSelectedTaskId(null);
    setRemark("");
  };
  const handleConfirmApprove = async () => {
    if (selectedTaskId && remark.trim()) {
      await dispatch(approveCheckTask({ taskID: selectedTaskId, remark }));
      setApproveDialogOpen(false);
      setRemark("");
      setSelectedTaskId(null);
      if (user?.id) {
        dispatch(fetchPendingTasks(user.id));
        dispatch(fetchTaskCount(user.id));
      }
    }
  };

  const handleConfirmReject = async () => {
    if (selectedTaskId && remark.trim()) {
      await dispatch(rejectCheckTask({ taskID: selectedTaskId, remark }));
      setRejectDialogOpen(false);
      setRemark("");
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

  const pendingCount = counts?.pendingCount ?? 0;
  const approvedCount = counts?.approvedCount ?? 0;
  const rejectedCount = counts?.rejectedCount ?? 0;

  const stats = [
    {
      label: "Pending Review",
      value: pendingCount.toString(),
      icon: <Assessment />,
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

  // Column definitions for CommonDataTable
  const pendingTasksColumns: GridColDef[] = React.useMemo(
    () => [
      { field: "activityName", headerName: "Activity Name", flex: 1.2, minWidth: 150 },
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
      { field: "currentUser", headerName: "Current User", flex: 0.8, minWidth: 100 },
      { field: "siteName", headerName: "Site Name", flex: 1, minWidth: 100 },
      {
        field: "dueDate",
        headerName: "Due Date",
        flex: 1,
        minWidth: 100,
        renderCell: (params) =>
          params.value ? new Date(params.value).toLocaleDateString() : "-",
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1.2,
        minWidth: 150,
        sortable: false,
        renderCell: (params) => (
          <Box sx={{ display: "flex", gap: 1 }}>
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
              onClick={() => handleApproveClick(params.row.tblId)}
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
              onClick={() => handleRejectClick(params.row.tblId)}
            >
              Reject
            </Button>
          </Box>
        ),
      },
    ],
    [theme],
  );

  const approvedTasksColumns: GridColDef[] = React.useMemo(
    () => [
      { field: "activityName", headerName: "Activity Name", flex: 1.2, minWidth: 150 },
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
              bgcolor: alpha(theme.palette.success.main, 0.1),
              color: theme.palette.success.main,
            }}
          />
        ),
      },
      { field: "siteName", headerName: "Site Name", flex: 1, minWidth: 100 },
      {
        field: "dueDate",
        headerName: "Due Date",
        flex: 1,
        minWidth: 100,
        renderCell: (params) =>
          params.value ? new Date(params.value).toLocaleDateString() : "-",
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 0.8,
        minWidth: 100,
        sortable: false,
        renderCell: (params) => (
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
          >
            View
          </Button>
        ),
      },
    ],
    [theme],
  );

  const rejectedTasksColumns: GridColDef[] = React.useMemo(
    () => [
      { field: "activityName", headerName: "Activity Name", flex: 1.2, minWidth: 150 },
      { field: "actName", headerName: "Act Name", flex: 1, minWidth: 100 },
      { field: "siteName", headerName: "Site Name", flex: 1, minWidth: 100 },
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
        field: "actions",
        headerName: "Actions",
        flex: 0.8,
        minWidth: 100,
        sortable: false,
        renderCell: (params) => (
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
          >
            View
          </Button>
        ),
      },
    ],
    [theme],
  );

  return (
    <Box>
      {!pendingTasksOpen && !approvedTasksOpen && !rejectedTasksOpen ? (
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
                0.08
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
                Pending Tasks for Review
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Review and take action on pending tasks
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={handleClosePending}
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
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={handleCloseApproved}
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
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={handleCloseRejected}
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

export default AuditorDashboard;
