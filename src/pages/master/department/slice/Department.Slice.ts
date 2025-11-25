import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../../../services/api';
import type {
  DepartmentMasterState,
  AddDepartmentMasterRequest,
  AddDepartmentMasterResponse,
  UpdateDepartmentMasterRequest,
  UpdateDepartmentMasterResponse,
  GetDepartmentMasterListResponse,
  GetDepartmentMasterByIdResponse,
  DeleteDepartmentMasterResponse
} from './Department.Type';

// Initial state
const initialState: DepartmentMasterState = {
  loading: false,
  error: null,
  success: false,
  departmentMasters: [],
  deleteLoading: false,
  deleteError: null,
  deleteSuccess: false,
  currentDepartmentMaster: null,
  fetchByIdLoading: false,
  fetchByIdError: null,
};

// Async thunk for adding department master
export const addDepartmentMaster = createAsyncThunk<
  AddDepartmentMasterResponse,
  AddDepartmentMasterRequest,
  { rejectValue: string }
>(
  'departmentMaster/addDepartmentMaster',
  async (departmentData: AddDepartmentMasterRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.post<AddDepartmentMasterResponse>(
        'Master/addDeptMaster',
        departmentData
      );

      // Check if add was successful
      if (!response.isSuccess) {
        return rejectWithValue(response.message || 'Failed to add department master');
      }

      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to add department master. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for fetching department master list
export const fetchDepartmentMasterList = createAsyncThunk<
  GetDepartmentMasterListResponse,
  void,
  { rejectValue: string }
>(
  'departmentMaster/fetchDepartmentMasterList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get<GetDepartmentMasterListResponse>(
        'Master/getDeptMasterList'
      );

      // Check if fetch was successful
      if (!response.isSuccess) {
        return rejectWithValue(response.message || 'Failed to fetch department master list');
      }

      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to fetch department master list. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for deleting department master
export const deleteDepartmentMaster = createAsyncThunk<
  DeleteDepartmentMasterResponse,
  string,
  { rejectValue: string }
>(
  'departmentMaster/deleteDepartmentMaster',
  async (departmentMasterId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<DeleteDepartmentMasterResponse>(
        `Master/deleteDeptMaster/${departmentMasterId}`
      );

      // Check if delete was successful
      if (!response.isSuccess) {
        return rejectWithValue(response.message || 'Failed to delete department master');
      }

      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to delete department master. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for fetching department master by ID
export const fetchDepartmentMasterById = createAsyncThunk<
  GetDepartmentMasterByIdResponse,
  string,
  { rejectValue: string }
>(
  'departmentMaster/fetchDepartmentMasterById',
  async (departmentMasterId: string, { rejectWithValue }) => {
    try {
      const response = await apiService.get<GetDepartmentMasterByIdResponse>(
        `Master/getDeptMasById/${departmentMasterId}`
      );

      // Check if fetch was successful
      if (!response.isSuccess) {
        return rejectWithValue(response.message || 'Failed to fetch department master details');
      }

      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to fetch department master details. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for updating department master
export const updateDepartmentMaster = createAsyncThunk<
  UpdateDepartmentMasterResponse,
  UpdateDepartmentMasterRequest,
  { rejectValue: string }
>(
  'departmentMaster/updateDepartmentMaster',
  async (departmentData: UpdateDepartmentMasterRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.post<UpdateDepartmentMasterResponse>(
        'Master/editDeptMaster',
        departmentData
      );

      // Check if update was successful
      if (!response.isSuccess) {
        return rejectWithValue(response.message || 'Failed to update department master');
      }

      return response;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to update department master. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

// Create slice
const departmentMasterSlice = createSlice({
  name: 'departmentMaster',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
      state.deleteError = null;
      state.fetchByIdError = null;
    },
    
    // Clear success
    clearSuccess: (state) => {
      state.success = false;
      state.deleteSuccess = false;
    },
    
    // Reset state
    resetDepartmentMasterState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.departmentMasters = [];
      state.deleteLoading = false;
      state.deleteError = null;
      state.deleteSuccess = false;
      state.currentDepartmentMaster = null;
      state.fetchByIdLoading = false;
      state.fetchByIdError = null;
    },
    
    // Clear current department master
    clearCurrentDepartmentMaster: (state) => {
      state.currentDepartmentMaster = null;
      state.fetchByIdLoading = false;
      state.fetchByIdError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Department Master pending
      .addCase(addDepartmentMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      // Add Department Master fulfilled
      .addCase(addDepartmentMaster.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      // Add Department Master rejected
      .addCase(addDepartmentMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred while adding department master';
        state.success = false;
      })
      // Fetch Department Master List pending
      .addCase(fetchDepartmentMasterList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Fetch Department Master List fulfilled
      .addCase(fetchDepartmentMasterList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.departmentMasters = action.payload.result || [];
      })
      // Fetch Department Master List rejected
      .addCase(fetchDepartmentMasterList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred while fetching department master list';
        state.departmentMasters = [];
      })
      // Delete Department Master pending
      .addCase(deleteDepartmentMaster.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })
      // Delete Department Master fulfilled
      .addCase(deleteDepartmentMaster.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = null;
        state.deleteSuccess = true;
        // Remove the deleted department master from the list
        state.departmentMasters = state.departmentMasters.filter(
          (departmentMaster) => departmentMaster.id !== action.meta.arg
        );
      })
      // Delete Department Master rejected
      .addCase(deleteDepartmentMaster.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload || 'An error occurred while deleting department master';
        state.deleteSuccess = false;
      })
      // Fetch Department Master By ID pending
      .addCase(fetchDepartmentMasterById.pending, (state) => {
        state.fetchByIdLoading = true;
        state.fetchByIdError = null;
        state.currentDepartmentMaster = null;
      })
      // Fetch Department Master By ID fulfilled
      .addCase(fetchDepartmentMasterById.fulfilled, (state, action) => {
        state.fetchByIdLoading = false;
        state.fetchByIdError = null;
        state.currentDepartmentMaster = action.payload.result;
      })
      // Fetch Department Master By ID rejected
      .addCase(fetchDepartmentMasterById.rejected, (state, action) => {
        state.fetchByIdLoading = false;
        state.fetchByIdError = action.payload || 'An error occurred while fetching department master details';
        state.currentDepartmentMaster = null;
      })
      // Update Department Master pending
      .addCase(updateDepartmentMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      // Update Department Master fulfilled
      .addCase(updateDepartmentMaster.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        // Don't update departmentMasters array here - let the list page refresh
      })
      // Update Department Master rejected
      .addCase(updateDepartmentMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred while updating department master';
        state.success = false;
      });
  },
});

// Export actions
export const { clearError, clearSuccess, resetDepartmentMasterState, clearCurrentDepartmentMaster } = departmentMasterSlice.actions;

// Export reducer
export default departmentMasterSlice.reducer;
