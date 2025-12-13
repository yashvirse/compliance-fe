import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../../services/api';
import type {
  CheckerDashboardState,
  GetCheckerTaskCountResponse,
  GetPendingCheckTasksResponse,
  GetApprovedCheckTasksResponse,
  GetRejectedCheckTasksResponse,
  ApproveCheckTaskRequest,
  ApproveCheckTaskResponse,
  RejectCheckTaskRequest,
  RejectCheckTaskResponse,
} from './CheckerDashboard.Type';

// Initial state
const initialState: CheckerDashboardState = {
  pendingCheckTasks: [],
  approvedCheckTasks: [],
  rejectedCheckTasks: [],
  counts: null,
  taskActionsLoading: false,
  taskActionsError: null,
  pendingCheckTasksLoading: false,
  pendingCheckTasksError: null,
  approvedCheckTasksLoading: false,
  approvedCheckTasksError: null,
  rejectedCheckTasksLoading: false,
  rejectedCheckTasksError: null,
  loading: false,
  error: null,
};

// ===== Async Thunks =====

// Fetch dashboard task counts
export const fetchCheckerTaskCount = createAsyncThunk(
  'checkerDashboard/fetchTaskCount',
  async (userId: string, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching checker task counts for user:', userId);
      const response = await apiService.get<GetCheckerTaskCountResponse>(
        `Dashboard/getTaskCount?userID=${userId}`
      );
      console.log('📊 Checker Dashboard API Response:', response);

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

// Fetch pending check tasks
export const fetchPendingCheckTasks = createAsyncThunk(
  'checkerDashboard/fetchPendingCheckTasks',
  async (userID: string, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching pending check tasks for user:', userID);
      const response = await apiService.get<GetPendingCheckTasksResponse>(
        `Dashboard/getPendingTaskDtl?userID=${userID}`
      );
      console.log('📋 Pending Check Tasks API Response:', response);

      if (response.isSuccess) {
        console.log('✅ Pending check tasks received:', response.result);
        return response.result;
      }

      console.error('❌ API error:', response.message);
      return rejectWithValue(response.message || 'Failed to fetch pending check tasks');
    } catch (error: any) {
      console.error('❌ Fetch error:', error);
      return rejectWithValue(error?.message || 'Failed to fetch pending check tasks');
    }
  }
);

// Fetch approved check tasks
export const fetchApprovedCheckTasks = createAsyncThunk(
  'checkerDashboard/fetchApprovedCheckTasks',
  async (userID: string, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching approved check tasks for user:', userID);
      const response = await apiService.get<GetApprovedCheckTasksResponse>(
        `Dashboard/getApprovedTaskDtl?userID=${userID}`
      );
      console.log('📋 Approved Check Tasks API Response:', response);

      if (response.isSuccess) {
        console.log('✅ Approved check tasks received:', response.result);
        return response.result;
      }

      console.error('❌ API error:', response.message);
      return rejectWithValue(response.message || 'Failed to fetch approved check tasks');
    } catch (error: any) {
      console.error('❌ Fetch error:', error);
      return rejectWithValue(error?.message || 'Failed to fetch approved check tasks');
    }
  }
);

// Fetch rejected check tasks
export const fetchRejectedCheckTasks = createAsyncThunk(
  'checkerDashboard/fetchRejectedCheckTasks',
  async (userID: string, { rejectWithValue }) => {
    try {
      console.log('🔄 Fetching rejected check tasks for user:', userID);
      const response = await apiService.get<GetRejectedCheckTasksResponse>(
        `Dashboard/getRejectedTaskDtl?userID=${userID}`
      );
      console.log('📋 Rejected Check Tasks API Response:', response);

      if (response.isSuccess) {
        console.log('✅ Rejected check tasks received:', response.result);
        return response.result;
      }

      console.error('❌ API error:', response.message);
      return rejectWithValue(response.message || 'Failed to fetch rejected check tasks');
    } catch (error: any) {
      console.error('❌ Fetch error:', error);
      return rejectWithValue(error?.message || 'Failed to fetch rejected check tasks');
    }
  }
);

// Approve check task
export const approveCheckTask = createAsyncThunk<
  ApproveCheckTaskResponse,
  ApproveCheckTaskRequest,
  { rejectValue: string }
