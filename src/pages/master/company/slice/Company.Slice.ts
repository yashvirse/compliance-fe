import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../../../services/api';
import type { 
  AddCompanyRequest, 
  AddCompanyResponse, 
  CompanyState 
} from './Company.Type';

// Initial state
const initialState: CompanyState = {
  loading: false,
  error: null,
  success: false,
  companies: [],
};

// Async thunk for adding company
export const addCompany = createAsyncThunk<
  AddCompanyResponse,
  AddCompanyRequest,
  { rejectValue: string }
>(
  'company/addCompany',
  async (companyData: AddCompanyRequest, { rejectWithValue }) => {
    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();

      // Company basic fields
      formData.append('CompanyName', companyData.CompanyName);
      formData.append('CompanyType', companyData.CompanyType);
      formData.append('CompanyCurrency', companyData.CompanyCurrency);
      formData.append('CompanyIsActive', String(companyData.CompanyIsActive));
      formData.append('CompanyDomain', companyData.CompanyDomain);
      
      // Financial details
      formData.append('PAN_No', companyData.PAN_No);
      formData.append('GST_NO', companyData.GST_NO);
      formData.append('CIN_NO', companyData.CIN_NO);
      formData.append('IFSC_Code', companyData.IFSC_Code);
      
      // Subscription
      formData.append('plan_type', companyData.plan_type);
      formData.append('plan_rate', companyData.plan_rate);

      // Company Logo (file)
      if (companyData.companyLogo) {
        formData.append('companyLogo', companyData.companyLogo);
      }
      if (companyData.CompanyLogo) {
        formData.append('CompanyLogo', companyData.CompanyLogo);
      }

      // Company Address
      formData.append('CompanyAddress.CompanyState', companyData.CompanyAddress.CompanyState);
      formData.append('CompanyAddress.CompanyCountry', companyData.CompanyAddress.CompanyCountry);
      formData.append('CompanyAddress.CompanyCity', companyData.CompanyAddress.CompanyCity);
      formData.append('CompanyAddress.CompanyZIP', companyData.CompanyAddress.CompanyZIP);
      formData.append('CompanyAddress.detailAdddress', companyData.CompanyAddress.detailAdddress);
      
      if (companyData.CompanyAddress.buildingNumber) {
        formData.append('CompanyAddress.buildingNumber', companyData.CompanyAddress.buildingNumber);
      }
      if (companyData.CompanyAddress.latitude) {
        formData.append('CompanyAddress.latitude', companyData.CompanyAddress.latitude);
      }
      if (companyData.CompanyAddress.longitude) {
        formData.append('CompanyAddress.longitude', companyData.CompanyAddress.longitude);
      }

      // User Data
      formData.append('user.userName', companyData.user.userName);
      formData.append('user.userEmail', companyData.user.userEmail);
      formData.append('user.userPassword', companyData.user.userPassword);
      formData.append('user.userMobile', companyData.user.userMobile);
      formData.append('user.IsActive', String(companyData.user.IsActive));
      formData.append('user.userRole', 'CustomerAdmin');
      formData.append('CID', 'CID');
      formData.append('CreatedBy', 'CreatedBy');
      

      // User Image (file)
      if (companyData.userImg) {
        formData.append('userImg', companyData.userImg);
      }
      if (companyData.user.userImage) {
        formData.append('user.userImage', companyData.user.userImage);
      }

      // Optional user fields
      if (companyData.user.userRole) {
        formData.append('user.userRole', companyData.user.userRole);
      }
      if (companyData.user.userID) {
        formData.append('user.userID', companyData.user.userID);
      }
      if (companyData.user.companyId) {
        formData.append('user.companyId', companyData.user.companyId);
      }
      if (companyData.user.companyDomain) {
        formData.append('user.companyDomain', companyData.user.companyDomain);
      }
      if (companyData.user.companyType) {
        formData.append('user.companyType', companyData.user.companyType);
      }
      if (companyData.user.createdBy) {
        formData.append('user.createdBy', companyData.user.createdBy);
      }
      if (companyData.user.createdOn) {
        formData.append('user.createdOn', companyData.user.createdOn);
      }

      // Optional company fields
      if (companyData.CID) {
        formData.append('CID', companyData.CID);
      }
      if (companyData.CreatedBy) {
        formData.append('CreatedBy', companyData.CreatedBy);
      }

      // Make API call
      const response = await apiService.upload<AddCompanyResponse>(
        'CompanyMaster/addComp',
        formData
      );

      // Check if company addition was successful
      if (!response.isSuccess) {
        return rejectWithValue(response.message || 'Failed to add company');
      }

      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to add company. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

// Company slice
const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear success
    clearSuccess: (state) => {
      state.success = false;
    },
    
    // Reset state
    resetCompanyState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Company pending
      .addCase(addCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      // Add Company fulfilled
      .addCase(addCompany.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      // Add Company rejected
      .addCase(addCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred while adding company';
        state.success = false;
      });
  },
});

// Export actions
export const { clearError, clearSuccess, resetCompanyState } = companySlice.actions;

// Export reducer
export default companySlice.reducer;
