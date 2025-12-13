// Auditor Dashboard Types

// ===== Task Counts (Dashboard Stats) =====
export interface TaskCountResult {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export interface GetTaskCountResponse {
  isSuccess: boolean;
  message: string;
  result: TaskCountResult;
}

// ===== Pending Task Detail =====
export interface PendingTaskDetail {
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

export interface PendingTask {
  tblId: string;
  activityId: string;
  actName: string;
  departmentName: string;
  activityName: string;
  description: string;
  dueDate: string;
  gracePeriodDate: string;
  reminderDate: string;
  currentUserID: string;
  currentUserName: string;
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
  details: PendingTaskDetail[];
  companyId: string;
  companyDomain: string;
}

export interface GetPendingTasksResponse {
  isSuccess: boolean;
  message: string;
  result: PendingTask[];
}

// ===== Auditor Dashboard State =====
export interface AuditorDashboardState {
  taskCounts: TaskCountResult | null;
  pendingTasks: PendingTask[];
  loading: boolean;
  pendingTasksLoading: boolean;
  error: string | null;
  pendingTasksError: string | null;
  successMessage: string | null;
}
