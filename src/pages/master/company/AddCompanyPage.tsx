import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../../app/store';
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
  Alert,
  Snackbar,
  CircularProgress
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
  CustomCheckbox
} from '../../../components/common';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import { addCompany, clearError, clearSuccess, fetchCompanyById, clearCurrentCompany } from './slice/Company.Slice';
import {
  selectCompanyLoading,
  selectCompanyError,
  selectCompanySuccess,
  selectCurrentCompany,
  selectFetchByIdLoading
} from './slice/Company.Selector';
import type { AddCompanyRequest } from './slice/Company.Type';

type TabType = 'company' | 'user' | 'domain' | 'account' | 'subscription';

const AddCompanyPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  
  // Redux selectors
  const loading = useSelector(selectCompanyLoading);
  const error = useSelector(selectCompanyError);
  const success = useSelector(selectCompanySuccess);
  const currentCompany = useSelector(selectCurrentCompany);
  const fetchByIdLoading = useSelector(selectFetchByIdLoading);
  
  const isEditMode = !!id;
  const [activeTab, setActiveTab] = useState<TabType>('company');
  const [showSnackbar, setShowSnackbar] = useState(false);

  // Form state for all sections
  const [companyData, setCompanyData] = useState({
    name: '',
    companyLogo: null as File | null,
    companyLogoPreview: '',
    companyType: '',
    country: '',
    state: '',
    city: '',
    buildingNo: '',
    zip: '',
    address: '',
    currency: '',
    isActive: true,
  });

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    userImage: null as File | null,
    userImagePreview: '',
    isActive: true,
  });

  const [domainData, setDomainData] = useState({
    domain: '',
    externalDomain: '',
  });

  const [accountData, setAccountData] = useState({
    ifscCode: '',
    panNo: '',
    gstNo: '',
    cinNo: '',
  });

  const [subscriptionData, setSubscriptionData] = useState({
    planType: '',
    planRate: '',
  });

  const companyTypeOptions = [
    { label: 'Private Limited', value: 'private_limited' },
    { label: 'Public Limited', value: 'public_limited' },
    { label: 'Partnership', value: 'partnership' },
    { label: 'Sole Proprietorship', value: 'sole_proprietorship' },
    { label: 'LLP', value: 'llp' },
  ];


  const countryOptions = [
    { label: 'United States', value: 'us' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Canada', value: 'ca' },
    { label: 'Australia', value: 'au' },
    { label: 'India', value: 'in' },
  ];

  const stateOptions = [
    { label: 'Andhra Pradesh', value: 'andhra_pradesh' },
    { label: 'Arunachal Pradesh', value: 'arunachal_pradesh' },
    { label: 'Assam', value: 'assam' },
    { label: 'Bihar', value: 'bihar' },
    { label: 'Chhattisgarh', value: 'chhattisgarh' },
    { label: 'Goa', value: 'goa' },
    { label: 'Gujarat', value: 'gujarat' },
    { label: 'Haryana', value: 'haryana' },
    { label: 'Himachal Pradesh', value: 'himachal_pradesh' },
    { label: 'Jharkhand', value: 'jharkhand' },
    { label: 'Karnataka', value: 'karnataka' },
    { label: 'Kerala', value: 'kerala' },
    { label: 'Madhya Pradesh', value: 'madhya_pradesh' },
    { label: 'Maharashtra', value: 'maharashtra' },
    { label: 'Manipur', value: 'manipur' },
    { label: 'Meghalaya', value: 'meghalaya' },
    { label: 'Mizoram', value: 'mizoram' },
    { label: 'Nagaland', value: 'nagaland' },
    { label: 'Odisha', value: 'odisha' },
    { label: 'Punjab', value: 'punjab' },
    { label: 'Rajasthan', value: 'rajasthan' },
    { label: 'Sikkim', value: 'sikkim' },
    { label: 'Tamil Nadu', value: 'tamil_nadu' },
    { label: 'Telangana', value: 'telangana' },
    { label: 'Tripura', value: 'tripura' },
    { label: 'Uttar Pradesh', value: 'uttar_pradesh' },
    { label: 'Uttarakhand', value: 'uttarakhand' },
    { label: 'West Bengal', value: 'west_bengal' },
    { label: 'Andaman and Nicobar Islands', value: 'andaman_nicobar' },
    { label: 'Chandigarh', value: 'chandigarh' },
    { label: 'Dadra & Nagar Haveli and Daman & Diu', value: 'dadra_nagar_haveli_daman_diu' },
    { label: 'Delhi', value: 'delhi' },
    { label: 'Jammu & Kashmir', value: 'jammu_kashmir' },
    { label: 'Ladakh', value: 'ladakh' },
    { label: 'Lakshadweep', value: 'lakshadweep' },
    { label: 'Puducherry', value: 'puducherry' },
  ];

  const currencyOptions = [
    { label: 'USD - US Dollar', value: 'USD' },
    { label: 'EUR - Euro', value: 'EUR' },
    { label: 'GBP - British Pound', value: 'GBP' },
    { label: 'INR - Indian Rupee', value: 'INR' },
    { label: 'AUD - Australian Dollar', value: 'AUD' },
    { label: 'CAD - Canadian Dollar', value: 'CAD' },
  ];

  const planTypeOptions = [
    { label: 'Basic', value: 'basic' },
    { label: 'Professional', value: 'professional' },
    { label: 'Enterprise', value: 'enterprise' },
    { label: 'Custom', value: 'custom' },
  ];

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'companyLogo' | 'userImage'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'companyLogo') {
          setCompanyData({
            ...companyData,
            companyLogo: file,
            companyLogoPreview: reader.result as string,
          });
        } else {
          setUserData({
            ...userData,
            userImage: file,
            userImagePreview: reader.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'company', label: 'Company', icon: <CompanyIcon /> },
    { id: 'user', label: 'User', icon: <UserIcon /> },
    { id: 'domain', label: 'Domain', icon: <DomainIcon /> },
    { id: 'account', label: 'Account Details', icon: <AccountIcon /> },
    { id: 'subscription', label: 'Subscription', icon: <SubscriptionIcon /> },
  ];

  // Fetch company data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      dispatch(fetchCompanyById(id));
    }
    
    return () => {
      dispatch(clearCurrentCompany());
    };
  }, [dispatch, id, isEditMode]);

  // Populate form when company data is loaded
  useEffect(() => {
    if (isEditMode && currentCompany) {
      // Populate company data
      setCompanyData({
        name: currentCompany.companyName || '',
        companyLogo: null,
        companyLogoPreview: currentCompany.companyLogo || '',
        companyType: currentCompany.companyType || '',
        country: currentCompany.companyAddress?.companyCountry || '',
        state: currentCompany.companyAddress?.companyState || '',
        city: currentCompany.companyAddress?.companyCity || '',
        buildingNo: currentCompany.companyAddress?.buildingNumber || '',
        zip: currentCompany.companyAddress?.companyZIP || '',
        address: currentCompany.companyAddress?.detailAdddress || '',
        currency: currentCompany.companyCurrency || '',
        isActive: currentCompany.companyIsActive ?? true,
      });

      // Populate user data
      setUserData({
        name: currentCompany.user?.userName || '',
        email: currentCompany.user?.userEmail || '',
        password: '', // Don't populate password for security
        mobile: currentCompany.user?.userMobile || '',
        userImage: null,
        userImagePreview: currentCompany.user?.userImg || '',
        isActive: currentCompany.user?.isActive ?? true,
      });

      // Populate domain data
      setDomainData({
        domain: currentCompany.companyDomain || '',
        externalDomain: currentCompany.user?.companyDomain || '',
      });

      // Populate account data
      setAccountData({
        ifscCode: currentCompany.ifsC_Code || '',
        panNo: currentCompany.paN_No || '',
        gstNo: currentCompany.gsT_NO || '',
        cinNo: currentCompany.ciN_NO || '',
      });

      // Populate subscription data
      setSubscriptionData({
        planType: currentCompany.plan_type || '',
        planRate: currentCompany.plan_rate || '',
      });
    }
  }, [isEditMode, currentCompany]);

  // Handle success/error
  useEffect(() => {
    if (success) {
      setShowSnackbar(true);
      setTimeout(() => {
        dispatch(clearSuccess());
        navigate('/dashboard/master/company');
      }, 2000);
    }
  }, [success, navigate, dispatch]);

  useEffect(() => {
    if (error) {
      setShowSnackbar(true);
    }
  }, [error]);

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data according to API structure
    const requestData: AddCompanyRequest = {
      CompanyName: companyData.name,
      CompanyType: companyData.companyType,
      CompanyCurrency: companyData.currency,
      CompanyIsActive: companyData.isActive,
      CompanyDomain: domainData.domain,
      PAN_No: accountData.panNo,
      GST_NO: accountData.gstNo,
      CIN_NO: accountData.cinNo,
      IFSC_Code: accountData.ifscCode,
      plan_type: subscriptionData.planType,
      plan_rate: subscriptionData.planRate,
      companyLogo: companyData.companyLogo,
      CompanyAddress: {
        CompanyState: companyData.state,
        CompanyCountry: companyData.country,
        CompanyCity: companyData.city,
        buildingNumber: companyData.buildingNo,
        CompanyZIP: companyData.zip,
        detailAdddress: companyData.address,
      },
      user: {
        userName: userData.name,
        userEmail: userData.email,
        userPassword: userData.password,
        userMobile: userData.mobile,
        IsActive: userData.isActive,
        companyDomain: domainData.externalDomain,
      },
      userImg: userData.userImage,
    };

    // Dispatch the action
    await dispatch(addCompany(requestData));
  };

  const handleNext = () => {
    const tabIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (tabIndex < tabs.length - 1) {
      setActiveTab(tabs[tabIndex + 1].id as TabType);
    }
  };

  const handlePrevious = () => {
    const tabIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (tabIndex > 0) {
      setActiveTab(tabs[tabIndex - 1].id as TabType);
    }
  };

  const renderCompanyForm = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Company Information
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Enter basic company details
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
        <Box>
          <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
            Company Logo
          </Typography>
          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadIcon />}
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              justifyContent: 'flex-start',
            }}
          >
            {companyData.companyLogo ? companyData.companyLogo.name : 'Upload Logo'}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'companyLogo')}
            />
          </Button>
          {companyData.companyLogoPreview && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <img
                src={companyData.companyLogoPreview}
                alt="Company Logo Preview"
                style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '8px' }}
              />
            </Box>
          )}
        </Box>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <CustomDropdown
          label="Company Type"
          name="companyType"
          value={companyData.companyType}
          onChange={(e) => setCompanyData({ ...companyData, companyType: e.target.value as string })}
          options={companyTypeOptions}
          required
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <CustomDropdown
          label="Country"
          name="country"
          value={companyData.country}
          onChange={(e) => setCompanyData({ ...companyData, country: e.target.value as string })}
          options={countryOptions}
          required
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <CustomDropdown
          label="State"
          name="state"
          value={companyData.state}
          onChange={(e) => setCompanyData({ ...companyData, state: e.target.value as string })}
          options={stateOptions}
          required
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <CustomTextField
          label="City"
          name="city"
          value={companyData.city}
          onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
          placeholder="Enter city"
          required
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <CustomTextField
          label="Building No"
          name="buildingNo"
          value={companyData.buildingNo}
          onChange={(e) => setCompanyData({ ...companyData, buildingNo: e.target.value })}
          placeholder="Building/Floor number"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <CustomTextField
          label="ZIP Code"
          name="zip"
          value={companyData.zip}
          onChange={(e) => setCompanyData({ ...companyData, zip: e.target.value })}
          placeholder="Enter ZIP code"
          required
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <CustomTextField
          label="Address"
          name="address"
          value={companyData.address}
          onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
          placeholder="Enter complete address"
          multiline
          rows={3}
          required
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <CustomDropdown
          label="Currency"
          name="currency"
          value={companyData.currency}
          onChange={(e) => setCompanyData({ ...companyData, currency: e.target.value as string })}
          options={currencyOptions}
          required
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Box sx={{ pt: 3 }}>
          <CustomCheckbox
            singleLabel="Is Active"
            checked={companyData.isActive}
            onSingleChange={(checked) => setCompanyData({ ...companyData, isActive: checked })}
          />
        </Box>
      </Grid>
    </Grid>
  );

  const renderUserForm = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          User Information
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Add primary user details for the company
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <CustomTextField
          label="Name"
          name="name"
          value={userData.name}
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          required
          placeholder="Enter full name"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <CustomTextField
          label="Email Address"
          name="email"
          type="email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          required
          placeholder="user@example.com"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <CustomTextField
          label="Password"
          name="password"
          type="password"
          value={userData.password}
          onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          required
          placeholder="Enter password"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <CustomTextField
          label="Mobile"
          name="mobile"
          value={userData.mobile}
          onChange={(e) => setUserData({ ...userData, mobile: e.target.value })}
          required
          placeholder="+1 (555) 000-0000"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Box>
          <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
            User Image
          </Typography>
          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadIcon />}
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              justifyContent: 'flex-start',
            }}
          >
            {userData.userImage ? userData.userImage.name : 'Upload Image'}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'userImage')}
            />
          </Button>
          {userData.userImagePreview && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <img
                src={userData.userImagePreview}
                alt="User Image Preview"
                style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '8px' }}
              />
            </Box>
          )}
        </Box>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Box sx={{ pt: 3 }}>
          <CustomCheckbox
            singleLabel="Is Active"
            checked={userData.isActive}
            onSingleChange={(checked) => setUserData({ ...userData, isActive: checked })}
          />
        </Box>
      </Grid>
    </Grid>
  );

  const renderDomainForm = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Domain Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Configure domain settings for the company
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <CustomTextField
          label="Domain"
          name="domain"
          value={domainData.domain}
          onChange={(e) => setDomainData({ ...domainData, domain: e.target.value })}
          required
          placeholder="company.com"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <CustomTextField
          label="External Domain"
          name="externalDomain"
          value={domainData.externalDomain}
          onChange={(e) => setDomainData({ ...domainData, externalDomain: e.target.value })}
          placeholder="external.company.com"
        />
      </Grid>
    </Grid>
  );

  const renderAccountForm = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Account Details
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Add company registration and tax information
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <CustomTextField
          label="IFSC Code"
          name="ifscCode"
          value={accountData.ifscCode}
          onChange={(e) => setAccountData({ ...accountData, ifscCode: e.target.value })}
          required
          placeholder="IFSC0001234"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <CustomTextField
          label="PAN No"
          name="panNo"
          value={accountData.panNo}
          onChange={(e) => setAccountData({ ...accountData, panNo: e.target.value })}
          required
          placeholder="ABCDE1234F"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <CustomTextField
          label="GST No"
          name="gstNo"
          value={accountData.gstNo}
          onChange={(e) => setAccountData({ ...accountData, gstNo: e.target.value })}
          required
          placeholder="22AAAAA0000A1Z5"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <CustomTextField
          label="CIN No"
          name="cinNo"
          value={accountData.cinNo}
          onChange={(e) => setAccountData({ ...accountData, cinNo: e.target.value })}
          required
          placeholder="U12345AB2020PTC123456"
        />
      </Grid>
    </Grid>
  );

  const renderSubscriptionForm = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Subscription Plan
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Configure subscription and pricing details
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <CustomDropdown
          label="Plan Type"
          name="planType"
          value={subscriptionData.planType}
          onChange={(e) => setSubscriptionData({ ...subscriptionData, planType: e.target.value as string })}
          options={planTypeOptions}
          required
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <CustomTextField
          label="Plan Rate"
          name="planRate"
          type="number"
          value={subscriptionData.planRate}
          onChange={(e) => setSubscriptionData({ ...subscriptionData, planRate: e.target.value })}
          required
          placeholder="Enter plan rate"
        />
      </Grid>
    </Grid>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'company':
        return renderCompanyForm();
      case 'user':
        return renderUserForm();
      case 'domain':
        return renderDomainForm();
      case 'account':
        return renderAccountForm();
      case 'subscription':
        return renderSubscriptionForm();
      default:
        return renderCompanyForm();
    }
  };

  const isLastTab = activeTab === 'subscription';
  const isFirstTab = activeTab === 'company';

  // Show loading spinner when fetching company data in edit mode
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
          Loading company data...
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
          {isEditMode ? 'Edit Company' : 'Add New Company'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isEditMode ? 'Update the company information' : 'Fill in the information to create a new company'}
        </Typography>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Side - Tab Buttons */}
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

        {/* Right Side - Form Content */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box component="form" onSubmit={handleSubmit}>
                {renderContent()}

                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', mt: 4, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
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
                    {!isFirstTab && (
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={handlePrevious}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          px: 4
                        }}
                      >
                        Previous
                      </Button>
                    )}
                  </Box>
                  <Box>
                    {!isLastTab ? (
                      <Button
                        variant="contained"
                        size="large"
                        onClick={handleNext}
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
                        Next
                      </Button>
                    ) : (
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
                        {loading ? 'Saving...' : isEditMode ? 'Update Company' : 'Submit & Save'}
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {error || 'Company added successfully!'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddCompanyPage;
