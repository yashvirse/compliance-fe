import React, { useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { HourglassEmpty, CheckCircle, Cancel as CancelIcon, Close as CloseIcon, AssignmentTwoTone as Assignment, Visibility as EyeIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../app/store';
import { selectUser } from '../login/slice/Login.selector';
import {
  fetchReviewerTaskCount,
  fetchPendingReviewTasks,
  fetchApprovedReviewTasks,
  fetchRejectedReviewTasks,
  approveReviewTask,
  rejectReviewTask,
} from './reviewerslice/ReviewerDashboard.Slice';
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
} from './reviewerslice/ReviewerDashboard.Selector';

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
  const [remark, setRemark] = useState('');

  const pendingCount = useSelector(selectReviewerPendingCount);
  const approvedCount = useSelector(selectReviewerApprovedCount);
  const rejectedCount = useSelector(selectReviewerRejectedCount);
  const pendingReviewTasks = useSelector(selectPendingReviewTasks);
  const approvedReviewTasks = useSelector(selectApprovedReviewTasks);
  const rejectedReviewTasks = useSelector(selectRejectedReviewTasks);
  const pendingReviewTasksLoading = useSelector(selectPendingReviewTasksLoading);
  const approvedReviewTasksLoading = useSelector(selectApprovedReviewTasksLoading);
  const rejectedReviewTasksLoading = useSelector(selectRejectedReviewTasksLoading);
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
    setRemark('');
    setApproveDialogOpen(true);
  };

  // Handle reject click
  const handleRejectClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setRemark('');
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
      setRemark('');
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
      setRemark('');
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
      label: 'Pending Review',
      value: pendingCount,
      icon: <HourglassEmpty />,
      color: theme.palette.warning.main,
      onClick: handlePendingReviewTasksClick,
    },
    {
      label: 'Approved',
      value: approvedCount,
      icon: <CheckCircle />,
      color: theme.palette.success.main,
      onClick: handleApprovedReviewTasksClick,
    },
    {
      label: 'Rejected',
      value: rejectedCount,
      icon: <CancelIcon />,
      color: theme.palette.error.main,
      onClick: handleRejectedReviewTasksClick,
    },
  ];

  // Render tasks table
  const renderTasksTable = (tasks: any[], isLoading: boolean, hasActions: boolean = false, hasViewButton: boolean = false) => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (!tasks || tasks.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Assignment sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            No tasks to display
          </Typography>
        </Box>
      );
    }

    return (
      <TableContainer component={Box} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
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
                  Due Date
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Maker
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Checker
                </Typography>
              </TableCell>
              {hasActions && (
                <TableCell align="center">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Actions
                  </Typography>
                </TableCell>
              )}
              {hasViewButton && (
                <TableCell align="center">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Actions
                  </Typography>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task, index) => (
              <TableRow
                key={task.tblId || index}
                hover
                sx={{ '&:last-child td': { borderBottom: 0 } }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {task.activityName}
                  </Typography>
                  {task.description && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 0.5 }}
                    >
                      {task.description}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{task.actName}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{task.departmentName}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{task.dueDate}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{task.maker}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{task.checker}</Typography>
                </TableCell>
                {hasActions && (
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleApproveClick(task.tblId)}
                        disabled={taskActionsLoading}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleRejectClick(task.tblId)}
                        disabled={taskActionsLoading}
                      >
                        Reject
                      </Button>
                    </Box>
                  </TableCell>
                )}
                {hasViewButton && (
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="text"
                      startIcon={<EyeIcon />}
                      onClick={() => handleViewTaskMovement(task)}
                      sx={{
                        color: theme.palette.primary.main,
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        }
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box>
      {/* Dashboard View - Show stat cards */}
      {!pendingReviewTasksOpen && !approvedReviewTasksOpen && !rejectedReviewTasksOpen && (
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
                    boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: `0 8px 30px ${alpha(theme.palette.common.black, 0.15)}`,
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
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

          <Card sx={{ borderRadius: 3, boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}` }}>
            <CardContent sx={{ p: 3 }}>
              {renderTasksTable(pendingReviewTasks, pendingReviewTasksLoading, true)}
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Approved Review Tasks Screen - Full Page */}
      {approvedReviewTasksOpen && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
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

          <Card sx={{ borderRadius: 3, boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}` }}>
            <CardContent sx={{ p: 3 }}>
              {renderTasksTable(approvedReviewTasks, approvedReviewTasksLoading, false, true)}
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Rejected Review Tasks Screen - Full Page */}
      {rejectedReviewTasksOpen && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
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

          <Card sx={{ borderRadius: 3, boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}` }}>
            <CardContent sx={{ p: 3 }}>
              {renderTasksTable(rejectedReviewTasks, rejectedReviewTasksLoading, false)}
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Approve Remarks Dialog */}
      <Dialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)} maxWidth="sm" fullWidth>
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
            {taskActionsLoading ? <CircularProgress size={24} /> : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Remarks Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
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
            {taskActionsLoading ? <CircularProgress size={24} /> : 'Reject'}
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
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.3rem', pb: 1 }}>
          Task Movement Details
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          {selectedTask && (
            <Box>
              <Box sx={{ mb: 3, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Activity Information
                </Typography>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Activity Name
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedTask.activityName}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Act Name
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedTask.actName}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Department
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedTask.departmentName}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Due Date
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : '-'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ mt: 3, mb: 2 }}>
                Task Movement History
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {selectedTask.details && selectedTask.details.length > 0 ? (
                  selectedTask.details.map((detail: any, index: number) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        bgcolor: alpha(
                          detail.status === 'Approved'
                            ? theme.palette.success.main
                            : detail.status === 'Rejected'
                            ? theme.palette.error.main
                            : theme.palette.warning.main,
                          0.05
                        ),
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {detail.userName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {index === 0 ? 'Maker' : index === 1 ? 'Checker' : 'Reviewer'}
                          </Typography>
                        </Box>
                        <Box 
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: detail.status === 'Approved' ? alpha(theme.palette.success.main, 0.2) : 
                                     detail.status === 'Rejected' ? alpha(theme.palette.error.main, 0.2) : 
                                     alpha(theme.palette.warning.main, 0.2),
                            color: detail.status === 'Approved' ? theme.palette.success.dark : 
                                   detail.status === 'Rejected' ? theme.palette.error.dark : 
                                   theme.palette.warning.dark,
                          }}
                        >
                          <Typography variant="caption" fontWeight={600}>
                            {detail.status}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2, my: 2 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                            In Date
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {detail.inDate && detail.inDate !== '0001-01-01T00:00:00Z'
                              ? new Date(detail.inDate).toLocaleString()
                              : '-'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                            Out Date
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {detail.outDate && detail.outDate !== '0001-01-01T00:00:00Z'
                              ? new Date(detail.outDate).toLocaleString()
                              : '-'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                            P.TAT (Days)
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {detail.pTat || 0}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                            A.TAT (Days)
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {detail.aTat || 0}
                          </Typography>
                        </Box>
                      </Box>

                      {detail.remarks && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                            Remarks
                          </Typography>
                          <Typography variant="body2">
                            {detail.remarks}
                          </Typography>
                        </Box>
                      )}

                      {detail.rejectionRemark && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                          <Typography variant="caption" color="error" display="block" sx={{ mb: 0.5, fontWeight: 600 }}>
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
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
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

export default ReviewerDashboard;
