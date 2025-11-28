import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../../../services/api';
import type {
  UserState,
  AddUserRequest,
  EditUserRequest,
  AddUserResponse,
  GetUserListResponse,
  GetUserByIdResponse
} from './CustomerAdminUser.Type';

const initialState: UserState = {
  users: [],
  loading: false,
  error: null
};

// Async thunks
export const addUser = createAsyncThunk(
  'customerAdminUser/addUser',
  async (userData: AddUserRequest, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('userName', userData.userName);
      formData.append('userEmail', userData.userEmail);
      formData.append('userMobile', userData.userMobile);
      formData.append('userPassword', userData.userPassword);
      formData.append('userRole', userData.userRole);
      formData.append('companyId', userData.companyId);
      formData.append('companyType', userData.companyType);
      formData.append('companyDomain', userData.companyDomain);
      formData.append('isActive', userData.isActive.toString());
      formData.append('createdBy', userData.createdBy);
      formData.append('createdOn', new Date().toISOString());
      
      if (userData.userimg) {
        formData.append('userimg', userData.userimg);
      }

      const response = await apiClient.post<AddUserResponse>(
        'User/addUser',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.isSuccess) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || 'Failed to add user');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'An error occurred while adding user'
      );
    }
  }
);

export const fetchUserList = createAsyncThunk(
  'customerAdminUser/fetchUserList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<GetUserListResponse>(
        'User/getUserList'
      );
      
      if (response.data.isSuccess) {
        return response.data.result;
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch users');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'An error occurred while fetching users'
      );
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'customerAdminUser/fetchUserById',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<GetUserByIdResponse>(
        `User/getUserById?uid=${userId}`
      );
      
      if (response.data.isSuccess) {
        return response.data.result;
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch user');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'An error occurred while fetching user'
      );
    }
  }
);

export const editUser = createAsyncThunk(
  'customerAdminUser/editUser',
  async (userData: EditUserRequest, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('userID', userData.userID);
      formData.append('userName', userData.userName);
      formData.append('userEmail', userData.userEmail);
      formData.append('userMobile', userData.userMobile);
      if (userData.userPassword) {
        formData.append('userPassword', userData.userPassword);
      }
      formData.append('userRole', userData.userRole);
      formData.append('companyId', userData.companyId);
      formData.append('companyDomain', userData.companyDomain);
      formData.append('IsActive', userData.isActive.toString());
      formData.append('createdBy', userData.createdBy);
      formData.append('createdOn', userData.createdOn);
      
      // Only send userimg if new image is uploaded
      if (userData.userimg && userData.userimg instanceof File) {
        formData.append('userimg', userData.userimg);
      }
      
      // Send userImage with existing path
      if (userData.userImage) {
        formData.append('userImage', userData.userImage);
      }

      const response = await apiClient.post<AddUserResponse>(
        'User/editUser',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data.isSuccess) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || 'Failed to edit user');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'An error occurred while editing user'
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  'customerAdminUser/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete<AddUserResponse>(
        `User/deleteUser?uid=${userId}`
      );
      
      if (response.data.isSuccess) {
        return userId;
      } else {
        return rejectWithValue(response.data.message || 'Failed to delete user');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'An error occurred while deleting user'
      );
    }
  }
);

const customerAdminUserSlice = createSlice({
  name: 'customerAdminUser',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Add User
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch User List
      .addCase(fetchUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch User By ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Edit User
      .addCase(editUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.userID !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError } = customerAdminUserSlice.actions;
export default customerAdminUserSlice.reducer;
