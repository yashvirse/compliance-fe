import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../app/store';
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
} from '@mui/material';
import {
  CheckCircle,
  Assignment,
  Cancel,
  Close as CloseIcon,
  ThumbUp as ApproveIcon,
  ThumbDown as RejectIcon
} from '@mui/icons-material';
import {
  fetchAssignedTasks,
  fetchTaskCount,
  approveTask,
  rejectTask,
  clearError,
  clearTaskActionError,
} from './makerslice/MakerDashboard.Slice';
import {
  selectAssignedTasks,
  selectMakerDashboardLoading,
  selectMakerDashboardError,
  selectTaskCounts,
  selectTaskActionsLoading,
  selectTaskActionsError,
} from './makerslice/MakerDashboard.Selector';
import { selectUser } from '../login/slice/Login.selector';

const MakerDashboard: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const assignedTasks = useSelector(selectAssignedTasks);
  const loading = useSelector(selectMakerDashboardLoading);
  const error = useSelector(selectMakerDashboardError);
  const counts = useSelector(selectTaskCounts);
  const taskActionsLoading = useSelector(selectTaskActionsLoading);
  const taskActionsError = useSelector(selectTaskActionsError);

  const [tasksOpen, setTasksOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [remark, setRemark] = useState('');

  const handleTotalTasksClick = async () => {
    if (user?.id) {
      await dispatch(fetchAssignedTasks(user.id));
      setTasksOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setTasksOpen(false);
    dispatch(clearError());
  };

  const handleApproveClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setRemark('');
    setApproveDialogOpen(true);
  };

  const handleRejectClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setRemark('');
    setRejectDialogOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (selectedTaskId && remark.trim()) {
      await dispatch(approveTask({ taskID: selectedTaskId, remark }));
      setApproveDialogOpen(false);
      setRemark('');
      setSelectedTaskId(null);
      // Refresh assigned tasks after approval
      if (user?.id) {
        dispatch(fetchAssignedTasks(user.id));
      }
    }
  };

  const handleConfirmReject = async () => {
    if (selectedTaskId && remark.trim()) {
      await dispatch(rejectTask({ taskID: selectedTaskId, remark }));
      setRejectDialogOpen(false);
      setRemark('');
      setSelectedTaskId(null);
      // Refresh assigned tasks after rejection
      if (user?.id) {
        dispatch(fetchAssignedTasks(user.id));
      }
    }
  };

  const handleCloseApproveDialog = () => {
    setApproveDialogOpen(false);
    setRemark('');
    setSelectedTaskId(null);
    dispatch(clearTaskActionError());
  };

  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
    setRemark('');
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
    { label: 'Total Tasks', value: totalCount.toString(), icon: <Assignment />, color: theme.palette.info.main },
    { label: 'Pending', value: pendingCount.toString(), icon: <Assignment />, color: theme.palette.warning.main },
    { label: 'Approved', value: approvedCount.toString(), icon: <CheckCircle />, color: theme.palette.success.main },
    { label: 'Rejected', value: rejectedCount.toString(), icon: <Cancel />, color: theme.palette.error.main },
  ];

  return (
    <Box>
      {!tasksOpen ? (
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
                    boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
                    cursor: stat.label === 'Total Tasks' ? 'pointer' : 'default',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': stat.label === 'Total Tasks' ? {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 30px ${alpha(theme.palette.common.black, 0.12)}`,
                    } : {},
                  }}
                  onClick={() => {
                    if (stat.label === 'Total Tasks') handleTotalTasksClick();
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

          <Card
            sx={{
              mt: 3,
              borderRadius: 3,
              boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
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
      ) : (
        <>
          {/* Assigned Tasks View */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Assigned Tasks
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage and take action on your assigned tasks
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={handleCloseDialog}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
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
              boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
              overflow: 'hidden'
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400, flexDirection: 'column', gap: 2 }}>
                <CircularProgress size={50} />
                <Typography variant="body1" color="text.secondary">
                  Loading Assigned Tasks...
                </Typography>
              </Box>
            ) : error ? (
              <Box sx={{ p: 4 }}>
                <Alert severity="error">
                  {error}
                </Alert>
              </Box>
            ) : assignedTasks.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 12 }}>
                <Assignment sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No tasks assigned yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You don't have any assigned tasks at the moment
                </Typography>
              </Box>
            ) : (
              <TableContainer>
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
                          Frequency
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="subtitle2" fontWeight={600}>
                          Due Day
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="subtitle2" fontWeight={600}>
                          Grace Days
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Checker
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Reviewer
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
                    {assignedTasks.map((task, index) => (
                      <TableRow 
                        key={task.activityId || index}
                        hover
                        sx={{ '&:last-child td': { borderBottom: 0 } }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {task.activityName}
                          </Typography>
                          {task.description && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
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
                              borderRadius: 2
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={task.frequency || 'N/A'} 
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {task.dueDay || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {task.gracePeriodDay || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {task.checker || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {task.reviewer || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              startIcon={<ApproveIcon />}
                              sx={{
                                borderRadius: 1.5,
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 2,
                                py: 1,
                              }}
                              onClick={() => handleApproveClick(task.activityId)}
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
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 2,
                                py: 1,
                              }}
                              onClick={() => handleRejectClick(task.activityId)}
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
      )}

      {/* Approve Task Dialog */}
      <Dialog
        open={approveDialogOpen}
        onClose={handleCloseApproveDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.2rem' }}>
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
            startIcon={taskActionsLoading ? <CircularProgress size={20} /> : <ApproveIcon />}
          >
            {taskActionsLoading ? 'Approving...' : 'Approve'}
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
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.2rem' }}>
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
            startIcon={taskActionsLoading ? <CircularProgress size={20} /> : <RejectIcon />}
          >
            {taskActionsLoading ? 'Rejecting...' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MakerDashboard;
