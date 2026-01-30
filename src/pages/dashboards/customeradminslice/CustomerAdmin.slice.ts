import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../../services/api";
import type {
  CustomerAdminState,
  GetAssignedTaskResponse,
  GetCompletedTaskResponse,
  GetCustomerAdminDashboardResponse,
  SiteWiseTaskResponse,
} from "./CustomerAdmin.type";

const initialState: CustomerAdminState = {
  loading: false,
  error: null,
  dashboardData: null,
  completedTasks: [],
  asignedTasks: [],
  siteWiseTasks: [],
};

// ✅ Customer Admin Dashboard API
export const fetchCustomerAdminDashboard = createAsyncThunk<
  GetCustomerAdminDashboardResponse,
  void,
  { rejectValue: string }
>(
  "customerAdmin/fetchCustomerAdminDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get<GetCustomerAdminDashboardResponse>(
        "Dashboard/CustomerAdminDashboard",
      );

      if (!response.isSuccess) {
        return rejectWithValue(
          response.message || "Failed to fetch customer admin dashboard",
        );
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch customer admin dashboard",
      );
    }
  },
);
export const fetchCompletedTasks = createAsyncThunk<
  GetCompletedTaskResponse,
  void,
  { rejectValue: string }
>("customerAdmin/fetchCompletedTasks", async (_, { rejectWithValue }) => {
  try {
    const response = await apiService.get<GetCompletedTaskResponse>(
      "Dashboard/getCompletedTaskDtl",
    );

    if (!response.isSuccess) {
      return rejectWithValue(response.message);
    }

    return response;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to fetch completed tasks",
    );
  }
});

// ✅ Assigned Tasks API
export const fetchAssignedTasks = createAsyncThunk<
  GetAssignedTaskResponse,
  void,
  { rejectValue: string }
>("customerAdmin/fetchAssignedTasks", async (_, { rejectWithValue }) => {
  try {
    const response = await apiService.get<GetAssignedTaskResponse>(
      "Dashboard/getAssignedTask",
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
});
// ✅ Site Wise Tasks API
export const fetchsiteWiseTasks = createAsyncThunk<
  SiteWiseTaskResponse,
  string, // 👈 siteId type
  { rejectValue: string }
>("customerAdmin/fetchsiteWiseTasks", async (siteId, { rejectWithValue }) => {
  try {
    const response = await apiService.get<SiteWiseTaskResponse>(
      `Dashboard/siteWiseData?siteId=${siteId}`,
    );

    if (!response.isSuccess) {
      return rejectWithValue(
        response.message || "Failed to fetch site wise tasks",
      );
    }

    return response;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch site wise tasks",
    );
  }
});

const customerAdminSlice = createSlice({
  name: "customerAdmin",
  initialState,
  reducers: {
    clearCustomerAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload.result;
      })
      .addCase(fetchCustomerAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
    builder
      .addCase(fetchCompletedTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompletedTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.completedTasks = action.payload.result;
      })
      .addCase(fetchCompletedTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
    builder
      .addCase(fetchAssignedTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignedTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.asignedTasks = action.payload.result;
      })
      .addCase(fetchAssignedTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
    builder
      .addCase(fetchsiteWiseTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchsiteWiseTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.siteWiseTasks = action.payload.result;
      })
      .addCase(fetchsiteWiseTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearCustomerAdminError } = customerAdminSlice.actions;
export default customerAdminSlice.reducer;
