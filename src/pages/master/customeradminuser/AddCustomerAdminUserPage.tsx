import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
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
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { addUser, editUser, fetchUserById, clearError } from './slice/CustomerAdminUser.Slice';
import {
  selectUserLoading,
  selectUserError
} from './slice/CustomerAdminUser.Selector';
import type { AddUserRequest, EditUserRequest } from './slice/CustomerAdminUser.Type';

const AddCustomerAdminUserPage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<AddUserRequest>({
    userName: '',
    userEmail: '',
    userMobile: '',
    userPassword: '',
    userRole: '',
    companyId: localStorage.getItem('companyID') || '',
    companyType: '',
    companyDomain: '',
    userimg: '',
    isActive: true,
    createdBy: localStorage.getItem('userId') || '' // TODO: Get from logged-in user
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [originalUserData, setOriginalUserData] = useState<any>(null);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  // Fetch user data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const loadUser = async () => {
        try {
          const user = await dispatch(fetchUserById(id)).unwrap();
          setOriginalUserData(user);
          setFormData({
            userName: user.userName,
            userEmail: user.userEmail,
            userMobile: user.userMobile,
            userPassword: '', // Don't populate password for security
            userRole: user.userRole,
            companyId: user.companyId,
            companyType: user.companyType || '',
            companyDomain: user.companyDomain,
            userimg: user.userImage || '',
            isActive: user.isActive,
            createdBy: user.createdBy || localStorage.getItem('userId') || ''
          });
          // Set image preview if exists
          if (user.userImage) {
            setImagePreview(`http://122.180.254.137:8099${user.userImage}`);
          }
        } catch (err) {
          setSnackbarMessage('Failed to load user data');
          setSnackbarSeverity('error');
          setShowSnackbar(true);
        }
      };
      loadUser();
    }
  }, [isEditMode, id, dispatch]);

  const handleChange = (field: keyof AddUserRequest) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Update password strength indicators in real-time
    if (field === 'userPassword' && typeof value === 'string') {
      setPasswordStrength({
        hasMinLength: value.length >= 8,
        hasUpperCase: /[A-Z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      });
    }
    
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
    
    // Password validation - required only for add mode, optional for edit
    if (!isEditMode) {
      if (!formData.userPassword.trim()) {
        newErrors.userPassword = 'Password is required';
      } else {
        // Password policy validation
        const password = formData.userPassword;
        const hasMinLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        if (!hasMinLength) {
          newErrors.userPassword = 'Password must be at least 8 characters';
        } else if (!hasUpperCase) {
          newErrors.userPassword = 'Password must contain at least 1 uppercase letter';
        } else if (!hasNumber) {
          newErrors.userPassword = 'Password must contain at least 1 number';
        } else if (!hasSpecialChar) {
          newErrors.userPassword = 'Password must contain at least 1 special character';
        }
      }
    } else if (formData.userPassword) {
      // Password policy validation for edit mode if password is provided
      const password = formData.userPassword;
      const hasMinLength = password.length >= 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      
      if (!hasMinLength) {
        newErrors.userPassword = 'Password must be at least 8 characters';
      } else if (!hasUpperCase) {
        newErrors.userPassword = 'Password must contain at least 1 uppercase letter';
      } else if (!hasNumber) {
        newErrors.userPassword = 'Password must contain at least 1 number';
      } else if (!hasSpecialChar) {
        newErrors.userPassword = 'Password must contain at least 1 special character';
      }
    }
    
    if (!formData.userRole.trim()) newErrors.userRole = 'Role is required';
    if (!formData.companyId.trim()) newErrors.companyId = 'Company ID is required';

  

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
      if (isEditMode && originalUserData) {
        // Edit mode - use editUser API
        const editData: EditUserRequest = {
          userID: originalUserData.userID,
          userName: formData.userName,
          userEmail: formData.userEmail,
          userMobile: formData.userMobile,
          userRole: formData.userRole,
          companyId: formData.companyId,
          companyDomain: formData.companyDomain,
          isActive: formData.isActive,
          createdBy: formData.createdBy,
          createdOn: originalUserData.createdOn,
          userimg: imageFile || undefined,
          userImage: originalUserData.userImage || '',
          // Will be conditionally added below
        };
        
        // Only include password if it was changed
        if (formData.userPassword) {
          editData.userPassword = formData.userPassword;
        }
        
        await dispatch(editUser(editData)).unwrap();
      } else {
        // Add mode - use addUser API
        const submitData = {
          ...formData,
          userimg: imageFile || formData.userimg
        };
        await dispatch(addUser(submitData)).unwrap();
      }
      
      setSnackbarMessage(isEditMode ? 'User updated successfully' : 'User added successfully');
      setSnackbarSeverity('success');
      setShowSnackbar(true);
      setTimeout(() => {
        navigate('/dashboard/master/customeradminuser');
      }, 1500);
    } catch (err) {
      setSnackbarMessage(error || (isEditMode ? 'Failed to update user' : 'Failed to add user'));
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
          {isEditMode ? 'Edit User' : 'Add New User'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isEditMode ? 'Update user details' : 'Fill in the details to create a new user'}
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
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={formData.userPassword}
              onChange={handleChange('userPassword')}
              error={!!errors.userPassword}
              helperText={errors.userPassword || (isEditMode ? 'Leave blank to keep current password' : 'Min 8 chars, 1 uppercase, 1 number, 1 special character')}
              required={!isEditMode}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {formData.userPassword && (
              <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: passwordStrength.hasMinLength ? 'success.main' : 'grey.300'
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: passwordStrength.hasMinLength ? 'success.main' : 'text.secondary' }}
                  >
                    At least 8 characters
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: passwordStrength.hasUpperCase ? 'success.main' : 'grey.300'
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: passwordStrength.hasUpperCase ? 'success.main' : 'text.secondary' }}
                  >
                    One uppercase letter
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: passwordStrength.hasNumber ? 'success.main' : 'grey.300'
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: passwordStrength.hasNumber ? 'success.main' : 'text.secondary' }}
                  >
                    One number
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: passwordStrength.hasSpecialChar ? 'success.main' : 'grey.300'
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: passwordStrength.hasSpecialChar ? 'success.main' : 'text.secondary' }}
                  >
                    One special character
                  </Typography>
                </Box>
              </Box>
            )}
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
                <MenuItem value="Auditor">Auditor</MenuItem>
              </Select>
              {errors.userRole && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                  {errors.userRole}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
           
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
                {imageFile ? imageFile.name : 'Upload User Image'}
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
                {loading ? 'Saving...' : (isEditMode ? 'Update User' : 'Save User')}
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
