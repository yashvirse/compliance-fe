import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  useTheme,
  alpha,
  Alert,
  Snackbar
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import type { FormData } from '../types/index';
import { CustomTextField, CustomDropdown } from '../components/common';

const countries = [
  { label: 'United States', value: 'United States' },
  { label: 'United Kingdom', value: 'United Kingdom' },
  { label: 'Canada', value: 'Canada' },
  { label: 'Australia', value: 'Australia' },
  { label: 'Germany', value: 'Germany' },
  { label: 'France', value: 'France' },
  { label: 'Spain', value: 'Spain' },
  { label: 'Italy', value: 'Italy' },
  { label: 'Japan', value: 'Japan' },
  { label: 'India', value: 'India' }
];

const FormPage: React.FC = () => {
  const theme = useTheme();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setShowSuccess(true);
    // Reset form after submission
    setTimeout(() => {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        zipCode: '',
        description: ''
      });
    }, 1500);
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      zipCode: '',
      description: ''
    });
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        User Information Form
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Please fill out all the required fields below.
      </Typography>

      <Card
        sx={{
          borderRadius: 3,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Personal Information Section */}
              <Grid size={{ xs: 12 }}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{
                    mb: 2,
                    pb: 1,
                    borderBottom: `2px solid ${theme.palette.primary.main}`
                  }}
                >
                  Personal Information
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  required
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  required
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  required
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  required
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </Grid>

              {/* Address Information Section */}
              <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{
                    mb: 2,
                    pb: 1,
                    borderBottom: `2px solid ${theme.palette.primary.main}`
                  }}
                >
                  Address Information
                </Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <CustomTextField
                  required
                  label="Street Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your street address"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  required
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomDropdown
                  required
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  options={countries}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  required
                  label="Zip Code"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="Enter zip code"
                />
              </Grid>

              {/* Additional Information Section */}
              <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{
                    mb: 2,
                    pb: 1,
                    borderBottom: `2px solid ${theme.palette.primary.main}`
                  }}
                >
                  Additional Information
                </Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <CustomTextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  placeholder="Enter any additional information..."
                />
              </Grid>

              {/* Action Buttons */}
              <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<Cancel />}
                    onClick={handleReset}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 4
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<Save />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 4,
                      boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
                      '&:hover': {
                        boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`
                      }
                    }}
                  >
                    Submit
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          Form submitted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FormPage;
