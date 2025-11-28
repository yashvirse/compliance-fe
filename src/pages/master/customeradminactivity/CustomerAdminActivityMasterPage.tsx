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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { fetchCompanyActivityList, fetchActivityById, updateActivity, deleteActivity, clearError } from './slice/CustomerAdminActivity.Slice';
import { fetchUserList } from '../customeradminuser/slice/CustomerAdminUser.Slice';
import {
  selectActivityMasterLoading,
  selectActivityMasterError,
  selectGroupedActivityMasters
} from './slice/CustomerAdminActivity.Selector';
import type { ActivityDetail } from './slice/CustomerAdminActivity.Type';

const CustomerAdminActivityMasterPage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const loading = useSelector(selectActivityMasterLoading);
  const error = useSelector(selectActivityMasterError);
  const groupedActivities = useSelector(selectGroupedActivityMasters);

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityDetail | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);
  const [userList, setUserList] = useState<Array<{userID: string, userName: string, userRole: string}>>([]);
  const [editFormData, setEditFormData] = useState({
    maker: '',
    checker: '',
    reviewer: '',
    auditor: '',
    frequency: '',
    dueDay: 0,
    gracePeriodDay: 0,
    reminderDay: 0
  });

  useEffect(() => {
    dispatch(fetchCompanyActivityList());
    fetchUsers();
  }, [dispatch]);

  const fetchUsers = async () => {
    try {
      const result = await dispatch(fetchUserList()).unwrap();
      setUserList(result);
    } catch (err) {
      console.error('Failed to fetch user list:', err);
    }
  };

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
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

  const handleEdit = async (actId: string) => {
    try {
      const activity = await dispatch(fetchActivityById(actId)).unwrap();
      setSelectedActivity(activity);
      setEditFormData({
        maker: activity.maker || '',
        checker: activity.checker || '',
        reviewer: activity.reviewer || '',
        auditor: activity.auditor || '',
        frequency: activity.frequency || '',
        dueDay: activity.dueDay || 0,
        gracePeriodDay: activity.gracePeriodDay || 0,
        reminderDay: activity.reminderDay || 0
      });
      setEditDialogOpen(true);
    } catch (err) {
      setSnackbarMessage('Failed to fetch activity details');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedActivity(null);
    setEditFormData({
      maker: '',
      checker: '',
      reviewer: '',
      auditor: '',
      frequency: '',
      dueDay: 0,
      gracePeriodDay: 0,
      reminderDay: 0
    });
  };

  const handleEditFormChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement> | any) => {
    setEditFormData(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleSaveEdit = async () => {
    if (!selectedActivity) return;

    try {
      await dispatch(updateActivity({
        activityId: selectedActivity.activityId,
        maker: editFormData.maker,
        checker: editFormData.checker,
        reviewer: editFormData.reviewer,
        auditor: editFormData.auditor,
        frequency: editFormData.frequency,
        dueDay: editFormData.dueDay,
        gracePeriodDay: editFormData.gracePeriodDay
      })).unwrap();
      
      setSnackbarMessage('Activity updated successfully');
      setSnackbarSeverity('success');
      setShowSnackbar(true);
      handleCloseEditDialog();
      dispatch(fetchCompanyActivityList());
    } catch (err) {
      setSnackbarMessage('Failed to update activity');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
    }
  };

  const handleDelete = (actId: string) => {
    setActivityToDelete(actId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!activityToDelete) return;

    try {
      await dispatch(deleteActivity(activityToDelete)).unwrap();
      setSnackbarMessage('Activity deleted successfully');
      setSnackbarSeverity('success');
      setShowSnackbar(true);
      setDeleteDialogOpen(false);
      setActivityToDelete(null);
      dispatch(fetchCompanyActivityList());
    } catch (err) {
      setSnackbarMessage('Failed to delete activity');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setActivityToDelete(null);
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
        <Box>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={handleImportActivity}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
            }}
          >
            Import Activity
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
                                    <TableCell align="center">
                                      <Typography variant="caption" fontWeight={600}>
                                        Reminder Day
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
                                      <TableCell align="center">
                                        <Typography variant="body2">
                                          {activity.reminderDay !== null && activity.reminderDay !== undefined ? activity.reminderDay : '-'}
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

      {/* Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Edit Activity Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, borderBottom: `1px solid ${theme.palette.divider}` }}>
          Edit Activity Assignment
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedActivity && (
            <Box>
              {/* Activity Info - Read Only */}
              <Paper sx={{ p: 2, mb: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Act Name
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {selectedActivity.actName}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      Department
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {selectedActivity.departmentName}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" color="text.secondary">
                      Activity Name
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {selectedActivity.activityName}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body2">
                      {selectedActivity.description}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Editable Fields */}
              <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                Activity Details
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Frequency</InputLabel>
                    <Select
                      value={editFormData.frequency}
                      onChange={handleEditFormChange('frequency')}
                      label="Frequency"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="Daily">Daily</MenuItem>
                      <MenuItem value="Weekly">Weekly</MenuItem>
                      <MenuItem value="Fortnightly">Fortnightly</MenuItem>
                      <MenuItem value="Monthly">Monthly</MenuItem>
                      <MenuItem value="Quarterly">Quarterly</MenuItem>
                      <MenuItem value="Half Yearly">Half Yearly</MenuItem>
                      <MenuItem value="Yearly">Yearly</MenuItem>
                      <MenuItem value="One Time">One Time</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Due Day"
                    type="number"
                    value={editFormData.dueDay}
                    onChange={handleEditFormChange('dueDay')}
                    placeholder="Enter due day"
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Grace Period Days"
                    type="number"
                    value={editFormData.gracePeriodDay}
                    onChange={handleEditFormChange('gracePeriodDay')}
                    placeholder="Enter grace period days"
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Reminder Day"
                    type="number"
                    value={editFormData.reminderDay}
                    onChange={handleEditFormChange('reminderDay')}
                    placeholder="Enter reminder day"
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              </Grid>

              <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                Assign Users
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Maker</InputLabel>
                    <Select
                      value={editFormData.maker}
                      onChange={handleEditFormChange('maker')}
                      label="Maker"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {userList
                        .filter(user => user.userRole === 'Maker')
                        .map(user => (
                          <MenuItem key={user.userID} value={user.userName}>
                            {user.userName}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Checker</InputLabel>
                    <Select
                      value={editFormData.checker}
                      onChange={handleEditFormChange('checker')}
                      label="Checker"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {userList
                        .filter(user => user.userRole === 'Checker')
                        .map(user => (
                          <MenuItem key={user.userID} value={user.userName}>
                            {user.userName}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Reviewer</InputLabel>
                    <Select
                      value={editFormData.reviewer}
                      onChange={handleEditFormChange('reviewer')}
                      label="Reviewer"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {userList
                        .filter(user => user.userRole === 'Reviewer')
                        .map(user => (
                          <MenuItem key={user.userID} value={user.userName}>
                            {user.userName}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Auditor</InputLabel>
                    <Select
                      value={editFormData.auditor}
                      onChange={handleEditFormChange('auditor')}
                      label="Auditor"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {userList
                        .filter(user => user.userRole === 'Auditor')
                        .map(user => (
                          <MenuItem key={user.userID} value={user.userName}>
                            {user.userName}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button 
            onClick={handleCloseEditDialog}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEdit}
            variant="contained"
            disabled={loading}
            sx={{ 
              textTransform: 'none',
              minWidth: 100
            }}
          >
            {loading ? <CircularProgress size={20} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this activity? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleDeleteCancel}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={loading}
            sx={{ 
              textTransform: 'none',
              minWidth: 100
            }}
          >
            {loading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerAdminActivityMasterPage;
