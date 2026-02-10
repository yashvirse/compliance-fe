import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  DepartmentResponse,
  ScoreCardResponse,
  ScoreCardState,
  SiteResponse,
} from "./ScoreCard.type";
import { apiService } from "../../../services/api";

/* ================= INITIAL STATE ================= */

const initialState: ScoreCardState = {
  loading: false,
  error: null,
  report: null,
  data: null,
  departments: [],
  sites: [],
};

/* ================= API THUNK ================= */

export const fetchScoreCardReport = createAsyncThunk<
  ScoreCardResponse,
  {
    sites: string[];
    departments: string[];
    monthYear?: string;
  },
  { rejectValue: string }
>("scoreCard/fetchScoreCardReport", async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    params.sites?.forEach((id) => query.append("siteID", id));
    params.departments?.forEach((d) => query.append("departmentName", d));
    if (params.monthYear) {
      query.append("monthYear", params.monthYear);
    }
    const response = await apiService.get<ScoreCardResponse>(
      `ReportMaster/getReport?${query.toString()}`,
    );
    if (!response.isSuccess) {
      return rejectWithValue(response.message);
    }
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to fetch report",
    );
  }
});

export const fetchDepartmentList = createAsyncThunk<
  DepartmentResponse,
  void,
  { rejectValue: string }
>("department/fetchDepartmentList", async (_, { rejectWithValue }) => {
  try {
    const response = await apiService.get<DepartmentResponse>(
      "Master/getDeptMasterList",
    );

    if (!response.isSuccess) {
      return rejectWithValue(
        response.message || "Failed to fetch department list",
      );
    }

    return response;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch department list",
    );
  }
});

export const fetchSiteList = createAsyncThunk<
  SiteResponse,
  void,
  { rejectValue: string }
>("site/fetchSiteList", async (_, { rejectWithValue }) => {
  try {
    const response = await apiService.get<SiteResponse>(
      "Master/getSiteMasterList",
    );

    if (!response.isSuccess) {
      return rejectWithValue(response.message || "Failed to fetch site list");
    }

    return response;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch site list",
    );
  }
});
/* ================= SLICE ================= */

const scoreCardSlice = createSlice({
  name: "scoreCard",
  initialState,
  reducers: {
    clearScoreCardError: (state) => {
      state.error = null;
    },
    resetScoreCard: (state) => {
      state.loading = false;
      state.error = null;
      state.report = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ===== PENDING ===== */
      .addCase(fetchScoreCardReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      /* ===== SUCCESS ===== */
      .addCase(fetchScoreCardReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload.result;
      })

      /* ===== ERROR ===== */
      .addCase(fetchScoreCardReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(fetchDepartmentList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      /* ===== SUCCESS ===== */
      .addCase(fetchDepartmentList.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload.result;
      })

      /* ===== ERROR ===== */
      .addCase(fetchDepartmentList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(fetchSiteList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      /* ===== SUCCESS ===== */
      .addCase(fetchSiteList.fulfilled, (state, action) => {
        state.loading = false;
        state.sites = action.payload.result;
      })

      /* ===== ERROR ===== */
      .addCase(fetchSiteList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

/* ================= EXPORTS ================= */

export const { clearScoreCardError, resetScoreCard } = scoreCardSlice.actions;

export default scoreCardSlice.reducer;
