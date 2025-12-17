import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { UserState, GetUserListResponse } from "./UserPage.type";
import { apiService } from "../../services/api";
const initialState: UserState = {
  loading: false,
  error: null,
  users: [],
};

// Async thunk for fetching act master list
export const fetchUserList = createAsyncThunk<
  GetUserListResponse,
  void,
  { rejectValue: string }
>("user/fetchUserList", async (_, { rejectWithValue }) => {
  try {
    const response = await apiService.get<GetUserListResponse>(
      "User/getUserList"
    );

    if (!response.isSuccess) {
      return rejectWithValue(response.message || "Failed to fetch users");
    }

    return response;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch users"
    );
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.result || [];
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
