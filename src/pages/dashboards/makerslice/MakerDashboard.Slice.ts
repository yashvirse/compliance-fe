import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../../services/api';
import type {
  MakerDashboardState,
  GetTaskCountResponse,
  GetPendingTasksResponse,
  GetApprovedTasksResponse,
  GetRejectedTasksResponse,
  ApproveTaskRequest,
  ApproveTaskResponse,
  RejectTaskRequest,
  RejectTaskResponse,
} from './MakerDashboard.Type';

// Initial state
const initialState: MakerDashboardState = {
  tasks: [],
  pendingTasks: [],
  approvedTasks: [],
  rejectedTasks: [],
  counts: null,
  taskActionsLoading: false,
  taskActionsError: null,
  pendingTasksLoading: false,
  pendingTasksError: null,
  approvedTasksLoading: false,
  approvedTasksError: null,
  rejectedTasksLoading: false,
  rejectedTasksError: null,
  loading: false,
  error: null,
};

// ===== Async Thunks =====



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

// Fetch pending tasks
export const fetchPendingTasks = createAsyncThunk(
  'makerDashboard/fetchPendingTasks',
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

// Fetch approved tasks
export const fetchApprovedTasks = createAsyncThunk(
  'makerDashboard/fetchApprovedTasks',
  async (userID: string, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching approved tasks for user:', userID);
      const response = await apiService.get<GetApprovedTasksResponse>(
        `Dashboard/getApprovedTaskDtl?userID=${userID}`
      );
      console.log('📋 Approved Tasks API Response:', response);

      if (response.isSuccess) {
        console.log('✅ Approved tasks received:', response.result);
        return response.result;
      }

      console.error('❌ API error:', response.message);
      return rejectWithValue(response.message || 'Failed to fetch approved tasks');
    } catch (error: any) {
      console.error('❌ Fetch error:', error);
      return rejectWithValue(error?.message || 'Failed to fetch approved tasks');
    }
  }
);

// Fetch rejected tasks
export const fetchRejectedTasks = createAsyncThunk(
  'makerDashboard/fetchRejectedTasks',
  async (userID: string, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching rejected tasks for user:', userID);
      const response = await apiService.get<GetRejectedTasksResponse>(
        `Dashboard/getRejectedTaskDtl?userID=${userID}`
      );
      console.log('📋 Rejected Tasks API Response:', response);

      if (response.isSuccess) {
        console.log('✅ Rejected tasks received:', response.result);
        return response.result;
      }

      console.error('❌ API error:', response.message);
      return rejectWithValue(response.message || 'Failed to fetch rejected tasks');
    } catch (error: any) {
      console.error('❌ Fetch error:', error);
      return rejectWithValue(error?.message || 'Failed to fetch rejected tasks');
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
      // Fetch pending tasks
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
      })
      // Fetch approved tasks
      .addCase(fetchApprovedTasks.pending, (state) => {
        state.approvedTasksLoading = true;
        state.approvedTasksError = null;
      })
      .addCase(fetchApprovedTasks.fulfilled, (state, action) => {
        state.approvedTasksLoading = false;
        state.approvedTasks = action.payload;
      })
      .addCase(fetchApprovedTasks.rejected, (state, action) => {
        state.approvedTasksLoading = false;
        state.approvedTasksError = action.payload as string;
      })
      // Fetch rejected tasks
      .addCase(fetchRejectedTasks.pending, (state) => {
        state.rejectedTasksLoading = true;
        state.rejectedTasksError = null;
      })
      .addCase(fetchRejectedTasks.fulfilled, (state, action) => {
        state.rejectedTasksLoading = false;
        state.rejectedTasks = action.payload;
      })
      .addCase(fetchRejectedTasks.rejected, (state, action) => {
        state.rejectedTasksLoading = false;
        state.rejectedTasksError = action.payload as string;
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
