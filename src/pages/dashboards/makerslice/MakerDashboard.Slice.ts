import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../../services/api";
import type {
  MakerDashboardState,
  GetTaskCountResponse,
  ApproveTaskRequest,
  ApproveTaskResponse,
  RejectTaskRequest,
  RejectTaskResponse,
  GetAssignedTasksResponse,
} from "./MakerDashboard.Type";

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
  "makerDashboard/fetchTaskCount",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<GetTaskCountResponse>(
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

// Approve task
export const approveTask = createAsyncThunk<
  ApproveTaskResponse,
  ApproveTaskRequest,
  { rejectValue: string }
>("makerDashboard/approveTask", async (payload, { rejectWithValue }) => {
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
      return rejectWithValue(response.message || "Failed to approve task");
    }
    return response;
  } catch (error: any) {
    console.error("❌ Approve task error:", error);
    return rejectWithValue(
      error?.response?.data?.message || "Error approving task",
    );
  }
});

// Reject task
export const rejectTask = createAsyncThunk<
  RejectTaskResponse,
  RejectTaskRequest,
  { rejectValue: string }
>("makerDashboard/rejectTask", async (payload, { rejectWithValue }) => {
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
      return rejectWithValue(response.message || "Failed to reject task");
    }

    return response;
  } catch (error: any) {
    console.error("❌ Reject task error:", error);
    return rejectWithValue(
      error?.response?.data?.message || "Error rejecting task",
    );
  }
});

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

// Slice
const makerDashboardSlice = createSlice({
  name: "makerDashboard",
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
        state.taskActionsError = action.payload || "Failed to approve task";
      })
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
        state.taskActionsError = action.payload || "Failed to reject task";
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

export const { clearError, clearTaskActionError } = makerDashboardSlice.actions;
export default makerDashboardSlice.reducer;
