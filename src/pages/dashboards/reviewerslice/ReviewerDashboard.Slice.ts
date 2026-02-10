import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../../services/api";
import type {
  ReviewerDashboardState,
  GetReviewerTaskCountResponse,
  ApproveReviewTaskRequest,
  ApproveReviewTaskResponse,
  RejectReviewTaskRequest,
  RejectReviewTaskResponse,
  GetAssignedTasksResponse,
} from "./ReviewerDashboard.Type";

// Initial state
const initialState: ReviewerDashboardState = {
  tasks: [],
  pendingReviewTasks: [],
  approvedReviewTasks: [],
  rejectedReviewTasks: [],
  counts: null,
  taskActionsLoading: false,
  taskActionsError: null,
  pendingReviewTasksLoading: false,
  pendingReviewTasksError: null,
  approvedReviewTasksLoading: false,
  approvedReviewTasksError: null,
  rejectedReviewTasksLoading: false,
  rejectedReviewTasksError: null,
  loading: false,
  error: null,
};

// ===== Async Thunks =====

// Fetch dashboard task counts
export const fetchReviewerTaskCount = createAsyncThunk(
  "reviewerDashboard/fetchTaskCount",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<GetReviewerTaskCountResponse>(
        `Dashboard/getTaskCount?userID=${userId}`,
      );

      if (response.isSuccess && response.result) {
        return response.result;
      }

      return rejectWithValue(
        response.message || "Failed to fetch dashboard counts",
      );
    } catch (error: any) {
      console.error("❌ Fetch error:", error);
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
// Approve review task
export const approveReviewTask = createAsyncThunk<
  ApproveReviewTaskResponse,
  ApproveReviewTaskRequest,
  { rejectValue: string }
>(
  "reviewerDashboard/approveReviewTask",
  async (payload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", payload.file);
      const response = await apiService.post<ApproveReviewTaskResponse>(
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
          response.message || "Failed to approve review task",
        );
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Error approving review task",
      );
    }
  },
);

// Reject review task
export const rejectReviewTask = createAsyncThunk<
  RejectReviewTaskResponse,
  RejectReviewTaskRequest,
  { rejectValue: string }
>("reviewerDashboard/rejectTask", async (payload, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("file", payload.file);
    const response = await apiService.post<RejectReviewTaskResponse>(
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
      return rejectWithValue(
        response.message || "Failed to reject review task",
      );
    }
    return response;
  } catch (error: any) {
    console.error("❌ Reject review task error:", error);
    return rejectWithValue(
      error?.response?.data?.message || "Error rejecting review task",
    );
  }
});

// Slice
const reviewerDashboardSlice = createSlice({
  name: "reviewerDashboard",
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
      .addCase(fetchReviewerTaskCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewerTaskCount.fulfilled, (state, action) => {
        state.loading = false;
        state.counts = action.payload;
      })
      .addCase(fetchReviewerTaskCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Approve review task
      .addCase(approveReviewTask.pending, (state) => {
        state.taskActionsLoading = true;
        state.taskActionsError = null;
      })
      .addCase(approveReviewTask.fulfilled, (state) => {
        state.taskActionsLoading = false;
        state.taskActionsError = null;
      })
      .addCase(approveReviewTask.rejected, (state, action) => {
        state.taskActionsLoading = false;
        state.taskActionsError =
          action.payload || "Failed to approve review task";
      })
      // Reject review task
      .addCase(rejectReviewTask.pending, (state) => {
        state.taskActionsLoading = true;
        state.taskActionsError = null;
      })
      .addCase(rejectReviewTask.fulfilled, (state) => {
        state.taskActionsLoading = false;
        state.taskActionsError = null;
      })
      .addCase(rejectReviewTask.rejected, (state, action) => {
        state.taskActionsLoading = false;
        state.taskActionsError =
          action.payload || "Failed to reject review task";
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
  reviewerDashboardSlice.actions;
export default reviewerDashboardSlice.reducer;
