import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../../services/api';
import type { DashboardState, GetTaskCountResponse, TaskCountResult } from './Dashboard.Type';

const initialState: DashboardState = {
  counts: null,
  loading: false,
  error: null,
};

// Fetch dashboard task counts for a user
export const fetchTaskCount = createAsyncThunk(
  'dashboard/fetchTaskCount',
  async (userId: string, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching task counts for user:', userId);
      const response = await apiService.get<GetTaskCountResponse>(`Dashboard/getTaskCount?userID=${userId}`);
      console.log('📊 Dashboard API Response:', response);

      if (response.isSuccess && response.result) {
        console.log('✅ Task counts received:', response.result);
        return response.result;
      }

      console.error('❌ API error:', response.message);
      return rejectWithValue(response.message || 'Failed to fetch dashboard counts');
    } catch (error: any) {
      console.error('❌ Fetch error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard counts');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskCount.fulfilled, (state, action) => {
        state.loading = false;
        state.counts = action.payload;
      })
      .addCase(fetchTaskCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
