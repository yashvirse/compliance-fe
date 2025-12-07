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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Edit,
  PendingActions,
  CheckCircle,
  Assignment,
  Cancel,
  Close as CloseIcon
} from '@mui/icons-material';
import { fetchAssignedTasks, clearError } from './makerslice/MakerDashboard.Slice';
import { fetchTaskCount } from './makerslice/Dashboard.Slice';
import {
  selectAssignedTasks,
  selectMakerDashboardLoading,
  selectMakerDashboardError
} from './makerslice/MakerDashboard.Selector';
import {
  selectTaskCounts,
  selectDashboardLoading,
  selectDashboardError
} from './makerslice/Dashboard.Selector';
import { selectUser } from '../login/slice/Login.selector';

const MakerDashboard: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const assignedTasks = useSelector(selectAssignedTasks);
  const loading = useSelector(selectMakerDashboardLoading);
  const error = useSelector(selectMakerDashboardError);
  const counts = useSelector(selectTaskCounts);
  const countsLoading = useSelector(selectDashboardLoading);
  const countsError = useSelector(selectDashboardError);

  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  const handleTotalTasksClick = async () => {
    if (user?.id) {
      await dispatch(fetchAssignedTasks(user.id));
      setTaskDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setTaskDialogOpen(false);
    dispatch(clearError());
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
debugger
  const stats = [
    { label: 'Total Tasks', value: totalCount.toString(), icon: <Assignment />, color: theme.palette.info.main },
    { label: 'Pending', value: pendingCount.toString(), icon: <PendingActions />, color: theme.palette.warning.main },
    { label: 'Approved', value: approvedCount.toString(), icon: <CheckCircle />, color: theme.palette.success.main },
    { label: 'Rejected', value: rejectedCount.toString(), icon: <Cancel />, color: theme.palette.error.main },
  ];

  return (
    <Box>
      {!taskDialogOpen ? (
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Maker Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create and manage data entries
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
                  onClick={() => stat.label === 'Total Tasks' && handleTotalTasksClick()}
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
                • Create new data entries
                <br />
                • Edit draft entries
                <br />• Submit for checker review
              </Typography>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Task List View - Full Screen like Master Pages */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Total Assigned Tasks
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View all tasks assigned to you
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

export default MakerDashboard;
