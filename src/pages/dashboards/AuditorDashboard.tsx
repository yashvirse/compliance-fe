import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../app/store';
import { Box, Typography, Card, CardContent, Grid, useTheme, alpha, CircularProgress, Alert, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { CheckCircle, Assessment, Cancel, Close as CloseIcon, Assignment } from '@mui/icons-material';
import { fetchTaskCount, fetchPendingTasks, clearError, clearPendingTasksError } from './auditorslice/AuditorDashboard.Slice';
import { selectTaskCounts, selectAuditorDashboardLoading, selectAuditorDashboardError, selectPendingTasks, selectPendingTasksLoading, selectPendingTasksError } from './auditorslice/AuditorDashboard.Selector';
import { selectUser } from '../login/slice/Login.selector';

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

  const [pendingTasksOpen, setPendingTasksOpen] = useState(false);

  const handlePendingTasksClick = async () => {
    if (user?.id) {
      await dispatch(fetchPendingTasks(user.id));
      setPendingTasksOpen(true);
    }
  };

  const handleClosePendingTasksDialog = () => {
    setPendingTasksOpen(false);
    // Refresh dashboard counts when returning to dashboard
    if (user?.id) {
      dispatch(fetchTaskCount(user.id));
    }
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

  const stats = [
    { label: 'Pending Review', value: pendingCount.toString(), icon: <Assessment />, color: theme.palette.warning.main, onClick: handlePendingTasksClick },
    { label: 'Approved', value: approvedCount.toString(), icon: <CheckCircle />, color: theme.palette.success.main },
    { label: 'Rejected', value: rejectedCount.toString(), icon: <Cancel />, color: theme.palette.error.main },
  ];

  return (
    <Box>
      {!pendingTasksOpen ? (
        <>
          {/* Main Dashboard View */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Auditor Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Review and manage tasks
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {stats.map((stat, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
                      cursor: stat.label === 'Pending Review' ? 'pointer' : 'default',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': stat.label === 'Pending Review' ? {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 30px ${alpha(theme.palette.common.black, 0.12)}`,
                      } : {},
                    }}
                    onClick={() => {
                      if (stat.label === 'Pending Review') handlePendingTasksClick();
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
          )}

          <Card
            sx={{
              mt: 3,
              borderRadius: 3,
              boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Auditor Role
              </Typography>
              <Typography variant="body1" paragraph>
                Review and approve or reject submitted tasks based on compliance requirements.
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
      ) : (
        <>
          {/* Pending Tasks View */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
              onClick={handleClosePendingTasksDialog}
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
            {pendingTasksLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400, flexDirection: 'column', gap: 2 }}>
                <CircularProgress size={50} />
                <Typography variant="body1" color="text.secondary">
                  Loading Pending Tasks...
                </Typography>
              </Box>
            ) : pendingTasksError ? (
              <Box sx={{ p: 4 }}>
                <Alert severity="error" onClose={() => dispatch(clearPendingTasksError())}>
                  {pendingTasksError}
                </Alert>
              </Box>
            ) : pendingTasks.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 12 }}>
                <Assignment sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No pending tasks
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All tasks have been reviewed
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
                          Current User
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Status
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
                    {pendingTasks.map((task) => (
                      <TableRow key={task.tblId} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>
                          <Typography variant="body2">
                            {task.activityName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {task.actName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {task.departmentName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {task.currentUserName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: theme.palette.warning.main, fontWeight: 600 }}>
                            {task.taskCurrentStatus}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(task.dueDate).toLocaleDateString()}
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
      )}
    </Box>
  );
};

export default AuditorDashboard;
