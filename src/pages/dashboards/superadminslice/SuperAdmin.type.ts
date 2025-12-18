// SuperAdmin.type.ts

export interface SuperAdminDashboardResult {
  totalCompany: number;
  totalAct: number;
  totalActivity: number;
  totalDepartment: number;
  totalUsers: number;
}

export interface GetSuperAdminDashboardResponse {
  isSuccess: boolean;
  message: string;
  result: SuperAdminDashboardResult;
}

export interface SuperAdminState {
  loading: boolean;
  error: string | null;
  dashboardData: SuperAdminDashboardResult | null;
}
