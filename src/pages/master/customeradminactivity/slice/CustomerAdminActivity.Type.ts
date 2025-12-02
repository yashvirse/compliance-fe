// Customer Admin Activity Master Types

export interface ActivityMasterItem {
  activityId: string;
  actID?: string;
  activityName: string;
  actName: string;
  departmentName: string;
  description: string;
  frequency?: string;
  dueDay?: number;
  gracePeriodDay?: number;
  reminderDay?: string;
}

export interface GroupedActivityMaster {
  actName: string;
  departmentName: string;
  activities: ActivityMasterItem[];
}

export interface GetActivityMasterListResponse {
  isSuccess: boolean;
  message: string;
  result: ActivityMasterItem[];
}

export interface CustomerAdminActivityState {
  activities: ActivityMasterItem[];
  loading: boolean;
  error: string | null;
}

export interface ImportActivitiesResponse {
  isSuccess: boolean;
  message: string;
  result?: any;
}

export interface ActivityDetail {
  activityId: string;
  actName: string;
  departmentName: string;
  activityName: string;
  description: string;
  frequency: string;
  dueDay: number;
  gracePeriodDay: number;
  reminderDay: number;
  maker: string | null;
  checker: string | null;
  reviewer: string | null;
  auditor: string | null;
  companyId: string;
  companyDomain: string;
}

export interface GetActivityByIdResponse {
  isSuccess: boolean;
  message: string;
  result: ActivityDetail;
}

export interface UpdateActivityRequest {
  activityId: string;
  maker?: string;
  checker?: string;
  reviewer?: string;
  auditor?: string;
  frequency?: string;
  dueDay?: number;
  gracePeriodDay?: number;
  reminderDay?: number;
}

export interface EditCompAdminActivityRequest {
  activityId: string;
  actName: string;
  departmentName: string;
  activityName: string;
  description: string;
  frequency: string;
  dueDay: number;
  gracePeriodDay: number;
  reminderDay: number;
  maker: string;
  checker: string;
  reviewer: string;
  auditer: string;
  companyId: string;
  companyDomain: string;
}

export interface UpdateActivityResponse {
  isSuccess: boolean;
  message: string;
  result?: any;
}

export interface DeleteActivityResponse {
  isSuccess: boolean;
  message: string;
  result?: any;
}
