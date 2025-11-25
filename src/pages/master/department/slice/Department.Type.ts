// Department Master Types and Interfaces

export interface DepartmentMaster {
  id: string;
  departmentName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  companyDomain: string;
  createdBy: string;
  createdDate: string;
}

export interface AddDepartmentMasterRequest {
  id?: string;
  departmentName: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  companyId: string;
  companyDomain: string;
  createdBy: string;
  createdDate?: string;
}

export interface AddDepartmentMasterResponse {
  isSuccess: boolean;
  message: string;
  result?: any;
}

export interface UpdateDepartmentMasterRequest {
  id: string;
  departmentName: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  companyId: string;
  companyDomain: string;
  createdBy: string;
  createdDate: string;
}

export interface UpdateDepartmentMasterResponse {
  isSuccess: boolean;
  message: string;
  result?: any;
}

export interface GetDepartmentMasterListResponse {
  isSuccess: boolean;
  message: string;
  result: DepartmentMaster[];
}

export interface GetDepartmentMasterByIdResponse {
  isSuccess: boolean;
  message: string;
  result: DepartmentMaster;
}

export interface DeleteDepartmentMasterResponse {
  isSuccess: boolean;
  message: string;
  result?: any;
}

export interface DepartmentMasterState {
  loading: boolean;
  error: string | null;
  success: boolean;
  departmentMasters: DepartmentMaster[];
  deleteLoading: boolean;
  deleteError: string | null;
  deleteSuccess: boolean;
  currentDepartmentMaster: DepartmentMaster | null;
  fetchByIdLoading: boolean;
  fetchByIdError: string | null;
}
