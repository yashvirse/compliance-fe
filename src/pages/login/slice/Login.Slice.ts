import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../../services/api";
import type { LoginRequest, LoginResponse, LoginState } from "./Login.Type";
import { UserRole } from "../../../config/roleConfig";

// Role mapping from API string to UserRole enum
const mapApiRoleToUserRole = (apiRole: string): UserRole => {
  const roleMapping: Record<string, UserRole> = {
    SuperAdmin: UserRole.SUPER_ADMIN,
    CustomerAdmin: UserRole.CUSTOMER_ADMIN,
    Maker: UserRole.MAKER,
    Checker: UserRole.CHECKER,
    Reviewer: UserRole.REVIEWER,
    Auditor: UserRole.AUDITOR,
  };
  return roleMapping[apiRole] || UserRole.AUDITOR;
};

// Initial state
const initialState: LoginState = {
  loading: false,
  error: null,
  user: null,
  token: null,
  isAuthenticated: false,
  isInitializing: true,
};

// Async thunk for login
export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  { rejectValue: string }
>("login/loginUser", async (credentials: LoginRequest, { rejectWithValue }) => {
  try {
    const response = await apiService.post<LoginResponse>(
      "Authenticate",
      credentials
    );

    // Check if login was successful
    if (!response.isSuccess) {
      return rejectWithValue(response.message || "Login failed");
    }

    // Store token in localStorage
    if (response.result?.token) {
      localStorage.setItem("authToken", response.result.token);
    }

    // Store user data in localStorage
    if (response.result) {
      localStorage.setItem("user", JSON.stringify(response.result));
    }

    return response;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Login failed. Please try again.";
    return rejectWithValue(errorMessage);
  }
});

// Login slice
const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    // Logout action
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("companyID");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Restore user from localStorage (on app load)
    restoreUser: (state) => {
      const token = localStorage.getItem("authToken");
      const userStr = localStorage.getItem("user");

      if (token && userStr) {
        try {
          state.token = token;
          state.user = JSON.parse(userStr);
          state.isAuthenticated = true;
        } catch (error) {
          // Invalid data in localStorage, clear it
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
        }
      }
      state.isInitializing = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login pending
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Login fulfilled
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        // Map the user data and convert role string to UserRole enum
        const userData = {
          ...action.payload.result,
          role: mapApiRoleToUserRole(action.payload.result.role),
        };

        state.user = userData as any;
        state.token = action.payload.result.token;
        state.isAuthenticated = true;

        // save user data in localStorage so we can use some api call
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("authToken", action.payload.result.token);
        localStorage.setItem("userRole", userData.role);
        localStorage.setItem("userId", userData.id);
        localStorage.setItem("companyID", userData.companyID);
      })
      // Login rejected
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred during login";
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

// Export actions
export const { logout, clearError, restoreUser } = loginSlice.actions;

// Export reducer
export default loginSlice.reducer;
