// Login Types and Interfaces
import { UserRole } from '../../../config/roleConfig';

export interface LoginRequest {
  userEmail: string;
  password: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  message: string;
  result: UserData;
}

export interface UserData {
  id: string;
  companyID: string;
  companyType: string;
  name: string;
  email: string;
  role: UserRole | string; // Allow both enum and string from API
  domain: string;
  isActive: boolean;
  token: string;
}

export interface LoginState {
  loading: boolean;
  error: string | null;
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
}
