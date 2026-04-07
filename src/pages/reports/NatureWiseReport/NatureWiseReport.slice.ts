import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../../services/api";
import type {
  NatureWiseReport,
  NatureWiseReportApiResponse,
} from "./NatureWiseReport.type";

/* ================= STATE TYPE ================= */

export interface NatureWiseReportState {
  loading: boolean;
  error: string | null;
  NatureWiseReportList: NatureWiseReport[];
}

/* ================= INITIAL STATE ================= */

const initialState: NatureWiseReportState = {
  loading: false,
  error: null,
  NatureWiseReportList: [],
};

/* ================= ASYNC THUNK ================= */

export const fetchAssignedTasks = createAsyncThunk<
  NatureWiseReportApiResponse,
  { fromDate: string },
  { rejectValue: string }
>("task/fetchAssignedTasks", async ({ fromDate }, { rejectWithValue }) => {
  try {
    const response = await apiService.get<NatureWiseReportApiResponse>(
      `Dashboard/getAssignedTask?fromDate=${encodeURIComponent(fromDate)}`,
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

/* ================= SLICE ================= */

const natureWiseReportSlice = createSlice({
  name: "natureWiseReport",
  initialState,
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignedTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignedTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.NatureWiseReportList = action.payload.result;
      })
      .addCase(fetchAssignedTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

/* ================= EXPORTS ================= */

export const { clearTaskError } = natureWiseReportSlice.actions;
export default natureWiseReportSlice.reducer;
