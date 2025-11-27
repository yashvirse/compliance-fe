import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../../../app/store';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  useTheme,
  alpha,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import { addUser, clearError } from './slice/CustomerAdminUser.Slice';
import {
  selectUserLoading,
  selectUserError
} from './slice/CustomerAdminUser.Selector';
import type { AddUserRequest } from './slice/CustomerAdminUser.Type';

const AddCustomerAdminUserPage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const [formData, setFormData] = useState<AddUserRequest>({
    userName: '',
    userEmail: '',
    userMobile: '',
    userPassword: '',
    userRole: '',
    companyId: localStorage.getItem('userId') || '',
    companyType: '',
    companyDomain: '',
    userImage: '',
    isActive: true,
    createdBy: 'admin' // TODO: Get from logged-in user
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleChange = (field: keyof AddUserRequest) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, isActive: event.target.checked }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.userName.trim()) newErrors.userName = 'User name is required';
    if (!formData.userEmail.trim()) newErrors.userEmail = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) {
      newErrors.userEmail = 'Invalid email format';
    }
    if (!formData.userMobile.trim()) newErrors.userMobile = 'Mobile is required';
    if (!formData.userPassword.trim()) newErrors.userPassword = 'Password is required';
    else if (formData.userPassword.length < 8) {
      newErrors.userPassword = 'Password must be at least 8 characters';
    }
    if (!formData.userRole.trim()) newErrors.userRole = 'Role is required';
    if (!formData.companyId.trim()) newErrors.companyId = 'Company ID is required';
    if (!formData.companyType.trim()) newErrors.companyType = 'Company Type is required';
    if (!formData.companyDomain.trim()) newErrors.companyDomain = 'Company Domain is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setSnackbarMessage('Please fill all required fields correctly');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
      return;
    }

    try {
      const submitData = {
        ...formData,
        userImage: imageFile || formData.userImage
      };
      await dispatch(addUser(submitData)).unwrap();
      setSnackbarMessage('User added successfully');
      setSnackbarSeverity('success');
      setShowSnackbar(true);
      setTimeout(() => {
        navigate('/dashboard/master/customeradminuser');
      }, 1500);
    } catch (err) {
      setSnackbarMessage(error || 'Failed to add user');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
    }
  };

  const handleBack = () => {
    navigate('/dashboard/master/customeradminuser');
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    dispatch(clearError());
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            mb: 2,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Back to User List
        </Button>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Add New User
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Fill in the details to create a new user
        </Typography>
      </Box>

      <Paper
        component="form"
        onSubmit={handleSubmit}
        autoComplete="off"
        sx={{
          borderRadius: 3,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
          p: 4
        }}
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="User Name"
              type="text"
              autoComplete="off"
              value={formData.userName}
              onChange={handleChange('userName')}
              error={!!errors.userName}
              helperText={errors.userName}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              autoComplete="off"
              value={formData.userEmail}
              onChange={handleChange('userEmail')}
              error={!!errors.userEmail}
              helperText={errors.userEmail}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Mobile"
              value={formData.userMobile}
              onChange={handleChange('userMobile')}
              error={!!errors.userMobile}
              helperText={errors.userMobile}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              autoComplete="new-password"
              value={formData.userPassword}
              onChange={handleChange('userPassword')}
              error={!!errors.userPassword}
              helperText={errors.userPassword}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth error={!!errors.userRole} required>
              <InputLabel>User Role</InputLabel>
              <Select
                value={formData.userRole}
                onChange={handleChange('userRole') as any}
                label="User Role"
              >
                <MenuItem value="Maker">Maker</MenuItem>
                <MenuItem value="Checker">Checker</MenuItem>
                <MenuItem value="Reviewer">Reviewer</MenuItem>
                <MenuItem value="Viewer">Viewer</MenuItem>
              </Select>
              {errors.userRole && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {errors.userRole}
                </Typography>
              )}
            </FormControl>
          </Grid>

         

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Company Domain"
              value={formData.companyDomain}
              onChange={handleChange('companyDomain')}
              error={!!errors.companyDomain}
              helperText={errors.companyDomain}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                User Image
              </Typography>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  py: 1.5,
                  borderStyle: 'dashed'
                }}
              >
                {imageFile ? imageFile.name : 'Choose Image'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              {imagePreview && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '150px',
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
              )}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={handleSwitchChange}
                  color="primary"
                />
              }
              label="Active Status"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 4,
                  py: 1
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 4,
                  py: 1,
                  fontWeight: 600,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
                }}
              >
                {loading ? 'Saving...' : 'Save User'}
              </Button>
            </Box>
          </Grid>
        </Grid>
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
    </Box>
  );
};

export default AddCustomerAdminUserPage;
