import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../../services/api';
import type { GetTaskCountResponse, AuditorDashboardState, GetPendingTasksResponse } from './AuditorDashboard.Type';

export const fetchTaskCount = createAsyncThunk(
  'auditorDashboard/fetchTaskCount',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<GetTaskCountResponse>(
        `Dashboard/getTaskCount?userID=${userId}`
      );
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch task count');
    }
  }
);

export const fetchPendingTasks = createAsyncThunk(
  'auditorDashboard/fetchPendingTasks',
  async (userID: string, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching pending tasks for user:', userID);
      const response = await apiService.get<GetPendingTasksResponse>(
        `Dashboard/getPendingTaskDtl?userID=${userID}`
      );
      console.log('📋 Pending Tasks API Response:', response);

      if (response.isSuccess) {
        console.log('✅ Pending tasks received:', response.result);
        return response.result;
      }

      console.error('❌ API error:', response.message);
      return rejectWithValue(response.message || 'Failed to fetch pending tasks');
    } catch (error: any) {
      console.error('❌ Fetch error:', error);
      return rejectWithValue(error?.message || 'Failed to fetch pending tasks');
    }
  }
);

const initialState: AuditorDashboardState = {
  taskCounts: null,
  pendingTasks: [],
  loading: false,
  pendingTasksLoading: false,
  error: null,
  pendingTasksError: null,
  successMessage: null,
};

const auditorDashboardSlice = createSlice({
  name: 'auditorDashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearPendingTasksError: (state) => {
      state.pendingTasksError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Task Count
      .addCase(fetchTaskCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskCount.fulfilled, (state, action) => {
        state.loading = false;
        state.taskCounts = action.payload;
      })
      .addCase(fetchTaskCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Pending Tasks
      .addCase(fetchPendingTasks.pending, (state) => {
        state.pendingTasksLoading = true;
        state.pendingTasksError = null;
      })
      .addCase(fetchPendingTasks.fulfilled, (state, action) => {
        state.pendingTasksLoading = false;
        state.pendingTasks = action.payload;
      })
      .addCase(fetchPendingTasks.rejected, (state, action) => {
        state.pendingTasksLoading = false;
        state.pendingTasksError = action.payload as string;
      });
  },
});

export const { clearError, clearSuccessMessage, clearPendingTasksError } = auditorDashboardSlice.actions;
export default auditorDashboardSlice.reducer;
