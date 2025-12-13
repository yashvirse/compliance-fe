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
  makerID?: string;
  checker: string | null;
  checkerID?: string;
  reviewer: string | null;
  reviewerID?: string;
  auditor: string | null;
  auditorID?: string;
  companyId: string;
  companyDomain: string;
  selectedSites?: string[];
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
  makerID: string;
  checker: string;
  checkerID: string;
  reviewer: string;
  reviewerID: string;
  auditer: string;
  auditerID: string;
  companyId: string;
  companyDomain: string;
  sites?: Array<{siteId: string, siteName: string}>;
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
