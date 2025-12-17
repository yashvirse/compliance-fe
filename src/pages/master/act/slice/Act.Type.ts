// Act Master Types and Interfaces

export interface ActMaster {
  actId: string;
  actName: string;
  depaermentID?: string; // For internal use
  depaermentName: string; // From API response
  description: string;
}

export interface AddActMasterRequest {
  actId: string;
  actName: string;
  depaermentName: string;
  description: string;
}

export interface AddActMasterResponse {
  isSuccess: boolean;
  message: string;
  result?: any;
}

export interface UpdateActMasterRequest {
  actId: string;
  actName: string;
  depaermentName: string;
  description: string;
}

export interface UpdateActMasterResponse {
  isSuccess: boolean;
  message: string;
  result?: any;
}

export interface GetActMasterListResponse {
  isSuccess: boolean;
  message: string;
  result: ActMaster[];
}

export interface DeleteActMasterResponse {
  isSuccess: boolean;
  message: string;
  result?: any;
}

export interface GetActMasterByIdResponse {
  isSuccess: boolean;
  message: string;
  result: ActMaster;
}

export interface DepartmentDropdownResponse {
  isSuccess: boolean;
  message: string;
  result: Record<string, string>; // { "id": "name" }
}

export interface ActMasterState {
  loading: boolean;
  error: string | null;
  success: boolean;
  actMasters: ActMaster[];
  deleteLoading: boolean;
  deleteError: string | null;
  deleteSuccess: boolean;
  currentActMaster: ActMaster | null;
  fetchByIdLoading: boolean;
  fetchByIdError: string | null;
  departmentDropdown: Record<string, string>;
  departmentDropdownLoading: boolean;
}
