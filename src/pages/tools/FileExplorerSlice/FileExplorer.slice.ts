// FileExplorer.slice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {
  BaseResponse,
  CreateFolderRequest,
  CreateFolderResponse,
  FileExplorerState,
  FileUploadRequest,
  FileUploadResponse,
  GetFileAndFolderResponse,
  RenameFolderRequest,
  RenameFolderResponse,
} from "./FileExplorer.type";
import { apiService } from "../../../services/api";

export const getFileAndFolderExplorer = createAsyncThunk<
  GetFileAndFolderResponse,
  void,
  { rejectValue: string }
>("fileExplorer/getFileAndFolder", async (_, { rejectWithValue }) => {
  try {
    const response = await apiService.get<GetFileAndFolderResponse>(
      "ReportMaster/get-folder",
    );
    if (!response.isSuccess) {
      return rejectWithValue(response.message || "Fetch failed");
    }

    return response;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Fetch failed");
  }
});
/* ---------- Upload File Thunk ---------- */
export const uploadFileExplorer = createAsyncThunk<
  FileUploadResponse, // ✅ Return Type
  FileUploadRequest, // ✅ Argument Type
  { rejectValue: string }
>(
  "fileExplorer/uploadFile",
  async ({ file, folderId }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiService.post<FileUploadResponse>(
        `ReportMaster/upload?folderId=${folderId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (!response.isSuccess) {
        return rejectWithValue(response.message || "Upload failed");
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Upload failed");
    }
  },
);
export const createFolderExplorer = createAsyncThunk<
  CreateFolderResponse, // ✅ Return Type
  CreateFolderRequest, // ✅ Argument Type
  { rejectValue: string }
>(
  "fileExplorer/createFolder",
  async ({ folderName, parentFolderId }, { rejectWithValue }) => {
    try {
      let url = `ReportMaster/create-folder?folderName=${encodeURIComponent(
        folderName,
      )}`;

      if (parentFolderId) {
        url += `&parentFolderId=${parentFolderId}`;
      }

      const response = await apiService.post<CreateFolderResponse>(url);

      if (!response.isSuccess) {
        return rejectWithValue(response.message || "Folder creation failed");
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Folder creation failed");
    }
  },
);
/* ---------- Rename Folder Thunk ---------- */
export const renameFolderExplorer = createAsyncThunk<
  RenameFolderResponse,
  RenameFolderRequest,
  { rejectValue: string }
>(
  "fileExplorer/renameFolder",
  async ({ folderId, newName }, { rejectWithValue }) => {
    try {
      const response = await apiService.put<RenameFolderResponse>(
        `ReportMaster/rename-folder?folderId=${folderId}&newName=${encodeURIComponent(
          newName,
        )}`,
      );

      if (!response.isSuccess) {
        return rejectWithValue(response.message || "Rename failed");
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Rename failed");
    }
  },
);
/* ---------- Delete File Thunk ---------- */
export const deleteFileExplorer = createAsyncThunk<
  BaseResponse, // ✅ Return Type
  string, // ✅ Argument Type (fileId)
  { rejectValue: string }
>("fileExplorer/deleteFile", async (fileId, { rejectWithValue }) => {
  try {
    const response = await apiService.delete<BaseResponse>(
      `ReportMaster/delete-file/${fileId}`,
    );

    if (!response.isSuccess) {
      return rejectWithValue(response.message || "Delete failed");
    }

    return response;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Delete failed");
  }
});
/* ---------- Delete Folder Thunk ---------- */
export const deleteFolderExplorer = createAsyncThunk<
  BaseResponse, // ✅ Return Type
  string, // ✅ Argument Type (folderId)
  { rejectValue: string }
>("fileExplorer/deleteFolder", async (folderId, { rejectWithValue }) => {
  try {
    const response = await apiService.delete<BaseResponse>(
      `ReportMaster/delete-folder/${folderId}`,
    );

    if (!response.isSuccess) {
      return rejectWithValue(response.message || "Folder delete failed");
    }

    return response;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Folder delete failed");
  }
});
/* ---------- Initial State ---------- */
const initialState: FileExplorerState = {
  loading: false,
  error: null,
  successMessage: null,
  files: [],
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
      .addCase(getFileAndFolderExplorer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFileAndFolderExplorer.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload.data || [];
      })
      .addCase(getFileAndFolderExplorer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Fetch failed";
      })
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
      })
      .addCase(createFolderExplorer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createFolderExplorer.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(createFolderExplorer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Folder creation failed";
      })
      .addCase(renameFolderExplorer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(renameFolderExplorer.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(renameFolderExplorer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Rename failed";
      })
      .addCase(deleteFileExplorer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteFileExplorer.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(deleteFileExplorer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Delete failed";
      })
      .addCase(deleteFolderExplorer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteFolderExplorer.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(deleteFolderExplorer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Folder delete failed";
      });
  },
});

export const { resetFileExplorerState } = FileExplorerSlice.actions;
export default FileExplorerSlice.reducer;
