import { UserRole } from '../config/roleConfig';

export interface User {
  id: string;
  companyID: string;
  companyType: string;
  name: string;
  email: string;
  role: UserRole;
  domain: string;
  isActive: boolean;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  description: string;
}
