// Act Master Types and Interfaces

export interface ActMaster {
  id: string;
  actCode: string;
  actName: string;
  actCategoryId: string;
  description: string;
  companyId: string;
  companyDomain: string;
  createdBy: string;
  createdDate: string;
}

export interface AddActMasterRequest {
  id?: string;
  actCode: string;
  actName: string;
  actCategoryId: string;
  description: string;
  companyId: string;
  companyDomain: string;
  createdBy: string;
  createdDate?: string;
}

export interface AddActMasterResponse {
  isSuccess: boolean;
  message: string;
  result?: any;
}

export interface UpdateActMasterRequest {
  id: string;
  actCode: string;
  actName: string;
  actCategoryId: string;
  description: string;
  companyId: string;
  companyDomain: string;
  createdBy: string;
  createdDate: string;
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
}