>(
  'checkerDashboard/approveCheckTask',
  async (payload, { rejectWithValue }) => {
    try {
      console.log('🔄 Approving check task:', payload.taskID);
      const response = await apiService.post<ApproveCheckTaskResponse>(
        `Dashboard/approveTask?taskID=${payload.taskID}&remark=${encodeURIComponent(payload.remark)}`,
        {}
      );
      console.log('✅ Check task approved successfully:', response);
      if (!response.isSuccess) {
        return rejectWithValue(response.message || 'Failed to approve check task');
      }
      return response;
    } catch (error: any) {
      console.error('❌ Approve check task error:', error);
      return rejectWithValue(error?.message || 'Error approving check task');
    }
  }
);

// Reject check task
export const rejectCheckTask = createAsyncThunk<
  RejectCheckTaskResponse,
  RejectCheckTaskRequest,
  { rejectValue: string }
>(
  'checkerDashboard/rejectCheckTask',
  async (payload, { rejectWithValue }) => {
    try {
      console.log('🔄 Rejecting check task:', payload.taskID);
      const response = await apiService.post<RejectCheckTaskResponse>(
        `Dashboard/rejectCheckTask?taskID=${payload.taskID}&remark=${encodeURIComponent(payload.remark)}`,
        {}
      );
      console.log('✅ Check task rejected successfully:', response);
      if (!response.isSuccess) {
        return rejectWithValue(response.message || 'Failed to reject check task');
      }
      return response;
    } catch (error: any) {
      console.error('❌ Reject check task error:', error);
      return rejectWithValue(error?.message || 'Error rejecting check task');
    }
  }
);

// Slice
const checkerDashboardSlice = createSlice({
  name: 'checkerDashboard',
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
      // Fetch task counts
      .addCase(fetchCheckerTaskCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCheckerTaskCount.fulfilled, (state, action) => {
        state.loading = false;
        state.counts = action.payload;
      })
      .addCase(fetchCheckerTaskCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch pending check tasks
      .addCase(fetchPendingCheckTasks.pending, (state) => {
        state.pendingCheckTasksLoading = true;
        state.pendingCheckTasksError = null;
      })
      .addCase(fetchPendingCheckTasks.fulfilled, (state, action) => {
        state.pendingCheckTasksLoading = false;
        state.pendingCheckTasks = action.payload;
      })
      .addCase(fetchPendingCheckTasks.rejected, (state, action) => {
        state.pendingCheckTasksLoading = false;
        state.pendingCheckTasksError = action.payload as string;
      })
      // Fetch approved check tasks
      .addCase(fetchApprovedCheckTasks.pending, (state) => {
        state.approvedCheckTasksLoading = true;
        state.approvedCheckTasksError = null;
      })
      .addCase(fetchApprovedCheckTasks.fulfilled, (state, action) => {
        state.approvedCheckTasksLoading = false;
        state.approvedCheckTasks = action.payload;
      })
      .addCase(fetchApprovedCheckTasks.rejected, (state, action) => {
        state.approvedCheckTasksLoading = false;
        state.approvedCheckTasksError = action.payload as string;
      })
      // Fetch rejected check tasks
      .addCase(fetchRejectedCheckTasks.pending, (state) => {
        state.rejectedCheckTasksLoading = true;
        state.rejectedCheckTasksError = null;
      })
      .addCase(fetchRejectedCheckTasks.fulfilled, (state, action) => {
        state.rejectedCheckTasksLoading = false;
        state.rejectedCheckTasks = action.payload;
      })
      .addCase(fetchRejectedCheckTasks.rejected, (state, action) => {
        state.rejectedCheckTasksLoading = false;
        state.rejectedCheckTasksError = action.payload as string;
      })
      // Approve check task
      .addCase(approveCheckTask.pending, (state) => {
        state.taskActionsLoading = true;
        state.taskActionsError = null;
      })
      .addCase(approveCheckTask.fulfilled, (state) => {
        state.taskActionsLoading = false;
        state.taskActionsError = null;
      })
      .addCase(approveCheckTask.rejected, (state, action) => {
        state.taskActionsLoading = false;
        state.taskActionsError = action.payload || 'Failed to approve check task';
      })
      // Reject check task
      .addCase(rejectCheckTask.pending, (state) => {
        state.taskActionsLoading = true;
        state.taskActionsError = null;
      })
      .addCase(rejectCheckTask.fulfilled, (state) => {
        state.taskActionsLoading = false;
        state.taskActionsError = null;
      })
      .addCase(rejectCheckTask.rejected, (state, action) => {
        state.taskActionsLoading = false;
        state.taskActionsError = action.payload || 'Failed to reject check task';
      });
  },
});

export const { clearError, clearTaskActionError } = checkerDashboardSlice.actions;
export default checkerDashboardSlice.reducer;
