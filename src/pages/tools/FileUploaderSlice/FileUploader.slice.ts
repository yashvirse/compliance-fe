// FileUploader.slice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {
  FileItem,
  FileListResponse,
  FileUploadRequest,
  FileUploadResponse,
  FileUploaderState,
} from "./FileUploader.type";
import { apiService } from "../../../services/api";

export const adduploaderFile = createAsyncThunk<
  FileUploadResponse,
  FileUploadRequest,
  { rejectValue: string }
>("fileUploader/uploadFile", async (payload, { rejectWithValue }) => {
  try {
    const formData = new FormData();

    // 👇 API fields
    formData.append("FileId", payload.FileId ?? "");
    formData.append("CompanyId", payload.CompanyId ?? "");
    formData.append("CompanyDomain", payload.CompanyDomain ?? "");
    formData.append("FileName", payload.FileName ?? payload.selectFile.name);
    formData.append("Path", payload.Path ?? "");
    formData.append("FileType", payload.FileType ?? payload.selectFile.type);
    formData.append("Month", payload.Month ?? "");
    formData.append("Year", payload.Year ?? "");
    formData.append("UploadedOn", new Date().toISOString());
    formData.append("IsDeleted", String(payload.IsDeleted ?? false));

    // 👇 actual file (VERY IMPORTANT)
    formData.append("selectFile", payload.selectFile);

    const response = await apiService.post<FileUploadResponse>(
      "CompanyActivityMaster/upload",
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
});

export const fetchFileList = createAsyncThunk<
  FileItem[],
  void,
  { rejectValue: string }
>("fileUploader/fetchFileList", async (_, { rejectWithValue }) => {
  try {
    const response = await apiService.get<FileListResponse>(
      "CompanyActivityMaster/list",
    );

    if (!response.isSuccess) {
      return rejectWithValue("Failed to fetch files");
    }

    return response.result;
  } catch (error: any) {
    return rejectWithValue(error.message || "API Error");
  }
});

export const deleteFile = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("fileUploader/deleteFile", async (fileId, { rejectWithValue }) => {
  try {
    const response = await apiService.delete(
      `CompanyActivityMaster/delete/${fileId}`,
    );

    if (!response.isSuccess) {
      return rejectWithValue(response.message || "Delete failed");
    }

    return fileId;
  } catch (error: any) {
    return rejectWithValue(error.message || "Delete failed");
  }
});
export const processSalaryMusterRoll = createAsyncThunk<
  Blob,
  string,
  { rejectValue: string }
>(
  "fileUploader/processSalaryMusterRoll",
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await apiService.post(
        `SalaryMusterRoll/Process?fileId=${fileId}`,
        {
          responseType: "blob",
          headers: {
            Accept: "application/pdf",
          },
        },
      );

      return response;
    } catch (error: any) {
      return rejectWithValue("PDF download failed");
    }
  },
);

const initialState: FileUploaderState = {
  loading: false,
  error: null,
  successMessage: null,
  files: [],
};

const FileUploaderSlice = createSlice({
  name: "fileUploader",
  initialState,
  reducers: {
    clearSuccess(state) {
      state.successMessage = null;
    },
    clearError(state) {
      state.error = null;
    },
    resetFileUploadState: (state) => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adduploaderFile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(adduploaderFile.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(adduploaderFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Upload failed";
      })
      .addCase(fetchFileList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFileList.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(fetchFileList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch files";
      })
      .addCase(deleteFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.loading = false;
        state.files = state.files.filter(
          (file) => file.fileId !== action.payload,
        );
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Delete failed";
      })
      .addCase(processSalaryMusterRoll.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(processSalaryMusterRoll.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Salary register downloaded successfully";
      })
      .addCase(processSalaryMusterRoll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Process failed";
      });
  },
});

export const { resetFileUploadState, clearSuccess, clearError } =
  FileUploaderSlice.actions;
export default FileUploaderSlice.reducer;
