import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../../services/api";
import type {
  AuditorDashboardState,
  GetTaskCountResponse,
  ApproveTaskResponse,
  ApproveTaskRequest,
  RejectTaskResponse,
  RejectTaskRequest,
  GetAssignedTasksResponse,
} from "./AuditorDashboard.Type";

const initialState: AuditorDashboardState = {
  tasks: [],
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
        `Dashboard/getTaskCount?userID=${userId}`,
      );
      if (response.isSuccess && response.result) {
        return response.result;
      }
      return rejectWithValue(response.message || "Failed to fetch task counts");
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch task counts");
    }
  },
);
export const fetchAssignedTasks = createAsyncThunk<
  GetAssignedTasksResponse,
  { userID: string; fromDate: string; userStatus: string },
  { rejectValue: string }
>(
  "customerAdmin/fetchAssignedTasks",
  async ({ userID, fromDate, userStatus }, { rejectWithValue }) => {
    try {
      const response = await apiService.get<GetAssignedTasksResponse>(
        `Dashboard/getAssignedTask?userID=${encodeURIComponent(
          userID,
        )}&fromDate=${encodeURIComponent(fromDate)}&userStatus=${encodeURIComponent(userStatus)}`,
      );

      if (!response.isSuccess) {
        return rejectWithValue(
          response.message || "Failed to fetch assigned tasks",
        );
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch assigned tasks",
      );
    }
  },
);
// Approve check task
export const approveCheckTask = createAsyncThunk<
  ApproveTaskResponse,
  ApproveTaskRequest,
  { rejectValue: string }
>("checkerDashboard/approveCheckTask", async (payload, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("file", payload.file);
    const response = await apiService.post<ApproveTaskResponse>(
      `Dashboard/approveTask?taskID=${payload.taskID}&remark=${encodeURIComponent(
        payload.remark,
      )}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    if (!response.isSuccess) {
      return rejectWithValue(
        response.message || "Failed to approve check task",
      );
    }
    return response;
  } catch (error: any) {
    console.error("❌ Approve check task error:", error);
    return rejectWithValue(
      error?.response?.data?.message || "Error approving check task",
    );
  }
});
// Reject check task
export const rejectCheckTask = createAsyncThunk<
  RejectTaskResponse,
  RejectTaskRequest,
  { rejectValue: string }
>("checkerDashboard/rejectCheckTask", async (payload, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("file", payload.file);
    const response = await apiService.post<RejectTaskResponse>(
      `Dashboard/rejectTask?taskID=${payload.taskID}&remark=${encodeURIComponent(
        payload.remark,
      )}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    if (!response.isSuccess) {
      return rejectWithValue(response.message || "Failed to reject check task");
    }
    return response;
  } catch (error: any) {
    console.error("❌ Reject check task error:", error);
    return rejectWithValue(
      error?.response?.data?.message || "Error rejecting check task",
    );
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
      })
      .addCase(fetchAssignedTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignedTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.result || [];
      })
      .addCase(fetchAssignedTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch assigned tasks";
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
