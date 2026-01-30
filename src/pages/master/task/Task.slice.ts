import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { TaskApiResponse, Task } from "./Task.type";
import { apiService } from "../../../services/api";

/* ================= STATE TYPE ================= */

export interface TaskState {
  loading: boolean;
  error: string | null;
  taskList: Task[];
}

/* ================= INITIAL STATE ================= */

const initialState: TaskState = {
  loading: false,
  error: null,
  taskList: [],
};

/* ================= ASYNC THUNK ================= */

export const fetchAssignedTasks = createAsyncThunk<
  TaskApiResponse,
  void,
  { rejectValue: string }
>("task/fetchAssignedTasks", async (_, { rejectWithValue }) => {
  try {
    const response = await apiService.get<TaskApiResponse>(
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

/* ================= SLICE ================= */

const taskSlice = createSlice({
  name: "task",
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
        state.taskList = action.payload.result;
      })
      .addCase(fetchAssignedTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

/* ================= EXPORTS ================= */

export const { clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
