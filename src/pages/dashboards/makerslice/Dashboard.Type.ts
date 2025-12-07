// Dashboard types for task counts

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

export interface DashboardState {
  counts: TaskCountResult | null;
  loading: boolean;
  error: string | null;
}
