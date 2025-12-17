export interface UserList {
  userID: string;
  userName: string;
  userEmail: string;
  userRole: string;
  userMobile: string;
  isActive: boolean;
}
export interface GetUserListResponse {
  isSuccess: boolean;
  message: string;
  result: UserList[];
}
export interface UserState {
  loading: boolean;
  error: string | null;
  users: UserList[];
}
