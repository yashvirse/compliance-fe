import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../../services/api";
import type {
  AuditorDashboardState,
  GetTaskCountResponse,
  GetPendingTasksResponse,
  GetApprovedTasksResponse,
  GetRejectedTasksResponse,
  ApproveTaskResponse,
  ApproveTaskRequest,
  RejectTaskResponse,
  RejectTaskRequest,
} from "./AuditorDashboard.Type";

const initialState: AuditorDashboardState = {
  pendingTasks: [],
  approvedTasks: [],
  rejectedTasks: [],
  counts: null,
  loading: false,
  pendingTasksLoading: false,
  approvedTasksLoading: false,
  rejectedTasksLoading: false,
  error: null,
  pendingTasksError: null,
  approvedTasksError: null,
  rejectedTasksError: null,
  successMessage: null,
  taskActionsLoading: false,
  taskActionsError: null,
};

// Fetch task counts
export const fetchTaskCount = createAsyncThunk(
  "auditorDashboard/fetchTaskCount",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<GetTaskCountResponse>(
        `Dashboard/getTaskCount?userID=${userId}`
      );
      if (response.isSuccess && response.result) {
        return response.result;
      }
      return rejectWithValue(response.message || "Failed to fetch task counts");
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch task counts");
    }
  }
);

// Fetch pending tasks
export const fetchPendingTasks = createAsyncThunk(
  "auditorDashboard/fetchPendingTasks",
  async (userID: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<GetPendingTasksResponse>(
        `Dashboard/getPendingTaskDtl?userID=${userID}`
      );
      if (response.isSuccess) {
        return response.result;
      }
      return rejectWithValue(
        response.message || "Failed to fetch pending tasks"
      );
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch pending tasks");
    }
  }
);

// Fetch approved tasks
export const fetchApprovedTasks = createAsyncThunk(
  "auditorDashboard/fetchApprovedTasks",
  async (userID: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<GetApprovedTasksResponse>(
        `Dashboard/getApprovedTaskDtl?userID=${userID}`
      );
      if (response.isSuccess) {
        return response.result;
      }
      return rejectWithValue(
        response.message || "Failed to fetch approved tasks"
      );
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch approved tasks"
      );
    }
  }
);

// Fetch rejected tasks
export const fetchRejectedTasks = createAsyncThunk(
  "auditorDashboard/fetchRejectedTasks",
  async (userID: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<GetRejectedTasksResponse>(
        `Dashboard/getRejectedTaskDtl?userID=${userID}`
      );
      if (response.isSuccess) {
        return response.result;
      }
      return rejectWithValue(
        response.message || "Failed to fetch rejected tasks"
      );
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch rejected tasks"
      );
    }
  }
);
// Approve check task
export const approveCheckTask = createAsyncThunk<
  ApproveTaskResponse,
  ApproveTaskRequest,
  { rejectValue: string }
>("checkerDashboard/approveCheckTask", async (payload, { rejectWithValue }) => {
  try {
    const response = await apiService.post<ApproveTaskResponse>(
      `Dashboard/approveTask?taskID=${
        payload.taskID
      }&remark=${encodeURIComponent(payload.remark)}`,
      {}
    );
    if (!response.isSuccess) {
      return rejectWithValue(
        response.message || "Failed to approve check task"
      );
    }
    return response;
  } catch (error: any) {
    console.error("❌ Approve check task error:", error);
    return rejectWithValue(error?.message || "Error approving check task");
  }
});

// Reject check task
export const rejectCheckTask = createAsyncThunk<
  RejectTaskResponse,
  RejectTaskRequest,
  { rejectValue: string }
>("checkerDashboard/rejectCheckTask", async (payload, { rejectWithValue }) => {
  try {
    const response = await apiService.post<RejectTaskResponse>(
      `Dashboard/rejectTask?taskID=${
        payload.taskID
      }&remark=${encodeURIComponent(payload.remark)}`,
      {}
    );
    if (!response.isSuccess) {
      return rejectWithValue(response.message || "Failed to reject check task");
    }
    return response;
  } catch (error: any) {
    console.error("❌ Reject check task error:", error);
    return rejectWithValue(error?.message || "Error rejecting check task");
  }
});
const auditorDashboardSlice = createSlice({
  name: "auditorDashboard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPendingTasksError: (state) => {
      state.pendingTasksError = null;
    },
    clearApprovedTasksError: (state) => {
      state.approvedTasksError = null;
    },
    clearRejectedTasksError: (state) => {
      state.rejectedTasksError = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
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
        state.counts = action.payload;
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
      })

      // Approved Tasks
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

      // Rejected Tasks
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
        state.taskActionsError =
          action.payload || "Failed to reject check task";
      });
  },
});

export const {
  clearError,
  clearPendingTasksError,
  clearApprovedTasksError,
  clearRejectedTasksError,
  clearSuccessMessage,
} = auditorDashboardSlice.actions;

export default auditorDashboardSlice.reducer;
