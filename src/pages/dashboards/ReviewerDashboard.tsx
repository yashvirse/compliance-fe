import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  useTheme,
  alpha,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import {
  HourglassEmpty,
  CheckCircle,
  Cancel as CancelIcon,
  Close as CloseIcon,
  AssignmentTwoTone as Assignment,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../app/store";
import { selectUser } from "../login/slice/Login.selector";
import {
  fetchReviewerTaskCount,
  fetchPendingReviewTasks,
  fetchApprovedReviewTasks,
  fetchRejectedReviewTasks,
  approveReviewTask,
  rejectReviewTask,
} from "./reviewerslice/ReviewerDashboard.Slice";
import {
  selectReviewerPendingCount,
  selectReviewerApprovedCount,
  selectReviewerRejectedCount,
  selectPendingReviewTasks,
  selectApprovedReviewTasks,
  selectRejectedReviewTasks,
  selectPendingReviewTasksLoading,
  selectApprovedReviewTasksLoading,
  selectRejectedReviewTasksLoading,
  selectReviewerTaskActionsLoading,
} from "./reviewerslice/ReviewerDashboard.Selector";
import TaskMovementDialog from "../../components/common/TaskMovementDialog";
import CommonDataTable from "../../components/common/CommonDataTable";

const ReviewerDashboard: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);

  const [pendingReviewTasksOpen, setPendingReviewTasksOpen] = useState(false);
  const [approvedReviewTasksOpen, setApprovedReviewTasksOpen] = useState(false);
  const [rejectedReviewTasksOpen, setRejectedReviewTasksOpen] = useState(false);
  const [taskMovementDialogOpen, setTaskMovementDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [remark, setRemark] = useState("");

  const pendingCount = useSelector(selectReviewerPendingCount);
  const approvedCount = useSelector(selectReviewerApprovedCount);
  const rejectedCount = useSelector(selectReviewerRejectedCount);
  const pendingReviewTasks = useSelector(selectPendingReviewTasks);
  const approvedReviewTasks = useSelector(selectApprovedReviewTasks);
  const rejectedReviewTasks = useSelector(selectRejectedReviewTasks);
  const pendingReviewTasksLoading = useSelector(
    selectPendingReviewTasksLoading
  );
  const approvedReviewTasksLoading = useSelector(
    selectApprovedReviewTasksLoading
  );
  const rejectedReviewTasksLoading = useSelector(
    selectRejectedReviewTasksLoading
  );
  const taskActionsLoading = useSelector(selectReviewerTaskActionsLoading);

  // Initial data fetch - only fetch counts
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchReviewerTaskCount(user.id));
    }
  }, [dispatch, user?.id]);

  // Handle pending review tasks click
  const handlePendingReviewTasksClick = async () => {
    if (user?.id) {
      await dispatch(fetchPendingReviewTasks(user.id));
      setPendingReviewTasksOpen(true);
    }
  };

  // Handle approved review tasks click
  const handleApprovedReviewTasksClick = async () => {
    if (user?.id) {
      await dispatch(fetchApprovedReviewTasks(user.id));
      setApprovedReviewTasksOpen(true);
    }
  };

  // Handle rejected review tasks click
  const handleRejectedReviewTasksClick = async () => {
    if (user?.id) {
      await dispatch(fetchRejectedReviewTasks(user.id));
      setRejectedReviewTasksOpen(true);
    }
  };

  // Close pending review tasks screen
  const handleClosePendingReviewTasksScreen = () => {
    setPendingReviewTasksOpen(false);
    if (user?.id) {
      dispatch(fetchReviewerTaskCount(user.id));
    }
  };

  // Close approved review tasks screen
  const handleCloseApprovedReviewTasksScreen = () => {
    setApprovedReviewTasksOpen(false);
    if (user?.id) {
      dispatch(fetchReviewerTaskCount(user.id));
    }
  };

  // Close rejected review tasks screen
  const handleCloseRejectedReviewTasksScreen = () => {
    setRejectedReviewTasksOpen(false);
    if (user?.id) {
      dispatch(fetchReviewerTaskCount(user.id));
    }
  };

  // Handle approve click
  const handleApproveClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setRemark("");
    setApproveDialogOpen(true);
  };

  // Handle reject click
  const handleRejectClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setRemark("");
    setRejectDialogOpen(true);
  };

  // Handle view task movement
  const handleViewTaskMovement = (task: any) => {
    setSelectedTask(task);
    setTaskMovementDialogOpen(true);
  };

  // Handle close task movement dialog
  const handleCloseTaskMovementDialog = () => {
    setTaskMovementDialogOpen(false);
    setSelectedTask(null);
  };

  // Confirm approve
  const handleConfirmApprove = async () => {
    if (selectedTaskId && remark.trim()) {
      await dispatch(approveReviewTask({ taskID: selectedTaskId, remark }));
      setApproveDialogOpen(false);
      setRemark("");
      setSelectedTaskId(null);
      // Refresh pending tasks
      if (user?.id) {
        await dispatch(fetchPendingReviewTasks(user.id));
        await dispatch(fetchReviewerTaskCount(user.id));
      }
    }
  };

  // Confirm reject
  const handleConfirmReject = async () => {
    if (selectedTaskId && remark.trim()) {
      await dispatch(rejectReviewTask({ taskID: selectedTaskId, remark }));
      setRejectDialogOpen(false);
      setRemark("");
      setSelectedTaskId(null);
      // Refresh pending tasks
      if (user?.id) {
        await dispatch(fetchPendingReviewTasks(user.id));
        await dispatch(fetchReviewerTaskCount(user.id));
      }
    }
  };

  const stats = [
    {
      label: "Pending Review",
      value: pendingCount,
      icon: <HourglassEmpty />,
      color: theme.palette.warning.main,
      onClick: handlePendingReviewTasksClick,
    },
    {
      label: "Approved",
      value: approvedCount,
      icon: <CheckCircle />,
      color: theme.palette.success.main,
      onClick: handleApprovedReviewTasksClick,
    },
    {
      label: "Rejected",
      value: rejectedCount,
      icon: <CancelIcon />,
      color: theme.palette.error.main,
      onClick: handleRejectedReviewTasksClick,
    },
  ];

  // Column definitions for CommonDataTable
  const pendingTasksColumns: GridColDef[] = React.useMemo(
    () => [
      { field: "activityName", headerName: "Activity Name", flex: 1.2, minWidth: 150 },
      { field: "actName", headerName: "Act Name", flex: 1, minWidth: 100 },
      { field: "departmentName", headerName: "Department", flex: 1, minWidth: 120 },
      { field: "siteName", headerName: "Site Name", flex: 1, minWidth: 100 },
      { field: "dueDate", headerName: "Due Date", flex: 0.8, minWidth: 100 },
      { field: "maker", headerName: "Maker", flex: 0.8, minWidth: 80 },
      { field: "checker", headerName: "Checker", flex: 0.8, minWidth: 80 },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1.2,
        minWidth: 150,
        sortable: false,
        renderCell: (params) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => handleApproveClick(params.row.tblId)}
              disabled={taskActionsLoading}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleRejectClick(params.row.tblId)}
              disabled={taskActionsLoading}
            >
              Reject
            </Button>
          </Box>
        ),
      },
    ],
    [theme, taskActionsLoading],
  );

  const approvedTasksColumns: GridColDef[] = React.useMemo(
    () => [
      { field: "activityName", headerName: "Activity Name", flex: 1.2, minWidth: 150 },
      { field: "actName", headerName: "Act Name", flex: 1, minWidth: 100 },
      { field: "departmentName", headerName: "Department", flex: 1, minWidth: 120 },
      { field: "siteName", headerName: "Site Name", flex: 1, minWidth: 100 },
      { field: "dueDate", headerName: "Due Date", flex: 0.8, minWidth: 100 },
      { field: "maker", headerName: "Maker", flex: 0.8, minWidth: 80 },
      { field: "checker", headerName: "Checker", flex: 0.8, minWidth: 80 },
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
      { field: "departmentName", headerName: "Department", flex: 1, minWidth: 120 },
      { field: "siteName", headerName: "Site Name", flex: 1, minWidth: 100 },
      { field: "dueDate", headerName: "Due Date", flex: 0.8, minWidth: 100 },
      { field: "maker", headerName: "Maker", flex: 0.8, minWidth: 80 },
      { field: "checker", headerName: "Checker", flex: 0.8, minWidth: 80 },
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
      {/* Dashboard View - Show stat cards */}
      {!pendingReviewTasksOpen &&
        !approvedReviewTasksOpen &&
        !rejectedReviewTasksOpen && (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Reviewer Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Final review and approval workflow
              </Typography>
            </Box>

            {/* Stat Cards */}
            <Grid container spacing={3}>
              {stats.map((stat, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    onClick={stat.onClick}
                    sx={{
                      borderRadius: 3,
                      boxShadow: `0 4px 20px ${alpha(
                        theme.palette.common.black,
                        0.08
                      )}`,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: `0 8px 30px ${alpha(
                          theme.palette.common.black,
                          0.15
                        )}`,
                        transform: "translateY(-4px)",
                      },
                    }}
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
          </>
        )}

      {/* Pending Review Tasks Screen - Full Page */}
      {pendingReviewTasksOpen && (
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Pending Review Tasks
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Review and approve/reject pending tasks
              </Typography>
            </Box>
            <Button
              startIcon={<CloseIcon />}
              onClick={handleClosePendingReviewTasksScreen}
              variant="outlined"
            >
              Back
            </Button>
          </Box>

          <Card
            sx={{
              borderRadius: 3,
              boxShadow: `0 4px 20px ${alpha(
                theme.palette.common.black,
                0.08
              )}`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {pendingReviewTasksLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : pendingReviewTasks.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Assignment sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No pending review tasks
                  </Typography>
                </Box>
              ) : (
                <CommonDataTable
                  rows={pendingReviewTasks}
                  columns={pendingTasksColumns}
                  loading={pendingReviewTasksLoading}
                  getRowId={(row) => row.tblId}
                  autoHeight={true}
                />
              )}
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Approved Review Tasks Screen - Full Page */}
      {approvedReviewTasksOpen && (
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Approved Review Tasks
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tasks that have been approved
              </Typography>
            </Box>
            <Button
              startIcon={<CloseIcon />}
              onClick={handleCloseApprovedReviewTasksScreen}
              variant="outlined"
            >
              Back
            </Button>
          </Box>

          <Card
            sx={{
              borderRadius: 3,
              boxShadow: `0 4px 20px ${alpha(
                theme.palette.common.black,
                0.08
              )}`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {approvedReviewTasksLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : approvedReviewTasks.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Assignment sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No approved tasks
                  </Typography>
                </Box>
              ) : (
                <CommonDataTable
                  rows={approvedReviewTasks}
                  columns={approvedTasksColumns}
                  loading={approvedReviewTasksLoading}
                  getRowId={(row) => row.tblId}
                  autoHeight={true}
                />
              )}
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Rejected Review Tasks Screen - Full Page */}
      {rejectedReviewTasksOpen && (
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Rejected Review Tasks
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tasks that have been rejected
              </Typography>
            </Box>
            <Button
              startIcon={<CloseIcon />}
              onClick={handleCloseRejectedReviewTasksScreen}
              variant="outlined"
            >
              Back
            </Button>
          </Box>

          <Card
            sx={{
              borderRadius: 3,
              boxShadow: `0 4px 20px ${alpha(
                theme.palette.common.black,
                0.08
              )}`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {rejectedReviewTasksLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : rejectedReviewTasks.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Assignment sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No rejected tasks
                  </Typography>
                </Box>
              ) : (
                <CommonDataTable
                  rows={rejectedReviewTasks}
                  columns={rejectedTasksColumns}
                  loading={rejectedReviewTasksLoading}
                  getRowId={(row) => row.tblId}
                  autoHeight={true}
                />
              )}
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Approve Remarks Dialog */}
      <Dialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Approve Review Task</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            label="Remarks"
            multiline
            rows={4}
            fullWidth
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter your remarks here..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmApprove}
            variant="contained"
            color="success"
            disabled={!remark.trim() || taskActionsLoading}
          >
            {taskActionsLoading ? <CircularProgress size={24} /> : "Approve"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Remarks Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Review Task</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            label="Remarks"
            multiline
            rows={4}
            fullWidth
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter your remarks here..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmReject}
            variant="contained"
            color="error"
            disabled={!remark.trim() || taskActionsLoading}
          >
            {taskActionsLoading ? <CircularProgress size={24} /> : "Reject"}
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

export default ReviewerDashboard;
