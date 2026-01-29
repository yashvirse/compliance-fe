// Checker Dashboard Types - Consolidated

// ===== Pending Check Tasks =====
export interface PendingCheckTaskDetail {
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

export interface PendingCheckTask {
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
  siteName: string;
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
  details: PendingCheckTaskDetail[];
  companyId: string;
  companyDomain: string;
}

export interface GetPendingCheckTasksResponse {
  isSuccess: boolean;
  message: string;
  result: PendingCheckTask[];
}

// ===== Task Counts (Dashboard Stats) =====
export interface CheckerTaskCountResult {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export interface GetCheckerTaskCountResponse {
  isSuccess: boolean;
  message: string;
  result: CheckerTaskCountResult;
}

// ===== Task Action Requests & Responses =====
export interface ApproveCheckTaskRequest {
  taskID: string;
  remark: string;
  file: File;
}

export interface ApproveCheckTaskResponse {
  isSuccess: boolean;
  message: string;
  result: number;
}

export interface RejectCheckTaskRequest {
  taskID: string;
  remark: string;
  file: File;
}

export interface RejectCheckTaskResponse {
  isSuccess: boolean;
  message: string;
  result: number;
}

// ===== Approved Check Tasks =====
export type ApprovedCheckTaskDetail = PendingCheckTaskDetail; // Same structure as pending

export type ApprovedCheckTask = PendingCheckTask; // Same structure as pending

export interface GetApprovedCheckTasksResponse {
  isSuccess: boolean;
  message: string;
  result: ApprovedCheckTask[];
}

// ===== Rejected Check Tasks =====
export type RejectedCheckTaskDetail = PendingCheckTaskDetail; // Same structure as pending

export type RejectedCheckTask = PendingCheckTask; // Same structure as pending

export interface GetRejectedCheckTasksResponse {
  isSuccess: boolean;
  message: string;
  result: RejectedCheckTask[];
}

// ===== Redux State =====
export interface CheckerDashboardState {
  // Pending Check Tasks
  pendingCheckTasks: PendingCheckTask[];
  // Approved Check Tasks
  approvedCheckTasks: ApprovedCheckTask[];
  // Rejected Check Tasks
  rejectedCheckTasks: RejectedCheckTask[];
  // Dashboard Counts
  counts: CheckerTaskCountResult | null;
  // Task Actions (Approve/Reject)
  taskActionsLoading: boolean;
  taskActionsError: string | null;
  // Pending Check Tasks Loading
  pendingCheckTasksLoading: boolean;
  pendingCheckTasksError: string | null;
  // Approved Check Tasks Loading
  approvedCheckTasksLoading: boolean;
  approvedCheckTasksError: string | null;
  // Rejected Check Tasks Loading
  rejectedCheckTasksLoading: boolean;
  rejectedCheckTasksError: string | null;
  // General state
  loading: boolean;
  error: string | null;
}
