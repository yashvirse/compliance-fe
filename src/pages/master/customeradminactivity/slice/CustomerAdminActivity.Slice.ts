import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../../../services/api';
import type {
  CustomerAdminActivityState,
  GetActivityMasterListResponse,
  ImportActivitiesResponse
} from './CustomerAdminActivity.Type';

const initialState: CustomerAdminActivityState = {
  activities: [],
  loading: false,
  error: null
};

// Async thunks
export const fetchActivityMasterList = createAsyncThunk(
  'customerAdminActivity/fetchActivityMasterList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<GetActivityMasterListResponse>(
        'Master/getSupAdmActMastList'
      );
      
      if (response.data.isSuccess) {
        return response.data.result;
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch activity masters');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'An error occurred while fetching activity masters'
      );
    }
  }
);

export const fetchCompanyActivityList = createAsyncThunk(
  'customerAdminActivity/fetchCompanyActivityList',
  async (_, { rejectWithValue }) => {
    try {
      // Get companyId from localStorage
      const companyId = localStorage.getItem('companyID') || '';
      
      const response = await apiClient.get<GetActivityMasterListResponse>(
        `CompanyActivityMaster/getCompActivityMasterList/${companyId}`
      );
      
      if (response.data.isSuccess) {
        return response.data.result;
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch company activities');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'An error occurred while fetching company activities'
      );
    }
  }
);

export const importActivities = createAsyncThunk(
  'customerAdminActivity/importActivities',
  async (activityIds: string[], { rejectWithValue }) => {
    try {
      const response = await apiClient.post<ImportActivitiesResponse>(
        'CompanyActivityMaster/addCompActivityMaster',
        activityIds,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.isSuccess) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || 'Failed to import activities');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'An error occurred while importing activities'
      );
    }
  }
);

const customerAdminActivitySlice = createSlice({
  name: 'customerAdminActivity',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Activity Master List
      .addCase(fetchActivityMasterList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityMasterList.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchActivityMasterList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Company Activity List
      .addCase(fetchCompanyActivityList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyActivityList.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchCompanyActivityList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Import Activities
      .addCase(importActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(importActivities.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(importActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError } = customerAdminActivitySlice.actions;
export default customerAdminActivitySlice.reducer;
