// Customer Admin.type.ts

export interface CustomerAdminDashboardResult {
  totalAct: number;
  totalActivity: number;
  totalSite: number;
  totalUser: number;
  totalPendigTask: number;
  totalApprovedTask: number;
  totalRejectedTask: number;
  totalTotalTask: number;
  totalCompletedTask: number;
}

export interface GetCustomerAdminDashboardResponse {
  isSuccess: boolean;
  message: string;
  result: CustomerAdminDashboardResult;
}

export interface CustomerAdminState {
  loading: boolean;
  error: string | null;
  dashboardData: CustomerAdminDashboardResult | null;
  completedTasks: AssignedTask[];
  rejectedTasks: AssignedTask[];
  pendingTasks: AssignedTask[];
  asignedTasks: AssignedTask[];
  siteWiseTasks: SiteWiseTask[];
}
// ---- Completed Task Detail ----
export interface CompletedTaskUserDetail {
  userId: string;
  userName: string;
  inDate: string;
  outDate: string;
  status: string;
  remarks: string;
  rejectionRemark: string;
  pTat: number;
  aTat: number;
}

export interface CompletedTask {
  tblId: string;
  activityId: string;
  actName: string;
  departmentName: string;
  activityName: string;
  description: string;
  dueDate: string;
  gracePeriodDate: string;
  reminderDate: string;
  taskCreationDate: string;
  taskCurrentStatus: string;

  maker: string;
  checker: string;
  reviewer: string;
  auditer: string;

  siteName: string;
  companyDomain: string;

  details: CompletedTaskUserDetail[];
}

export interface GetCompletedTaskResponse {
  isSuccess: boolean;
  message: string;
  result: CompletedTask[];
}
export interface AssignedTaskUserDetail {
  userId: string;
  userName: string;
  inDate: string;
  outDate: string;
  status: string;
  remarks: string;
  rejectionRemark: string;
  pTat: number;
  aTat: number;
}

export interface AssignedTask {
  tblId: string;
  activityId: string;

  actName: string;
  departmentName: string;
  activityName: string;
  description: string;

  dueDate: string;
  gracePeriodDate: string;
  reminderDate: string;
  taskCreationDate: string;

  currentUserID: string | null;
  currentUserName: string | null;
  currentUserInDate: string;

  taskCurrentStatus: string;

  maker: string;
  makerID: string;

  checker: string;
  checkerID: string;

  reviewer: string;
  reviewerID: string;

  auditer: string;
  auditerID: string;

  companyId: string;
  companyDomain: string;

  siteID: string | null;
  siteName: string | null;

  details: AssignedTaskUserDetail[];
}

export interface GetAssignedTaskResponse {
  isSuccess: boolean;
  message: string;
  result: AssignedTask[];
}

export interface SiteWiseTask {
  tblId: string;
  activityId: string;
  actName: string;
  departmentName: string;
  activityName: string;
  description: string;

  dueDate: string; // ISO Date
  gracePeriodDate: string; // ISO Date
  reminderDate: string; // ISO Date

  currentUserID: string | null;
  currentUserName: string | null;
  currentUserInDate: string;

  maker: string;
  makerID: string;

  checker: string;
  checkerID: string;

  reviewer: string;
  reviewerID: string;

  auditer: string;
  auditerID: string;

  taskCreationDate: string;
  taskCurrentStatus: string;

  details: TaskDetail[];

  companyId: string;
  siteID: string;
  siteName: string;
  companyDomain: string;
  frequency: string;
}
export interface SiteWiseTaskResponse {
  isSuccess: boolean;
  message: string;
  result: SiteWiseTask[];
}
export interface TaskDetail {
  userId: string;
  userName: string;
  inDate: string; // ISO Date string
  outDate: string; // ISO Date string | "0001-01-01T00:00:00Z"
  status: string;
  remarks: string;
  rejectionRemark: string;
  pTat: number;
  aTat: number;
}
