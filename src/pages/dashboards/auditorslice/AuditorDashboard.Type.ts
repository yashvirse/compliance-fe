// Auditor Dashboard Types

// ===== Task Counts (Dashboard Stats) =====
export interface AuditorTaskCountResult {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export interface GetTaskCountResponse {
  isSuccess: boolean;
  message: string;
  result: AuditorTaskCountResult;
}

// ===== Pending Tasks =====
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
  siteName?: string; // optional अगर कुछ tasks में न हो
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
// ===== Task Action Requests & Responses =====
export interface ApproveTaskRequest {
  taskID: string;
  remark: string;
}

export interface ApproveTaskResponse {
  isSuccess: boolean;
  message: string;
  result: number;
}

export interface RejectTaskRequest {
  taskID: string;
  remark: string;
}

export interface RejectTaskResponse {
  isSuccess: boolean;
  message: string;
  result: number;
}

// ===== Approved Tasks (same structure as Pending) =====
export type ApprovedTaskDetail = PendingTaskDetail;
export type ApprovedTask = PendingTask;

export interface GetApprovedTasksResponse {
  isSuccess: boolean;
  message: string;
  result: ApprovedTask[];
}

// ===== Rejected Tasks (same structure as Pending) =====
export type RejectedTaskDetail = PendingTaskDetail;
export type RejectedTask = PendingTask;

export interface GetRejectedTasksResponse {
  isSuccess: boolean;
  message: string;
  result: RejectedTask[];
}

// ===== Redux State =====
export interface AuditorDashboardState {
  // Tasks
  pendingTasks: PendingTask[];
  approvedTasks: ApprovedTask[];
  rejectedTasks: RejectedTask[];

  // Dashboard Counts
  counts: AuditorTaskCountResult | null;

  // Loading states
  loading: boolean; // for task count
  pendingTasksLoading: boolean;
  approvedTasksLoading: boolean;
  rejectedTasksLoading: boolean;
  taskActionsLoading: boolean;
  taskActionsError: string | null;
  // Error states
  error: string | null;
  pendingTasksError: string | null;
  approvedTasksError: string | null;
  rejectedTasksError: string | null;

  successMessage?: string | null;
}
