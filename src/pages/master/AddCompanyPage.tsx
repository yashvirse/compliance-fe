import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  useTheme,
  alpha,
  Divider
} from '@mui/material';
import {
  Business as CompanyIcon,
  Person as UserIcon,
  Domain as DomainIcon,
  AccountBalance as AccountIcon,
  Subscriptions as SubscriptionIcon,
  ArrowBack
} from '@mui/icons-material';
import {
  CustomTextField,
  CustomDropdown,
  CustomDatePicker
} from '../../components/common';
import { type Dayjs } from 'dayjs';

type TabType = 'company' | 'user' | 'domain' | 'account' | 'subscription';

const AddCompanyPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('company');

  // Company form state
  const [companyData, setCompanyData] = useState({
    name: '',
    industry: '',
    location: '',
    email: '',
    phone: '',
    website: '',
    employees: '',
    registrationDate: null as Dayjs | null,
    status: 'active',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const industryOptions = [
    { label: 'Technology', value: 'technology' },
    { label: 'Finance', value: 'finance' },
    { label: 'Healthcare', value: 'healthcare' },
    { label: 'Retail', value: 'retail' },
    { label: 'Education', value: 'education' },
    { label: 'Manufacturing', value: 'manufacturing' },
  ];

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Pending', value: 'pending' },
  ];

  const countryOptions = [
    { label: 'United States', value: 'us' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Canada', value: 'ca' },
    { label: 'Australia', value: 'au' },
    { label: 'India', value: 'in' },
  ];

  const tabs = [
    { id: 'company', label: 'Company', icon: <CompanyIcon /> },
    { id: 'user', label: 'User', icon: <UserIcon /> },
    { id: 'domain', label: 'Domain', icon: <DomainIcon /> },
    { id: 'account', label: 'Account Details', icon: <AccountIcon /> },
    { id: 'subscription', label: 'Subscription', icon: <SubscriptionIcon /> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Company Data:', companyData);
    // Add API call here
  };

  const renderCompanyForm = () => (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Company Information
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField
            label="Company Name"
            name="name"
            value={companyData.name}
            onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
            required
            placeholder="Enter company name"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomDropdown
            label="Industry"
            name="industry"
            value={companyData.industry}
            onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value as string })}
            options={industryOptions}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField
            label="Email"
            name="email"
            type="email"
            value={companyData.email}
            onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
            required
            placeholder="company@example.com"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField
            label="Phone"
            name="phone"
            value={companyData.phone}
            onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField
            label="Website"
            name="website"
            value={companyData.website}
            onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
            placeholder="https://www.example.com"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField
            label="Number of Employees"
            name="employees"
            type="number"
            value={companyData.employees}
            onChange={(e) => setCompanyData({ ...companyData, employees: e.target.value })}
            placeholder="100"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomDatePicker
            label="Registration Date"
            value={companyData.registrationDate}
            onChange={(date) => setCompanyData({ ...companyData, registrationDate: date })}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomDropdown
            label="Status"
            name="status"
            value={companyData.status}
            onChange={(e) => setCompanyData({ ...companyData, status: e.target.value as string })}
            options={statusOptions}
            required
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Address Information
          </Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <CustomTextField
            label="Address"
            name="address"
            value={companyData.address}
            onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
            placeholder="Street address"
            multiline
            rows={2}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField
            label="City"
            name="city"
            value={companyData.city}
            onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
            placeholder="City"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField
            label="State/Province"
            name="state"
            value={companyData.state}
            onChange={(e) => setCompanyData({ ...companyData, state: e.target.value })}
            placeholder="State"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomTextField
            label="ZIP/Postal Code"
            name="zipCode"
            value={companyData.zipCode}
            onChange={(e) => setCompanyData({ ...companyData, zipCode: e.target.value })}
            placeholder="12345"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <CustomDropdown
            label="Country"
            name="country"
            value={companyData.country}
            onChange={(e) => setCompanyData({ ...companyData, country: e.target.value as string })}
            options={countryOptions}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/dashboard/master/company')}
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
              Save Company
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  const renderPlaceholder = (title: string) => (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title} Form
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Form content will be added here
      </Typography>
    </Box>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'company':
        return renderCompanyForm();
      case 'user':
        return renderPlaceholder('User');
      case 'domain':
        return renderPlaceholder('Domain');
      case 'account':
        return renderPlaceholder('Account Details');
      case 'subscription':
        return renderPlaceholder('Subscription');
      default:
        return renderCompanyForm();
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard/master/company')}
          sx={{
            textTransform: 'none',
            mb: 2,
            color: theme.palette.text.secondary,
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            }
          }}
        >
          Back to Company List
        </Button>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Add New Company
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Fill in the information to create a new company
        </Typography>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Right Side - Tab Buttons */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            sx={{
              borderRadius: 3,
              boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
              p: 2,
              position: 'sticky',
              top: 20
            }}
          >
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, px: 1 }}>
              Sections
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  fullWidth
                  startIcon={tab.icon}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  variant={activeTab === tab.id ? 'contained' : 'text'}
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    py: 1.5,
                    px: 2,
                    borderRadius: 2,
                    fontWeight: activeTab === tab.id ? 600 : 500,
                    color: activeTab === tab.id ? 'white' : theme.palette.text.primary,
                    bgcolor: activeTab === tab.id ? theme.palette.primary.main : 'transparent',
                    '&:hover': {
                      bgcolor: activeTab === tab.id 
                        ? theme.palette.primary.dark 
                        : alpha(theme.palette.primary.main, 0.1),
                    }
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Left Side - Form Content */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {renderContent()}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddCompanyPage;
