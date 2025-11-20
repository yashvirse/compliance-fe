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
  Divider
} from '@mui/material';
import { Save } from '@mui/icons-material';
import {
  CustomTextField,
  CustomDropdown,
  CustomCheckbox,
  CustomRadio,
  CustomMultiSelect,
  CustomDatePicker,
  CustomDateRangePicker
} from '../components/common';
import { type Dayjs } from 'dayjs';

const ComponentDemoPage: React.FC = () => {
  const theme = useTheme();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    country: '',
    gender: '',
    hobbies: [] as (string | number)[],
    newsletter: false,
    languages: [] as (string | number)[],
    birthDate: null as Dayjs | null,
    startDate: null as Dayjs | null,
    endDate: null as Dayjs | null,
  });

  const countryOptions = [
    { label: 'United States', value: 'us' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Canada', value: 'ca' },
    { label: 'Australia', value: 'au' },
    { label: 'Germany', value: 'de' }
  ];

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' }
  ];

  const hobbyOptions = [
    { label: 'Reading', value: 'reading' },
    { label: 'Sports', value: 'sports' },
    { label: 'Music', value: 'music' },
    { label: 'Travel', value: 'travel' }
  ];

  const languageOptions = [
    { label: 'English', value: 'en' },
    { label: 'Spanish', value: 'es' },
    { label: 'French', value: 'fr' },
    { label: 'German', value: 'de' },
    { label: 'Chinese', value: 'zh' },
    { label: 'Japanese', value: 'ja' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Common Components Demo
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Reusable TextField, Dropdown, Checkbox, and Radio Button components
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
              {/* TextField Section */}
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
                  Custom TextField
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  placeholder="Enter your first name"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="example@email.com"
                  helperText="We'll never share your email"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  label="Disabled Field"
                  value="Cannot edit this"
                  disabled
                />
              </Grid>

              {/* Dropdown Section */}
              <Grid size={{ xs: 12 }} sx={{ mt: 3 }}>
                <Divider />
              </Grid>

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
                  Custom Dropdown
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomDropdown
                  label="Select Country"
                  name="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value as string })}
                  options={countryOptions}
                  required
                  helperText="Choose your country"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomDropdown
                  label="Select Multiple (Demo)"
                  options={countryOptions}
                  placeholder="Select options"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomMultiSelect
                  label="Select Languages"
                  options={languageOptions}
                  value={formData.languages}
                  onChange={(value) => setFormData({ ...formData, languages: value })}
                  helperText="Select one or more languages"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomMultiSelect
                  label="Select Skills (Text Mode)"
                  options={languageOptions}
                  value={formData.languages}
                  onChange={(value) => setFormData({ ...formData, languages: value })}
                  renderValue="text"
                  helperText="Selected values shown as text"
                />
              </Grid>

              {/* Radio Button Section */}
              <Grid size={{ xs: 12 }} sx={{ mt: 3 }}>
                <Divider />
              </Grid>

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
                  Custom Radio Button
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomRadio
                  label="Select Gender"
                  options={genderOptions}
                  value={formData.gender}
                  onChange={(value) => setFormData({ ...formData, gender: value as string })}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomRadio
                  label="Display in Row"
                  options={genderOptions}
                  value={formData.gender}
                  onChange={(value) => setFormData({ ...formData, gender: value as string })}
                  row
                  helperText="Radio buttons displayed horizontally"
                />
              </Grid>

              {/* Checkbox Section */}
              <Grid size={{ xs: 12 }} sx={{ mt: 3 }}>
                <Divider />
              </Grid>

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
                  Custom Checkbox
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomCheckbox
                  label="Select Hobbies"
                  options={hobbyOptions}
                  value={formData.hobbies}
                  onChange={(value) => setFormData({ ...formData, hobbies: value })}
                  helperText="You can select multiple options"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ mt: 2 }}>
                  <CustomCheckbox
                    singleLabel="Subscribe to newsletter"
                    checked={formData.newsletter}
                    onSingleChange={(checked) => setFormData({ ...formData, newsletter: checked })}
                  />
                  <CustomCheckbox
                    singleLabel="I agree to terms and conditions"
                    checked={false}
                  />
                  <CustomCheckbox
                    singleLabel="Enable notifications"
                    checked={true}
                  />
                </Box>
              </Grid>

              {/* Date Picker Section */}
              <Grid size={{ xs: 12 }} sx={{ mt: 3 }}>
                <Divider />
              </Grid>

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
                  Custom Date Picker
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomDatePicker
                  label="Birth Date"
                  value={formData.birthDate}
                  onChange={(date) => setFormData({ ...formData, birthDate: date })}
                  helperText="Select your birth date"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomDatePicker
                  label="Appointment Date"
                  value={formData.birthDate}
                  onChange={(date) => setFormData({ ...formData, birthDate: date })}
                  required
                  format="MM/DD/YYYY"
                  helperText="Required field with US date format"
                />
              </Grid>

              {/* Date Range Picker Section */}
              <Grid size={{ xs: 12 }} sx={{ mt: 3 }}>
                <Divider />
              </Grid>

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
                  Custom Date Range Picker
                </Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <CustomDateRangePicker
                  label="Select Date Range"
                  startDate={formData.startDate}
                  endDate={formData.endDate}
                  onStartDateChange={(date) => setFormData({ ...formData, startDate: date })}
                  onEndDateChange={(date) => setFormData({ ...formData, endDate: date })}
                  startLabel="From Date"
                  endLabel="To Date"
                  required
                  helperText={{
                    startDate: 'Select start date',
                    endDate: 'Select end date'
                  }}
                />
              </Grid>

              {/* Submit Button */}
              <Grid size={{ xs: 12 }} sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    size="large"
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
                    Submit Form
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Usage Code Examples */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
          mt: 3
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Usage Examples
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Import:
            </Typography>
            <Box sx={{ bgcolor: theme.palette.grey[100], p: 2, borderRadius: 1, mb: 2 }}>
              <code>
                {`import { CustomTextField, CustomDropdown, CustomCheckbox, CustomRadio } from '../components/common';`}
              </code>
            </Box>

            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              CustomTextField:
            </Typography>
            <Box sx={{ bgcolor: theme.palette.grey[100], p: 2, borderRadius: 1, mb: 2 }}>
              <code>
                {`<CustomTextField
  label="Name"
  value={value}
  onChange={handleChange}
  required
/>`}
              </code>
            </Box>

            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              CustomDropdown:
            </Typography>
            <Box sx={{ bgcolor: theme.palette.grey[100], p: 2, borderRadius: 1, mb: 2 }}>
              <code>
                {`<CustomDropdown
  label="Country"
  options={[{ label: 'USA', value: 'us' }]}
  value={value}
  onChange={handleChange}
/>`}
              </code>
            </Box>

            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              CustomRadio:
            </Typography>
            <Box sx={{ bgcolor: theme.palette.grey[100], p: 2, borderRadius: 1, mb: 2 }}>
              <code>
                {`<CustomRadio
  label="Gender"
  options={[{ label: 'Male', value: 'male' }]}
  value={value}
  onChange={handleChange}
  row
/>`}
              </code>
            </Box>

            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              CustomCheckbox:
            </Typography>
            <Box sx={{ bgcolor: theme.palette.grey[100], p: 2, borderRadius: 1 }}>
              <code>
                {`<CustomCheckbox
  label="Hobbies"
  options={[{ label: 'Reading', value: 'reading' }]}
  value={selectedValues}
  onChange={handleChange}
/>`}
              </code>
            </Box>

            <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
              CustomMultiSelect:
            </Typography>
            <Box sx={{ bgcolor: theme.palette.grey[100], p: 2, borderRadius: 1 }}>
              <code>
                {`<CustomMultiSelect
  label="Languages"
  options={[{ label: 'English', value: 'en' }]}
  value={selectedValues}
  onChange={handleChange}
  renderValue="chips" // or "text"
/>`}
              </code>
            </Box>

            <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
              CustomDatePicker:
            </Typography>
            <Box sx={{ bgcolor: theme.palette.grey[100], p: 2, borderRadius: 1 }}>
              <code>
                {`<CustomDatePicker
  label="Birth Date"
  value={dateValue}
  onChange={handleDateChange}
  format="DD/MM/YYYY"
  required
/>`}
              </code>
            </Box>

            <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
              CustomDateRangePicker:
            </Typography>
            <Box sx={{ bgcolor: theme.palette.grey[100], p: 2, borderRadius: 1 }}>
              <code>
                {`<CustomDateRangePicker
  label="Select Date Range"
  startDate={startDate}
  endDate={endDate}
  onStartDateChange={handleStartChange}
  onEndDateChange={handleEndChange}
  required
/>`}
              </code>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ComponentDemoPage;
