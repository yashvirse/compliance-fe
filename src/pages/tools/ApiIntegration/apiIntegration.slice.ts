import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  IMusterRollThunkPayload,
  ISalaryRegisterThunkPayload,
} from "./apiIntegration.type";
import { apiService } from "../../../services/api";

interface ApiIntegrationState {
  musterLoading: boolean;
  musterError: string | null;
  musterSuccess: ApiResponse | null;

  salaryLoading: boolean;
  salaryError: string | null;
  salarySuccess: ApiResponse | null;
}
const initialState: ApiIntegrationState = {
  musterLoading: false,
  musterError: null,
  musterSuccess: null,

  salaryLoading: false,
  salaryError: null,
  salarySuccess: null,
};

interface ApiResponse {
  isSuccess: boolean;
  message: string;
  data: any;
}

export const executeMusterIntegration = createAsyncThunk<
  ApiResponse,
  IMusterRollThunkPayload,
  { rejectValue: string }
>(
  "apiIntegration/executeMusterIntegration",
  async ({ data, apiKey, apiUrl }, { rejectWithValue }) => {
    try {
      const response = await apiService.post<ApiResponse>(
        apiUrl,
        data, // ✅ only body
        {
          headers: {
            "x-api-key": apiKey, // ✅ header me jaega
          },
        },
      );

      if (!response.isSuccess) {
        return rejectWithValue(
          response.message || "Failed to execute Muster API",
        );
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to execute Muster API",
      );
    }
  },
);
export const executeSalaryIntegration = createAsyncThunk<
  ApiResponse,
  ISalaryRegisterThunkPayload,
  { rejectValue: string }
>(
  "apiIntegration/executeSalaryIntegration",
  async ({ data, apiKey, apiUrl }, { rejectWithValue }) => {
    try {
      const response = await apiService.post<ApiResponse>(
        apiUrl,
        data, // ✅ only body
        {
          headers: {
            "x-api-key": apiKey, // ✅ header me jaega
          },
        },
      );

      if (!response.isSuccess) {
        return rejectWithValue(
          response.message || "Failed to execute Muster API",
        );
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to execute Muster API",
      );
    }
  },
);

const apiIntegrationSlice = createSlice({
  name: "apiIntegration",
  initialState,
  reducers: {
    clearMusterState: (state) => {
      state.musterError = null;
      state.musterSuccess = null;
      state.musterLoading = false;
    },
    clearSalaryState: (state) => {
      state.salaryError = null;
      state.salarySuccess = null;
      state.salaryLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(executeMusterIntegration.pending, (state) => {
        state.musterLoading = true;
        state.musterError = null;
        state.musterSuccess = null;
      })
      .addCase(executeMusterIntegration.fulfilled, (state, action) => {
        state.musterLoading = false;
        state.musterSuccess = action.payload;
      })
      .addCase(executeMusterIntegration.rejected, (state, action) => {
        state.musterLoading = false;
        state.musterError = action.payload || "Error executing Muster API";
        state.musterSuccess = null;
      })

      .addCase(executeSalaryIntegration.pending, (state) => {
        state.salaryLoading = true;
        state.salaryError = null;
        state.salarySuccess = null;
      })
      .addCase(executeSalaryIntegration.fulfilled, (state, action) => {
        state.salaryLoading = false;
        state.salarySuccess = action.payload;
      })
      .addCase(executeSalaryIntegration.rejected, (state, action) => {
        state.salaryLoading = false;
        state.salaryError = action.payload || "Error executing Salary API";
        state.salarySuccess = null;
      });
  },
});

export const { clearMusterState, clearSalaryState } =
  apiIntegrationSlice.actions;

export default apiIntegrationSlice.reducer;
