import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../../services/api';
import type { MakerDashboardState, GetAssignedTasksResponse } from './MakerDashboard.Type';

// Initial state
const initialState: MakerDashboardState = {
  tasks: [],
  loading: false,
  error: null,
};

// Async thunk to fetch assigned tasks
export const fetchAssignedTasks = createAsyncThunk(
  'makerDashboard/fetchAssignedTasks',
  async (userID: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<GetAssignedTasksResponse>(
        `Master/getAssinedTask?userID=${userID}`
      );
      
      if (response.data.isSuccess) {
        return response.data.result;
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch assigned tasks');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch assigned tasks');
    }
  }
);

// Slice
const makerDashboardSlice = createSlice({
  name: 'makerDashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch assigned tasks
      .addCase(fetchAssignedTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignedTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchAssignedTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = makerDashboardSlice.actions;
export default makerDashboardSlice.reducer;
