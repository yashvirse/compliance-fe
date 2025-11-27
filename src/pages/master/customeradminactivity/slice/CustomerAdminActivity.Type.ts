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
