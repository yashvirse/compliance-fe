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
  Paper,
  Chip,
  Tooltip,
  IconButton,
} from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import {
  HourglassEmpty,
  CheckCircle,
  Cancel as CancelIcon,
  Close as CloseIcon,
  Visibility as EyeIcon,
  ThumbUp as ApproveIcon,
  ThumbDown as RejectIcon,
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
  const [file, setFile] = useState<File | null>(null);

  const pendingCount = useSelector(selectReviewerPendingCount);
  const approvedCount = useSelector(selectReviewerApprovedCount);
  const rejectedCount = useSelector(selectReviewerRejectedCount);
  const pendingReviewTasks = useSelector(selectPendingReviewTasks);
  const approvedReviewTasks = useSelector(selectApprovedReviewTasks);
  const rejectedReviewTasks = useSelector(selectRejectedReviewTasks);
  const pendingReviewTasksLoading = useSelector(
    selectPendingReviewTasksLoading,
  );
  const approvedReviewTasksLoading = useSelector(
    selectApprovedReviewTasksLoading,
  );
  const rejectedReviewTasksLoading = useSelector(
    selectRejectedReviewTasksLoading,
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
    setFile(null);
    setApproveDialogOpen(true);
  };

  // Handle reject click
  const handleRejectClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setRemark("");
    setFile(null);
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
    if (selectedTaskId && remark.trim() && file) {
      await dispatch(
        approveReviewTask({ taskID: selectedTaskId, remark, file }),
      );
      setApproveDialogOpen(false);
      setRemark("");
      setFile(null);
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
    if (selectedTaskId && remark.trim() && file) {
      await dispatch(
        rejectReviewTask({ taskID: selectedTaskId, remark, file }),
      );
      setRejectDialogOpen(false);
      setRemark("");
      setFile(null);
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
      { field: "siteName", headerName: "Site Name", flex: 1, minWidth: 100 },
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
      {
        field: "activityName",
        headerName: "Activity Name",
        flex: 1.2,
        minWidth: 250,
      },
      { field: "actName", headerName: "Act Name", flex: 1, minWidth: 130 },
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
        flex: 0.8,
        minWidth: 70,
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
        minWidth: 80,
        sortable: false,
        renderCell: (params) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "left",
              height: "100%",
              gap: 1,
            }}
          >
            {/* Approve */}
            <Tooltip title="Approve Task" arrow>
              <IconButton
                size="small"
                onClick={() => handleApproveClick(params.row.tblId)}
                sx={{
                  color: theme.palette.success.main, // ✅ sirf icon color
                  "&:hover": {
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                  },
                }}
              >
                <ApproveIcon />
              </IconButton>
            </Tooltip>

            {/* Reject */}
            <Tooltip title="Reject Task" arrow>
              <IconButton
                size="small"
                onClick={() => handleRejectClick(params.row.tblId)}
                sx={{
                  color: theme.palette.error.main, // ✅ sirf icon color
                  "&:hover": {
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                  },
                }}
              >
                <RejectIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [theme, taskActionsLoading],
  );

  const approvedTasksColumns: GridColDef[] = React.useMemo(
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
      { field: "actName", headerName: "Act Name", flex: 1, minWidth: 130 },
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
      {
        field: "dueDate",
        headerName: "Due Date",
        flex: 0.8,
        minWidth: 70,
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
        minWidth: 80,
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
        width: 60,
        sortable: false,
        filterable: false,
        align: "left",
        headerAlign: "left",
        renderCell: (params) =>
          params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
      },
      { field: "siteName", headerName: "Site Name", flex: 1, minWidth: 120 },
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
              bgcolor: alpha(theme.palette.error.main, 0.1),
              color: theme.palette.error.main,
            }}
          />
        ),
      },
      {
        field: "dueDate",
        headerName: "Due Date",
        flex: 0.8,
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
        minWidth: 80,
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
                        0.08,
                      )}`,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: `0 8px 30px ${alpha(
                          theme.palette.common.black,
                          0.15,
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
                  Reviewer Role
                </Typography>
                <Typography variant="body1" paragraph>
                  Review and approve or reject submitted tasks based on
                  compliance requirements.
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
        )}

      {/* Pending Review Tasks Screen - Full Page */}
      {pendingReviewTasksOpen && (
        <>
          {/* Pending Review Tasks View */}
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
                approve/reject pending tasks
              </Typography>
            </Box>

            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={handleClosePendingReviewTasksScreen}
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
                0.08,
              )}`,
              overflow: "hidden",
            }}
          >
            {pendingReviewTasksLoading ? (
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
                  Loading Pending Review Tasks...
                </Typography>
              </Box>
            ) : pendingReviewTasks.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 12 }}>
                <Assignment
                  sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No pending review tasks
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All tasks are reviewed
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
          </Paper>
        </>
      )}

      {/* Approved Review Tasks Screen - Full Page */}
      {approvedReviewTasksOpen && (
        <>
          {/* Approved Review Tasks View */}
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
                Tasks that have been approved
              </Typography>
            </Box>

            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={handleCloseApprovedReviewTasksScreen}
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
                0.08,
              )}`,
              overflow: "hidden",
            }}
          >
            {approvedReviewTasksLoading ? (
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
                  Loading Approved Review Tasks...
                </Typography>
              </Box>
            ) : approvedReviewTasks.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 12 }}>
                <Assignment
                  sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No approved tasks
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No tasks have been approved yet
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
          </Paper>
        </>
      )}

      {/* Rejected Review Tasks Screen - Full Page */}
      {rejectedReviewTasksOpen && (
        <>
          {/* Rejected Review Tasks View */}
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
                Tasks that have been rejected
              </Typography>
            </Box>

            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={handleCloseRejectedReviewTasksScreen}
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
                0.08,
              )}`,
              overflow: "hidden",
            }}
          >
            {rejectedReviewTasksLoading ? (
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
                  Loading Rejected Review Tasks...
                </Typography>
              </Box>
            ) : rejectedReviewTasks.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 12 }}>
                <Assignment
                  sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No rejected tasks
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No tasks have been rejected
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
          </Paper>
        </>
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
