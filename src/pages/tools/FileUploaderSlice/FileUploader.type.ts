// FileUploader.type.ts

export interface FileUploadRequest {
  FileId?: string;
  CompanyId?: string;
  CompanyDomain?: string;
  FileName?: string;
  Path?: string;
  FileType?: string;
  Month?: string;
  Year?: string;
  UploadedOn?: string;
  IsDeleted?: boolean;
  selectFile: File;
}

export interface FileUploadResponse {
  isSuccess: boolean;
  message: string;
  data?: any;
}

export interface FileUploaderState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  files: FileItem[];
}
export interface FileItem {
  fileId: string;
  companyId: string;
  companyDomain: string;
  fileName: string;
  storedFileName: string;
  fileType: string;
  fileSize: number;
  folderPath: string;
  uploadedOn: string;
  isDeleted: boolean;
}

export interface FileListResponse {
  isSuccess: boolean;
  message: string | null;
  result: FileItem[];
}
export interface FileDeleteResponse {
  isSuccess: boolean;
  message: string;
}
export interface ProcessSalaryResponse {
  isSuccess: boolean;
  message: string;
  result?: any;
}
