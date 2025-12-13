import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import type { AppDispatch } from '../../../app/store';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Divider,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import { addSite, updateSite, fetchSiteList, clearError } from './slice/Site.Slice';
import { selectSites, selectSiteLoading, selectSiteError } from './slice/Site.Selector';
import type { Site, DefaultUser } from './slice/Site.Type';
import { apiClient } from '../../../services/api';
import type { GetUserListResponse } from '../customeradminuser/slice';
import { useAuth } from '../../../context/AuthContext';

const AddSitePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuth();

  const sites = useSelector(selectSites);
  const loading = useSelector(selectSiteLoading);
  const error = useSelector(selectSiteError);

  const [formData, setFormData] = useState<Site>({
    siteName: '',
    companyId: user?.companyID || '',
    compnanyDomain: user?.domain || '',
    description: '',
    siteLocation: '',
    state: '',
    country: 'India',
    siteId:'',
    defaultUser: {
      defaultMaker: '',
      defaultMakerId: '',
      defaultChecker: '',
      defaultCheckerId: '',
      defaultReviewer: '',
      defaultReviewerId: '',
      defaultAuditer: '',
      defaultAuditerId: '',
    },
  });

  // Indian states list
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Chandigarh', 'Dadra and Nagar Haveli',
    'Daman and Diu', 'Delhi', 'Lakshadweep', 'Puducherry'
  ];

  // Fetch user list from API
  const [userList, setUserList] = useState<Array<{ userID: string; userName: string; userRole: string }>>([]);
  const [userListLoading, setUserListLoading] = useState(false);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const isEditMode = !!id;

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUserListLoading(true);
         const response = await apiClient.get<GetUserListResponse>(
        'User/getUserList'
      );
        // API returns data wrapped in result array
        if (response.data && response.data.result && Array.isArray(response.data.result)) {
          setUserList(response.data.result);
        }
      } catch (err) {
        console.error('Error fetching user list:', err);
        // Show error but don't block form
        setSnackbarMessage('Failed to load user list');
        setSnackbarSeverity('error');
        setShowSnackbar(true);
      } finally {
        setUserListLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (isEditMode && id) {
      if (sites.length === 0) {
        dispatch(fetchSiteList());
      } else {
        const site = sites.find((s: Site) => s.siteId === id);
        if (site) {
          setFormData(site);
        }
      }
    }
  }, [id, isEditMode, dispatch, sites]);

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

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.siteName.trim()) {
      errors.siteName = 'Site name is required';
    }
    if (!formData.siteLocation.trim()) {
      errors.siteLocation = 'Location is required';
    }
    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }
    if (!formData.country.trim()) {
      errors.country = 'Country is required';
    }
    if (!formData.defaultUser.defaultMaker.trim()) {
      errors.defaultMaker = 'Default Maker is required';
    }
    if (!formData.defaultUser.defaultChecker.trim()) {
      errors.defaultChecker = 'Default Checker is required';
    }
    if (!formData.defaultUser.defaultReviewer.trim()) {
      errors.defaultReviewer = 'Default Reviewer is required';
    }
    if (!formData.defaultUser.defaultAuditer.trim()) {
      errors.defaultAuditer = 'Default Auditor is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleUserSelectChange = (fieldName: keyof DefaultUser) => (e: any) => {
    const selectedUserId = e.target.value;
    const selectedUser = userList.find((u) => u.userID === selectedUserId);

    setFormData((prev) => ({
      ...prev,
      defaultUser: {
        ...prev.defaultUser,
        [fieldName]: selectedUser?.userName || '',
        [fieldName === 'defaultMaker' ? 'defaultMakerId' : 
         fieldName === 'defaultChecker' ? 'defaultCheckerId' : 
         fieldName === 'defaultReviewer' ? 'defaultReviewerId' : 
         'defaultAuditerId']: selectedUserId,
      },
    }));

    if (formErrors[fieldName]) {
      setFormErrors((prev) => ({
        ...prev,
        [fieldName]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      let result;
      if (isEditMode && id) {
        result = await dispatch(updateSite({ ...formData, siteId: id })).unwrap();
        setSnackbarMessage(result?.message || 'Site updated successfully');
      } else {
        result = await dispatch(addSite(formData)).unwrap();
        setSnackbarMessage(result?.message || 'Site added successfully');
      }
      setSnackbarSeverity('success');
      setShowSnackbar(true);

      setTimeout(() => {
        navigate('/dashboard/master/site');
      }, 2000);
    } catch (error: any) {
      setSnackbarMessage(error?.message || error || 'An error occurred');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
    }
  };

  const handleBack = () => {
    navigate('/dashboard/master/site');
  };

  // Filter users by role
  const getMakerUsers = () => userList.filter((user) => user.userRole === 'Maker');
  const getCheckerUsers = () => userList.filter((user) => user.userRole === 'Checker');
  const getReviewerUsers = () => userList.filter((user) => user.userRole === 'Reviewer');
  const getAuditorUsers = () => userList.filter((user) => user.userRole === 'Auditor');

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mr: 2, textTransform: 'none' }}
        >
          Back
        </Button>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            {isEditMode ? 'Edit Site' : 'Add New Site'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEditMode ? 'Update site information' : 'Create a new site master record'}
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          {/* Site Basic Information */}
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Site Information
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Site Name"
                name="siteName"
                value={formData.siteName}
                onChange={handleChange}
                error={!!formErrors.siteName}
                helperText={formErrors.siteName}
                placeholder="Enter site name"
                variant="outlined"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter site description"
                variant="outlined"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Site Location"
                name="siteLocation"
                value={formData.siteLocation}
                onChange={handleChange}
                error={!!formErrors.siteLocation}
                helperText={formErrors.siteLocation}
                placeholder="Enter site location"
                variant="outlined"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={!!formErrors.state}>
                <InputLabel>State</InputLabel>
                <Select
                  name="state"
                  value={formData.state}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, state: e.target.value }));
                    if (formErrors.state) {
                      setFormErrors((prev) => ({ ...prev, state: '' }));
                    }
                  }}
                  label="State"
                >
                  <MenuItem value="">Select State</MenuItem>
                  {indianStates.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                disabled
                placeholder="India"
                variant="outlined"
                helperText="Country is set to India"
              />
            </Grid>
          </Grid>

          {/* Default Users Section */}
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Default Users {userListLoading && <CircularProgress size={20} sx={{ ml: 2 }} />}
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={!!formErrors.defaultMaker} disabled={userListLoading}>
                <InputLabel>Default Maker</InputLabel>
                <Select
                  value={formData.defaultUser.defaultMakerId}
                  onChange={handleUserSelectChange('defaultMaker')}
                  label="Default Maker"
                >
                  <MenuItem value="">Select Maker</MenuItem>
                  {getMakerUsers().map((user) => (
                    <MenuItem key={user.userID} value={user.userID}>
                      {user.userName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={!!formErrors.defaultChecker} disabled={userListLoading}>
                <InputLabel>Default Checker</InputLabel>
                <Select
                  value={formData.defaultUser.defaultCheckerId}
                  onChange={handleUserSelectChange('defaultChecker')}
                  label="Default Checker"
                >
                  <MenuItem value="">Select Checker</MenuItem>
                  {getCheckerUsers().map((user) => (
                    <MenuItem key={user.userID} value={user.userID}>
                      {user.userName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={!!formErrors.defaultReviewer} disabled={userListLoading}>
                <InputLabel>Default Reviewer</InputLabel>
                <Select
                  value={formData.defaultUser.defaultReviewerId}
                  onChange={handleUserSelectChange('defaultReviewer')}
                  label="Default Reviewer"
                >
                  <MenuItem value="">Select Reviewer</MenuItem>
                  {getReviewerUsers().map((user) => (
                    <MenuItem key={user.userID} value={user.userID}>
                      {user.userName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={!!formErrors.defaultAuditer} disabled={userListLoading}>
                <InputLabel>Default Auditor</InputLabel>
                <Select
                  value={formData.defaultUser.defaultAuditerId}
                  onChange={handleUserSelectChange('defaultAuditer')}
                  label="Default Auditor"
                >
                  <MenuItem value="">Select Auditor</MenuItem>
                  {getAuditorUsers().map((user) => (
                    <MenuItem key={user.userID} value={user.userID}>
                      {user.userName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Form Actions */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start', mt: 4 }}>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                onClick={handleSubmit}
                disabled={loading || userListLoading}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                {loading ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Site' : 'Save Site')}
              </Button>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={loading}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Cancel
              </Button>
            </Box>
          </Grid>
        </form>
      </Paper>

      <Snackbar open={showSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddSitePage;
