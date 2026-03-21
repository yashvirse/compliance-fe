import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { IRegisterResponse, IRegister } from "./Registers.type";
import { apiService } from "../../../services/api";

/* ================= INITIAL STATE ================= */

interface RegistersState {
  loading: boolean;
  error: string | null;
  reports: IRegister[];
}

const initialState: RegistersState = {
  loading: false,
  error: null,
  reports: [],
};

/* ================= API THUNK ================= */

export const fetchGeneratedReports = createAsyncThunk<
  IRegisterResponse,
  void,
  { rejectValue: string }
>("registers/fetchGeneratedReports", async (_, { rejectWithValue }) => {
  try {
    const response = await apiService.get<IRegisterResponse>(
      "ReportMaster/getGeneratedReports",
    );

    if (!response.isSuccess) {
      return rejectWithValue(response.message || "Failed to fetch reports");
    }

    return response;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch reports",
    );
  }
});

/* ================= SLICE ================= */

const registersSlice = createSlice({
  name: "registers",
  initialState,
  reducers: {
    clearRegistersError: (state) => {
      state.error = null;
    },
    resetRegisters: (state) => {
      state.loading = false;
      state.error = null;
      state.reports = [];
    },
  },
  extraReducers: (builder) => {
    builder
      /* ===== PENDING ===== */
      .addCase(fetchGeneratedReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      /* ===== SUCCESS ===== */
      .addCase(fetchGeneratedReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.result;
      })

      /* ===== ERROR ===== */
      .addCase(fetchGeneratedReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearRegistersError, resetRegisters } = registersSlice.actions;

export default registersSlice.reducer;
