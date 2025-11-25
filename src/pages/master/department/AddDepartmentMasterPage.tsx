import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../../app/store';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  useTheme,
  alpha,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { CustomTextField } from '../../../components/common';
import { addDepartmentMaster, updateDepartmentMaster, clearError, clearSuccess, fetchDepartmentMasterById, clearCurrentDepartmentMaster } from './slice/Department.Slice';
import {
  selectDepartmentMasterLoading,
  selectDepartmentMasterError,
  selectDepartmentMasterSuccess,
  selectCurrentDepartmentMaster,
  selectFetchByIdLoading
} from './slice/Department.Selector';
import type { UpdateDepartmentMasterRequest } from './slice/Department.Type';

const AddDepartmentMasterPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();

  const loading = useSelector(selectDepartmentMasterLoading);
  const error = useSelector(selectDepartmentMasterError);
  const success = useSelector(selectDepartmentMasterSuccess);
  const currentDepartmentMaster = useSelector(selectCurrentDepartmentMaster);
  const fetchByIdLoading = useSelector(selectFetchByIdLoading);

  const isEditMode = !!id;
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [formData, setFormData] = useState({
    departmentName: '',
    description: '',
    companyDomain: '',
  });

  // Fetch department master data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      dispatch(fetchDepartmentMasterById(id));
    }
  }, [dispatch, id, isEditMode]);

  // Populate form when department master data is loaded
  useEffect(() => {
    if (isEditMode && currentDepartmentMaster) {
      setFormData({
        departmentName: currentDepartmentMaster.departmentName || '',
        description: currentDepartmentMaster.description || '',
        companyDomain: currentDepartmentMaster.companyDomain || '',
      });
    }
  }, [isEditMode, currentDepartmentMaster]);

  useEffect(() => {
    if (success) {
      setShowSnackbar(true);
      setTimeout(() => {
        dispatch(clearSuccess());
        navigate('/dashboard/master/department');
      }, 1500);
    }
  }, [success, navigate, dispatch]);

  useEffect(() => {
    if (error) {
      setShowSnackbar(true);
    }
  }, [error]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(clearCurrentDepartmentMaster());
      dispatch(clearSuccess());
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    if (error) {
      dispatch(clearError());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode && currentDepartmentMaster) {
      // Update existing department master
      const updateData: UpdateDepartmentMasterRequest = {
        id: currentDepartmentMaster.id,
        departmentName: formData.departmentName,
        description: formData.description,
        createdAt: currentDepartmentMaster.createdAt,
        updatedAt: new Date().toISOString(),
        companyId: localStorage.getItem('userId') || '',
        companyDomain: formData.companyDomain,
        createdBy: localStorage.getItem('userId') || '',
        createdDate: currentDepartmentMaster.createdDate,
      };

      await dispatch(updateDepartmentMaster(updateData));
    } else {
      // Add new department master
      const requestData = {
        departmentName: formData.departmentName,
        description: formData.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        companyId: localStorage.getItem('userId') || '',
        companyDomain: formData.companyDomain,
        createdBy: 'admin',
        createdDate: new Date().toISOString(),
        id: ''
      };

      await dispatch(addDepartmentMaster(requestData));
    }
  };

  // Show loading spinner when fetching department master data in edit mode
  if (isEditMode && fetchByIdLoading) {
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
          Loading department master data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard/master/department')}
          sx={{
            textTransform: 'none',
            mb: 2,
            color: theme.palette.text.secondary,
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            }
          }}
        >
          Back to Department Master List
        </Button>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {isEditMode ? 'Edit Department Master' : 'Add Department Master'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isEditMode ? 'Update department master information' : 'Create a new department master entry'}
        </Typography>
      </Box>

      {/* Form */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: '250px' }}>
                  <CustomTextField
                    label="Department Name"
                    name="departmentName"
                    value={formData.departmentName}
                    onChange={handleChange}
                    required
                    placeholder="Enter department name"
                  />
                </Box>

                <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: '250px' }}>
                  <CustomTextField
                    label="Company Domain"
                    name="companyDomain"
                    value={formData.companyDomain}
                    onChange={handleChange}
                    required
                    placeholder="Enter company domain"
                  />
                </Box>
              </Box>

              <Box>
                <CustomTextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Enter description"
                  multiline
                  rows={4}
                />
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'flex-end', 
              mt: 4, 
              pt: 3, 
              borderTop: `1px solid ${theme.palette.divider}` 
            }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/dashboard/master/department')}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 4
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || fetchByIdLoading}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 4,
                  boxShadow: `0 4px 15px ${alpha(theme.palette.success.main, 0.4)}`,
                  bgcolor: theme.palette.success.main,
                  '&:hover': {
                    bgcolor: theme.palette.success.dark,
                    boxShadow: `0 6px 20px ${alpha(theme.palette.success.main, 0.5)}`
                  }
                }}
              >
                {loading ? 'Saving...' : isEditMode ? 'Update Department Master' : 'Submit & Save'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={success ? "success" : "error"}
          sx={{ width: '100%' }}
        >
          {success ? (isEditMode ? 'Department Master updated successfully!' : 'Department Master added successfully!') : error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddDepartmentMasterPage;
