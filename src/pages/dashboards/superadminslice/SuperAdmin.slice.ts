// src/features/SuperAdmin/SuperAdmin.slice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  GetSuperAdminDashboardResponse,
  SuperAdminState,
} from "./SuperAdmin.type";
import { apiService } from "../../../services/api";

const initialState: SuperAdminState = {
  loading: false,
  error: null,
  dashboardData: null,
};

// Async thunk for fetching super admin dashboard data
export const fetchSuperAdminDashboard = createAsyncThunk<
  GetSuperAdminDashboardResponse,
  void,
  { rejectValue: string }
>("superAdmin/fetchSuperAdminDashboard", async (_, { rejectWithValue }) => {
  try {
    const response = await apiService.get<GetSuperAdminDashboardResponse>(
      "Dashboard/getSuperAdminDashboartDetail"
    );

    if (!response.isSuccess) {
      return rejectWithValue(
        response.message || "Failed to fetch dashboard data"
      );
    }

    return response;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch dashboard data"
    );
  }
});

const superAdminSlice = createSlice({
  name: "superAdmin",
  initialState,
  reducers: {
    clearSuperAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuperAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload.result;
      })
      .addCase(fetchSuperAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearSuperAdminError } = superAdminSlice.actions;
export default superAdminSlice.reducer;
