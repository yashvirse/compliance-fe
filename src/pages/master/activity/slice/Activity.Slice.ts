import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../../../services/api";
import type {
  ActivityMasterState,
  AddActivityMasterRequest,
  AddActivityMasterResponse,
  UpdateActivityMasterRequest,
  UpdateActivityMasterResponse,
  GetActivityMasterListResponse,
  GetActivityMasterByIdResponse,
  DeleteActivityMasterResponse,
  GetActMasterListResponse,
} from "./Activity.Type";

// Initial state
const initialState: ActivityMasterState = {
  loading: false,
  error: null,
  success: false,
  activityMasters: [],
  deleteLoading: false,
  deleteError: null,
  deleteSuccess: false,
  currentActivityMaster: null,
  fetchByIdLoading: false,
  fetchByIdError: null,
  actMasters: [],
  actMastersLoading: false,
};

// Async thunk for adding activity master
export const addActivityMaster = createAsyncThunk<
  AddActivityMasterResponse,
  AddActivityMasterRequest,
  { rejectValue: string }
>(
  "activityMaster/addActivityMaster",
  async (activityData: AddActivityMasterRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.post<AddActivityMasterResponse>(
        "Master/addSupAdmActMast",
        activityData
      );

      if (!response.isSuccess) {
        return rejectWithValue(
          response.message || "Failed to add activity master"
        );
      }

      return response;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to add activity master. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for fetching activity master list
export const fetchActivityMasterList = createAsyncThunk<
  GetActivityMasterListResponse,
  void,
  { rejectValue: string }
>("activityMaster/fetchActivityMasterList", async (_, { rejectWithValue }) => {
  try {
    const response = await apiService.get<GetActivityMasterListResponse>(
      "Master/getSupAdmActMastList"
    );

    if (!response.isSuccess) {
      return rejectWithValue(
        response.message || "Failed to fetch activity master list"
      );
    }

    return response;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch activity master list. Please try again.";
    return rejectWithValue(errorMessage);
  }
});

// Async thunk for fetching act master list
export const fetchActMasterListForActivity = createAsyncThunk<
  GetActMasterListResponse,
  void,
  { rejectValue: string }
>("activityMaster/fetchActMasterList", async (_, { rejectWithValue }) => {
  try {
    const response = await apiService.get<GetActMasterListResponse>(
      "Master/getActMasterList"
    );

    if (!response.isSuccess) {
      return rejectWithValue(
        response.message || "Failed to fetch act master list"
      );
    }

    return response;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch act master list. Please try again.";
    return rejectWithValue(errorMessage);
  }
});

// Async thunk for deleting activity master
export const deleteActivityMaster = createAsyncThunk<
  DeleteActivityMasterResponse,
  string,
  { rejectValue: string }
>(
  "activityMaster/deleteActivityMaster",
  async (activityMasterId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<DeleteActivityMasterResponse>(
        `Master/deleteSupAdmActMast/${activityMasterId}`
      );

      if (!response.isSuccess) {
        return rejectWithValue(
          response.message || "Failed to delete activity master"
        );
      }

      return response;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete activity master. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for fetching activity master by ID
export const fetchActivityMasterById = createAsyncThunk<
  GetActivityMasterByIdResponse,
  string,
  { rejectValue: string }
>(
  "activityMaster/fetchActivityMasterById",
  async (activityMasterId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<GetActivityMasterByIdResponse>(
        `Master/getSupAdmActMastById/${activityMasterId}`
      );

      if (!response.isSuccess) {
        return rejectWithValue(
          response.message || "Failed to fetch activity master details"
        );
      }

      return response;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch activity master details. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for updating activity master
export const updateActivityMaster = createAsyncThunk<
  UpdateActivityMasterResponse,
  UpdateActivityMasterRequest,
  { rejectValue: string }
>(
  "activityMaster/updateActivityMaster",
  async (activityData: UpdateActivityMasterRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.put<UpdateActivityMasterResponse>(
        "Master/editSupAdmActMast",
        activityData
      );

      if (!response.isSuccess) {
        return rejectWithValue(
          response.message || "Failed to update activity master"
        );
      }

      return response;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update activity master. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Create slice
const activityMasterSlice = createSlice({
  name: "activityMaster",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.deleteError = null;
      state.fetchByIdError = null;
    },

    clearSuccess: (state) => {
      state.success = false;
      state.deleteSuccess = false;
    },

    resetActivityMasterState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.activityMasters = [];
      state.deleteLoading = false;
      state.deleteError = null;
      state.deleteSuccess = false;
      state.currentActivityMaster = null;
      state.fetchByIdLoading = false;
      state.fetchByIdError = null;
    },

    clearCurrentActivityMaster: (state) => {
      state.currentActivityMaster = null;
      state.fetchByIdLoading = false;
      state.fetchByIdError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Activity Master
      .addCase(addActivityMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addActivityMaster.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(addActivityMaster.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "An error occurred while adding activity master";
        state.success = false;
      })
      // Fetch Activity Master List
      .addCase(fetchActivityMasterList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityMasterList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.activityMasters = action.payload.result || [];
      })
      .addCase(fetchActivityMasterList.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "An error occurred while fetching activity master list";
        state.activityMasters = [];
      })
      // Delete Activity Master
      .addCase(deleteActivityMaster.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteActivityMaster.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = null;
        state.deleteSuccess = true;
        state.activityMasters = state.activityMasters.filter(
          (activity) => activity.activityId !== action.meta.arg
        );
      })
      .addCase(deleteActivityMaster.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError =
          action.payload || "An error occurred while deleting activity master";
        state.deleteSuccess = false;
      })
      // Fetch Activity Master By ID
      .addCase(fetchActivityMasterById.pending, (state) => {
        state.fetchByIdLoading = true;
        state.fetchByIdError = null;
        state.currentActivityMaster = null;
      })
      .addCase(fetchActivityMasterById.fulfilled, (state, action) => {
        state.fetchByIdLoading = false;
        state.fetchByIdError = null;
        state.currentActivityMaster = action.payload.result;
      })
      .addCase(fetchActivityMasterById.rejected, (state, action) => {
        state.fetchByIdLoading = false;
        state.fetchByIdError =
          action.payload ||
          "An error occurred while fetching activity master details";
        state.currentActivityMaster = null;
      })
      // Update Activity Master
      .addCase(updateActivityMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateActivityMaster.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(updateActivityMaster.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "An error occurred while updating activity master";
        state.success = false;
      })
      // Fetch Act Master List
      .addCase(fetchActMasterListForActivity.pending, (state) => {
        state.actMastersLoading = true;
      })
      .addCase(fetchActMasterListForActivity.fulfilled, (state, action) => {
        state.actMastersLoading = false;
        state.actMasters = action.payload.result || [];
      })
      .addCase(fetchActMasterListForActivity.rejected, (state) => {
        state.actMastersLoading = false;
        state.actMasters = [];
      });
  },
});

export const {
  clearError,
  clearSuccess,
  resetActivityMasterState,
  clearCurrentActivityMaster,
} = activityMasterSlice.actions;

export default activityMasterSlice.reducer;
