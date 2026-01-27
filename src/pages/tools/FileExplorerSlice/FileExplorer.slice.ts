// FileExplorer.slice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {
  FileExplorerUploadRequest,
  FileExplorerUploadResponse,
  FileExplorerState,
} from "./FileExplorer.type";
import { apiService } from "../../../services/api";

/* ---------- Upload File Thunk ---------- */
export const uploadFileExplorer = createAsyncThunk<
  FileExplorerUploadResponse,
  FileExplorerUploadRequest,
  { rejectValue: string }
>(
  "fileExplorer/uploadFile",
  async ({ file, folderPath }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folderPath", folderPath);

      const response = await apiService.post<FileExplorerUploadResponse>(
        "CompanyActivityMaster/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.isSuccess) {
        return rejectWithValue(response.message || "Upload failed");
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Upload failed");
    }
  }
);

/* ---------- Initial State ---------- */
const initialState: FileExplorerState = {
  loading: false,
  error: null,
  successMessage: null,
};

/* ---------- Slice ---------- */
const FileExplorerSlice = createSlice({
  name: "fileExplorer",
  initialState,
  reducers: {
    resetFileExplorerState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFileExplorer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(uploadFileExplorer.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(uploadFileExplorer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Upload failed";
      });
  },
});

export const { resetFileExplorerState } = FileExplorerSlice.actions;
export default FileExplorerSlice.reducer;
