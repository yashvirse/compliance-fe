import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../../services/api";
import type {
  CheckerDashboardState,
  GetCheckerTaskCountResponse,
  ApproveCheckTaskRequest,
  ApproveCheckTaskResponse,
  RejectCheckTaskRequest,
  RejectCheckTaskResponse,
  GetAssignedTasksResponse,
} from "./CheckerDashboard.Type";

// Initial state
const initialState: CheckerDashboardState = {
  tasks: [],
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
  "checkerDashboard/fetchTaskCount",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<GetCheckerTaskCountResponse>(
        `Dashboard/getTaskCount?userID=${userId}`,
      );

      if (response.isSuccess && response.result) {
        return response.result;
      }

      return rejectWithValue(
        response.message || "Failed to fetch dashboard counts",
      );
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch dashboard counts",
      );
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
  ApproveCheckTaskResponse,
  ApproveCheckTaskRequest,
  { rejectValue: string }
>("checkerDashboard/approveCheckTask", async (payload, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("file", payload.file);
    const response = await apiService.post<ApproveCheckTaskResponse>(
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
  RejectCheckTaskResponse,
  RejectCheckTaskRequest,
  { rejectValue: string }
>("checkerDashboard/rejectCheckTask", async (payload, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("file", payload.file);
    const response = await apiService.post<RejectCheckTaskResponse>(
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

// Slice
const checkerDashboardSlice = createSlice({
  name: "checkerDashboard",
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
        state.taskActionsError =
          action.payload || "Failed to approve check task";
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

export const { clearError, clearTaskActionError } =
  checkerDashboardSlice.actions;
export default checkerDashboardSlice.reducer;
