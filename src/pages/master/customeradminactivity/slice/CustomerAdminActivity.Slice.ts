import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../../../services/api';
import type {
  CustomerAdminActivityState,
  GetActivityMasterListResponse
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
      });
  }
});

export const { clearError } = customerAdminActivitySlice.actions;
export default customerAdminActivitySlice.reducer;
