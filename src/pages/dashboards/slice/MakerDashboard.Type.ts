// Maker Dashboard Types

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

export interface MakerDashboardState {
  tasks: AssignedTask[];
  loading: boolean;
  error: string | null;
}
