import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../../services/api";
import type {
  ReviewerDashboardState,
  GetReviewerTaskCountResponse,
  GetPendingReviewTasksResponse,
  GetApprovedReviewTasksResponse,
  GetRejectedReviewTasksResponse,
  ApproveReviewTaskRequest,
  ApproveReviewTaskResponse,
  RejectReviewTaskRequest,
  RejectReviewTaskResponse,
} from "./ReviewerDashboard.Type";

// Initial state
const initialState: ReviewerDashboardState = {
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
        `Dashboard/getTaskCount?userID=${userId}`
      );

      if (response.isSuccess && response.result) {
        console.log("✅ Task counts received:", response.result);
        return response.result;
      }

      console.error("❌ API error:", response.message);
      return rejectWithValue(
        response.message || "Failed to fetch dashboard counts"
      );
    } catch (error: any) {
      console.error("❌ Fetch error:", error);
      return rejectWithValue(
        error?.message || "Failed to fetch dashboard counts"
      );
    }
  }
);

// Fetch pending review tasks
export const fetchPendingReviewTasks = createAsyncThunk(
  "reviewerDashboard/fetchPendingReviewTasks",
  async (userID: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<GetPendingReviewTasksResponse>(
        `Dashboard/getPendingTaskDtl?userID=${userID}`
      );

      if (response.isSuccess) {
        console.log("✅ Pending review tasks received:", response.result);
        return response.result;
      }

      console.error("❌ API error:", response.message);
      return rejectWithValue(
        response.message || "Failed to fetch pending review tasks"
      );
    } catch (error: any) {
      console.error("❌ Fetch error:", error);
      return rejectWithValue(
        error?.message || "Failed to fetch pending review tasks"
      );
    }
  }
);

// Fetch approved review tasks
export const fetchApprovedReviewTasks = createAsyncThunk(
  "reviewerDashboard/fetchApprovedReviewTasks",
  async (userID: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<GetApprovedReviewTasksResponse>(
        `Dashboard/getApprovedTaskDtl?userID=${userID}`
      );

      if (response.isSuccess) {
        console.log("✅ Approved review tasks received:", response.result);
        return response.result;
      }

      console.error("❌ API error:", response.message);
      return rejectWithValue(
        response.message || "Failed to fetch approved review tasks"
      );
    } catch (error: any) {
      console.error("❌ Fetch error:", error);
      return rejectWithValue(
        error?.message || "Failed to fetch approved review tasks"
      );
    }
  }
);

// Fetch rejected review tasks
export const fetchRejectedReviewTasks = createAsyncThunk(
  "reviewerDashboard/fetchRejectedTasks",
  async (userID: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<GetRejectedReviewTasksResponse>(
        `Dashboard/getRejectedTaskDtl?userID=${userID}`
      );

      if (response.isSuccess) {
        console.log("✅ Rejected review tasks received:", response.result);
        return response.result;
      }

      console.error("❌ API error:", response.message);
      return rejectWithValue(
        response.message || "Failed to fetch rejected review tasks"
      );
    } catch (error: any) {
      console.error("❌ Fetch error:", error);
      return rejectWithValue(
        error?.message || "Failed to fetch rejected review tasks"
      );
    }
  }
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
      const response = await apiService.post<ApproveReviewTaskResponse>(
        `Dashboard/approveTask?taskID=${
          payload.taskID
        }&remark=${encodeURIComponent(payload.remark)}`,
        {}
      );
      if (!response.isSuccess) {
        return rejectWithValue(
          response.message || "Failed to approve review task"
        );
      }
      return response;
    } catch (error: any) {
      console.error("❌ Approve review task error:", error);
      return rejectWithValue(error?.message || "Error approving review task");
    }
  }
);

// Reject review task
export const rejectReviewTask = createAsyncThunk<
  RejectReviewTaskResponse,
  RejectReviewTaskRequest,
  { rejectValue: string }
>("reviewerDashboard/rejectTask", async (payload, { rejectWithValue }) => {
  try {
    const response = await apiService.post<RejectReviewTaskResponse>(
      `Dashboard/rejectTask?taskID=${
        payload.taskID
      }&remark=${encodeURIComponent(payload.remark)}`,
      {}
    );
    if (!response.isSuccess) {
      return rejectWithValue(
        response.message || "Failed to reject review task"
      );
    }
    return response;
  } catch (error: any) {
    console.error("❌ Reject review task error:", error);
    return rejectWithValue(error?.message || "Error rejecting review task");
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
      // Fetch pending review tasks
      .addCase(fetchPendingReviewTasks.pending, (state) => {
        state.pendingReviewTasksLoading = true;
        state.pendingReviewTasksError = null;
      })
      .addCase(fetchPendingReviewTasks.fulfilled, (state, action) => {
        state.pendingReviewTasksLoading = false;
        state.pendingReviewTasks = action.payload;
      })
      .addCase(fetchPendingReviewTasks.rejected, (state, action) => {
        state.pendingReviewTasksLoading = false;
        state.pendingReviewTasksError = action.payload as string;
      })
      // Fetch approved review tasks
      .addCase(fetchApprovedReviewTasks.pending, (state) => {
        state.approvedReviewTasksLoading = true;
        state.approvedReviewTasksError = null;
      })
      .addCase(fetchApprovedReviewTasks.fulfilled, (state, action) => {
        state.approvedReviewTasksLoading = false;
        state.approvedReviewTasks = action.payload;
      })
      .addCase(fetchApprovedReviewTasks.rejected, (state, action) => {
        state.approvedReviewTasksLoading = false;
        state.approvedReviewTasksError = action.payload as string;
      })
      // Fetch rejected review tasks
      .addCase(fetchRejectedReviewTasks.pending, (state) => {
        state.rejectedReviewTasksLoading = true;
        state.rejectedReviewTasksError = null;
      })
      .addCase(fetchRejectedReviewTasks.fulfilled, (state, action) => {
        state.rejectedReviewTasksLoading = false;
        state.rejectedReviewTasks = action.payload;
      })
      .addCase(fetchRejectedReviewTasks.rejected, (state, action) => {
        state.rejectedReviewTasksLoading = false;
        state.rejectedReviewTasksError = action.payload as string;
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
      });
  },
});

export const { clearError, clearTaskActionError } =
  reviewerDashboardSlice.actions;
export default reviewerDashboardSlice.reducer;
