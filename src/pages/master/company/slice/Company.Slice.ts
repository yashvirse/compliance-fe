import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../../../services/api';
import type { 
  AddCompanyRequest, 
  AddCompanyResponse, 
  CompanyState,
  GetCompanyListResponse,
  DeleteCompanyResponse,
  GetCompanyByIdResponse,
  UpdateCompanyRequest,
  UpdateCompanyResponse
} from './Company.Type';

// Initial state
const initialState: CompanyState = {
  loading: false,
  error: null,
  success: false,
  companies: [],
  fetchLoading: false,
  fetchError: null,
  deleteLoading: false,
  deleteError: null,
  deleteSuccess: false,
  currentCompany: null,
  fetchByIdLoading: false,
  fetchByIdError: null,
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

// Async thunk for fetching company list
export const fetchCompanyList = createAsyncThunk<
  GetCompanyListResponse,
  void,
  { rejectValue: string }
>(
  'company/fetchCompanyList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get<GetCompanyListResponse>(
        'CompanyMaster/getCompList'
      );

      // Check if fetch was successful
      if (!response.isSuccess) {
        return rejectWithValue(response.message || 'Failed to fetch companies');
      }

      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to fetch companies. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for deleting company
export const deleteCompany = createAsyncThunk<
  DeleteCompanyResponse,
  string,
  { rejectValue: string }
>(
  'company/deleteCompany',
  async (companyId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.delete<DeleteCompanyResponse>(
        `CompanyMaster/deleteComp/${companyId}`
      );

      // Check if delete was successful
      if (!response.isSuccess) {
        return rejectWithValue(response.message || 'Failed to delete company');
      }

      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to delete company. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for fetching company by ID
export const fetchCompanyById = createAsyncThunk<
  GetCompanyByIdResponse,
  string,
  { rejectValue: string }
>(
  'company/fetchCompanyById',
  async (companyId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<GetCompanyByIdResponse>(
        `CompanyMaster/getCompByID/${companyId}`
      );

      // Check if fetch was successful
      if (!response.isSuccess) {
        return rejectWithValue(response.message || 'Failed to fetch company details');
      }

      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to fetch company details. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for updating company
export const updateCompany = createAsyncThunk<
  UpdateCompanyResponse,
  UpdateCompanyRequest,
  { rejectValue: string }
>(
  'company/updateCompany',
  async (companyData: UpdateCompanyRequest, { rejectWithValue }) => {
    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();

      // Required fields
      formData.append('CID', companyData.CID);
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

      // Company Logo (file or string)
      if (companyData.companyLogo instanceof File) {
        formData.append('companyLogo', companyData.companyLogo);
      } else if (companyData.CompanyLogo) {
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

      // User Data - Required fields
      formData.append('user.userID', companyData.user.userID);
      formData.append('user.userName', companyData.user.userName);
      formData.append('user.userEmail', companyData.user.userEmail);
      formData.append('user.userPassword', companyData.user.userPassword);
      formData.append('user.userMobile', companyData.user.userMobile);
      formData.append('user.IsActive', String(companyData.user.IsActive));
      
      // User Image (file or string)
      if (companyData.userImg instanceof File) {
        formData.append('userImage', companyData.userImg);
      } else if (companyData.user.userImage) {
        formData.append('user.userImage', companyData.user.userImage);
      }

      // Optional user fields
      if (companyData.user.userRole) {
        formData.append('user.userRole', companyData.user.userRole);
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
      if (companyData.CreatedBy) {
        formData.append('CreatedBy', companyData.CreatedBy);
      }

      // Make API call
      const response = await apiService.upload<UpdateCompanyResponse>(
        'CompanyMaster/editComp',
        formData
      );

      // Check if company update was successful
      if (!response.isSuccess) {
        return rejectWithValue(response.message || 'Failed to update company');
      }

      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to update company. Please try again.';
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
      state.deleteSuccess = false;
    },
    
    // Reset state
    resetCompanyState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.deleteLoading = false;
      state.deleteError = null;
      state.deleteSuccess = false;
      state.currentCompany = null;
      state.fetchByIdLoading = false;
      state.fetchByIdError = null;
    },
    
    // Clear current company
    clearCurrentCompany: (state) => {
      state.currentCompany = null;
      state.fetchByIdLoading = false;
      state.fetchByIdError = null;
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
      })
      // Fetch Company List pending
      .addCase(fetchCompanyList.pending, (state) => {
        state.fetchLoading = true;
        state.fetchError = null;
      })
      // Fetch Company List fulfilled
      .addCase(fetchCompanyList.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.fetchError = null;
        state.companies = action.payload.result;
      })
      // Fetch Company List rejected
      .addCase(fetchCompanyList.rejected, (state, action) => {
        state.fetchLoading = false;
        state.fetchError = action.payload || 'An error occurred while fetching companies';
      })
      // Delete Company pending
      .addCase(deleteCompany.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })
      // Delete Company fulfilled
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = null;
        state.deleteSuccess = true;
        // Remove deleted company from the list
        state.companies = state.companies.filter(
          (company) => company.cid !== action.meta.arg
        );
      })
      // Delete Company rejected
      .addCase(deleteCompany.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload || 'An error occurred while deleting company';
        state.deleteSuccess = false;
      })
      // Fetch Company By ID pending
      .addCase(fetchCompanyById.pending, (state) => {
        state.fetchByIdLoading = true;
        state.fetchByIdError = null;
        state.currentCompany = null;
      })
      // Fetch Company By ID fulfilled
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.fetchByIdLoading = false;
        state.fetchByIdError = null;
        state.currentCompany = action.payload.result;
      })
      // Fetch Company By ID rejected
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.fetchByIdLoading = false;
        state.fetchByIdError = action.payload || 'An error occurred while fetching company details';
        state.currentCompany = null;
      })
      // Update Company pending
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      // Update Company fulfilled
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        // Update the company in the list if it exists
        const updatedCompanyIndex = state.companies.findIndex(
          (company) => company.cid === action.meta.arg.CID
        );
        if (updatedCompanyIndex !== -1 && action.payload.result) {
          state.companies[updatedCompanyIndex] = action.payload.result;
        }
      })
      // Update Company rejected
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred while updating company';
        state.success = false;
      });
  },
});

// Export actions
export const { clearError, clearSuccess, resetCompanyState, clearCurrentCompany } = companySlice.actions;

// Export reducer
export default companySlice.reducer;
