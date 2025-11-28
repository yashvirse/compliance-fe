// User Master Types for Customer Admin

export interface User {
  userID: string;
  userName: string;
  userEmail: string;
  userMobile: string;
  userRole: string;
  companyId: string;
  companyType: string;
  companyDomain: string;
  userImage?: string;
  isActive: boolean;
  createdBy?: string;
  createdOn?: string;
}

export interface AddUserRequest {
  userName: string;
  userEmail: string;
  userMobile: string;
  userPassword: string;
  userRole: string;
  companyId: string;
  companyType: string;
  companyDomain: string;
  userimg?: string | File;
  isActive: boolean;
  createdBy: string;
}

export interface EditUserRequest {
  userID: string;
  userName: string;
  userEmail: string;
  userMobile: string;
  userPassword?: string;
  userRole: string;
  companyId: string;
  companyDomain: string;
  userimg?: string | File;
  isActive: boolean;
  createdBy: string;
  createdOn: string;
}

export interface AddUserResponse {
  isSuccess: boolean;
  message: string;
  result?: any;
}

export interface GetUserListResponse {
  isSuccess: boolean;
  message: string;
  result: User[];
}

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export interface GetUserByIdResponse {
  isSuccess: boolean;
  message: string;
  result: User & { userPassword: string };
}
