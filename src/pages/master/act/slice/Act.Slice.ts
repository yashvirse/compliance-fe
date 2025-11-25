import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../../../services/api';
import type { 
  ActMasterState,
  GetActMasterListResponse,
  AddActMasterRequest,
  AddActMasterResponse,
  DeleteActMasterResponse,
  GetActMasterByIdResponse,
  UpdateActMasterRequest,
  UpdateActMasterResponse
} from './Act.Type';

// Initial state
const initialState: ActMasterState = {
  loading: false,
  error: null,
  success: false,
  actMasters: [],
  deleteLoading: false,
  deleteError: null,
  deleteSuccess: false,
  currentActMaster: null,
  fetchByIdLoading: false,
  fetchByIdError: null,
};

// Async thunk for adding act master
export const addActMaster = createAsyncThunk<
  AddActMasterResponse,
  AddActMasterRequest,
  { rejectValue: string }
>(
  'actMaster/addActMaster',
  async (actData: AddActMasterRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.post<AddActMasterResponse>(
        'Master/addActMaster',
        actData
      );

      // Check if add was successful
      if (!response.isSuccess) {
        return rejectWithValue(response.message || 'Failed to add act master');
      }

      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to add act master. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for fetching act master list
export const fetchActMasterList = createAsyncThunk<
  GetActMasterListResponse,
  void,
  { rejectValue: string }
>(
  'actMaster/fetchActMasterList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get<GetActMasterListResponse>(
        'Master/getActMasterList'
      );

      // Check if fetch was successful
      if (!response.isSuccess) {
        return rejectWithValue(response.message || 'Failed to fetch act masters');
      }

      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to fetch act masters. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for deleting act master
export const deleteActMaster = createAsyncThunk<
  DeleteActMasterResponse,
  string,
  { rejectValue: string }
>(
  'actMaster/deleteActMaster',
  async (actMasterId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<DeleteActMasterResponse>(
        `Master/deleteActMaster/${actMasterId}`
      );

      // Check if delete was successful
      if (!response.isSuccess) {
        return rejectWithValue(response.message || 'Failed to delete act master');
      }

      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to delete act master. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for fetching act master by ID
export const fetchActMasterById = createAsyncThunk<
  GetActMasterByIdResponse,
  string,
  { rejectValue: string }
>(
  'actMaster/fetchActMasterById',
  async (actMasterId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<GetActMasterByIdResponse>(
        `Master/getActMasById/${actMasterId}`
      );

      // Check if fetch was successful
      if (!response.isSuccess) {
        return rejectWithValue(response.message || 'Failed to fetch act master details');
      }

      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to fetch act master details. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for updating act master
export const updateActMaster = createAsyncThunk<
  UpdateActMasterResponse,
  UpdateActMasterRequest,
  { rejectValue: string }
>(
  'actMaster/updateActMaster',
  async (actData: UpdateActMasterRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.post<UpdateActMasterResponse>(
        'Master/editActMaster',
        actData
      );

      // Check if update was successful
      if (!response.isSuccess) {
        return rejectWithValue(response.message || 'Failed to update act master');
      }

      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to update act master. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

// Act Master slice
const actMasterSlice = createSlice({
  name: 'actMaster',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear success
    clearSuccess: (state) => {
      state.success = false;
      state.deleteSuccess = false;
    },
    
    // Reset state
    resetActMasterState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.actMasters = [];
      state.deleteLoading = false;
      state.deleteError = null;
      state.deleteSuccess = false;
      state.currentActMaster = null;
      state.fetchByIdLoading = false;
      state.fetchByIdError = null;
    },
    
    // Clear current act master
    clearCurrentActMaster: (state) => {
      state.currentActMaster = null;
      state.fetchByIdLoading = false;
      state.fetchByIdError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Act Master pending
      .addCase(addActMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      // Add Act Master fulfilled
      .addCase(addActMaster.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      // Add Act Master rejected
      .addCase(addActMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred while adding act master';
        state.success = false;
      })
      // Fetch Act Master List pending
      .addCase(fetchActMasterList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Fetch Act Master List fulfilled
      .addCase(fetchActMasterList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.actMasters = action.payload.result || [];
      })
      // Fetch Act Master List rejected
      .addCase(fetchActMasterList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred while fetching act masters';
      })
      // Delete Act Master pending
      .addCase(deleteActMaster.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })
      // Delete Act Master fulfilled
      .addCase(deleteActMaster.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = null;
        state.deleteSuccess = true;
        // Remove deleted act master from the list
        state.actMasters = state.actMasters.filter(
          (actMaster) => actMaster.id !== action.meta.arg
        );
      })
      // Delete Act Master rejected
      .addCase(deleteActMaster.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload || 'An error occurred while deleting act master';
        state.deleteSuccess = false;
      })
      // Fetch Act Master By ID pending
      .addCase(fetchActMasterById.pending, (state) => {
        state.fetchByIdLoading = true;
        state.fetchByIdError = null;
        state.currentActMaster = null;
      })
      // Fetch Act Master By ID fulfilled
      .addCase(fetchActMasterById.fulfilled, (state, action) => {
        state.fetchByIdLoading = false;
        state.fetchByIdError = null;
        state.currentActMaster = action.payload.result;
      })
      // Fetch Act Master By ID rejected
      .addCase(fetchActMasterById.rejected, (state, action) => {
        state.fetchByIdLoading = false;
        state.fetchByIdError = action.payload || 'An error occurred while fetching act master details';
        state.currentActMaster = null;
      })
      // Update Act Master pending
      .addCase(updateActMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      // Update Act Master fulfilled
      .addCase(updateActMaster.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        // Don't update actMasters array here - let the list page refresh
        // The API returns result: 1 (not the full object), which causes DataGrid errors
      })
      // Update Act Master rejected
      .addCase(updateActMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred while updating act master';
        state.success = false;
      });
  },
});

// Export actions
export const { clearError, clearSuccess, resetActMasterState, clearCurrentActMaster } = actMasterSlice.actions;

// Export reducer
export default actMasterSlice.reducer;
