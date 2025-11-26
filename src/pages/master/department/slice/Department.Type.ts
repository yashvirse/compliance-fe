// Department Master Types and Interfaces

export interface DepartmentMaster {
  deptId: string;
  departmentName: string;
}

export interface AddDepartmentMasterRequest {
  deptId: string;
  departmentName: string;
}

export interface AddDepartmentMasterResponse {
  isSuccess: boolean;
  message: string;
  result?: any;
}

export interface UpdateDepartmentMasterRequest {
  deptId: string;
  departmentName: string;
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
