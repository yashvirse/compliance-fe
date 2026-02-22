// FileExplorer.type.ts
export interface getFileAndFolder {
  id: string;
  name: string;
  type: "file" | "folder";
  parentFolderId: string | null;
  createdOn: string;
}
export interface FileUploadRequest {
  file: File;
  folderId: string;
}

export interface CreateFolderRequest {
  folderName: string;
  parentFolderId?: string;
}

export interface RenameFolderRequest {
  folderId: string;
  newName: string;
}

/* ---------- Common API Response ---------- */

export interface BaseResponse<T = any> {
  isSuccess: boolean;
  message: string;
  data?: T;
}

export type FileUploadResponse = BaseResponse;
export type CreateFolderResponse = BaseResponse;
export type RenameFolderResponse = BaseResponse;
export type GetFileAndFolderResponse = BaseResponse<getFileAndFolder[]>;
/* ---------- Redux State ---------- */

export interface FileExplorerState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  files: getFileAndFolder[];
}
