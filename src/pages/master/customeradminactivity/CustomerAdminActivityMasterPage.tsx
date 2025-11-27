import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../../../app/store';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  CircularProgress,
  Alert,
  Snackbar,
  useTheme,
  alpha,
  Chip,
  Tooltip,
  Button
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { fetchCompanyActivityList, clearError } from './slice/CustomerAdminActivity.Slice';
import {
  selectActivityMasterLoading,
  selectActivityMasterError,
  selectGroupedActivityMasters
} from './slice/CustomerAdminActivity.Selector';

const CustomerAdminActivityMasterPage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const loading = useSelector(selectActivityMasterLoading);
  const error = useSelector(selectActivityMasterError);
  const groupedActivities = useSelector(selectGroupedActivityMasters);

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    dispatch(fetchCompanyActivityList());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setShowSnackbar(true);
    }
  }, [error]);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    dispatch(clearError());
  };

  const toggleRow = (key: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleEdit = (actId: string) => {
    // TODO: Implement edit functionality
    console.log('Edit activity:', actId);
  };

  const handleDelete = (actId: string) => {
    // TODO: Implement delete functionality
    console.log('Delete activity:', actId);
  };

  const handleAddActivity = () => {
    // TODO: Navigate to add activity page
    console.log('Add activity');
  };

  const handleImportActivity = () => {
    navigate('/dashboard/master/customeradminactivity/import');
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column',
          gap: 2 
        }}
      >
        <CircularProgress size={50} />
        <Typography variant="body1" color="text.secondary">
          Loading Activity Masters...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Activity Master
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage activities grouped by Act and Department
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={handleImportActivity}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            Import Activity
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddActivity}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
            }}
          >
            Add Activity
          </Button>
        </Box>
      </Box>

      {/* Main Table */}
      <Paper
        sx={{
          borderRadius: 3,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
          overflow: 'hidden'
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableCell sx={{ width: 50 }} />
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Act Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Department Name
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupedActivities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 8 }}>
                    <Typography variant="body1" color="text.secondary">
                      No activity masters found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                groupedActivities.map((group) => {
                  const rowKey = `${group.actName}-${group.departmentName}`;
                  const isExpanded = expandedRows.has(rowKey);

                  return (
                    <React.Fragment key={rowKey}>
                      {/* Parent Row */}
                      <TableRow 
                        hover
                        sx={{ 
                          cursor: 'pointer',
                          '& > *': { borderBottom: 'unset' },
                          bgcolor: isExpanded ? alpha(theme.palette.primary.main, 0.02) : 'inherit',
                          transition: 'background-color 0.2s'
                        }}
                        onClick={() => toggleRow(rowKey)}
                      >
                        <TableCell>
                          <IconButton 
                            size="small"
                            sx={{
                              transition: 'transform 0.2s',
                              transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'
                            }}
                          >
                            <KeyboardArrowDownIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {group.actName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={group.departmentName} 
                            size="small"
                            sx={{ 
                              bgcolor: alpha(theme.palette.info.main, 0.1),
                              color: theme.palette.info.main,
                              fontWeight: 500,
                              borderRadius: 2
                            }}
                          />
                        </TableCell>
                      </TableRow>

                      {/* Nested Table Row */}
                      <TableRow>
                        <TableCell 
                          style={{ paddingBottom: 0, paddingTop: 0 }} 
                          colSpan={3}
                        >
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box 
                              sx={{ 
                                margin: 2,
                                borderRadius: 2,
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                overflow: 'hidden'
                              }}
                            >
                              <Box 
                                sx={{ 
                                  bgcolor: alpha(theme.palette.grey[500], 0.03),
                                  px: 2,
                                  py: 1.5,
                                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                                }}
                              >
                                <Typography variant="subtitle2" fontWeight={600}>
                                  Activities ({group.activities.length})
                                </Typography>
                              </Box>
                              <Table size="small">
                                <TableHead>
                                  <TableRow sx={{ bgcolor: alpha(theme.palette.grey[500], 0.02) }}>
                                    <TableCell>
                                      <Typography variant="caption" fontWeight={600}>
                                        Activity Name
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="caption" fontWeight={600}>
                                        Description
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="caption" fontWeight={600}>
                                        Frequency
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography variant="caption" fontWeight={600}>
                                        Due Day
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography variant="caption" fontWeight={600}>
                                        Grace Days
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="caption" fontWeight={600}>
                                        Reminder Date
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{ width: 120 }}>
                                      <Typography variant="caption" fontWeight={600}>
                                        Actions
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {group.activities.map((activity) => (
                                    <TableRow 
                                      key={activity.activityId}
                                      hover
                                      sx={{
                                        '&:last-child td': { borderBottom: 0 }
                                      }}
                                    >
                                      <TableCell>
                                        <Typography variant="body2">
                                          {activity.activityName}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                          {activity.description}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Chip 
                                          label={activity.frequency || 'N/A'} 
                                          size="small"
                                          color="primary"
                                          variant="outlined"
                                        />
                                      </TableCell>
                                      <TableCell align="center">
                                        <Typography variant="body2">
                                          {activity.dueDay || '-'}
                                        </Typography>
                                      </TableCell>
                                      <TableCell align="center">
                                        <Typography variant="body2">
                                          {activity.gracePeriodDay || '-'}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Typography variant="body2">
                                          {activity.reminderDay 
                                            ? new Date(activity.reminderDay).toLocaleDateString('en-GB', { 
                                                day: '2-digit', 
                                                month: 'short', 
                                                year: 'numeric' 
                                              })
                                            : '-'}
                                        </Typography>
                                      </TableCell>
                                      <TableCell align="center">
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                          <Tooltip title="Edit Activity">
                                            <IconButton
                                              size="small"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(activity.activityId);
                                              }}
                                              sx={{
                                                color: theme.palette.primary.main,
                                                '&:hover': {
                                                  bgcolor: alpha(theme.palette.primary.main, 0.1)
                                                }
                                              }}
                                            >
                                              <EditIcon fontSize="small" />
                                            </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Delete Activity">
                                            <IconButton
                                              size="small"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(activity.activityId);
                                              }}
                                              sx={{
                                                color: theme.palette.error.main,
                                                '&:hover': {
                                                  bgcolor: alpha(theme.palette.error.main, 0.1)
                                                }
                                              }}
                                            >
                                              <DeleteIcon fontSize="small" />
                                            </IconButton>
                                          </Tooltip>
                                        </Box>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Error Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error || 'An error occurred'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomerAdminActivityMasterPage;
