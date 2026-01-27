// FileExplorer.type.ts

export interface FileExplorerUploadRequest {
  file: File;
  folderPath: string;
}

export interface FileExplorerUploadResponse {
  isSuccess: boolean;
  message: string;
  data?: any;
}

export interface FileExplorerState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}
