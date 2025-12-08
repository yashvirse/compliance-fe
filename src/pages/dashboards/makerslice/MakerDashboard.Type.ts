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

// ===== Redux State =====
export interface MakerDashboardState {
  // Assigned Tasks
  tasks: AssignedTask[];
  // Dashboard Counts
  counts: TaskCountResult | null;
  // Task Actions (Approve/Reject)
  taskActionsLoading: boolean;
  taskActionsError: string | null;
  // General state
  loading: boolean;
  error: string | null;
}
