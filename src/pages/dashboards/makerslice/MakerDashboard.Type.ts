// Maker Dashboard Types - Consolidated

// ===== Assigned Tasks =====
export interface AssignedTask {
  activityId: string;
  activityName: string;
  actName: string;
  departmentName: string;
  description: string;
  frequency: string;
  dueDay: number;
  gracePeriodDay: number;
  reminderDay: number;
  maker: string;
  checker: string;
  reviewer: string;
  auditor: string;
  status?: string;
  assignedDate?: string;
}

export interface GetAssignedTasksResponse {
  isSuccess: boolean;
  message: string;
  result: AssignedTask[];
}

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

// ===== Pending Tasks Detail =====
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

// ===== Approved Tasks Detail =====
export type ApprovedTaskDetail = PendingTaskDetail; // Same structure as pending

export type ApprovedTask = PendingTask; // Same structure as pending

export interface GetApprovedTasksResponse {
  isSuccess: boolean;
  message: string;
  result: ApprovedTask[];
}

// ===== Rejected Tasks Detail =====
export type RejectedTaskDetail = PendingTaskDetail; // Same structure as pending

export type RejectedTask = PendingTask; // Same structure as pending

export interface GetRejectedTasksResponse {
  isSuccess: boolean;
  message: string;
  result: RejectedTask[];
}

// ===== Redux State =====
export interface MakerDashboardState {
  // Assigned Tasks
  tasks: AssignedTask[];
  // Pending Tasks
  pendingTasks: PendingTask[];
  // Approved Tasks
  approvedTasks: ApprovedTask[];
  // Rejected Tasks
  rejectedTasks: RejectedTask[];
  // Dashboard Counts
  counts: TaskCountResult | null;
  // Task Actions (Approve/Reject)
  taskActionsLoading: boolean;
  taskActionsError: string | null;
  // Pending Tasks Loading
  pendingTasksLoading: boolean;
  pendingTasksError: string | null;
  // Approved Tasks Loading
  approvedTasksLoading: boolean;
  approvedTasksError: string | null;
  // Rejected Tasks Loading
  rejectedTasksLoading: boolean;
  rejectedTasksError: string | null;
  // General state
  loading: boolean;
  error: string | null;
}
