// Reviewer Dashboard Types - Consolidated
export interface AssignedTask {
  tblId: string;
  activityName: string;
  actName: string;
  departmentName: string;
  siteName: string;
  siteID: string;
  dueDate: string;
  taskCurrentStatus: string;
  userStatus: string;
  frequency: string;
}

export interface GetAssignedTasksResponse {
  isSuccess: boolean;
  message: string;
  result: AssignedTask[];
}

// ===== Pending Review Tasks =====
export interface PendingReviewTaskDetail {
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

export interface PendingReviewTask {
  tblId: string;
  activityId: string;
  actName: string;
  departmentName: string;
  siteName: string;
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
  details: PendingReviewTaskDetail[];
  companyId: string;
  companyDomain: string;
}

export interface GetPendingReviewTasksResponse {
  isSuccess: boolean;
  message: string;
  result: PendingReviewTask[];
}

// ===== Task Counts (Dashboard Stats) =====
export interface ReviewerTaskCountResult {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export interface GetReviewerTaskCountResponse {
  isSuccess: boolean;
  message: string;
  result: ReviewerTaskCountResult;
}

// ===== Task Action Requests & Responses =====
export interface ApproveReviewTaskRequest {
  taskID: string;
  remark: string;
  file: File;
}

export interface ApproveReviewTaskResponse {
  isSuccess: boolean;
  message: string;
  result: number;
}

export interface RejectReviewTaskRequest {
  taskID: string;
  remark: string;
  file: File;
}

export interface RejectReviewTaskResponse {
  isSuccess: boolean;
  message: string;
  result: number;
}

// ===== Approved Review Tasks =====
export type ApprovedReviewTaskDetail = PendingReviewTaskDetail; // Same structure as pending

export type ApprovedReviewTask = PendingReviewTask; // Same structure as pending

export interface GetApprovedReviewTasksResponse {
  isSuccess: boolean;
  message: string;
  result: ApprovedReviewTask[];
}

// ===== Rejected Review Tasks =====
export type RejectedReviewTaskDetail = PendingReviewTaskDetail; // Same structure as pending

export type RejectedReviewTask = PendingReviewTask; // Same structure as pending

export interface GetRejectedReviewTasksResponse {
  isSuccess: boolean;
  message: string;
  result: RejectedReviewTask[];
}

// ===== Redux State =====
export interface ReviewerDashboardState {
  tasks: AssignedTask[];
  // Pending Review Tasks
  pendingReviewTasks: PendingReviewTask[];
  // Approved Review Tasks
  approvedReviewTasks: ApprovedReviewTask[];
  // Rejected Review Tasks
  rejectedReviewTasks: RejectedReviewTask[];
  // Dashboard Counts
  counts: ReviewerTaskCountResult | null;
  // Task Actions (Approve/Reject)
  taskActionsLoading: boolean;
  taskActionsError: string | null;
  // Pending Review Tasks Loading
  pendingReviewTasksLoading: boolean;
  pendingReviewTasksError: string | null;
  // Approved Review Tasks Loading
  approvedReviewTasksLoading: boolean;
  approvedReviewTasksError: string | null;
  // Rejected Review Tasks Loading
  rejectedReviewTasksLoading: boolean;
  rejectedReviewTasksError: string | null;
  // General state
  loading: boolean;
  error: string | null;
}
