import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../../services/api';
import type {
  MakerDashboardState,
  GetAssignedTasksResponse,
  GetTaskCountResponse,
  ApproveTaskRequest,
  ApproveTaskResponse,
  RejectTaskRequest,
  RejectTaskResponse,
} from './MakerDashboard.Type';

// Initial state
const initialState: MakerDashboardState = {
  tasks: [],
  counts: null,
  taskActionsLoading: false,
  taskActionsError: null,
  loading: false,
  error: null,
};

// ===== Async Thunks =====

// Fetch assigned tasks for a user
export const fetchAssignedTasks = createAsyncThunk(
  'makerDashboard/fetchAssignedTasks',
  async (userID: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<GetAssignedTasksResponse>(
        `Master/getAssinedTask?userID=${userID}`
      );

      if (response.isSuccess) {
        return response.result;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch assigned tasks');
      }
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch assigned tasks');
    }
  }
);

// Fetch dashboard task counts
export const fetchTaskCount = createAsyncThunk(
  'makerDashboard/fetchTaskCount',
  async (userId: string, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching task counts for user:', userId);
      const response = await apiService.get<GetTaskCountResponse>(
        `Dashboard/getTaskCount?userID=${userId}`
      );
      console.log('📊 Dashboard API Response:', response);

      if (response.isSuccess && response.result) {
        console.log('✅ Task counts received:', response.result);
        return response.result;
      }

      console.error('❌ API error:', response.message);
      return rejectWithValue(response.message || 'Failed to fetch dashboard counts');
    } catch (error: any) {
      console.error('❌ Fetch error:', error);
      return rejectWithValue(error?.message || 'Failed to fetch dashboard counts');
    }
  }
);

// Approve task
export const approveTask = createAsyncThunk<
  ApproveTaskResponse,
  ApproveTaskRequest,
  { rejectValue: string }
>(
  'makerDashboard/approveTask',
  async (payload, { rejectWithValue }) => {
    try {
      console.log('🔄 Approving task:', payload.taskID);
      const response = await apiService.post<ApproveTaskResponse>(
        `Dashboard/approveTask?taskID=${payload.taskID}&remark=${encodeURIComponent(payload.remark)}`,
        {}
      );
      console.log('✅ Task approved successfully:', response);
      if (!response.isSuccess) {
        return rejectWithValue(response.message || 'Failed to approve task');
      }
      return response;
    } catch (error: any) {
      console.error('❌ Approve task error:', error);
      return rejectWithValue(error?.message || 'Error approving task');
    }
  }
);

// Reject task
export const rejectTask = createAsyncThunk<
  RejectTaskResponse,
  RejectTaskRequest,
  { rejectValue: string }
>(
  'makerDashboard/rejectTask',
  async (payload, { rejectWithValue }) => {
    try {
      console.log('🔄 Rejecting task:', payload.taskID);
      const response = await apiService.post<RejectTaskResponse>(
        `Dashboard/rejectTask?taskID=${payload.taskID}&remark=${encodeURIComponent(payload.remark)}`,
        {}
      );
      console.log('✅ Task rejected successfully:', response);
      if (!response.isSuccess) {
        return rejectWithValue(response.message || 'Failed to reject task');
      }
      return response;
    } catch (error: any) {
      console.error('❌ Reject task error:', error);
      return rejectWithValue(error?.message || 'Error rejecting task');
    }
  }
);

// Slice
const makerDashboardSlice = createSlice({
  name: 'makerDashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearTaskActionError: (state) => {
      state.taskActionsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch assigned tasks
      .addCase(fetchAssignedTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignedTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchAssignedTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch task counts
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
      })
      // Approve task
      .addCase(approveTask.pending, (state) => {
        state.taskActionsLoading = true;
        state.taskActionsError = null;
      })
      .addCase(approveTask.fulfilled, (state) => {
        state.taskActionsLoading = false;
        state.taskActionsError = null;
      })
      .addCase(approveTask.rejected, (state, action) => {
        state.taskActionsLoading = false;
        state.taskActionsError = action.payload || 'Failed to approve task';
      })
      // Reject task
      .addCase(rejectTask.pending, (state) => {
        state.taskActionsLoading = true;
        state.taskActionsError = null;
      })
      .addCase(rejectTask.fulfilled, (state) => {
        state.taskActionsLoading = false;
        state.taskActionsError = null;
      })
      .addCase(rejectTask.rejected, (state, action) => {
        state.taskActionsLoading = false;
        state.taskActionsError = action.payload || 'Failed to reject task';
      });
  },
});

export const { clearError, clearTaskActionError } = makerDashboardSlice.actions;
export default makerDashboardSlice.reducer;
